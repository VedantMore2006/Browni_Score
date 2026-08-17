from datetime import datetime

from database import Base
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="member")  # member / coordinator / admin

    points_total = Column(Integer, default=100)
    points_this_week = Column(Integer, default=0)
    points_this_month = Column(Integer, default=0)

    streak_presence = Column(Integer, default=0)
    streak_task_reporting = Column(Integer, default=0)

    warnings_count = Column(Integer, default=0)
    rank = Column(String, default="E")
    status = Column(String, default="active")  # active / suspended / disqualified
    joined_date = Column(DateTime, default=datetime.utcnow)

    tasks_assigned = relationship(
        "Task", back_populates="assignee", foreign_keys="Task.assigned_to"
    )
    point_logs = relationship(
        "PointLog", back_populates="member", foreign_keys="PointLog.member_id"
    )
    warnings = relationship(
        "Warning", back_populates="member", foreign_keys="Warning.member_id"
    )


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    duration_hrs = Column(Float, default=0)
    deadline = Column(DateTime, nullable=True)
    priority = Column(Integer, default=2)  # 1 / 2 / 3

    assigned_to = Column(Integer, ForeignKey("members.id"), nullable=False)
    assigned_by = Column(Integer, ForeignKey("members.id"), nullable=False)

    status = Column(String, default="pending")  # pending/in_progress/completed/rated
    rating = Column(String, nullable=True)  # needs_revision/meets/exceeds
    points_awarded = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    assignee = relationship(
        "Member", back_populates="tasks_assigned", foreign_keys=[assigned_to]
    )


class PointLog(Base):
    __tablename__ = "point_logs"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    event_type = Column(String, nullable=False)  # earn / deduct
    category = Column(String, nullable=False)  # attendance/task/learning/content/streak/conduct
    points = Column(Integer, nullable=False)
    reason = Column(String, default="")
    logged_by = Column(Integer, ForeignKey("members.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    member = relationship("Member", back_populates="point_logs", foreign_keys=[member_id])


class Warning(Base):
    __tablename__ = "warnings"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    warning_number = Column(Integer, nullable=False)  # 1/2/3
    reason = Column(String, default="")
    issued_by = Column(Integer, ForeignKey("members.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    valid_reason_accepted = Column(Boolean, default=False)

    member = relationship("Member", back_populates="warnings", foreign_keys=[member_id])
