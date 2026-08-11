from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from auth import get_current_user, require_role, hash_password

router = APIRouter(prefix="/members", tags=["members"])


@router.get("", response_model=List[schemas.MemberOut])
def list_members(
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    if user.role == "member":
        return [db.query(models.Member).filter(models.Member.id == user.id).first()]
    return db.query(models.Member).order_by(models.Member.points_total.desc()).all()


@router.get("/me", response_model=schemas.MemberOut)
def get_me(user: models.Member = Depends(get_current_user)):
    return user


@router.get("/{member_id}", response_model=schemas.MemberOut)
def get_member(
    member_id: int,
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    if user.role == "member" and user.id != member_id:
        raise HTTPException(status_code=403, detail="Cannot view other members")
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member


@router.post("", response_model=schemas.MemberOut)
def create_member(
    payload: schemas.MemberCreate,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    existing = db.query(models.Member).filter(models.Member.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")

    member = models.Member(
        name=payload.name,
        username=payload.username,
        password_hash=hash_password(payload.password),
        role=payload.role,
        points_total=100,
        rank="D",
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.patch("/{member_id}", response_model=schemas.MemberOut)
def update_member(
    member_id: int,
    payload: schemas.MemberUpdate,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    if payload.name is not None:
        member.name = payload.name
    if payload.role is not None:
        member.role = payload.role
    if payload.status is not None:
        member.status = payload.status

    db.commit()
    db.refresh(member)
    return member


@router.post("/{member_id}/deactivate", response_model=schemas.MemberOut)
def deactivate_member(
    member_id: int,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    member.status = "suspended"
    db.commit()
    db.refresh(member)
    return member


@router.post("/{member_id}/reset-password", response_model=schemas.MemberOut)
def reset_password(
    member_id: int,
    payload: schemas.PasswordReset,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    member.password_hash = hash_password(payload.new_password)
    db.commit()
    db.refresh(member)
    return member


@router.get("/{member_id}/audit-log")
def member_audit_log(
    member_id: int,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    logs = (
        db.query(models.PointLog)
        .filter(models.PointLog.member_id == member_id)
        .order_by(models.PointLog.timestamp.desc())
        .all()
    )
    warnings = (
        db.query(models.Warning)
        .filter(models.Warning.member_id == member_id)
        .order_by(models.Warning.date.desc())
        .all()
    )
    return {
        "point_logs": [schemas.PointLogOut.model_validate(l) for l in logs],
        "warnings": [schemas.WarningOut.model_validate(w) for w in warnings],
    }
