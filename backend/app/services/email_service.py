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
    """Deliver email through Brevo/Resend HTTPS or a configured SMTP server."""
    settings = get_settings()
    if not settings.email_enabled:
        return False

    # 1. Brevo HTTP API (Port 443 HTTPS - works on cloud hosts without SMTP port restrictions)
    if settings.brevo_api_key:
        def _send_brevo():
            payload = json.dumps({
                "sender": {"name": "GlowCare", "email": settings.smtp_from or "glowcare20262gmail.com@gmail.com"},
                "to": [{"email": to_email}],
                "subject": subject,
                "textContent": body,
            }).encode("utf-8")
            request = urllib.request.Request(
                "https://api.brevo.com/v3/smtp/email",
                data=payload,
                headers={
                    "api-key": settings.brevo_api_key,
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(request, timeout=15):
                pass

        try:
            await asyncio.to_thread(_send_brevo)
            logger.info(f"Email delivered to {to_email} via Brevo HTTP API")
            return True
        except Exception:
            logger.exception("Brevo email delivery failed")

    # 2. Resend HTTP API (Port 443 HTTPS - works on cloud hosts without SMTP port restrictions)
    if settings.resend_api_key:
        clean_resend_key = settings.resend_api_key.strip()
        from_address = (settings.email_from or "GlowCare <onboarding@resend.dev>").strip()

        def _send_resend():
            request = urllib.request.Request(
                "https://api.resend.com/emails",
                data=json.dumps({
                    "from": from_address,
                    "to": [to_email],
                    "subject": subject,
                    "text": body,
                }).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {clean_resend_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(request, timeout=15) as resp:
                return resp.read().decode("utf-8")

        try:
            res = await asyncio.to_thread(_send_resend)
            logger.info(f"Email delivered to {to_email} via Resend HTTP API: {res}")
            return True
        except urllib.error.HTTPError as http_err:
            err_body = http_err.read().decode("utf-8", errors="replace")
            logger.error(f"Resend HTTP {http_err.code} error: {err_body}")
        except Exception as e:
            logger.exception(f"Resend delivery failed: {e}")

    # 3. SMTP Delivery (Try Port 587 STARTTLS, then Port 465 SSL)
    message = EmailMessage()
    message["From"] = settings.smtp_from
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    clean_password = (settings.smtp_password or "").replace(" ", "")

    def _send():
        last_error = None
        # Attempt 1: Port 587 (STARTTLS)
        try:
            with smtplib.SMTP(settings.smtp_host, 587, timeout=10) as server:
                server.starttls()
                if settings.smtp_username and clean_password:
                    server.login(settings.smtp_username, clean_password)
                server.send_message(message)
                return True
        except Exception as err587:
            last_error = err587
            logger.warning(f"SMTP Port 587 failed ({err587}); trying Port 465 SSL...")

        # Attempt 2: Port 465 (SSL)
        try:
            with smtplib.SMTP_SSL(settings.smtp_host, 465, timeout=10) as server:
                if settings.smtp_username and clean_password:
                    server.login(settings.smtp_username, clean_password)
                server.send_message(message)
                return True
        except Exception as err465:
            last_error = err465
            logger.warning(f"SMTP Port 465 failed ({err465})")

        raise last_error

    try:
        await asyncio.to_thread(_send)
        logger.info(f"Email delivered to {to_email} via SMTP")
        return True
    except Exception:
        logger.exception("SMTP email delivery failed")
        return False
