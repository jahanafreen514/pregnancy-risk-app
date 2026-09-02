from urllib.parse import urlsplit

import dns.resolver
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.prescription_model import Prescription
from app.models.notification_model import Notification
from app.models.password_reset_model import PasswordResetToken
from app.models.reminder_model import Reminder
from app.models.feedback_model import Feedback
from app.models.contact_message_model import ContactMessage

from app.config.settings import get_settings

# Atlas details for the configured project.  These avoid the unreliable SRV/TXT
# lookup performed by some home-router DNS servers.  Atlas host names still use
# normal DNS and TLS certificate validation; no database credential is stored
# here.
ATLAS_DIRECT_FALLBACKS = {
    "cluster0.ugsr8kt.mongodb.net": (
        "ac-xkon7x8-shard-00-00.ugsr8kt.mongodb.net:27017,"
        "ac-xkon7x8-shard-00-01.ugsr8kt.mongodb.net:27017,"
        "ac-xkon7x8-shard-00-02.ugsr8kt.mongodb.net:27017",
        "replicaSet=atlas-z1fqrp-shard-0&authSource=admin",
    )
}


def resolve_atlas_uri(uri: str) -> str:
    """Resolve an Atlas SRV URI using public DNS when the local router DNS fails.

    PyMongo resolves ``mongodb+srv`` through the operating-system DNS resolver.
    Some home routers time out SRV/TXT lookups even though normal internet access
    works.  Resolving records through Cloudflare here gives Motor a normal
    multi-host MongoDB URI and avoids that startup failure.
    """
    if not uri.startswith("mongodb+srv://"):
        return uri

    parsed = urlsplit(uri)
    cluster = parsed.hostname
    if not cluster:
        return uri

    resolver = dns.resolver.Resolver(configure=False)
    resolver.nameservers = ["1.1.1.1", "8.8.8.8"]
    resolver.timeout = 3
    resolver.lifetime = 8
    try:
        srv_records = resolver.resolve(f"_mongodb._tcp.{cluster}", "SRV")
        hosts = ",".join(
            f"{record.target.to_text(omit_final_dot=True)}:{record.port}"
            for record in srv_records
        )
        txt_records = resolver.resolve(cluster, "TXT")
        atlas_options = "&".join(
            b"".join(record.strings).decode("utf-8") for record in txt_records
        )
        return _build_direct_uri(parsed, hosts, atlas_options)
    except (dns.exception.DNSException, UnicodeDecodeError):
        fallback = ATLAS_DIRECT_FALLBACKS.get(cluster)
        if fallback:
            hosts, atlas_options = fallback
            return _build_direct_uri(parsed, hosts, atlas_options)
        # Preserve standard behavior only for unknown clusters.
        return uri


def _build_direct_uri(parsed, hosts: str, atlas_options: str) -> str:
    """Build a standard Mongo URI while retaining credentials from .env."""
    auth = parsed.netloc.rsplit("@", 1)[0]
    database = parsed.path or "/glowcare"
    options = "&".join(item for item in ("tls=true", parsed.query, atlas_options) if item)
    return f"mongodb://{auth}@{hosts}{database}?{options}"

async def init_db():
    # Create the client during application startup, not module import.  This lets
    # health tooling and OpenAPI generation work even while Atlas is unavailable.
    # Validate the already-trained Colab artifacts once at application startup.
    # Prediction requests reuse this in-memory model; no startup retraining.
    from app.services.prediction_service import validate_loaded_model
    validate_loaded_model()
    mongodb_uri = resolve_atlas_uri(get_settings().mongodb_url)
    client = AsyncIOMotorClient(mongodb_uri, serverSelectionTimeoutMS=10000)
    db = client["glowcare"]

    from app.models.user_model import User
    from app.models.doctor_model import DoctorProfile
    from app.models.admin_model import AdminSettings
    from app.models.alert_model import Alert
    from app.models.report_model import Report
    from app.models.pregnancy_model import PregnancyRecord, Appointment


    await init_beanie(
        database=db,
        document_models=[
            User,
            DoctorProfile,
            AdminSettings,
            Alert,
            Report,
            PregnancyRecord,
            Appointment,
            Prescription,
            Notification,
            PasswordResetToken,
            Reminder,
            Feedback,
            ContactMessage,
        ],
    )

    # Repair legacy feedback at startup. Missing `sender_type` previously made
    # Beanie reject the complete result cursor with a validation error.
    await db["feedback"].update_many(
        {"sender_type": {"$exists": False}},
        {"$set": {"sender_type": "user"}},
    )

    print("✅ MongoDB + Beanie connected successfully")
