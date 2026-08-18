from fastapi import APIRouter, HTTPException
from projects import PROJECTS, get_project

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[dict])
def list_projects():
    """Public: return all 13 project configs."""
    return PROJECTS


@router.get("/{project_id}", response_model=dict)
def get_project_by_id(project_id: str):
    """Public: return a single project config by ID."""
    p = get_project(project_id)
    if not p:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")
    return p
