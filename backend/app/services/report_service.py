from app.models.report_model import Report
from app.schemas.report_schema import ReportCreate


async def create_report(
    doctor_id: str,
    payload: ReportCreate
):

    report = Report(
        patient_id=str(payload.patient_id),
        doctor_id=doctor_id,
        title=payload.title,
        summary=payload.summary
    )


    await report.insert()


    return report