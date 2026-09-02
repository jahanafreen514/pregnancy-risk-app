import asyncio
from datetime import datetime, timedelta, timezone

from app.models.reminder_model import Reminder
from app.models.pregnancy_model import Appointment
from app.services.notification_service import notify_user


async def dispatch_due_reminders() -> None:
    now = datetime.now().astimezone()
    today, current_time = now.date().isoformat(), now.strftime("%H:%M")
    # Reminders repeat every day until the user deletes them. Checking all
    # active reminders prevents a backend restart from missing today's alert.
    reminders = await Reminder.find(Reminder.enabled == True).to_list()
    for reminder in reminders:
        if reminder.last_sent_date != today and reminder.time_of_day <= current_time:
            await notify_user(reminder.user_id, reminder.title, reminder.message, reminder.kind)
            reminder.last_sent_date = today
            await reminder.save()

    # Appointment reminders are sent once, 15 minutes before accepted visits.
    now_utc = datetime.now(timezone.utc)
    window_end = now_utc + timedelta(minutes=15)
    appointments = await Appointment.find(
        Appointment.status == "accepted", Appointment.reminder_sent == False,
        Appointment.scheduled_for >= now_utc, Appointment.scheduled_for <= window_end,
    ).to_list()
    for appointment in appointments:
        await notify_user(appointment.doctor_id, "Upcoming appointment", "Your patient appointment starts in about 15 minutes.", "appointment_reminder")
        await notify_user(appointment.patient_id, "Upcoming appointment", "Your appointment starts in about 15 minutes. Please be ready.", "appointment_reminder")
        appointment.reminder_sent = True
        await appointment.save()

    # Calls are persisted as missed when no participant accepts within one
    # minute.  This runs on the backend, so it also works when the caller has
    # closed their browser after placing the call.
    unanswered_before = now_utc - timedelta(minutes=1)
    ringing_calls = await Appointment.find(
        Appointment.call_status == "ringing",
        Appointment.call_ringing_at <= unanswered_before,
    ).to_list()
    for appointment in ringing_calls:
        appointment.call_status = "missed"
        appointment.call_ended_at = now_utc
        await appointment.save()
        initiator = appointment.call_initiator_id
        receiver = appointment.doctor_id if initiator == appointment.patient_id else appointment.patient_id
        await notify_user(initiator, "Missed call", "Your online consultation call was not answered.", "missed_call", {"appointment_id": str(appointment.id)})
        await notify_user(receiver, "Missed call", "You missed an online consultation call.", "missed_call", {"appointment_id": str(appointment.id)})


async def reminder_loop() -> None:
    while True:
        try:
            await dispatch_due_reminders()
        except Exception:
            pass
        await asyncio.sleep(30)
