from fastapi import APIRouter, Depends, HTTPException
from app.models.report_model import Report

from app.middleware.auth_middleware import require_roles

from app.models.alert_model import Alert
from app.models.pregnancy_model import Appointment, PregnancyRecord
from app.models.user_model import User
from app.models.doctor_model import DoctorProfile

from app.schemas.admin_schema import StatusUpdate


router = APIRouter(
    prefix="/admin",
    tags=["Administration"]
)


# =========================
# ADMIN AUTHORIZATION
# =========================

admin_required = Depends(
    require_roles("admin")
)


# =========================
# USER RESPONSE FORMAT
# =========================

def format_user(user: User):

    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "country_code": user.country_code,
        "phone": user.phone,
        "selected_doctor": user.selected_doctor,
        "is_active": user.is_active,
        "created_at": (
            user.created_at.isoformat()
            if user.created_at
            else None
        )
    }


# =========================
# ADMIN DASHBOARD
# =========================

@router.get("/dashboard")
async def dashboard(
    _: User = admin_required
):

    users_count = await User.find(
        User.role == "user"
    ).count()


    doctors_count = await User.find(
        User.role == "doctor"
    ).count()


    high_risk_count = await PregnancyRecord.find(
        PregnancyRecord.risk_level == "High"
    ).count()


    appointments_count = await Appointment.count()


    unread_alerts = await Alert.find(
        Alert.is_read == False
    ).count()


    return {
        "users": users_count,
        "doctors": doctors_count,
        "highRiskRecords": high_risk_count,
        "appointments": appointments_count,
        "unreadAlerts": unread_alerts
    }


# =========================
# ALL USERS
# =========================

@router.get("/users")
async def get_all_users(
    _: User = admin_required
):

    all_users = await User.find_all().sort(
        -User.created_at
    ).to_list()


    return [
        format_user(user)
        for user in all_users
    ]


# =========================
# UPDATE USER STATUS
# =========================

@router.patch(
    "/users/{user_id}/status"
)
async def update_user_status(
    user_id: str,
    payload: StatusUpdate,
    _: User = admin_required
):

    user = await User.get(
        user_id
    )


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    user.is_active = payload.is_active


    await user.save()


    return format_user(
        user
    )


# =========================
# ALL DOCTORS
# =========================

@router.get("/doctors")
async def get_all_doctors(
    _: User = admin_required
):

    doctor_users = await User.find(
        User.role == "doctor"
    ).sort(
        -User.created_at
    ).to_list()


    result = []


    for doctor in doctor_users:

        profile = await DoctorProfile.find_one(
            DoctorProfile.user_id
            == str(doctor.id)
        )


        result.append(
            {
                "user_id": str(
                    doctor.id
                ),

                "name": doctor.name,

                "email": doctor.email,

                "phone": doctor.phone,

                "profile_id": (
                    str(profile.id)
                    if profile
                    else None
                ),

                "specialization": (
                    profile.specialization
                    if profile
                    else "Not uploaded"
                ),

                "hospital": (
                    profile.hospital
                    if profile
                    else "Not uploaded"
                ),

                "license_number": (
                    profile.license_number
                    if profile
                    else None
                ),

                "verification_status": (
                    profile.verification_status
                    if profile
                    else "not_uploaded"
                ),

                "is_verified": (
                    profile.is_verified
                    if profile
                    else False
                ),

                "is_active": (
                    doctor.is_active
                ),

                "created_at": (
                    doctor.created_at.isoformat()
                    if doctor.created_at
                    else None
                )
            }
        )


    return result


# =========================
# GET PENDING DOCTORS
# =========================

@router.get("/doctors/pending")
async def get_pending_doctors(
    _: User = admin_required
):

    profiles = await DoctorProfile.find(
        DoctorProfile.verification_status
        == "pending"
    ).to_list()


    doctors = []


    for profile in profiles:

        user = await User.get(
            profile.user_id
        )


        if not user:

            continue


        doctors.append(
            {
                "profile_id": str(
                    profile.id
                ),

                "user_id": str(
                    user.id
                ),

                "name": user.name,

                "email": user.email,

                "phone": user.phone,

                "specialization": (
                    profile.specialization
                ),

                "hospital": (
                    profile.hospital
                ),

                "license_number": (
                    profile.license_number
                ),

                "verification_status": (
                    profile.verification_status
                ),

                "is_verified": (
                    profile.is_verified
                )
            }
        )


    return doctors


# =========================
# APPROVE DOCTOR
# =========================

@router.put(
    "/doctors/{doctor_id}/approve"
)
async def approve_doctor(
    doctor_id: str,
    _: User = admin_required
):

    doctor = await User.get(
        doctor_id
    )


    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor user not found"
        )


    if doctor.role != "doctor":

        raise HTTPException(
            status_code=400,
            detail="User is not a doctor"
        )


    profile = await DoctorProfile.find_one(
        DoctorProfile.user_id
        == doctor_id
    )


    if not profile:

        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )


    profile.is_verified = True

    profile.verification_status = (
        "approved"
    )


    await profile.save()


    return {
        "message": (
            "Doctor approved successfully"
        ),

        "doctor_id": doctor_id,

        "verification_status": (
            "approved"
        ),

        "is_verified": True
    }


# =========================
# REJECT DOCTOR
# =========================

@router.put(
    "/doctors/{doctor_id}/reject"
)
async def reject_doctor(
    doctor_id: str,
    _: User = admin_required
):

    doctor = await User.get(
        doctor_id
    )


    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor user not found"
        )


    if doctor.role != "doctor":

        raise HTTPException(
            status_code=400,
            detail="User is not a doctor"
        )


    profile = await DoctorProfile.find_one(
        DoctorProfile.user_id
        == doctor_id
    )


    if not profile:

        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )


    profile.is_verified = False

    profile.verification_status = (
        "rejected"
    )


    await profile.save()


    return {
        "message": (
            "Doctor rejected successfully"
        ),

        "doctor_id": doctor_id,

        "verification_status": (
            "rejected"
        ),

        "is_verified": False
    }
# =========================
# ADMIN REPORTS
# =========================

@router.get("/reports")
async def get_admin_reports(
    _: User = admin_required
):

    records = await PregnancyRecord.find_all().sort(
        -PregnancyRecord.created_at
    ).to_list()


    reports = []


    for record in records:


        patient = await User.get(
            record.user_id
        )


        if not patient:
            continue



        reports.append(

            {

                "report_id":
                    str(record.id),


                "patient_name":
                    patient.name,


                "patient_email":
                    patient.email,


                "risk_level":
                    record.risk_level,


                "risk_score":
                    record.risk_score,



                "symptoms":
                    record.symptoms,



                "pregnancy_week":
                    record.pregnancy_week,



                "vitals":
                    {

                        "bpSystolic":
                            record.bp_systolic,


                        "bpDiastolic":
                            record.bp_diastolic,


                        "sugar":
                            record.sugar,


                        "temperature":
                            record.temperature,


                        "heartRate":
                            record.heart_rate

                    },



                "created_at":
                    record.created_at.isoformat()
                    if record.created_at
                    else None

            }

        )


    return reports