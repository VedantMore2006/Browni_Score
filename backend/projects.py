# backend/projects.py
# Static project configuration — not stored in DB (projects/leads don't change often)

PROJECTS = [
    {"id": "mindspace",    "name": "MindSpace",              "lead": "Ganesh",    "members": ["Vedant","Nakul","Ashutosh","Nandini","Prerna","Swapnil","Krishna"], "color": "#4FC3F7"},
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
