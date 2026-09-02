from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect

from app.middleware.auth_middleware import get_current_user
from app.models.notification_model import Notification
from app.models.user_model import User
from app.schemas.notification_schema import NotificationOut
from app.services.realtime_service import manager

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def serialize_notification(notification: Notification) -> dict:
    """Convert Beanie's ObjectId into the string required by NotificationOut."""
    return {**notification.model_dump(mode="json"), "id": str(notification.id)}


@router.get("", response_model=list[NotificationOut])
async def list_notifications(user: User = Depends(get_current_user)):
    items = await Notification.find(Notification.user_id == str(user.id)).sort(-Notification.created_at).to_list()
    return [serialize_notification(item) for item in items]


@router.patch("/{notification_id}/read", response_model=NotificationOut)
async def mark_read(notification_id: str, user: User = Depends(get_current_user)):
    notification = await Notification.get(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification.user_id != str(user.id):
        raise HTTPException(status_code=403, detail="Not allowed")
    notification.is_read = True
    await notification.save()
    return serialize_notification(notification)


@router.websocket("/ws/{user_id}")
async def notification_socket(websocket: WebSocket, user_id: str, token: str):
    # The normal HTTP endpoints remain authoritative; this socket only pushes events.
    from jose import JWTError, jwt
    from app.config.security import ALGORITHM
    from app.config.settings import get_settings

    try:
        payload = jwt.decode(token, get_settings().secret_key, algorithms=[ALGORITHM])
        if payload.get("type") != "access" or payload.get("sub") != user_id:
            await websocket.close(code=1008)
            return
    except JWTError:
        await websocket.close(code=1008)
        return
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
