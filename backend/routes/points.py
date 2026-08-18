import models
import schemas
from auth import require_role
from database import get_db
from fastapi import APIRouter, Depends, HTTPException
from logger import logger
from points_engine import apply_points
from sqlalchemy.orm import Session

router = APIRouter(prefix="/points", tags=["points"])


# ── Helper ────────────────────────────────────────────────────────────────────

def _resolve_logs(logs: list, db: Session) -> list:
    """Resolve member names for a list of point logs — avoids N+1 queries."""
    member_ids = set()
    for l in logs:
        member_ids.add(l.member_id)
        member_ids.add(l.logged_by)
    members = db.query(models.Member).filter(models.Member.id.in_(member_ids)).all()
    member_map = {m.id: m.name for m in members}
    return [
        {
            "id": l.id,
            "member_id": l.member_id,
            "member_name": member_map.get(l.member_id, "Unknown"),
            "event_type": l.event_type,
            "category": l.category,
            "points": l.points,
            "reason": l.reason,
            "logged_by": l.logged_by,
            "logged_by_name": member_map.get(l.logged_by, "System"),
            "timestamp": l.timestamp,
        }
        for l in logs
    ]


# ── Public endpoints ──────────────────────────────────────────────────────────

@router.get("/all", response_model=list[dict])
def all_point_logs(
    db: Session = Depends(get_db),
    member_id: int | None = None,
    category: str | None = None,
    event_type: str | None = None,
    limit: int = 200,
    offset: int = 0,
):
    """Public: paginated point log for all members or one member."""
    q = db.query(models.PointLog)
    if member_id:
        q = q.filter(models.PointLog.member_id == member_id)
    if category:
        q = q.filter(models.PointLog.category == category)
    if event_type:
        q = q.filter(models.PointLog.event_type == event_type)
    logs = q.order_by(models.PointLog.timestamp.desc()).offset(offset).limit(limit).all()
    return _resolve_logs(logs, db)


# ── Admin-only endpoints ──────────────────────────────────────────────────────

@router.post("", response_model=schemas.PointLogOut)
def log_points(
    payload: schemas.PointLogCreate,
    db: Session = Depends(get_db),
    actor: models.Member = Depends(require_role("admin")),
):
    if payload.points <= 0:
        raise HTTPException(status_code=400, detail="Points must be greater than 0")

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
    logger.info(
        f"Points logged: member={member.name} type={payload.event_type} "
        f"pts={payload.points} cat={payload.category} reason={payload.reason}"
    )
    return log


@router.get("/member/{member_id}", response_model=list[dict])
def member_point_log(
    member_id: int,
    db: Session = Depends(get_db),
):
    """Public: point log for a single member (kept for backward compatibility)."""
    logs = (
        db.query(models.PointLog)
        .filter(models.PointLog.member_id == member_id)
        .order_by(models.PointLog.timestamp.desc())
        .all()
    )
    return _resolve_logs(logs, db)
