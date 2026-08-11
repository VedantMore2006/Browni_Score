from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from auth import get_current_user, require_role
from points_engine import apply_points

router = APIRouter(prefix="/tasks", tags=["tasks"])

RATING_POINTS = {"needs_revision": 3, "meets": 5, "exceeds": 8}


@router.get("", response_model=List[schemas.TaskOut])
def list_tasks(
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    if user.role == "member":
        return (
            db.query(models.Task)
            .filter(models.Task.assigned_to == user.id)
            .order_by(models.Task.deadline)
            .all()
        )
    return db.query(models.Task).order_by(models.Task.deadline).all()


@router.post("", response_model=schemas.TaskOut)
def create_task(
    payload: schemas.TaskCreateRequest,
    db: Session = Depends(get_db),
    actor: models.Member = Depends(require_role("coordinator", "admin")),
):
    assignee = db.query(models.Member).filter(models.Member.id == payload.assigned_to).first()
    if not assignee:
        raise HTTPException(status_code=404, detail="Assignee not found")

    task = models.Task(
        title=payload.title,
        duration_hrs=payload.duration_hrs,
        deadline=payload.deadline,
        priority=payload.priority,
        assigned_to=payload.assigned_to,
        assigned_by=actor.id,
        status="pending",
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.post("/{task_id}/complete", response_model=schemas.TaskOut)
def mark_complete(
    task_id: int,
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if user.role == "member" and task.assigned_to != user.id:
        raise HTTPException(status_code=403, detail="Not your task")

    task.status = "completed"
    task.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task


@router.post("/{task_id}/rate", response_model=schemas.TaskOut)
def rate_task(
    task_id: int,
    payload: schemas.TaskRateRequest,
    db: Session = Depends(get_db),
    actor: models.Member = Depends(require_role("coordinator", "admin")),
):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.status != "completed":
        raise HTTPException(status_code=400, detail="Task must be completed before rating")

    member = db.query(models.Member).filter(models.Member.id == task.assigned_to).first()
    points = RATING_POINTS[payload.rating]

    task.rating = payload.rating
    task.points_awarded = points
    task.status = "rated"

    apply_points(
        db,
        member,
        event_type="earn",
        category="task",
        points=points,
        reason=f"Task rated '{payload.rating}': {task.title}",
        logged_by=actor.id,
    )

    db.commit()
    db.refresh(task)
    return task
