from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from database.connection import get_db
from models.response_action import ResponseAction
from models.incident import Incident
from models.user import User
from schemas.response import (
    ResponseActionResponse,
    ResponseRecommendRequest,
    ResponseRecommendResponse,
    ResponseExecuteRequest,
    ResponseExecuteResponse,
    ResponseApproveRequest,
    ResponseRejectRequest
)
from services.response_service import ResponseService
from routes.auth import get_current_user, require_roles
from typing import List, Optional

router = APIRouter(prefix="/api/responses", tags=["Response Actions"])

@router.get("", response_model=List[ResponseActionResponse])
def read_responses(db: Session = Depends(get_db)):
    """
    Returns list of all response actions with their approval and simulation statuses.
    """
    return db.query(ResponseAction).order_by(ResponseAction.id.desc()).all()

@router.post("/recommend", response_model=ResponseRecommendResponse)
def recommend_actions(payload: ResponseRecommendRequest, db: Session = Depends(get_db)):
    """
    Returns recommended mitigation playbooks for an incident.
    """
    incident = db.query(Incident).filter(Incident.incident_id == payload.incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident with ID '{payload.incident_id}' not found."
        )

    recommendations = ResponseService.get_recommendations(incident.title)
    return {
        "incident_id": payload.incident_id,
        "recommendations": recommendations
    }

@router.post("/{id}/approve", response_model=ResponseActionResponse)
def approve_response_action(
    id: str,
    payload: Optional[ResponseApproveRequest] = Body(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "analyst"]))
):
    """
    Analyst/Admin Human Approval endpoint.
    Approves a PENDING_APPROVAL response action.
    """
    comments = payload.comments if payload else None
    try:
        action = ResponseService.approve_action(
            db=db,
            action_identifier=id,
            approved_by=f"{current_user.name} ({current_user.role})",
            comments=comments
        )
        return action
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/{id}/reject", response_model=ResponseActionResponse)
def reject_response_action(
    id: str,
    payload: ResponseRejectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "analyst"]))
):
    """
    Analyst/Admin Human Rejection endpoint.
    Rejects a PENDING_APPROVAL response action.
    """
    try:
        action = ResponseService.reject_action(
            db=db,
            action_identifier=id,
            rejected_by=f"{current_user.name} ({current_user.role})",
            reason=payload.reason
        )
        return action
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/execute", response_model=ResponseExecuteResponse)
def execute_response_action(
    payload: ResponseExecuteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "analyst"]))
):
    """
    Executes a safe simulated response action.
    If action is high-impact and requires approval, verifies approval status before execution.
    """
    incident = db.query(Incident).filter(Incident.incident_id == payload.incident_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident with ID '{payload.incident_id}' not found."
        )

    result = ResponseService.execute_action(
        db=db,
        incident_id=payload.incident_id,
        action_type=payload.action_type,
        executed_by=f"{current_user.name} ({current_user.role})",
        action_id=payload.action_id,
        bypass_approval=bool(payload.bypass_approval)
    )

    return result

@router.post("/{id}/execute", response_model=ResponseExecuteResponse)
def execute_response_action_by_id(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "analyst"]))
):
    """
    Executes an approved response action by ID.
    """
    # Lookup action
    if id.isdigit():
        action = db.query(ResponseAction).filter(ResponseAction.id == int(id)).first()
    else:
        action = db.query(ResponseAction).filter(ResponseAction.action_uuid == id).first()

    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Response action '{id}' not found.")

    result = ResponseService.execute_action(
        db=db,
        incident_id=action.incident_id,
        action_type=action.action_type,
        executed_by=f"{current_user.name} ({current_user.role})",
        action_id=id,
        bypass_approval=False
    )
    return result
