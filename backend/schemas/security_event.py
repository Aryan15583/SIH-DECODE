from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class SecurityEventCreate(BaseModel):
    event_type: str = Field(..., max_length=100)
    source: str = Field(..., max_length=100)
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    username: Optional[str] = None
    hostname: Optional[str] = None
    message: Optional[str] = None
    raw_data: Optional[str] = None
    timestamp: Optional[datetime] = None

class SecurityEventResponse(BaseModel):
    id: int
    event_type: str
    source: str
    source_ip: Optional[str]
    destination_ip: Optional[str]
    username: Optional[str]
    hostname: Optional[str]
    message: Optional[str]
    raw_data: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True
