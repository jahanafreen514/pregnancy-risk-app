from app.models.alert_model import Alert


async def create_alert(
    user_id: str,
    title: str,
    message: str,
    severity: str = "info"
):

    alert = Alert(
        user_id=user_id,
        title=title,
        message=message,
        severity=severity
    )


    await alert.insert()


    return alert