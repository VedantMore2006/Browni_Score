from datetime import datetime
from typing import Optional, Literal

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
    name: Optional[str] = None
    role: Optional[Role] = None
    status: Optional[MemberStatus] = None


class PasswordReset(BaseModel):
    new_password: str


class TaskCreateRequest(BaseModel):
    title: str
    duration_hrs: float = 0
    deadline: Optional[datetime] = None
    priority: int = 2
    assigned_to: int


class TaskOut(BaseModel):
    id: int
    title: str
    duration_hrs: float
    deadline: Optional[datetime]
    priority: int
    assigned_to: int
    assigned_by: int
    status: TaskStatus
    rating: Optional[TaskRating]
    points_awarded: int
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class TaskRateRequest(BaseModel):
    rating: TaskRating


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
