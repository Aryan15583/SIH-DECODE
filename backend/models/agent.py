from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from datetime import datetime
from database.connection import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    agent_uuid = Column(String(50), unique=True, index=True, nullable=False)  # e.g., "agent-1"
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="Standby", nullable=False)  # Active, Investigating, Standby, Completed
    progress = Column(Integer, default=0, nullable=False)
    tasks_completed = Column(Integer, default=0, nullable=False)
    incidents_investigated = Column(Integer, default=0, nullable=False)
    accuracy = Column(Float, default=0.0, nullable=False)
    current_task = Column(String(255), nullable=True)
    last_activity = Column(DateTime, default=datetime.utcnow, nullable=False)
    icon = Column(String(50), default="search", nullable=False)
