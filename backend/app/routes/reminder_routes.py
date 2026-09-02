from fastapi import APIRouter, Depends, HTTPException, status

from app.middleware.auth_middleware import get_current_user
from app.models.reminder_model import Reminder
from app.models.user_model import User
from app.schemas.reminder_schema import ReminderCreate, ReminderOut
from app.services.notification_service import notify_user

router = APIRouter(prefix="/reminders", tags=["Reminders"])


def as_response(reminder: Reminder) -> dict:
    return {**reminder.model_dump(), "id": str(reminder.id)}


@router.get("", response_model=list[ReminderOut])
async def list_reminders(user: User = Depends(get_current_user)):
    items = await Reminder.find(Reminder.user_id == str(user.id)).sort(-Reminder.created_at).to_list()
    return [as_response(item) for item in items]


@router.post("", response_model=ReminderOut, status_code=status.HTTP_201_CREATED)
async def create_reminder(payload: ReminderCreate, user: User = Depends(get_current_user)):
    reminder = Reminder(user_id=str(user.id), **payload.model_dump())
    await reminder.insert()
    return as_response(reminder)


@router.post("/{reminder_id}/test")
async def test_reminder(reminder_id: str, user: User = Depends(get_current_user)):
    """Deliver one reminder immediately for an end-to-end email/in-app test."""
    reminder = await Reminder.get(reminder_id)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    if reminder.user_id != str(user.id):
        raise HTTPException(status_code=403, detail="Not allowed")
    await notify_user(str(user.id), f"Test: {reminder.title}", reminder.message, reminder.kind)
    return {"message": "Test reminder sent. Check Notifications and your email inbox."}


@router.patch("/{reminder_id}/toggle", response_model=ReminderOut)
async def toggle_reminder(reminder_id: str, user: User = Depends(get_current_user)):
    reminder = await Reminder.get(reminder_id)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    if reminder.user_id != str(user.id):
        raise HTTPException(status_code=403, detail="Not allowed")
    reminder.enabled = not reminder.enabled
    await reminder.save()
    return as_response(reminder)


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(reminder_id: str, user: User = Depends(get_current_user)):
    reminder = await Reminder.get(reminder_id)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    if reminder.user_id != str(user.id):
        raise HTTPException(status_code=403, detail="Not allowed")
    await reminder.delete()
