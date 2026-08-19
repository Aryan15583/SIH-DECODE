from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AlertCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    source: str = Field(..., max_length=100)
    category: str = Field(..., max_length=100)
    severity: str = "Medium"  # Low, Medium, High, Critical
    status: str = "New"       # New, Investigating, Resolved, False Positive
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    affected_asset: Optional[str] = None
    confidence_score: float = 0.0

class AlertUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    source: Optional[str] = None
    category: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    affected_asset: Optional[str] = None
    confidence_score: Optional[float] = None

class AlertResponse(BaseModel):
    id: int
    alert_id: str
    title: str
    description: Optional[str]
    source: str
    category: str
    severity: str
    status: str
    source_ip: Optional[str]
    destination_ip: Optional[str]
    affected_asset: Optional[str]
    confidence_score: float
    detected_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
