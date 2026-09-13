import asyncio
import logging
import smtplib
import json
import urllib.error
import urllib.request
from email.message import EmailMessage

from app.config.settings import get_settings

logger = logging.getLogger(__name__)


async def send_email(to_email: str, subject: str, body: str) -> bool:
    """Deliver email through Resend HTTPS or, locally, a configured SMTP server."""
    settings = get_settings()
    if not settings.email_enabled:
        return False

    if settings.resend_api_key and settings.email_from:
        def _send_resend():
            request = urllib.request.Request(
                "https://api.resend.com/emails",
                data=json.dumps({
                    "from": settings.email_from,
                    "to": [to_email],
                    "subject": subject,
                    "text": body,
                }).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(request, timeout=15):
                pass

        try:
            await asyncio.to_thread(_send_resend)
            return True
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError):
            logger.exception("Resend email delivery failed")
            return False
        except Exception:
            logger.exception("Unexpected email delivery failure")
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
