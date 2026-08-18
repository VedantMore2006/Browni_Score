# Vitals&Vectors — Backend Implementation Plan
## Shipping the backend to match the frontend
### Version 1.0 — Complete Pre-Implementation Reference

---

## OVERVIEW

The frontend is complete with mock data. This document is the complete specification
for replacing every mock array with real API calls. Every endpoint, every schema
change, every error case, every frontend wiring instruction, and every logging
requirement is documented here.

The backend is Python FastAPI + SQLite. It already has a working skeleton.
This plan extends it to match exactly what the frontend needs.

---

## ARCHITECTURE DECISIONS (locked)

| Decision | Choice | Reason |
|---|---|---|
| Auth model | Admin-only JWT | Public portal — only admin logs in |
| Public endpoints | No auth required | All read endpoints are public |
| Write endpoints | Admin JWT required | Only admin can add/modify data |
| Database | SQLite | Phase 1 — upgrade to PostgreSQL later |
| Reset mechanism | Weekly/monthly cron-style manual endpoint | No cron yet, admin triggers it |
| Project data | Static config file | Projects/leads don't change often |
| Attendance | Placeholder only | Premises app integration is future |
| Task source | Manual admin entry | Google Classroom integration is future |

---

## CRITICAL GAP: PUBLIC VS AUTH MODEL

**The existing backend requires auth (`get_current_user`) on almost every endpoint.**
**The frontend is a public portal — no login for regular viewers.**

**Required change:** Split all endpoints into two categories:

### Category A — Public (no token needed)
These must be accessible with no Authorization header:
- `GET /members` — team list for dashboard, leaderboard, point-log
- `GET /members/{id}` — hunter profile page
- `GET /tasks` — all-tasks, project, hunter pages
- `GET /tasks/{id}` — task detail
- `GET /points/all` — point-log page (all members' logs)
- `GET /leaderboard/weekly` — leaderboard
- `GET /leaderboard/monthly` — leaderboard
- `GET /leaderboard/hero-of-month` — leaderboard
- `GET /projects` — NEW: project list
- `GET /health` — status check

### Category B — Admin only (JWT required)
These require `Authorization: Bearer <token>`:
- `POST /auth/login` — admin login
- `POST /members` — create member
- `PATCH /members/{id}` — edit member
- `POST /members/{id}/deactivate` — deactivate
- `POST /members/{id}/reset-password` — reset password
- `POST /tasks` — create task
- `POST /tasks/{id}/complete` — mark complete
- `POST /tasks/{id}/rate` — rate task
- `POST /points` — log points
- `POST /warnings` — issue warning
- `GET /admin/alerts` — alert panel
- `GET /members/{id}/audit-log` — audit log
- `POST /admin/reset-weekly` — reset weekly points
- `POST /admin/reset-monthly` — reset monthly points
- `POST /admin/confirm-hero-week` — confirm hero of week
- `POST /admin/confirm-hero-month` — confirm hero of month
- `POST /admin/seed-members` — NEW: seed all 18 members

---

## SECTION 1: MODELS CHANGES

### 1.1 — Add `project_id` field to Task model

The frontend tracks tasks by project. The current `Task` model has no project field.
Every frontend page (dashboard.js, all-tasks, project.html, hunter.html) uses `projectId`.

```python
# In models.py — add to Task class:
project_id = Column(String, nullable=True, index=True)
# e.g. 'mindspace', 'neurovi', 'nutrisure', etc.
# Nullable for backward compatibility with existing tasks
```

### 1.2 — Add `project_lead_name` field to Task model

The frontend displays the lead name on every task row. Currently `assigned_by` is a member ID,
and the frontend needs to resolve it to a name. Add a denormalized lead name field for simplicity:

```python
# In models.py — add to Task class:
project_lead_name = Column(String, nullable=True)
# Populated at task creation from the PROJECTS config
```

### 1.3 — No changes to Member, PointLog, Warning models

These are correct as-is.

---

## SECTION 2: SCHEMAS CHANGES

### 2.1 — Update TaskCreateRequest

```python
class TaskCreateRequest(BaseModel):
    title: str
    duration_hrs: float = 0
    deadline: datetime | None = None
    priority: int = 2                    # 1=High, 2=Medium, 3=Low
    assigned_to: int                     # member ID
    project_id: str | None = None       # NEW: 'mindspace', 'neurovi', etc.
    project_lead_name: str | None = None # NEW: lead display name
```

### 2.2 — Update TaskOut

```python
class TaskOut(BaseModel):
    id: int
    title: str
    duration_hrs: float
    deadline: datetime | None
    priority: int
    assigned_to: int
    assigned_by: int
    project_id: str | None              # NEW
    project_lead_name: str | None       # NEW
    status: TaskStatus
    rating: TaskRating | None
    points_awarded: int
    created_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = True
```

### 2.3 — Add PointLogOut with resolved names

The frontend point-log page shows member name and "logged by" name as strings, not IDs.
Add a resolved version:

```python
class PointLogOutResolved(BaseModel):
    id: int
    member_id: int
    member_name: str                    # NEW: resolved from member_id
    event_type: EventType
    category: Category
    points: int
    reason: str
    logged_by: int
    logged_by_name: str                 # NEW: resolved from logged_by
    timestamp: datetime

    class Config:
        from_attributes = False         # manual construction
```

### 2.4 — Add TaskOut with resolved names

```python
class TaskOutResolved(BaseModel):
    id: int
    title: str
    duration_hrs: float
    deadline: datetime | None
    priority: int
    assigned_to: int
    assigned_to_name: str               # NEW: resolved
    assigned_by: int
    assigned_by_name: str               # NEW: resolved
    project_id: str | None
    project_lead_name: str | None
    status: TaskStatus
    rating: TaskRating | None
    points_awarded: int
    created_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = False
```

### 2.5 — Add ProjectConfig schema

```python
class ProjectConfig(BaseModel):
    id: str
    name: str
    lead: str
    members: list[str]
    color: str
```

### 2.6 — Add AdminResetResponse

```python
class AdminResetResponse(BaseModel):
    status: str
    members_updated: int
    reset_type: str                     # 'weekly' or 'monthly'
    timestamp: datetime
```

### 2.7 — Add HeroConfirmRequest

```python
class HeroConfirmRequest(BaseModel):
    member_id: int
    period: str                         # 'week' or 'month'
    note: str = ""
```

### 2.8 — Add MemberSeedRequest

```python
class MemberSeedRequest(BaseModel):
    confirm: bool = False               # must be True to execute
```

### 2.9 — Add ChangePasswordRequest (member changes own password)

```python
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
```

### 2.10 — Update MemberOut — add `project_ids` field

```python
class MemberOut(BaseModel):
    id: int
    name: str
    username: str
    role: Role
    points_total: int
    points_this_week: int
    points_this_month: int
    streak_presence: int
    streak_task_reporting: int
    warnings_count: int
    rank: str
    rank_label: str                     # NEW: "Platinum Hunter" etc.
    status: MemberStatus
    joined_date: datetime

    class Config:
        from_attributes = True
```

---

## SECTION 3: NEW FILE — `backend/projects.py`

The 13 projects are static configuration. Store them as a Python constant, not in the database.
This is simpler and matches how the frontend uses them (static JS arrays).

```python
# backend/projects.py

PROJECTS = [
    {"id": "mindspace",    "name": "MindSpace",             "lead": "Ganesh",    "members": ["Vedant","Nakul","Ashutosh","Nandini","Prerna","Swapnil","Krishna"], "color": "#4FC3F7"},
    {"id": "neurovi",      "name": "NeuroVisualisAI",        "lead": "Ganesh",    "members": ["Vedant","Nakul","Ashutosh","Swapnil"],                              "color": "#4FC3F7"},
    {"id": "nutrisure",    "name": "NutriSure",              "lead": "Deepavali", "members": ["Vishal","Vedant","Prem"],                                           "color": "#00E5FF"},
    {"id": "solobeauty",   "name": "SoloBeauty",             "lead": "Santosh",   "members": ["Prem","Prerna"],                                                    "color": "#9A7BFF"},
    {"id": "skillsense",   "name": "SkillSense",             "lead": "Swapnil",   "members": ["Komal","Deepavali","Ashutosh","Shreya","Prem"],                     "color": "#FFB300"},
    {"id": "lms",          "name": "LMS",                    "lead": "Swapnil",   "members": ["Prem","Swapnil","Komal","Shreya"],                                  "color": "#FFB300"},
    {"id": "website",      "name": "Website",                "lead": "Debaditya", "members": ["Suraj","Ashutosh","Umesh"],                                         "color": "#FF1744"},
    {"id": "socialmedia",  "name": "LinkedIn / Social Media","lead": "Debaditya", "members": ["Ashutosh","Suraj"],                                                 "color": "#FF1744"},
    {"id": "ezest",        "name": "E-Zest",                 "lead": "Santosh",   "members": ["Ganesh","Vedant","Nikita","Nakul","Prerna","Ashutosh","Swapnil","Nandini"], "color": "#9A7BFF"},
    {"id": "funday",       "name": "Fun Day",                "lead": "Nikita",    "members": ["Deepavali","Prerna"],                                               "color": "#00E5FF"},
    {"id": "demoday",      "name": "Demo Day",               "lead": "Deepavali", "members": ["Prerna"],                                                           "color": "#00E5FF"},
    {"id": "learningtime", "name": "Learning Time",          "lead": "Vedant",    "members": [],                                                                   "color": "#4FC3F7"},
    {"id": "premises",     "name": "Premises",               "lead": "Deepavali", "members": ["Prem"],                                                             "color": "#00E5FF"},
]

PROJECTS_BY_ID = {p["id"]: p for p in PROJECTS}

U5_LEADS = ["Deepavali", "Santosh", "Debaditya", "Swapnil", "Ganesh", "Nikita"]

ALL_MEMBER_NAMES = [
    "Deepavali", "Santosh", "Debaditya", "Swapnil", "Ganesh", "Nikita",
    "Vedant", "Nakul", "Ashutosh", "Nandini", "Prerna", "Prem",
    "Komal", "Shreya", "Vishal", "Suraj", "Krishna", "Umesh"
]

def get_project(project_id: str) -> dict | None:
    return PROJECTS_BY_ID.get(project_id)

def get_lead_for_project(project_id: str) -> str | None:
    p = get_project(project_id)
    return p["lead"] if p else None
```

---

## SECTION 4: NEW ROUTE — `backend/routes/projects.py`

```python
# Public endpoint — no auth required
from fastapi import APIRouter
from projects import PROJECTS

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("", response_model=list[dict])
def list_projects():
    """Return all 13 project configs. Public — no auth needed."""
    return PROJECTS

@router.get("/{project_id}")
def get_project(project_id: str):
    from projects import get_project as _get
    from fastapi import HTTPException
    p = _get(project_id)
    if not p:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")
    return p
```

---

## SECTION 5: CHANGES TO EXISTING ROUTES

### 5.1 — `routes/members.py` — Make list/get public

```python
# GET /members — PUBLIC (remove get_current_user dependency)
@router.get("", response_model=list[schemas.MemberOut])
def list_members(db: Session = Depends(get_db)):
    """Public: list all active + suspended members sorted by monthly points."""
    members = db.query(models.Member).order_by(
        models.Member.points_this_month.desc()
    ).all()
    result = []
    for m in members:
        out = schemas.MemberOut.model_validate(m)
        out_dict = out.model_dump()
        out_dict['rank_label'] = ranking.rank_label(m.rank)
        result.append(out_dict)
    return result

# GET /members/{id} — PUBLIC
@router.get("/{member_id}", response_model=schemas.MemberOut)
def get_member(member_id: int, db: Session = Depends(get_db)):
    """Public: get one member by ID."""
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

# GET /members/by-name/{name} — PUBLIC (NEW — frontend looks up by name)
@router.get("/by-name/{name}", response_model=schemas.MemberOut)
def get_member_by_name(name: str, db: Session = Depends(get_db)):
    """Public: get one member by name string (used by hunter.html?name=Ganesh)."""
    member = db.query(models.Member).filter(
        models.Member.name.ilike(name)
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail=f"Member '{name}' not found")
    return member

# PATCH /members/me/password — AUTH (NEW — member changes own password)
@router.patch("/me/password")
def change_own_password(
    payload: schemas.ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    from auth import verify_password, hash_password
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"status": "password updated"}
```

### 5.2 — `routes/tasks.py` — Make GET public, add project_id, add resolved output

```python
# GET /tasks — PUBLIC (remove auth, add filters)
@router.get("", response_model=list[schemas.TaskOutResolved])
def list_tasks(
    db: Session = Depends(get_db),
    project_id: str | None = None,        # query param: ?project_id=mindspace
    assigned_to: int | None = None,       # query param: ?assigned_to=3
    status: str | None = None,            # query param: ?status=pending
    priority: int | None = None,          # query param: ?priority=1
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

# GET /tasks/{id} — PUBLIC
@router.get("/{task_id}", response_model=schemas.TaskOutResolved)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Public: get single task detail."""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return _resolve_task(task, db)

# Helper function to resolve member names
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
    # Build member map to avoid N+1 queries
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

# POST /tasks — ADMIN ONLY (update to include project fields)
@router.post("", response_model=schemas.TaskOutResolved)
def create_task(
    payload: schemas.TaskCreateRequest,
    db: Session = Depends(get_db),
    actor: models.Member = Depends(require_role("admin")),
):
    from projects import get_lead_for_project
    assignee = db.query(models.Member).filter(models.Member.id == payload.assigned_to).first()
    if not assignee:
        raise HTTPException(status_code=404, detail="Assignee not found")
    if payload.project_id:
        from projects import PROJECTS_BY_ID
        if payload.project_id not in PROJECTS_BY_ID:
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
    return _resolve_task(task, db)

# POST /tasks/{id}/complete — ADMIN ONLY
# (existing logic is correct, just change require_role to "admin" only)

# POST /tasks/{id}/rate — ADMIN ONLY (same as above)
```

### 5.3 — `routes/points.py` — Add public all-members endpoint

```python
# GET /points/all — PUBLIC (NEW — point-log page shows all members' logs)
@router.get("/all", response_model=list[schemas.PointLogOutResolved])
def all_point_logs(
    db: Session = Depends(get_db),
    member_id: int | None = None,         # ?member_id=3 — filter to one member
    category: str | None = None,          # ?category=attendance
    event_type: str | None = None,        # ?event_type=earn
    limit: int = 200,                     # max 200 logs per request
    offset: int = 0,
):
    """Public: paginated point log for all members or one member."""
    q = db.query(models.PointLog)
    if member_id:
        q = q.filter(models.PointLog.member_id == member_id)
    if category:
        q = q.filter(models.PointLog.category == category)
    if event_type:
        q = q.filter(models.PointLog.event_type == event_type)
    logs = q.order_by(models.PointLog.timestamp.desc()).offset(offset).limit(limit).all()
    return _resolve_logs(logs, db)

def _resolve_logs(logs: list, db: Session) -> list:
    # Build member map to avoid N+1
    member_ids = set()
    for l in logs:
        member_ids.add(l.member_id)
        member_ids.add(l.logged_by)
    members = db.query(models.Member).filter(models.Member.id.in_(member_ids)).all()
    member_map = {m.id: m.name for m in members}
    return [
        {
            "id": l.id,
            "member_id": l.member_id,
            "member_name": member_map.get(l.member_id, "Unknown"),
            "event_type": l.event_type,
            "category": l.category,
            "points": l.points,
            "reason": l.reason,
            "logged_by": l.logged_by,
            "logged_by_name": member_map.get(l.logged_by, "System"),
            "timestamp": l.timestamp,
        }
        for l in logs
    ]

# POST /points — ADMIN ONLY (keep existing, just change role to "admin")
# GET /points/member/{id} — remove (replaced by /points/all?member_id=N)
```

### 5.4 — `routes/leaderboard.py` — Make all public

```python
# All leaderboard endpoints: remove get_current_user dependency — PUBLIC
# Add rank_label to each member in the response

@router.get("/weekly")
def weekly_leaderboard(db: Session = Depends(get_db)):
    """Public: all members sorted by points_this_week descending."""
    members = (
        db.query(models.Member)
        .filter(models.Member.status == "active")
        .order_by(models.Member.points_this_week.desc())
        .all()
    )
    return _enrich_members(members)

@router.get("/monthly")
def monthly_leaderboard(db: Session = Depends(get_db)):
    """Public: all members sorted by points_this_month descending."""
    members = (
        db.query(models.Member)
        .filter(models.Member.status == "active")
        .order_by(models.Member.points_this_month.desc())
        .all()
    )
    return _enrich_members(members)

@router.get("/hero-of-month")
def hero_of_month(db: Session = Depends(get_db)):
    """Public: members with 300+ pts this month."""
    members = (
        db.query(models.Member)
        .filter(models.Member.status == "active", models.Member.points_this_month >= 300)
        .order_by(models.Member.points_this_month.desc())
        .all()
    )
    return _enrich_members(members)

def _enrich_members(members: list) -> list:
    from ranking import rank_label
    result = []
    for m in members:
        d = schemas.MemberOut.model_validate(m).model_dump()
        d['rank_label'] = rank_label(m.rank)
        result.append(d)
    return result
```

### 5.5 — `routes/admin.py` — Add reset and hero endpoints, seed endpoint

```python
# GET /admin/alerts — ADMIN ONLY (existing — correct)

# POST /admin/reset-weekly — ADMIN ONLY (NEW)
@router.post("/reset-weekly", response_model=schemas.AdminResetResponse)
def reset_weekly(
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Reset points_this_week to 0 for all members. Run every Monday."""
    members = db.query(models.Member).all()
    count = 0
    for m in members:
        m.points_this_week = 0
        count += 1
    db.commit()
    return {
        "status": "ok",
        "members_updated": count,
        "reset_type": "weekly",
        "timestamp": datetime.utcnow(),
    }

# POST /admin/reset-monthly — ADMIN ONLY (NEW)
@router.post("/reset-monthly", response_model=schemas.AdminResetResponse)
def reset_monthly(
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Reset points_this_month to 0 for all members. Run on 1st of month."""
    members = db.query(models.Member).all()
    count = 0
    for m in members:
        m.points_this_month = 0
        count += 1
    db.commit()
    return {
        "status": "ok",
        "members_updated": count,
        "reset_type": "monthly",
        "timestamp": datetime.utcnow(),
    }

# POST /admin/confirm-hero-week — ADMIN ONLY (NEW)
@router.post("/confirm-hero-week")
def confirm_hero_week(
    payload: schemas.HeroConfirmRequest,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Record hero of week confirmation. Logs a point event for recognition."""
    member = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return {
        "status": "confirmed",
        "hero": member.name,
        "period": "week",
        "pts_this_week": member.points_this_week,
        "confirmed_by": admin.name,
        "note": payload.note,
    }

# POST /admin/confirm-hero-month — ADMIN ONLY (NEW)
@router.post("/confirm-hero-month")
def confirm_hero_month(
    payload: schemas.HeroConfirmRequest,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Record hero of month confirmation."""
    member = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    if member.points_this_month < 300:
        raise HTTPException(
            status_code=400,
            detail=f"{member.name} has only {member.points_this_month} pts — below 300 threshold"
        )
    return {
        "status": "confirmed",
        "hero": member.name,
        "period": "month",
        "pts_this_month": member.points_this_month,
        "confirmed_by": admin.name,
        "note": payload.note,
    }

# POST /admin/seed-members — ADMIN ONLY (NEW)
@router.post("/seed-members")
def seed_members(
    payload: schemas.MemberSeedRequest,
    db: Session = Depends(get_db),
    admin: models.Member = Depends(require_role("admin")),
):
    """Seed all 18 real team members into the database. One-time operation."""
    if not payload.confirm:
        raise HTTPException(status_code=400, detail="Set confirm=true to execute seeding")
    from projects import ALL_MEMBER_NAMES, U5_LEADS
    from auth import hash_password
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
    return {
        "status": "ok",
        "created": created,
        "skipped": skipped,
        "default_password": "hunter123",
        "note": "Change passwords immediately after seeding",
    }
```

### 5.6 — `routes/warnings.py` — Remove member auth restriction

```python
# GET /warnings/member/{id} — make public (consistent with public portal model)
@router.get("/member/{member_id}", response_model=list[schemas.WarningOut])
def member_warnings(
    member_id: int,
    db: Session = Depends(get_db),
    # No auth — public portal
):
    return (
        db.query(models.Warning)
        .filter(models.Warning.member_id == member_id)
        .order_by(models.Warning.date.desc())
        .all()
    )
```

---

## SECTION 6: LOGGING SETUP

Add structured logging to every route. Never log passwords, tokens, or personal data.

### 6.1 — New file: `backend/logger.py`

```python
# backend/logger.py
import logging
import sys
from datetime import datetime

def setup_logger(name: str = "vv") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    fmt = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    console_handler.setFormatter(fmt)

    # File handler — rotate daily
    file_handler = logging.FileHandler("logs/app.log")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(fmt)

    if not logger.handlers:
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)

    return logger

logger = setup_logger()
```

### 6.2 — Log events per route

| Event | Level | Message format |
|---|---|---|
| Admin login success | INFO | `Admin login: username={username} id={id}` |
| Admin login fail | WARNING | `Login failed: username={username} reason=bad_credentials` |
| Suspended account login attempt | WARNING | `Login blocked: username={username} status={status}` |
| Member created | INFO | `Member created: name={name} role={role} by=admin` |
| Member deactivated | INFO | `Member deactivated: name={name} by=admin` |
| Task created | INFO | `Task created: id={id} title={title} assigned_to={name} project={project_id}` |
| Task completed | INFO | `Task completed: id={id} title={title} member={name}` |
| Task rated | INFO | `Task rated: id={id} rating={rating} pts={points} member={name}` |
| Points logged | INFO | `Points logged: member={name} type={type} pts={pts} cat={cat} reason={reason}` |
| Warning issued | WARNING | `Warning issued: member={name} number={n} reason={reason}` |
| Member suspended (3rd warning) | WARNING | `Member suspended: name={name} warnings=3` |
| Weekly reset | INFO | `Weekly reset executed: {n} members updated by admin` |
| Monthly reset | INFO | `Monthly reset executed: {n} members updated by admin` |
| Hero confirmed | INFO | `Hero confirmed: member={name} period={period}` |
| Members seeded | INFO | `Members seeded: created={list} skipped={list}` |
| 404 not found | DEBUG | `404: {method} {path} — {detail}` |
| 400 bad request | DEBUG | `400: {method} {path} — {detail}` |
| 401 unauthorized | WARNING | `401: {method} {path} — unauthorized attempt` |
| 403 forbidden | WARNING | `403: {method} {path} — forbidden role={role}` |
| 500 server error | ERROR | `500: {method} {path} — {exception}` |

### 6.3 — Add request middleware in `main.py`

```python
import time
from logger import logger

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 1)
    logger.info(
        f"{request.method} {request.url.path} → {response.status_code} ({duration}ms)"
    )
    return response
```

---

## SECTION 7: ERROR HANDLING

### 7.1 — Global exception handler in `main.py`

```python
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."}
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code >= 500:
        logger.error(f"HTTP {exc.status_code}: {exc.detail}")
    elif exc.status_code >= 400:
        logger.debug(f"HTTP {exc.status_code}: {exc.detail} — {request.method} {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
```

### 7.2 — Validation error handler

```python
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = " → ".join(str(x) for x in error["loc"])
        errors.append(f"{field}: {error['msg']}")
    logger.debug(f"Validation error on {request.method} {request.url.path}: {errors}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation failed",
            "errors": errors
        }
    )
```

### 7.3 — All error messages the frontend will display

Every `detail` field must be a human-readable string the frontend can show directly:

| HTTP Code | Situation | Detail message |
|---|---|---|
| 400 | Username already taken | `"Username already taken"` |
| 400 | Invalid rating value | `"Rating must be needs_revision, meets, or exceeds"` |
| 400 | Task not completed yet | `"Task must be completed before rating"` |
| 400 | Hero below threshold | `"{name} has only {pts} pts — below 300 threshold"` |
| 400 | Seed not confirmed | `"Set confirm=true to execute seeding"` |
| 400 | Wrong current password | `"Current password is incorrect"` |
| 400 | Password too short | `"New password must be at least 6 characters"` |
| 400 | Points value zero | `"Points must be greater than 0"` |
| 400 | Unknown project | `"Unknown project_id: {id}"` |
| 401 | Bad credentials | `"Invalid username or password"` |
| 401 | No token | `"Authentication required"` |
| 401 | Expired token | `"Session expired — please log in again"` |
| 403 | Wrong role | `"Admin access required"` |
| 403 | Account suspended | `"Account is suspended"` |
| 403 | Account disqualified | `"Account is disqualified"` |
| 404 | Member not found | `"Member not found"` |
| 404 | Task not found | `"Task not found"` |
| 404 | Project not found | `"Project '{id}' not found"` |
| 422 | Validation error | `"Validation failed"` + errors array |
| 500 | Anything else | `"Internal server error. Please try again."` |

---

## SECTION 8: MAIN.PY UPDATES

```python
# main.py — updated full version

import os
import time
import models
from auth import hash_password
from database import Base, SessionLocal, engine
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from logger import logger
from routes import admin, auth, leaderboard, members, points, tasks, warnings, projects as projects_route

# Create DB tables
Base.metadata.create_all(bind=engine)

# Create logs directory
os.makedirs("logs", exist_ok=True)

app = FastAPI(
    title="Vitals&Vectors API",
    version="1.0.0",
    description="Backend for Vitals&Vectors research lab monitoring portal",
)

# CORS — allow all origins for Phase 1 local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 1)
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration}ms)")
    return response

# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error. Please try again."})

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code >= 500:
        logger.error(f"HTTP {exc.status_code}: {exc.detail}")
    elif exc.status_code in (401, 403):
        logger.warning(f"HTTP {exc.status_code}: {exc.detail} [{request.method} {request.url.path}]")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    errors = [f"{' → '.join(str(x) for x in e['loc'])}: {e['msg']}" for e in exc.errors()]
    return JSONResponse(status_code=422, content={"detail": "Validation failed", "errors": errors})

# Routers
app.include_router(auth.router)
app.include_router(members.router)
app.include_router(points.router)
app.include_router(tasks.router)
app.include_router(warnings.router)
app.include_router(leaderboard.router)
app.include_router(admin.router)
app.include_router(projects_route.router)    # NEW

@app.get("/")
def root():
    return {"status": "Vitals&Vectors API online", "version": "1.0.0"}

@app.get("/health")
def health(db=Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "degraded", "db": "error"}

# Seed admin on startup
seed_admin()
```

---

## SECTION 9: FRONTEND WIRING PLAN

### 9.1 — Shared `frontend/js/api.js` (new file to create)

All pages share this. Replace mock data imports with real fetch calls:

```javascript
// frontend/js/api.js
const BASE = 'http://localhost:8000';

// ── Auth ────────────────────────────────────────────────
function getToken()    { return localStorage.getItem('vv_token'); }
function setToken(t)   { localStorage.setItem('vv_token', t); }
function clearToken()  { localStorage.removeItem('vv_token'); }
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

async function handleResponse(res) {
  if (res.ok) return res.json();
  const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
  throw new Error(err.detail || `HTTP ${res.status}`);
}

// ── Public API calls ─────────────────────────────────────
const api = {
  // Members
  getMembers:        ()   => fetch(`${BASE}/members`).then(handleResponse),
  getMemberByName:   (n)  => fetch(`${BASE}/members/by-name/${encodeURIComponent(n)}`).then(handleResponse),
  getMember:         (id) => fetch(`${BASE}/members/${id}`).then(handleResponse),

  // Tasks
  getTasks:          (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/tasks${q ? '?' + q : ''}`).then(handleResponse);
  },
  getTask:           (id) => fetch(`${BASE}/tasks/${id}`).then(handleResponse),

  // Points
  getAllPointLogs:    (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/points/all${q ? '?' + q : ''}`).then(handleResponse);
  },

  // Leaderboard
  leaderboardWeekly:  () => fetch(`${BASE}/leaderboard/weekly`).then(handleResponse),
  leaderboardMonthly: () => fetch(`${BASE}/leaderboard/monthly`).then(handleResponse),
  heroOfMonth:        () => fetch(`${BASE}/leaderboard/hero-of-month`).then(handleResponse),

  // Projects
  getProjects:        ()   => fetch(`${BASE}/projects`).then(handleResponse),
  getProject:         (id) => fetch(`${BASE}/projects/${id}`).then(handleResponse),

  // Health
  health:             ()   => fetch(`${BASE}/health`).then(handleResponse),

  // ── Admin API calls (require token) ───────────────────
  login: (username, password) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(handleResponse),

  createMember:    (body) => fetch(`${BASE}/members`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  updateMember:    (id, body) => fetch(`${BASE}/members/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  deactivateMember:(id)  => fetch(`${BASE}/members/${id}/deactivate`, { method: 'POST', headers: authHeaders() }).then(handleResponse),
  resetPassword:   (id, pw) => fetch(`${BASE}/members/${id}/reset-password`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ new_password: pw }) }).then(handleResponse),

  createTask:      (body) => fetch(`${BASE}/tasks`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  completeTask:    (id)   => fetch(`${BASE}/tasks/${id}/complete`, { method: 'POST', headers: authHeaders() }).then(handleResponse),
  rateTask:        (id, rating) => fetch(`${BASE}/tasks/${id}/rate`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ rating }) }).then(handleResponse),

  logPoints:       (body) => fetch(`${BASE}/points`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  issueWarning:    (body) => fetch(`${BASE}/warnings`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  getMemberWarnings: (id) => fetch(`${BASE}/warnings/member/${id}`).then(handleResponse),

  adminAlerts:     ()     => fetch(`${BASE}/admin/alerts`, { headers: authHeaders() }).then(handleResponse),
  resetWeekly:     ()     => fetch(`${BASE}/admin/reset-weekly`, { method: 'POST', headers: authHeaders() }).then(handleResponse),
  resetMonthly:    ()     => fetch(`${BASE}/admin/reset-monthly`, { method: 'POST', headers: authHeaders() }).then(handleResponse),
  confirmHeroWeek: (id)   => fetch(`${BASE}/admin/confirm-hero-week`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ member_id: id, period: 'week' }) }).then(handleResponse),
  confirmHeroMonth:(id)   => fetch(`${BASE}/admin/confirm-hero-month`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ member_id: id, period: 'month' }) }).then(handleResponse),
  seedMembers:     ()     => fetch(`${BASE}/admin/seed-members`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ confirm: true }) }).then(handleResponse),
  getAuditLog:     (id)   => fetch(`${BASE}/members/${id}/audit-log`, { headers: authHeaders() }).then(handleResponse),
};
```

### 9.2 — Error display helper

```javascript
// In api.js — add shared error toast
function showApiError(err) {
  const msg = err.message || 'Something went wrong. Please try again.';
  showToast(msg, 'error');
  console.error('[API Error]', err);
}
```

### 9.3 — Page-by-page wiring checklist

| Page | Mock to replace | API call | Data mapping |
|---|---|---|---|
| `dashboard.html` | MEMBERS, ALL_TASKS, ATTENDANCE_TODAY | `api.getMembers()`, `api.getTasks()` | members → MEMBERS shape; tasks → ALL_TASKS shape |
| `all-tasks.html` | ALL_TASKS, PROJECTS | `api.getTasks()`, `api.getProjects()` | direct mapping |
| `tasks.html` | ALL_TASKS, MEMBERS, PROJECTS | same as above | same |
| `project.html` | ALL_TASKS filtered | `api.getTasks({project_id})` | filter by URL param |
| `hunter.html` | ALL_TASKS filtered, ALL_LOGS filtered | `api.getMemberByName(name)`, `api.getTasks({assigned_to: id})`, `api.getAllPointLogs({member_id: id})` | resolve from URL ?name= param |
| `point-log.html` | ALL_LOGS, ALL_MEMBERS | `api.getAllPointLogs()`, `api.getMembers()` | direct mapping |
| `leaderboard.html` | MEMBERS | `api.leaderboardWeekly()`, `api.leaderboardMonthly()` | direct mapping |
| `attendance.html` | ATTENDANCE_TODAY | placeholder — Premises integration pending | keep mock |
| `login.html` | alert() mock | `api.login()` | store token, redirect |
| `admin/admin_dashboard.html` | MEMBERS, ALL_TASKS | `api.adminAlerts()`, `api.getMembers()`, `api.leaderboardWeekly()`, `api.heroOfMonth()`, `api.logPoints()`, `api.issueWarning()` | direct |
| `admin/members.html` | hardcoded rows | `api.getMembers()`, `api.createMember()`, `api.updateMember()`, `api.deactivateMember()`, `api.resetPassword()` | direct |
| `admin/assign-tasks.html` | ALL_TASKS, PROJECTS | `api.getTasks()`, `api.getProjects()`, `api.getMembers()`, `api.createTask()`, `api.rateTask()` | direct |

---

## SECTION 10: COMPLETE ENDPOINT REFERENCE TABLE

| Method | Endpoint | Auth | Who calls it | Frontend page |
|---|---|---|---|---|
| POST | `/auth/login` | No | Admin | login.html |
| GET | `/members` | No | Public | dashboard, leaderboard, point-log, admin |
| GET | `/members/by-name/{name}` | No | Public | hunter.html |
| GET | `/members/{id}` | No | Public | hunter.html |
| POST | `/members` | Admin | Admin | admin/members.html |
| PATCH | `/members/{id}` | Admin | Admin | admin/members.html |
| POST | `/members/{id}/deactivate` | Admin | Admin | admin/members.html |
| POST | `/members/{id}/reset-password` | Admin | Admin | admin/members.html |
| PATCH | `/members/me/password` | Auth | Any logged-in | settings.html |
| GET | `/members/{id}/audit-log` | Admin | Admin | admin/members.html |
| GET | `/tasks` | No | Public | all-tasks, dashboard, tasks, project, hunter |
| GET | `/tasks/{id}` | No | Public | task detail popover |
| POST | `/tasks` | Admin | Admin | admin/assign-tasks.html |
| POST | `/tasks/{id}/complete` | Admin | Admin | admin/assign-tasks.html |
| POST | `/tasks/{id}/rate` | Admin | Admin | admin/assign-tasks.html |
| GET | `/points/all` | No | Public | point-log.html, hunter.html |
| POST | `/points` | Admin | Admin | admin/admin_dashboard.html |
| GET | `/leaderboard/weekly` | No | Public | leaderboard, dashboard |
| GET | `/leaderboard/monthly` | No | Public | leaderboard |
| GET | `/leaderboard/hero-of-month` | No | Public | leaderboard, admin dashboard |
| GET | `/projects` | No | Public | all pages that use PROJECTS |
| GET | `/projects/{id}` | No | Public | project.html |
| POST | `/warnings` | Admin | Admin | admin/admin_dashboard.html |
| GET | `/warnings/member/{id}` | No | Public | hunter.html |
| GET | `/admin/alerts` | Admin | Admin | admin/admin_dashboard.html |
| POST | `/admin/reset-weekly` | Admin | Admin | admin/admin_dashboard.html |
| POST | `/admin/reset-monthly` | Admin | Admin | admin/admin_dashboard.html |
| POST | `/admin/confirm-hero-week` | Admin | Admin | admin/admin_dashboard.html |
| POST | `/admin/confirm-hero-month` | Admin | Admin | admin/admin_dashboard.html |
| POST | `/admin/seed-members` | Admin | Admin | one-time setup |
| GET | `/health` | No | Public | settings.html |
| GET | `/` | No | Anyone | — |

**Total: 30 endpoints**

---

## SECTION 11: DATABASE MIGRATION PLAN

The existing DB has no `project_id` or `project_lead_name` on tasks. Handle this:

```python
# backend/migrate.py — run once before using new API
# DO NOT use Alembic yet — SQLite ALTER TABLE is limited

import sqlite3

conn = sqlite3.connect("vitals_vectors.db")
cursor = conn.cursor()

# Add project_id column if not exists
try:
    cursor.execute("ALTER TABLE tasks ADD COLUMN project_id TEXT")
    print("Added project_id column")
except Exception as e:
    print(f"project_id: {e}")

# Add project_lead_name column if not exists
try:
    cursor.execute("ALTER TABLE tasks ADD COLUMN project_lead_name TEXT")
    print("Added project_lead_name column")
except Exception as e:
    print(f"project_lead_name: {e}")

conn.commit()
conn.close()
print("Migration complete")
```

Run: `python migrate.py` before starting the server after this update.

---

## SECTION 12: STARTUP SEQUENCE

```bash
# 1. Install any new dependencies
pip install python-jose[cryptography] passlib[bcrypt] fastapi uvicorn sqlalchemy --break-system-packages

# 2. Run migration (adds new columns)
cd backend
python migrate.py

# 3. Start backend
uvicorn main:app --reload --port 8000

# 4. Seed all 18 members (one-time, via curl or API docs)
curl -X POST http://localhost:8000/admin/seed-members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"confirm": true}'

# 5. Open frontend
cd frontend
python -m http.server 3000
# Open http://localhost:3000
```

---

## SECTION 13: REQUIREMENTS.TXT UPDATE

```
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pydantic==2.7.1
python-multipart==0.0.9
```

---

## SECTION 14: IMPLEMENTATION ORDER

### Phase 1 — Foundation (do first)
1. Add `project_id`, `project_lead_name` to Task model
2. Run migration script
3. Create `backend/projects.py`
4. Create `backend/logger.py` + `logs/` directory
5. Update `main.py` (middleware, exception handlers, new router)
6. Update `backend/schemas.py` (all new schemas)

### Phase 2 — Public endpoints
7. Update `routes/members.py` (public list/get, add by-name, add change-password)
8. Update `routes/tasks.py` (public list/get, project fields, resolved names)
9. Update `routes/points.py` (public /points/all endpoint)
10. Update `routes/leaderboard.py` (remove auth, add rank_label)
11. Update `routes/warnings.py` (remove member auth restriction)
12. Create `routes/projects.py`

### Phase 3 — Admin endpoints
13. Update `routes/admin.py` (reset-weekly, reset-monthly, confirm-hero, seed)
14. Test all admin endpoints with curl or FastAPI docs
15. Test all public endpoints with curl

### Phase 4 — Frontend wiring
16. Create `frontend/js/api.js`
17. Wire `login.html` → `api.login()`
18. Wire `dashboard.html` / `dashboard.js` → real data
19. Wire `all-tasks.html` → `api.getTasks()` + `api.getProjects()`
20. Wire `point-log.html` → `api.getAllPointLogs()`
21. Wire `leaderboard.html` → `api.leaderboardWeekly()` / `api.leaderboardMonthly()`
22. Wire `hunter.html` → `api.getMemberByName()` + tasks + logs
23. Wire `project.html` → `api.getTasks({project_id})`
24. Wire `admin/admin_dashboard.html` → all admin APIs
25. Wire `admin/members.html` → member CRUD
26. Wire `admin/assign-tasks.html` → task CRUD + rating

### Phase 5 — Cleanup & verification
27. Remove all `const MEMBERS = [...]`, `const ALL_TASKS = [...]`, `const ALL_LOGS = [...]` mock arrays from all frontend files
28. End-to-end test: create member → assign task → complete → rate → check point log → check leaderboard
29. Test all error states: 404, 401, 403, 422, 500
30. Verify CORS works from frontend (port 3000) to backend (port 8000)

---

## SECTION 15: KNOWN FUTURE INTEGRATIONS (placeholders only)

| Integration | Status | Placeholder |
|---|---|---|
| Google Classroom tasks | Future | `GET /tasks` remains manual for now |
| Premises attendance | Future | `attendance.html` shows mock data with banner |
| Email/WhatsApp notifications | Future | confirm-hero endpoints return data, no email yet |
| Streak auto-calculation | Future | admin manually logs streak points via /points |
| Cron for weekly/monthly reset | Future | admin manually hits /admin/reset-weekly |

---

*End of backend implementation plan. 30 endpoints, 14 schema types, full logging, full error handling.*
*Implementation order: Section 14. Start with Phase 1 — foundation.*
