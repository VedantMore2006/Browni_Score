import models
import schemas
from database import get_db
from fastapi import APIRouter, Depends
from ranking import rank_label
from sqlalchemy.orm import Session

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


def _enrich_members(members: list) -> list:
    result = []
    for m in members:
        d = schemas.MemberOut.model_validate(m).model_dump()
        d["rank_label"] = rank_label(m.rank)
        result.append(d)
    return result


@router.get("/weekly", response_model=list[dict])
def weekly_leaderboard(db: Session = Depends(get_db)):
    """Public: all active members sorted by points_this_week descending."""
    members = (
        db.query(models.Member)
        .filter(models.Member.status == "active")
        .order_by(models.Member.points_this_week.desc())
        .all()
    )
    return _enrich_members(members)


@router.get("/monthly", response_model=list[dict])
def monthly_leaderboard(db: Session = Depends(get_db)):
    """Public: all active members sorted by points_this_month descending."""
    members = (
        db.query(models.Member)
        .filter(models.Member.status == "active")
        .order_by(models.Member.points_this_month.desc())
        .all()
    )
    return _enrich_members(members)


@router.get("/hero-of-month", response_model=list[dict])
def hero_of_month(db: Session = Depends(get_db)):
    """Public: active members with 300+ pts this month."""
    members = (
        db.query(models.Member)
        .filter(models.Member.status == "active", models.Member.points_this_month >= 300)
        .order_by(models.Member.points_this_month.desc())
        .all()
    )
    return _enrich_members(members)
