import asyncio
import smtplib
from email.message import EmailMessage

from app.config.settings import get_settings


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
                server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)

    try:
        await asyncio.to_thread(_send)
        return True
    except (OSError, smtplib.SMTPException):
        return False
