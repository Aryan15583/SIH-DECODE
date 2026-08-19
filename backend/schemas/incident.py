from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Any

class IncidentCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    severity: str = "Medium"  # Low, Medium, High, Critical
    status: str = "Open"      # Open, Investigating, Contained, Resolved
    attack_type: Optional[str] = None
    risk_score: int = 0
    assigned_to: Optional[str] = None
    attacker: Optional[str] = None
    attacker_location: Optional[str] = None
    affected_assets: Optional[List[Any]] = None
    timeline: Optional[List[Any]] = None
    ai_summary: Optional[str] = None
    mitre_techniques: Optional[List[Any]] = None
    recommended_actions: Optional[List[str]] = None
    evidence: Optional[str] = None

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    attack_type: Optional[str] = None
    risk_score: Optional[int] = None
    assigned_to: Optional[str] = None
    attacker: Optional[str] = None
    attacker_location: Optional[str] = None
    affected_assets: Optional[List[Any]] = None
    timeline: Optional[List[Any]] = None
    ai_summary: Optional[str] = None
    mitre_techniques: Optional[List[Any]] = None
    recommended_actions: Optional[List[str]] = None
    evidence: Optional[str] = None
    resolved_at: Optional[datetime] = None

class IncidentResponse(BaseModel):
    id: int
    incident_id: str
    title: str
    description: Optional[str]
    severity: str
    status: str
    attack_type: Optional[str]
    risk_score: int
    assigned_to: Optional[str]
    attacker: Optional[str]
    attacker_location: Optional[str]
    affected_assets: Optional[List[Any]]
    timeline: Optional[List[Any]]
    ai_summary: Optional[str]
    mitre_techniques: Optional[List[Any]]
    recommended_actions: Optional[List[str]]
    evidence: Optional[str]
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True
