import asyncio

from app.models.notification_model import Notification
from app.models.user_model import User
from app.services.email_service import send_email
from app.services.realtime_service import manager


async def notify_user(user_id: str, title: str, message: str, category: str = "general", metadata: dict | None = None) -> Notification:
    notification = Notification(user_id=user_id, title=title, message=message, category=category, metadata=metadata or {})
    await notification.insert()
    await manager.send(user_id, {
        "type": "notification",
        "data": {**notification.model_dump(mode="json"), "id": str(notification.id)},
    })

    user = await User.get(user_id)
    if user and user.email_notifications_enabled:
        # Email delivery can be slow or temporarily unavailable.  A saved
        # notification must not hold up prediction, alert, or appointment API
        # responses while the SMTP server responds.
        asyncio.create_task(send_email(user.email, title, message))
    return notification
