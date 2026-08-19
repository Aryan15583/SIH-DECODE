from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ResponseActionCreate(BaseModel):
    incident_id: str
    action_type: str
    description: Optional[str] = None
    requires_approval: bool = True
    status: str = "PENDING_APPROVAL"
    executed_by: Optional[str] = None
    result: Optional[str] = None

class ResponseActionUpdate(BaseModel):
    status: Optional[str] = None
    result: Optional[str] = None
    approved_by: Optional[str] = None
    rejection_reason: Optional[str] = None

class ResponseActionResponse(BaseModel):
    id: int
    action_uuid: Optional[str] = None
    incident_id: str
    action_type: str
    description: Optional[str] = None
    status: str
    requires_approval: bool = True
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    executed_by: Optional[str] = None
    execution_time: Optional[datetime] = None
    result: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ResponseRecommendRequest(BaseModel):
    incident_id: str

class ResponseRecommendResponse(BaseModel):
    incident_id: str
    recommendations: List[str]

class ResponseApproveRequest(BaseModel):
    action_id: Optional[str] = None
    comments: Optional[str] = None

class ResponseRejectRequest(BaseModel):
    action_id: Optional[str] = None
    reason: str

class ResponseExecuteRequest(BaseModel):
    incident_id: str
    action_type: str
    action_id: Optional[str] = None
    bypass_approval: Optional[bool] = False

class ResponseExecuteResponse(BaseModel):
    action: str
    status: str
    result: str
    action_id: Optional[str] = None
    approval_status: Optional[str] = None
