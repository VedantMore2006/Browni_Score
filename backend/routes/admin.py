from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from auth import require_role

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/alerts")
def alerts(
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin", "coordinator")),
):
    low_points = db.query(models.Member).filter(models.Member.points_total < 100).all()
    two_warnings = db.query(models.Member).filter(models.Member.warnings_count == 2).all()
    overdue_tasks = (
        db.query(models.Task)
        .filter(models.Task.deadline < datetime.utcnow(), models.Task.status.in_(["pending", "in_progress"]))
        .all()
    )
    return {
        "low_points": [schemas.MemberOut.model_validate(m) for m in low_points],
        "two_warnings": [schemas.MemberOut.model_validate(m) for m in two_warnings],
        "overdue_tasks": [schemas.TaskOut.model_validate(t) for t in overdue_tasks],
    }
