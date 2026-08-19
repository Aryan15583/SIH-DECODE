from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime
from database.connection import Base

class ResponseAction(Base):
    __tablename__ = "response_actions"

    id = Column(Integer, primary_key=True, index=True)
    action_uuid = Column(String(50), unique=True, index=True, nullable=True) # E.g. "ACT-001"
    incident_id = Column(String(50), nullable=False)
    action_type = Column(String(100), nullable=False)  # Block IP, Isolate Endpoint, Disable User, etc.
    description = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING_APPROVAL", nullable=False) # PENDING_APPROVAL, APPROVED, REJECTED, EXECUTED, FAILED, Simulated
    requires_approval = Column(Boolean, default=True, nullable=False)
    approved_by = Column(String(100), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    executed_by = Column(String(100), nullable=True)
    execution_time = Column(DateTime, nullable=True)
    result = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
