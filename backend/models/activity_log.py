from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database.connection import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=True) # Username or User ID
    action = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
