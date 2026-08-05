from fastapi import APIRouter, Depends, HTTPException

from app.middleware.auth_middleware import (
    get_current_user,
    require_roles
)

from app.models.report_model import Report
from app.models.user_model import User

from app.schemas.report_schema import (
    ReportCreate,
    ReportOut
)


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)



@router.post(
    "",
    response_model=ReportOut,
    status_code=201
)
async def create(
    payload: ReportCreate,
    user: User = Depends(require_roles("doctor", "admin"))
):

    patient = await User.get(
        str(payload.patient_id)
    )


    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )


    report = Report(
        patient_id=str(patient.id),
        doctor_id=str(user.id),
        title=payload.title,
        summary=payload.summary
    )


    await report.insert()

    return report




@router.get(
    "",
    response_model=list[ReportOut]
)
async def list_reports(
    user: User = Depends(get_current_user)
):

    if user.role == "admin":

        return await Report.find_all().sort(
            -Report.created_at
        ).to_list()



    if user.role == "doctor":

        return await Report.find(
            Report.doctor_id == str(user.id)
        ).sort(
            -Report.created_at
        ).to_list()



    return await Report.find(
        Report.patient_id == str(user.id)
    ).sort(
        -Report.created_at
    ).to_list()