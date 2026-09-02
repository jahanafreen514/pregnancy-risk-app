from datetime import timezone
from fastapi import APIRouter, Depends, HTTPException


from app.middleware.auth_middleware import (
    get_current_user,
    require_roles
)

from app.models.alert_model import Alert
from app.models.user_model import User

from app.schemas.alert_schema import (
    AlertCreate,
    AlertOut
)


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


def serialize_alert(alert: Alert) -> dict:
    """Convert Beanie's ObjectId into the string required by AlertOut."""
    data = alert.model_dump(mode="json")
    # Older alerts used naive UTC values. Explicit UTC makes browser conversion
    # accurate instead of treating that UTC time as the device's local time.
    created_at = alert.created_at
    if created_at and created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    data["created_at"] = created_at.isoformat() if created_at else None
    return {**data, "id": str(alert.id)}



@router.get(
    "",
    response_model=list[AlertOut]
)
async def list_alerts(
    user: User = Depends(get_current_user)
):

    items = await Alert.find(
        Alert.user_id == str(user.id)
    ).sort(
        -Alert.created_at
    ).to_list()
    return [serialize_alert(item) for item in items]




@router.post(
    "",
    response_model=AlertOut
)
async def send_alert(
    payload: AlertCreate,
    _: User = Depends(require_roles("doctor","admin"))
):

    alert = Alert(
        user_id=str(payload.user_id),
        title=payload.title,
        message=payload.message,
        severity=payload.severity
    )


    await alert.insert()

    return serialize_alert(alert)




@router.patch(
    "/{alert_id}/read",
    response_model=AlertOut
)
async def mark_read(
    alert_id: str,
    user: User = Depends(get_current_user)
):

    alert = await Alert.get(alert_id)


    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )


    if alert.user_id != str(user.id):
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )


    alert.is_read = True

    await alert.save()

    return serialize_alert(alert)
