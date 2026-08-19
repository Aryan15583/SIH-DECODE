from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from database.connection import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String(50), default="Medium", nullable=False)  # Low, Medium, High, Critical
    status = Column(String(50), default="Open", nullable=False)      # Open, Investigating, Contained, Resolved
    attack_type = Column(String(100), nullable=True)
    risk_score = Column(Integer, default=0, nullable=False)
    assigned_to = Column(String(100), nullable=True)
    
    # Advanced Incident Details for Frontend Compatibility
    attacker = Column(String(50), nullable=True)
    attacker_location = Column(String(100), nullable=True)
    affected_assets = Column(JSON, nullable=True)  # List of {id, name, type}
    timeline = Column(JSON, nullable=True)         # List of {time, event}
    ai_summary = Column(Text, nullable=True)
    mitre_techniques = Column(JSON, nullable=True) # List of {id, name}
    recommended_actions = Column(JSON, nullable=True) # List of strings
    evidence = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
