from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database.connection import Base

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False)
    source = Column(String(100), nullable=False)
    source_ip = Column(String(50), nullable=True)
    destination_ip = Column(String(50), nullable=True)
    username = Column(String(100), nullable=True)
    hostname = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)
    raw_data = Column(Text, nullable=True)
    mongo_document_id = Column(String(50), nullable=True) # Linked MongoDB document ID
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
