from fastapi import APIRouter, Depends, HTTPException

from app.middleware.auth_middleware import (
    get_current_user,
    require_roles
)

from app.models.report_model import Report
from app.models.user_model import User

from app.schemas.report_schema import (
    ReportCreate,
    ReportOut,
    ReportUpdate,
)


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


async def _include_patient_details(reports: list[Report]) -> list[Report]:
    """Provide doctor-facing identity fields for both new and existing reports."""
    for report in reports:
        if report.patient_name and report.patient_email:
            continue
        patient = await User.get(report.patient_id)
        if patient:
            report.patient_name = patient.name
            report.patient_email = patient.email
    return reports


def _serialize_report(report: Report) -> dict:
    """Convert Beanie's BSON ObjectId into the string required by ReportOut."""
    data = report.model_dump(mode="json")
    data["id"] = str(report.id)
    return data



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
        patient_name=patient.name,
        patient_email=patient.email,
        doctor_id=str(user.id),
        title=payload.title,
        summary=payload.summary,
        risk_level=payload.risk_level,
        risk_score=payload.risk_score,
        confidence=payload.confidence,
        recommendation=payload.recommendation,
        symptoms=payload.symptoms,
        risk_factors=payload.risk_factors,
        vitals=payload.vitals,
    )


    await report.insert()

    return _serialize_report(report)




@router.get(
    "",
    response_model=list[ReportOut]
)
async def list_reports(
    user: User = Depends(get_current_user)
):

    if user.role == "admin":
        reports = await Report.find_all().sort(
            -Report.created_at
        ).to_list()
        reports = await _include_patient_details(reports)
        return [_serialize_report(report) for report in reports]



    if user.role == "doctor":
        reports = await Report.find(
            Report.doctor_id == str(user.id)
        ).sort(
            -Report.created_at
        ).to_list()
        reports = await _include_patient_details(reports)
        return [_serialize_report(report) for report in reports]



    reports = await Report.find(
        Report.patient_id == str(user.id)
    ).sort(
        -Report.created_at
    ).to_list()
    reports = await _include_patient_details(reports)
    return [_serialize_report(report) for report in reports]


@router.patch("/{report_id}", response_model=ReportOut)
async def update_report(report_id: str, payload: ReportUpdate, user: User = Depends(require_roles("doctor", "admin"))):
    report = await Report.get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    if user.role != "admin" and report.doctor_id != str(user.id):
        raise HTTPException(status_code=403, detail="Not allowed to update this report")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(report, field, value)
    if payload.doctor_notes is not None:
        report.status = payload.status or "Reviewed"
    await report.save()
    return _serialize_report(report)
