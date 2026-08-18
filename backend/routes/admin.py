from datetime import datetime

import models
import schemas
from auth import require_role
from database import get_db
from fastapi import APIRouter, Depends, HTTPException
from logger import logger
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/alerts")
def alerts(
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin", "coordinator")),
):
    """Admin: members with low points, 2 warnings, and overdue tasks."""
    low_points = db.query(models.Member).filter(models.Member.points_total < 100).all()
    two_warnings = db.query(models.Member).filter(models.Member.warnings_count == 2).all()
    overdue_tasks = (
        db.query(models.Task)
        .filter(
            models.Task.deadline < datetime.utcnow(),
            models.Task.status.in_(["pending", "in_progress"])
        )
        .all()
    )
    return {
        "low_points": [schemas.MemberOut.model_validate(m) for m in low_points],
        "two_warnings": [schemas.MemberOut.model_validate(m) for m in two_warnings],
        "overdue_tasks": [schemas.TaskOut.model_validate(t) for t in overdue_tasks],
    }


@router.post("/reset-weekly", response_model=schemas.AdminResetResponse)
def reset_weekly(
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Admin: reset points_this_week to 0 for all members. Run every Monday."""
    members = db.query(models.Member).all()
    count = 0
    for m in members:
        m.points_this_week = 0
        count += 1
    db.commit()
    logger.info(f"Weekly reset executed: {count} members updated by admin")
    return {
        "status": "ok",
        "members_updated": count,
        "reset_type": "weekly",
        "timestamp": datetime.utcnow(),
    }


@router.post("/reset-monthly", response_model=schemas.AdminResetResponse)
def reset_monthly(
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Admin: reset points_this_month to 0 for all members. Run on 1st of month."""
    members = db.query(models.Member).all()
    count = 0
    for m in members:
        m.points_this_month = 0
        count += 1
    db.commit()
    logger.info(f"Monthly reset executed: {count} members updated by admin")
    return {
        "status": "ok",
        "members_updated": count,
        "reset_type": "monthly",
        "timestamp": datetime.utcnow(),
    }


@router.post("/confirm-hero-week")
def confirm_hero_week(
    payload: schemas.HeroConfirmRequest,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Admin: record hero of week confirmation."""
    member = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    logger.info(f"Hero confirmed: member={member.name} period=week")
    return {
        "status": "confirmed",
        "hero": member.name,
        "period": "week",
        "pts_this_week": member.points_this_week,
        "confirmed_by": admin.name,
        "note": payload.note,
    }


@router.post("/confirm-hero-month")
def confirm_hero_month(
    payload: schemas.HeroConfirmRequest,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Admin: record hero of month confirmation. Member must have 300+ pts."""
    member = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    if member.points_this_month < 300:
        raise HTTPException(
            status_code=400,
            detail=f"{member.name} has only {member.points_this_month} pts — below 300 threshold"
        )
    logger.info(f"Hero confirmed: member={member.name} period=month")
    return {
        "status": "confirmed",
        "hero": member.name,
        "period": "month",
        "pts_this_month": member.points_this_month,
        "confirmed_by": admin.name,
        "note": payload.note,
    }


@router.post("/seed-members")
def seed_members(
    payload: schemas.MemberSeedRequest,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Admin: seed all 18 real team members into the database. One-time operation."""
    if not payload.confirm:
        raise HTTPException(status_code=400, detail="Set confirm=true to execute seeding")

    from auth import hash_password
    from projects import ALL_MEMBER_NAMES, U5_LEADS
    from ranking import rank_for_points

    created = []
    skipped = []
    for name in ALL_MEMBER_NAMES:
        existing = db.query(models.Member).filter(
            models.Member.name.ilike(name)
        ).first()
        if existing:
            skipped.append(name)
            continue
        username = name.lower().replace(" ", "_")
        role = "coordinator" if name in U5_LEADS else "member"
        member = models.Member(
            name=name,
            username=username,
            password_hash=hash_password("hunter123"),  # default password
            role=role,
            points_total=100,
            rank=rank_for_points(100),
            status="active",
        )
        db.add(member)
        created.append(name)

    db.commit()
    logger.info(f"Members seeded: created={created} skipped={skipped}")
    return {
        "status": "ok",
        "created": created,
        "skipped": skipped,
        "default_password": "hunter123",
        "note": "Change passwords immediately after seeding",
    }
