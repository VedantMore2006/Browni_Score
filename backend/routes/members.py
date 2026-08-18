import models
import schemas
from auth import get_current_user, hash_password, require_role, verify_password
from database import get_db
from fastapi import APIRouter, Depends, HTTPException
from logger import logger
from ranking import rank_label
from sqlalchemy.orm import Session

router = APIRouter(prefix="/members", tags=["members"])


def _enrich(m: models.Member) -> dict:
    """Return MemberOut dict with rank_label populated."""
    d = schemas.MemberOut.model_validate(m).model_dump()
    d["rank_label"] = rank_label(m.rank)
    return d


# ── Public endpoints ────────────────────────────────────────────────────────

@router.get("", response_model=list[dict])
def list_members(db: Session = Depends(get_db)):
    """Public: list all members sorted by monthly points."""
    members = db.query(models.Member).order_by(
        models.Member.points_this_month.desc()
    ).all()
    return [_enrich(m) for m in members]


@router.get("/by-name/{name}", response_model=dict)
def get_member_by_name(name: str, db: Session = Depends(get_db)):
    """Public: get one member by name string (used by hunter.html?name=Ganesh)."""
    member = db.query(models.Member).filter(
        models.Member.name.ilike(name)
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail=f"Member '{name}' not found")
    return _enrich(member)


@router.get("/me", response_model=dict)
def get_me(user: models.Member = Depends(get_current_user)):
    return _enrich(user)


@router.get("/{member_id}", response_model=dict)
def get_member(member_id: int, db: Session = Depends(get_db)):
    """Public: get one member by ID."""
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return _enrich(member)


# ── Auth-required endpoints ─────────────────────────────────────────────────

@router.patch("/me/password")
def change_own_password(
    payload: schemas.ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    """Allow a logged-in member to change their own password."""
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"status": "password updated"}


# ── Admin-only endpoints ────────────────────────────────────────────────────

@router.post("", response_model=dict)
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
    logger.info(f"Member created: name={member.name} role={member.role} by=admin")
    return _enrich(member)


@router.patch("/{member_id}", response_model=dict)
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
    return _enrich(member)


@router.post("/{member_id}/deactivate", response_model=dict)
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
    logger.info(f"Member deactivated: name={member.name} by=admin")
    return _enrich(member)


@router.post("/{member_id}/reset-password", response_model=dict)
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
    return _enrich(member)


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
