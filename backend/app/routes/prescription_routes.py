from fastapi import APIRouter, Depends, HTTPException

from app.models.prescription_model import Prescription
from app.middleware.auth_middleware import get_current_user


router = APIRouter(
    prefix="/prescriptions",
    tags=["Prescriptions"]
)


# GET ALL PRESCRIPTIONS
@router.get("/")
async def get_prescriptions(
    current_user=Depends(get_current_user)
):
    prescriptions = await Prescription.find_all().to_list()

    return {
        "message": "Prescriptions fetched successfully",
        "data": prescriptions
    }



# CREATE PRESCRIPTION
@router.post("/")
async def create_prescription(
    data: dict,
    current_user=Depends(get_current_user)
):

    prescription = Prescription(
        doctor_id=data.get("doctor_id"),
        doctor_name=data.get("doctor_name"),

        patient_id=data.get("patient_id"),
        patient_name=data.get("patient_name"),
        patient_email=data.get("patient_email"),

        medicine=data.get("medicine"),
        dosage=data.get("dosage"),
        frequency=data.get("frequency"),
        timing=data.get("timing"),

        instructions=data.get(
            "instructions",
            ""
        ),

        status=data.get(
            "status",
            "active"
        )
    )


    await prescription.insert()


    return {
        "message": "Prescription created successfully",
        "data": prescription
    }



# GET SINGLE PRESCRIPTION
@router.get("/{prescription_id}")
async def get_single_prescription(
    prescription_id: str,
    current_user=Depends(get_current_user)
):

    prescription = await Prescription.get(
        prescription_id
    )

    if not prescription:
        raise HTTPException(
            status_code=404,
            detail="Prescription not found"
        )

    return prescription
# UPDATE PRESCRIPTION
@router.put("/{prescription_id}")
async def update_prescription(
    prescription_id: str,
    data: dict,
    current_user=Depends(get_current_user)
):

    prescription = await Prescription.get(
        prescription_id
    )

    if not prescription:
        raise HTTPException(
            status_code=404,
            detail="Prescription not found"
        )

    prescription.patient_id = data.get(
        "patient_id",
        prescription.patient_id
    )

    prescription.patient_name = data.get(
        "patient_name",
        prescription.patient_name
    )

    prescription.patient_email = data.get(
        "patient_email",
        prescription.patient_email
    )

    prescription.medicine = data.get(
        "medicine",
        prescription.medicine
    )

    prescription.dosage = data.get(
        "dosage",
        prescription.dosage
    )

    prescription.frequency = data.get(
        "frequency",
        prescription.frequency
    )

    prescription.timing = data.get(
        "timing",
        prescription.timing
    )

    prescription.instructions = data.get(
        "instructions",
        prescription.instructions
    )

    prescription.status = data.get(
        "status",
        prescription.status
    )

    await prescription.save()

    return {
        "message": "Prescription updated successfully",
        "data": prescription
    }


# DELETE PRESCRIPTION
@router.delete("/{prescription_id}")
async def delete_prescription(
    prescription_id: str,
    current_user=Depends(get_current_user)
):

    prescription = await Prescription.get(
        prescription_id
    )

    if not prescription:
        raise HTTPException(
            status_code=404,
            detail="Prescription not found"
        )


    await prescription.delete()


    return {
        "message":"Prescription deleted successfully"
    }