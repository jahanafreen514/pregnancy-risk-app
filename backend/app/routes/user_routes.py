from fastapi import APIRouter, Depends, HTTPException

from app.middleware.auth_middleware import get_current_user
from app.models.user_model import User
from app.schemas.user_schema import UserOut, UserUpdate


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me", response_model=UserOut)
async def me(
    current_user: User = Depends(get_current_user)
):
    return current_user



@router.patch("/me", response_model=UserOut)
async def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user)
):

    fields = {
        "countryCode": "country_code",
        "phone": "phone",
        "name": "name",
        "selectedDoctor": "selected_doctor"
    }


    for source, target in fields.items():

        value = getattr(payload, source)

        if value is not None:
            setattr(current_user, target, value)


    await current_user.save()

    return current_user



@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: str,
    _: User = Depends(get_current_user)
):

    user = await User.get(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user