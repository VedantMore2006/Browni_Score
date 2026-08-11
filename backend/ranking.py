RANK_TABLE = [
    ("E", 0, 99, "Unranked Hunter"),
    ("D", 100, 149, "Bronze Hunter"),
    ("C", 150, 199, "Iron Hunter"),
    ("B", 200, 249, "Silver Hunter"),
    ("A", 250, 299, "Gold Hunter"),
    ("S", 300, 399, "Platinum Hunter"),
    ("SS", 400, None, "Shadow Monarch"),
]


def rank_for_points(points: int) -> str:
    for code, lo, hi, _label in RANK_TABLE:
        if hi is None:
            if points >= lo:
                return code
        elif lo <= points <= hi:
            return code
    return "E"


def rank_label(code: str) -> str:
    for c, _lo, _hi, label in RANK_TABLE:
        if c == code:
            return label
    return "Unranked Hunter"


def points_to_next_rank(points: int) -> int:
    current = rank_for_points(points)
    idx = next(i for i, r in enumerate(RANK_TABLE) if r[0] == current)
    if idx + 1 >= len(RANK_TABLE):
        return 0
    next_lo = RANK_TABLE[idx + 1][1]
    return max(next_lo - points, 0)
