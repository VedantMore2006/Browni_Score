from datetime import datetime

import models
import schemas
from auth import require_role
from database import get_db
from fastapi import APIRouter, Depends, HTTPException
from logger import logger
from points_engine import apply_points
from sqlalchemy.orm import Session

router = APIRouter(prefix="/tasks", tags=["tasks"])

RATING_POINTS = {"needs_revision": 3, "meets": 5, "exceeds": 8}


# ── Helpers ──────────────────────────────────────────────────────────────────

def _resolve_task(task: models.Task, db: Session) -> dict:
    assignee = db.query(models.Member).filter(models.Member.id == task.assigned_to).first()
    assigner = db.query(models.Member).filter(models.Member.id == task.assigned_by).first()
    return {
        "id": task.id,
        "title": task.title,
        "duration_hrs": task.duration_hrs,
        "deadline": task.deadline,
        "priority": task.priority,
        "assigned_to": task.assigned_to,
        "assigned_to_name": assignee.name if assignee else "Unknown",
        "assigned_by": task.assigned_by,
        "assigned_by_name": assigner.name if assigner else "Unknown",
        "project_id": task.project_id,
        "project_lead_name": task.project_lead_name,
        "status": task.status,
        "rating": task.rating,
        "points_awarded": task.points_awarded,
        "created_at": task.created_at,
        "completed_at": task.completed_at,
    }


def _resolve_tasks(tasks: list, db: Session) -> list:
    """Resolve member names for a list of tasks — avoids N+1 queries."""
    member_ids = set()
    for t in tasks:
        member_ids.add(t.assigned_to)
        member_ids.add(t.assigned_by)
    members = db.query(models.Member).filter(models.Member.id.in_(member_ids)).all()
    member_map = {m.id: m.name for m in members}
    return [
        {
            "id": t.id,
            "title": t.title,
            "duration_hrs": t.duration_hrs,
            "deadline": t.deadline,
            "priority": t.priority,
            "assigned_to": t.assigned_to,
            "assigned_to_name": member_map.get(t.assigned_to, "Unknown"),
            "assigned_by": t.assigned_by,
            "assigned_by_name": member_map.get(t.assigned_by, "Unknown"),
            "project_id": t.project_id,
            "project_lead_name": t.project_lead_name,
            "status": t.status,
            "rating": t.rating,
            "points_awarded": t.points_awarded,
            "created_at": t.created_at,
            "completed_at": t.completed_at,
        }
        for t in tasks
    ]


# ── Public endpoints ──────────────────────────────────────────────────────────

@router.get("", response_model=list[dict])
def list_tasks(
    db: Session = Depends(get_db),
    project_id: str | None = None,
    assigned_to: int | None = None,
    status: str | None = None,
    priority: int | None = None,
):
    """Public: list all tasks with optional filters."""
    q = db.query(models.Task)
    if project_id:
        q = q.filter(models.Task.project_id == project_id)
    if assigned_to:
        q = q.filter(models.Task.assigned_to == assigned_to)
    if status:
        q = q.filter(models.Task.status == status)
    if priority:
        q = q.filter(models.Task.priority == priority)
    tasks = q.order_by(models.Task.deadline).all()
    return _resolve_tasks(tasks, db)


@router.get("/{task_id}", response_model=dict)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Public: get single task detail."""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return _resolve_task(task, db)


# ── Admin-only endpoints ──────────────────────────────────────────────────────

@router.post("", response_model=dict)
def create_task(
    payload: schemas.TaskCreateRequest,
    db: Session = Depends(get_db),
    actor: models.Member = Depends(require_role("admin")),
):
    from projects import PROJECTS_BY_ID, get_lead_for_project

    assignee = db.query(models.Member).filter(models.Member.id == payload.assigned_to).first()
    if not assignee:
        raise HTTPException(status_code=404, detail="Assignee not found")
    if payload.project_id and payload.project_id not in PROJECTS_BY_ID:
        raise HTTPException(status_code=400, detail=f"Unknown project_id: {payload.project_id}")

    task = models.Task(
        title=payload.title,
        duration_hrs=payload.duration_hrs,
        deadline=payload.deadline,
        priority=payload.priority,
        assigned_to=payload.assigned_to,
        assigned_by=actor.id,
        project_id=payload.project_id,
        project_lead_name=payload.project_lead_name or get_lead_for_project(payload.project_id),
        status="pending",
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    logger.info(
        f"Task created: id={task.id} title={task.title} "
        f"assigned_to={assignee.name} project={task.project_id}"
    )
    return _resolve_task(task, db)


@router.post("/{task_id}/complete", response_model=dict)
def mark_complete(
    task_id: int,
    db: Session = Depends(get_db),
    actor: models.Member = Depends(require_role("admin")),
):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = "completed"
    task.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(task)

    member = db.query(models.Member).filter(models.Member.id == task.assigned_to).first()
    logger.info(f"Task completed: id={task.id} title={task.title} member={member.name if member else 'Unknown'}")
    return _resolve_task(task, db)


@router.post("/{task_id}/rate", response_model=dict)
def rate_task(
    task_id: int,
    payload: schemas.TaskRateRequest,
    db: Session = Depends(get_db),
    actor: models.Member = Depends(require_role("admin")),
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
    logger.info(
        f"Task rated: id={task.id} rating={payload.rating} "
        f"pts={points} member={member.name if member else 'Unknown'}"
    )
    return _resolve_task(task, db)
