from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.middleware.auth_middleware import get_current_user
from app.models.doctor_model import DoctorProfile
from app.models.pregnancy_model import Appointment
from app.models.user_model import User

from app.schemas.appointment_schema import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentOut,
)
from app.services.notification_service import notify_user

# ==================================================
# CONVERT MONGODB OBJECTID TO STRING
# ==================================================

async def appointment_to_response(appointment):

    patient = await User.get(
        appointment.patient_id
    )
    doctor = await User.get(appointment.doctor_id)


    return {
        "id": str(appointment.id),

        "doctor_id": appointment.doctor_id,

        "patient_id": appointment.patient_id,

        "patient_name":
            patient.name if patient else "N/A",

        "patient_email":
            patient.email if patient else "N/A",

        "doctor_name": doctor.name if doctor else "N/A",
        "doctor_email": doctor.email if doctor else "N/A",

        "scheduled_for":
            appointment.scheduled_for,

        "status":
            appointment.status,

        "reason":
            appointment.reason,

        "appointment_type": appointment.appointment_type,
    }

# ==================================================
# ROUTER
# ==================================================

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
)


# ==================================================
# PATIENT/USER: BOOK APPOINTMENT
# POST /api/appointments
# ==================================================

@router.post(
    "",
    response_model=AppointmentOut,
    status_code=status.HTTP_201_CREATED,
)
async def book_appointment(
    payload: AppointmentCreate,
    user: User = Depends(get_current_user),
):

    # Only users/patients can book appointments
    if user.role not in ["user", "patient"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can book appointments",
        )

    # Validate doctor ID
    if not ObjectId.is_valid(str(payload.doctor_id)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid doctor ID",
        )

    # Find doctor user
    doctor = await User.get(
        str(payload.doctor_id)
    )

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )

    # Check selected user role
    if doctor.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected user is not a doctor",
        )

    # Check doctor account
    if not doctor.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor account is inactive",
        )

    # Check doctor verification
    doctor_profile = await DoctorProfile.find_one(
        DoctorProfile.user_id == str(doctor.id)
    )

    if (
        not doctor_profile
        or not doctor_profile.is_verified
        or doctor_profile.verification_status != "approved"
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor is not verified or approved",
        )

    # Prevent appointments in the past
    if payload.scheduled_for <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book an appointment in the past",
        )

    # Prevent duplicate appointment
    existing_appointment = await Appointment.find_one(
        Appointment.patient_id == str(user.id),
        Appointment.doctor_id == str(doctor.id),
        Appointment.scheduled_for == payload.scheduled_for,
    )

    if existing_appointment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have an appointment at this time",
        )

    # Create appointment
    appointment = Appointment(
        patient_id=str(user.id),
        doctor_id=str(doctor.id),
        scheduled_for=payload.scheduled_for,
        reason=payload.reason,
        appointment_type=payload.appointment_type,
        status="pending",
    )

    # Save appointment
    await appointment.insert()
    # Keep the care-team relationship in sync so risk reports reach this doctor.
    user.selected_doctor = str(doctor.id)
    await user.save()

    await notify_user(
        str(doctor.id),
        "New appointment request",
        f"{user.name} requested an appointment for {payload.scheduled_for.isoformat()}.",
        "appointment",
    )

    # Convert ObjectId to string
    return await appointment_to_response(appointment)


@router.post("/{appointment_id}/call-request")
async def request_online_call(appointment_id: str, user: User = Depends(get_current_user)):
    """Notify the other participant before WebRTC negotiation starts."""
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment = await Appointment.get(appointment_id)
    if not appointment or appointment.status != "accepted" or appointment.appointment_type != "online":
        raise HTTPException(status_code=400, detail="This appointment is not ready for an online call")
    if str(user.id) not in {appointment.patient_id, appointment.doctor_id}:
        raise HTTPException(status_code=403, detail="Not allowed")
    recipient = appointment.doctor_id if str(user.id) == appointment.patient_id else appointment.patient_id
    appointment.call_status = "ringing"
    appointment.call_initiator_id = str(user.id)
    appointment.call_ringing_at = datetime.now(timezone.utc)
    appointment.call_started_at = None
    appointment.call_ended_at = None
    await appointment.save()
    await notify_user(
        recipient,
        "Incoming video consultation",
        f"{user.name} is calling for your accepted online appointment.",
        "call_request",
        {"appointment_id": appointment_id, "caller_name": user.name, "caller_id": str(user.id)},
    )
    return {"message": "Call request sent.", "call_status": appointment.call_status}


@router.post("/{appointment_id}/call-reject")
async def reject_online_call(appointment_id: str, user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment = await Appointment.get(appointment_id)
    if not appointment or str(user.id) not in {appointment.patient_id, appointment.doctor_id}:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if appointment.call_status != "ringing" or appointment.call_initiator_id == str(user.id):
        raise HTTPException(status_code=400, detail="There is no incoming call to reject")
    appointment.call_status = "rejected"
    appointment.call_ended_at = datetime.now(timezone.utc)
    await appointment.save()
    await notify_user(appointment.call_initiator_id, "Call declined", f"{user.name} declined the online consultation call.", "call_rejected", {"appointment_id": appointment_id})
    return {"message": "Call declined."}


@router.get("/{appointment_id}/contact")
async def appointment_contact(appointment_id: str, user: User = Depends(get_current_user)):
    """Share a participant's WhatsApp contact only for an accepted appointment."""
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment = await Appointment.get(appointment_id)
    if not appointment or appointment.status != "accepted":
        raise HTTPException(status_code=404, detail="Accepted appointment not found")
    if str(user.id) not in {appointment.patient_id, appointment.doctor_id}:
        raise HTTPException(status_code=403, detail="Not allowed")
    counterpart_id = appointment.doctor_id if str(user.id) == appointment.patient_id else appointment.patient_id
    counterpart = await User.get(counterpart_id)
    if not counterpart or not counterpart.phone:
        raise HTTPException(status_code=404, detail="The other participant has not added a phone number")
    return {
        "name": counterpart.name,
        "role": counterpart.role,
        "phone": counterpart.phone,
        "country_code": counterpart.country_code or "",
    }


# ==================================================
# CURRENT USER: ALL RELEVANT APPOINTMENTS
# GET /api/appointments
# ==================================================

@router.get(
    "",
    response_model=list[AppointmentOut],
)
async def list_appointments(
    user: User = Depends(get_current_user),
):

    # Admin can see all appointments
    if user.role == "admin":

        appointments = await Appointment.find_all().sort(
            -Appointment.scheduled_for
        ).to_list()

        return [await appointment_to_response(appointment) for appointment in appointments]

    # User/Patient can see only own appointments
    if user.role in ["user", "patient"]:

        appointments = await Appointment.find(
            Appointment.patient_id == str(user.id)
        ).sort(
            -Appointment.scheduled_for
        ).to_list()

        return [await appointment_to_response(appointment) for appointment in appointments]

    # Doctor can see only own appointment requests
    if user.role == "doctor":

        appointments = await Appointment.find(
            Appointment.doctor_id == str(user.id)
        ).sort(
            -Appointment.scheduled_for
        ).to_list()

        return [await appointment_to_response(appointment) for appointment in appointments]

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid user role",
    )


# ==================================================
# PATIENT/USER: OWN APPOINTMENTS
# GET /api/appointments/patient
# ==================================================

@router.get(
    "/patient",
    response_model=list[AppointmentOut],
)
async def patient_appointments(
    user: User = Depends(get_current_user),
):

    # Only user/patient can access
    if user.role not in ["user", "patient"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access this endpoint",
        )

    appointments = await Appointment.find(
        Appointment.patient_id == str(user.id)
    ).sort(
        -Appointment.scheduled_for
    ).to_list()

    responses = []

    for appointment in appointments:
        responses.append(
            await appointment_to_response(appointment)
        )

    return responses
# DOCTOR: APPOINTMENT REQUESTS
# GET /api/appointments/doctor
# ==================================================

@router.get(
    "/doctor",
    response_model=list[AppointmentOut],
)
async def doctor_appointments(
    user: User = Depends(get_current_user),
):

    if user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can access this endpoint",
        )


    appointments = await Appointment.find(
        Appointment.doctor_id == str(user.id)
    ).sort(
        -Appointment.scheduled_for
    ).to_list()


    responses = []

    for appointment in appointments:
        responses.append(
            await appointment_to_response(appointment)
        )


    return responses
@router.patch(
    "/{appointment_id}",
    response_model=AppointmentOut,
)
async def update_appointment(
    appointment_id: str,
    payload: AppointmentUpdate,
    user: User = Depends(get_current_user),
):

    # Validate appointment ID
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment ID",
        )

    # Find appointment
    appointment = await Appointment.get(
        appointment_id
    )

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    # Doctors can accept/reject/complete their own appointments; patients can cancel theirs.
    is_assigned_doctor = user.role == "doctor" and appointment.doctor_id == str(user.id)
    is_assigned_patient = user.role in {"user", "patient"} and appointment.patient_id == str(user.id)
    if user.role != "admin" and not is_assigned_doctor and not is_assigned_patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to update this appointment",
        )

    # Valid appointment statuses
    allowed_statuses = {
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
    }
    new_status = payload.status.lower().strip()

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid appointment status. "
                "Allowed values: pending, accepted, rejected, "
                "completed, cancelled"
            ),
        )

    if is_assigned_patient and new_status != "cancelled":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Patients can only cancel their appointments")
    if is_assigned_doctor and new_status in {"pending", "cancelled"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Doctors can accept, reject, or complete appointments")

    # Update status
    appointment.status = new_status

    # Save changes
    await appointment.save()

    recipient_id = appointment.patient_id if user.role in {"doctor", "admin"} else appointment.doctor_id
    await notify_user(
        recipient_id,
        "Appointment updated",
        f"Your appointment scheduled for {appointment.scheduled_for.isoformat()} is now {new_status}.",
        "appointment",
    )

    # Convert ObjectId to string
    return await appointment_to_response(appointment)
