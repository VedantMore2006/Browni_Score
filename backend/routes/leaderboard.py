from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("/weekly", response_model=List[schemas.MemberOut])
def weekly_leaderboard(
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    return (
        db.query(models.Member)
        .filter(models.Member.status == "active")
        .order_by(models.Member.points_this_week.desc())
        .all()
    )


@router.get("/monthly", response_model=List[schemas.MemberOut])
def monthly_leaderboard(
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    return (
        db.query(models.Member)
        .filter(models.Member.status == "active")
        .order_by(models.Member.points_this_month.desc())
        .all()
    )


@router.get("/hero-of-month", response_model=List[schemas.MemberOut])
def hero_of_month(
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    return (
        db.query(models.Member)
        .filter(models.Member.status == "active", models.Member.points_this_month >= 300)
        .order_by(models.Member.points_this_month.desc())
        .all()
    )
