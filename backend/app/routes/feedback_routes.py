from fastapi import APIRouter, Depends, HTTPException, status

from app.middleware.auth_middleware import get_current_user, require_roles
from app.models.feedback_model import Feedback
from app.models.user_model import User
from app.schemas.feedback_schema import FeedbackCreate, FeedbackOut

router = APIRouter(prefix="/feedback", tags=["Feedback"])


def serialize(item: Feedback) -> dict:
    return {**item.model_dump(), "id": str(item.id)}


@router.post("", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
async def create_feedback(payload: FeedbackCreate, user: User = Depends(get_current_user)):
    if payload.consultation_id:
        existing = await Feedback.find_one(
            Feedback.user_id == str(user.id),
            Feedback.consultation_id == payload.consultation_id,
        )
        if existing:
            raise HTTPException(status_code=409, detail="Feedback has already been submitted for this consultation")
    feedback = Feedback(user_id=str(user.id), user_name=user.name, sender_type=user.role, **payload.model_dump())
    await feedback.insert()
    return serialize(feedback)


@router.get("", response_model=list[FeedbackOut])
async def list_feedback(_: User = Depends(require_roles("admin"))):
    items = await Feedback.find_all().sort(-Feedback.created_at).to_list()
    return [serialize(item) for item in items]


@router.get("/summary")
async def feedback_summary(_: User = Depends(require_roles("admin"))):
    """Database-backed feedback metrics for the admin dashboard/charts."""
    items = await Feedback.find_all().to_list()
    distribution = {str(rating): 0 for rating in range(1, 6)}
    sender_types: dict[str, int] = {}
    for item in items:
        distribution[str(item.rating)] += 1
        sender_types[item.sender_type] = sender_types.get(item.sender_type, 0) + 1
    total = len(items)
    return {
        "total": total,
        "average_rating": round(sum(item.rating for item in items) / total, 2) if total else 0,
        "positive": sum(item.rating >= 4 for item in items),
        "negative": sum(item.rating <= 2 for item in items),
        "rating_distribution": distribution,
        "sender_distribution": sender_types,
    }


@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_feedback(feedback_id: str, _: User = Depends(require_roles("admin"))):
    feedback = await Feedback.get(feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    await feedback.delete()
