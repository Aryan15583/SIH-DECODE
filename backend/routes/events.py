from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.connection import get_db
from database.mongodb import get_raw_events_collection
from models.security_event import SecurityEvent
from models.activity_log import ActivityLog
from schemas.security_event import SecurityEventCreate, SecurityEventResponse
from services.threat_detection import ThreatDetectionEngine
from services.incident_service import IncidentService
from routes.auth import get_optional_current_user
from datetime import datetime
from typing import List, Optional, Any

router = APIRouter(prefix="/api/events", tags=["Security Events"])

@router.post("", status_code=status.HTTP_201_CREATED)
def ingest_event(
    event_in: SecurityEventCreate,
    db: Session = Depends(get_db),
    current_user: Optional[Any] = Depends(get_optional_current_user)
):
    """
    Ingests a raw security event:
    1. Stores raw/flexible JSON document in MongoDB.
    2. Stores structured metadata record in PostgreSQL.
    3. Runs rule-based Threat Detection Engine.
    4. Correlates Alerts to Incidents.
    """
    # 1. Store in MongoDB (flexible document)
    mongo_doc_id = None
    try:
        raw_events_col = get_raw_events_collection()
        mongo_doc = {
            "event_type": event_in.event_type,
            "source": event_in.source,
            "source_ip": event_in.source_ip,
            "destination_ip": event_in.destination_ip,
            "username": event_in.username,
            "hostname": event_in.hostname,
            "message": event_in.message,
            "raw_data": event_in.raw_data,
            "ingested_at": datetime.utcnow().isoformat(),
            "ingested_by": current_user.email if current_user else "Telemetry Ingestion"
        }
        res = raw_events_col.insert_one(mongo_doc)
        mongo_doc_id = str(res.inserted_id)
    except Exception:
        # Graceful degradation if MongoDB temporarily unreachable
        pass

    # 2. Store structured metadata in PostgreSQL
    event = SecurityEvent(
        event_type=event_in.event_type,
        source=event_in.source,
        source_ip=event_in.source_ip,
        destination_ip=event_in.destination_ip,
        username=event_in.username,
        hostname=event_in.hostname,
        message=event_in.message,
        raw_data=event_in.raw_data or f"Type: {event_in.event_type}, Msg: {event_in.message}",
        mongo_document_id=mongo_doc_id,
        timestamp=event_in.timestamp or datetime.utcnow()
    )
    db.add(event)
    db.commit()
    db.refresh(event)

    # 3. Run Threat Detection Engine
    alerts = ThreatDetectionEngine.process_event(db, event)

    # 4. Correlate Alerts to Incidents
    correlated_incidents = []
    for alert in alerts:
        incident = IncidentService.correlate_alert_to_incident(db, alert)
        if incident and incident.incident_id not in correlated_incidents:
            correlated_incidents.append(incident.incident_id)

    # 5. Log activity
    log = ActivityLog(
        user_id=current_user.email if current_user else "System",
        action="EVENT_INGESTED",
        description=f"Ingested event '{event.event_type}' from {event.source_ip or event.source}. Generated {len(alerts)} alert(s).",
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()

    return {
        "status": "success",
        "event_id": event.id,
        "mongo_document_id": mongo_doc_id,
        "alerts_generated": [a.alert_id for a in alerts],
        "incidents_affected": correlated_incidents
    }

@router.get("", response_model=List[SecurityEventResponse])
def read_events(db: Session = Depends(get_db)):
    return db.query(SecurityEvent).order_by(SecurityEvent.timestamp.desc()).limit(100).all()

@router.get("/{id}", response_model=SecurityEventResponse)
def read_event(id: int, db: Session = Depends(get_db)):
    event = db.query(SecurityEvent).filter(SecurityEvent.id == id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Security event with ID {id} not found."
        )
    return event
