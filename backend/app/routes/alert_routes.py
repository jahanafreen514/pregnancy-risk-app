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



@router.get(
    "",
    response_model=list[AlertOut]
)
async def list_alerts(
    user: User = Depends(get_current_user)
):

    return await Alert.find(
        Alert.user_id == str(user.id)
    ).sort(
        -Alert.created_at
    ).to_list()




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

    return alert




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

    return alert