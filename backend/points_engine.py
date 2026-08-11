from sqlalchemy.orm import Session

import models
from ranking import rank_for_points


def apply_points(
    db: Session,
    member: models.Member,
    event_type: str,
    category: str,
    points: int,
    reason: str,
    logged_by: int,
) -> models.PointLog:
    delta = points if event_type == "earn" else -points

    member.points_total += delta
    member.points_this_week += delta
    member.points_this_month += delta
    member.rank = rank_for_points(member.points_total)

    log = models.PointLog(
        member_id=member.id,
        event_type=event_type,
        category=category,
        points=points,
        reason=reason,
        logged_by=logged_by,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
