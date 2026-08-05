from app.models.pregnancy_model import Appointment
from app.schemas.pregnancy_schema import AppointmentCreate


async def create_appointment(
    patient_id: str,
    payload: AppointmentCreate
):

    appointment = Appointment(
        patient_id=patient_id,
        doctor_id=str(payload.doctor_id),
        scheduled_for=payload.scheduled_for,
        reason=payload.reason
    )


    await appointment.insert()


    return appointment