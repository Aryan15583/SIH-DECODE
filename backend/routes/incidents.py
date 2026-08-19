from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.connection import get_db
from models.incident import Incident
from models.activity_log import ActivityLog
from models.user import User
from schemas.incident import IncidentCreate, IncidentUpdate, IncidentResponse
from routes.auth import get_optional_current_user, require_roles
from datetime import datetime
from typing import List, Optional

router = APIRouter(tags=["Incidents"])

def find_incident(id: str, db: Session) -> Incident:
    if id.isdigit():
        incident = db.query(Incident).filter(Incident.id == int(id)).first()
    else:
        incident = db.query(Incident).filter(Incident.incident_id == id).first()
    return incident

# ----------------- Backend REST Endpoints (/api/incidents) -----------------

@router.get("/api/incidents", response_model=List[IncidentResponse])
def read_api_incidents(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Incident)
    if status_filter:
        query = query.filter(Incident.status == status_filter)
    return query.order_by(Incident.created_at.desc()).all()

@router.get("/api/incidents/{id}", response_model=IncidentResponse)
def read_api_incident(id: str, db: Session = Depends(get_db)):
    incident = find_incident(id, db)
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident with identifier '{id}' not found."
        )
    return incident

@router.post("/api/incidents", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_api_incident(
    incident_in: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "analyst"]))
):
    incident_count = db.query(Incident).count() + 1
    incident_id = f"INC-{incident_count:03d}"

    incident = Incident(
        incident_id=incident_id,
        title=incident_in.title,
        description=incident_in.description,
        severity=incident_in.severity,
        status=incident_in.status,
        attack_type=incident_in.attack_type,
        risk_score=incident_in.risk_score,
        assigned_to=incident_in.assigned_to or current_user.name,
        attacker=incident_in.attacker,
        attacker_location=incident_in.attacker_location,
        affected_assets=incident_in.affected_assets or [],
        timeline=incident_in.timeline or [],
        ai_summary=incident_in.ai_summary or "No AI summary provided.",
        mitre_techniques=incident_in.mitre_techniques or [],
        recommended_actions=incident_in.recommended_actions or [],
        evidence=incident_in.evidence,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(incident)

    log = ActivityLog(
        user_id=f"{current_user.name} ({current_user.role})",
        action="INCIDENT_CREATED",
        description=f"Incident {incident_id} ({incident.title}) manually created.",
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    db.refresh(incident)
    return incident

@router.put("/api/incidents/{id}", response_model=IncidentResponse)
def update_api_incident(
    id: str,
    incident_in: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "analyst"]))
):
    incident = find_incident(id, db)
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident with identifier '{id}' not found."
        )

    old_status = incident.status
    update_data = incident_in.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(incident, field, value)

    if incident.status == "Resolved" and old_status != "Resolved":
        incident.resolved_at = datetime.utcnow()
    elif incident.status != "Resolved":
        incident.resolved_at = None

    incident.updated_at = datetime.utcnow()

    log = ActivityLog(
        user_id=f"{current_user.name} ({current_user.role})",
        action="INCIDENT_UPDATED",
        description=f"Incident {incident.incident_id} updated. Status: {incident.status}, Assignee: {incident.assigned_to}.",
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    db.refresh(incident)
    return incident

@router.delete("/api/incidents/{id}", status_code=status.HTTP_200_OK)
def delete_api_incident(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    incident = find_incident(id, db)
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident with identifier '{id}' not found."
        )

    incident_id = incident.incident_id
    db.delete(incident)

    log = ActivityLog(
        user_id=f"{current_user.name} ({current_user.role})",
        action="INCIDENT_DELETED",
        description=f"Incident {incident_id} was deleted from the system.",
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    return {"success": True, "message": f"Incident {incident_id} successfully deleted"}

# ----------------- Frontend Compatibility Endpoints (/incidents) -----------------

@router.get("/incidents")
def get_frontend_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).order_by(Incident.created_at.desc()).all()
    result = []
    for inc in incidents:
        frontend_status = "Active" if inc.status == "Open" else inc.status
        result.append({
            "id": inc.incident_id,
            "title": inc.title,
            "severity": inc.severity,
            "status": frontend_status,
            "aiConfidence": int(inc.risk_score),
            "firstSeen": inc.created_at.isoformat() + "Z",
            "lastSeen": inc.updated_at.isoformat() + "Z",
            "attacker": inc.attacker or "Unknown",
            "attackerLocation": inc.attacker_location or "Unknown",
            "affectedAssets": inc.affected_assets or [],
            "timeline": inc.timeline or [],
            "aiSummary": inc.ai_summary or "No summary available.",
            "mitreTechniques": inc.mitre_techniques or [],
            "recommendedActions": inc.recommended_actions or []
        })
    return result

@router.get("/incidents/{id}")
def get_frontend_incident(id: str, db: Session = Depends(get_db)):
    inc = find_incident(id, db)
    if not inc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident {id} not found."
        )

    frontend_status = "Active" if inc.status == "Open" else inc.status

    return {
        "id": inc.incident_id,
        "title": inc.title,
        "severity": inc.severity,
        "status": frontend_status,
        "aiConfidence": int(inc.risk_score),
        "firstSeen": inc.created_at.isoformat() + "Z",
        "lastSeen": inc.updated_at.isoformat() + "Z",
        "attacker": inc.attacker or "Unknown",
        "attackerLocation": inc.attacker_location or "Unknown",
        "affectedAssets": inc.affected_assets or [],
        "timeline": inc.timeline or [],
        "aiSummary": inc.ai_summary or "No summary available.",
        "mitreTechniques": inc.mitre_techniques or [],
        "recommendedActions": inc.recommended_actions or [],
        "evidence": inc.evidence or "No raw evidence available."
    }
