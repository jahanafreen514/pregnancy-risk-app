from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.prescription_model import Prescription

from app.config.settings import get_settings

client = AsyncIOMotorClient(get_settings().mongodb_url)

db = client["glowcare"]


async def init_db():

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
        ],
    )

    print("✅ MongoDB + Beanie connected successfully")