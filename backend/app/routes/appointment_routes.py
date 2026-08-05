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

# ==================================================
# CONVERT MONGODB OBJECTID TO STRING
# ==================================================

async def appointment_to_response(appointment):

    patient = await User.get(
        appointment.patient_id
    )


    return {
        "id": str(appointment.id),

        "doctor_id": appointment.doctor_id,

        "patient_id": appointment.patient_id,

        "patient_name":
            patient.name if patient else "N/A",

        "patient_email":
            patient.email if patient else "N/A",

        "scheduled_for":
            appointment.scheduled_for,

        "status":
            appointment.status,

        "reason":
            appointment.reason,
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
        status="pending",
    )

    # Save appointment
    await appointment.insert()

    # Convert ObjectId to string
    return await appointment_to_response(appointment)


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

        return [
            appointment_to_response(appointment)
            for appointment in appointments
        ]

    # User/Patient can see only own appointments
    if user.role in ["user", "patient"]:

        appointments = await Appointment.find(
            Appointment.patient_id == str(user.id)
        ).sort(
            -Appointment.scheduled_for
        ).to_list()

        return [
            appointment_to_response(appointment)
            for appointment in appointments
        ]

    # Doctor can see only own appointment requests
    if user.role == "doctor":

        appointments = await Appointment.find(
            Appointment.doctor_id == str(user.id)
        ).sort(
            -Appointment.scheduled_for
        ).to_list()

        return [
            appointment_to_response(appointment)
            for appointment in appointments
        ]

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
    print("LOGIN USER ID:", user.id)
    print("LOGIN ROLE:", user.role)
    print("APPOINTMENT DOCTOR ID:", appointment.doctor_id)
    # Only assigned doctor or admin can update
    if (
        user.role != "admin"
        and appointment.doctor_id != str(user.id)
    ):
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
    print("STATUS RECEIVED:", payload.status)
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

    # Update status
    appointment.status = new_status

    # Save changes
    await appointment.save()

    # Convert ObjectId to string
    return await appointment_to_response(appointment)
