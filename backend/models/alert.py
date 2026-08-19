from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from datetime import datetime
from database.connection import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    source = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    severity = Column(String(50), default="Medium", nullable=False)  # Low, Medium, High, Critical
    status = Column(String(50), default="New", nullable=False)      # New, Investigating, Resolved, False Positive
    source_ip = Column(String(50), nullable=True)
    destination_ip = Column(String(50), nullable=True)
    affected_asset = Column(String(100), nullable=True)
    confidence_score = Column(Float, default=0.0, nullable=False)
    detected_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
