from datetime import datetime
from typing import Literal

from pydantic import BaseModel

Role = Literal["member", "coordinator", "admin"]
MemberStatus = Literal["active", "suspended", "disqualified"]
TaskStatus = Literal["pending", "in_progress", "completed", "rated"]
TaskRating = Literal["needs_revision", "meets", "exceeds"]
EventType = Literal["earn", "deduct"]
Category = Literal["attendance", "task", "learning", "content", "streak", "conduct"]


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: Role
    member_id: int
    name: str


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
    rank_label: str = ""          # populated at response time from ranking.rank_label()
    status: MemberStatus
    joined_date: datetime

    class Config:
        from_attributes = True


class MemberCreate(BaseModel):
    name: str
    username: str
    password: str
    role: Role = "member"


class MemberUpdate(BaseModel):
    name: str | None = None
    role: Role | None = None
    status: MemberStatus | None = None


class PasswordReset(BaseModel):
    new_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ── Task schemas ────────────────────────────────────────────────────────────

class TaskCreateRequest(BaseModel):
    title: str
    duration_hrs: float = 0
    deadline: datetime | None = None
    priority: int = 2                    # 1=High, 2=Medium, 3=Low
    assigned_to: int                     # member ID
    project_id: str | None = None       # 'mindspace', 'neurovi', etc.
    project_lead_name: str | None = None # lead display name


class TaskOut(BaseModel):
    id: int
    title: str
    duration_hrs: float
    deadline: datetime | None
    priority: int
    assigned_to: int
    assigned_by: int
    project_id: str | None
    project_lead_name: str | None
    status: TaskStatus
    rating: TaskRating | None
    points_awarded: int
    created_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = True


class TaskOutResolved(BaseModel):
    """TaskOut with member names resolved — returned by all public task endpoints."""
    id: int
    title: str
    duration_hrs: float
    deadline: datetime | None
    priority: int
    assigned_to: int
    assigned_to_name: str
    assigned_by: int
    assigned_by_name: str
    project_id: str | None
    project_lead_name: str | None
    status: TaskStatus
    rating: TaskRating | None
    points_awarded: int
    created_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = False


class TaskRateRequest(BaseModel):
    rating: TaskRating


# ── Points schemas ──────────────────────────────────────────────────────────

class PointLogCreate(BaseModel):
    member_id: int
    event_type: EventType
    category: Category
    points: int
    reason: str = ""


class PointLogOut(BaseModel):
    id: int
    member_id: int
    event_type: EventType
    category: Category
    points: int
    reason: str
    logged_by: int
    timestamp: datetime

    class Config:
        from_attributes = True


class PointLogOutResolved(BaseModel):
    """PointLogOut with member names resolved — returned by the public /points/all endpoint."""
    id: int
    member_id: int
    member_name: str
    event_type: EventType
    category: Category
    points: int
    reason: str
    logged_by: int
    logged_by_name: str
    timestamp: datetime

    class Config:
        from_attributes = False


# ── Warning schemas ─────────────────────────────────────────────────────────

class WarningCreate(BaseModel):
    member_id: int
    reason: str
    valid_reason_accepted: bool = False


class WarningOut(BaseModel):
    id: int
    member_id: int
    warning_number: int
    reason: str
    issued_by: int
    date: datetime
    valid_reason_accepted: bool

    class Config:
        from_attributes = True


# ── Project schemas ─────────────────────────────────────────────────────────

class ProjectConfig(BaseModel):
    id: str
    name: str
    lead: str
    members: list[str]
    color: str


# ── Admin schemas ───────────────────────────────────────────────────────────

class AdminResetResponse(BaseModel):
    status: str
    members_updated: int
    reset_type: str           # 'weekly' or 'monthly'
    timestamp: datetime


class HeroConfirmRequest(BaseModel):
    member_id: int
    period: str               # 'week' or 'month'
    note: str = ""


class MemberSeedRequest(BaseModel):
    confirm: bool = False     # must be True to execute
