import asyncio
import logging
import smtplib
from email.message import EmailMessage

from app.config.settings import get_settings

logger = logging.getLogger(__name__)


async def send_email(to_email: str, subject: str, body: str) -> bool:
    """Send mail when SMTP is configured; otherwise safely leave delivery disabled."""
    settings = get_settings()
    if not settings.email_enabled:
        return False

    message = EmailMessage()
    message["From"] = settings.smtp_from
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    def _send():
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
            server.starttls()
            if settings.smtp_username and settings.smtp_password:
                # Google displays app passwords in groups of four characters.
                # Spaces copied from that display are not part of the password.
                server.login(settings.smtp_username, settings.smtp_password.replace(" ", ""))
            server.send_message(message)

    try:
        await asyncio.to_thread(_send)
        return True
    except Exception:
        # Keep credentials out of the log, but retain the real provider error
        # in Render so failed OTP delivery is diagnosable.
        logger.exception("SMTP email delivery failed")
        return False
