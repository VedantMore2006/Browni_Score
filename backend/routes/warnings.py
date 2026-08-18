import models
import schemas
from auth import require_role
from database import get_db
from fastapi import APIRouter, Depends, HTTPException
from logger import logger
from sqlalchemy.orm import Session

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
        logger.warning(f"Member suspended: name={member.name} warnings=3")

    db.commit()
    db.refresh(warning)
    logger.warning(
        f"Warning issued: member={member.name} number={member.warnings_count} reason={payload.reason}"
    )
    return warning


@router.get("/member/{member_id}", response_model=list[schemas.WarningOut])
def member_warnings(
    member_id: int,
    db: Session = Depends(get_db),
    # Public endpoint — consistent with public portal model
):
    """Public: get warnings for a member (visible on hunter profile page)."""
    return (
        db.query(models.Warning)
        .filter(models.Warning.member_id == member_id)
        .order_by(models.Warning.date.desc())
        .all()
    )
