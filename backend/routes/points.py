
import models
import schemas
from auth import get_current_user, require_role
from database import get_db
from fastapi import APIRouter, Depends, HTTPException
from points_engine import apply_points
from sqlalchemy.orm import Session

router = APIRouter(prefix="/points", tags=["points"])


@router.post("", response_model=schemas.PointLogOut)
def log_points(
    payload: schemas.PointLogCreate,
    db: Session = Depends(get_db),
    actor: models.Member = Depends(require_role("coordinator", "admin")),
):
    member = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    log = apply_points(
        db,
        member,
        event_type=payload.event_type,
        category=payload.category,
        points=payload.points,
        reason=payload.reason,
        logged_by=actor.id,
    )
    return log


@router.get("/member/{member_id}", response_model=list[schemas.PointLogOut])
def member_point_log(
    member_id: int,
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    if user.role == "member" and user.id != member_id:
        raise HTTPException(status_code=403, detail="Cannot view other members' logs")
    return (
        db.query(models.PointLog)
        .filter(models.PointLog.member_id == member_id)
        .order_by(models.PointLog.timestamp.desc())
        .all()
    )
