from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database.connection import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_uuid = Column(String(50), unique=True, index=True, nullable=False) # e.g. "rep-001"
    name = Column(String(255), nullable=False)
    type = Column(String(100), default="Audit", nullable=False)  # Compliance, Audit, Executive
    severity = Column(String(50), default="Medium", nullable=False)  # Critical, High, Medium, Low, Executive
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String(50), default="Ready", nullable=False)  # Ready, Generating, Scheduled
    pdf_path = Column(String(255), nullable=True)
