from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from auth import require_role, get_current_user

router = APIRouter(prefix="/warnings", tags=["warnings"])


@router.post("", response_model=schemas.WarningOut)
def issue_warning(
    payload: schemas.WarningCreate,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    member = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    member.warnings_count += 1
    warning = models.Warning(
        member_id=member.id,
        warning_number=member.warnings_count,
        reason=payload.reason,
        issued_by=admin.id,
        valid_reason_accepted=payload.valid_reason_accepted,
    )
    db.add(warning)

    if member.warnings_count >= 3:
        member.status = "suspended"

    db.commit()
    db.refresh(warning)
    return warning


@router.get("/member/{member_id}", response_model=List[schemas.WarningOut])
def member_warnings(
    member_id: int,
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    if user.role == "member" and user.id != member_id:
        raise HTTPException(status_code=403, detail="Cannot view other members' warnings")
    return (
        db.query(models.Warning)
        .filter(models.Warning.member_id == member_id)
        .order_by(models.Warning.date.desc())
        .all()
    )
