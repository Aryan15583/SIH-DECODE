from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from models.alert import Alert
from models.activity_log import ActivityLog
from models.user import User
from schemas.alert import AlertCreate, AlertUpdate, AlertResponse
from routes.auth import get_optional_current_user, require_roles
from datetime import datetime
from typing import List, Optional, Any

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def read_alerts(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    source: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """
    Returns alerts with filtering and pagination.
    """
    query = db.query(Alert)

    if severity:
        query = query.filter(Alert.severity == severity)
    if status:
        query = query.filter(Alert.status == status)
    if category:
        query = query.filter(Alert.category == category)
    if source:
        query = query.filter(Alert.source == source)

    query = query.order_by(Alert.created_at.desc())
    offset = (page - 1) * limit
    alerts = query.offset(offset).limit(limit).all()
    return alerts

@router.get("/{id}", response_model=AlertResponse)
def read_alert(id: str, db: Session = Depends(get_db)):
    if id.isdigit():
        alert = db.query(Alert).filter(Alert.id == int(id)).first()
    else:
        alert = db.query(Alert).filter(Alert.alert_id == id).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert with identifier '{id}' not found."
        )
    return alert

@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def create_alert(
    alert_in: AlertCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "analyst"]))
):
    """
    Manually creates a new Alert (requires analyst or admin role).
    """
    alert_count = db.query(Alert).count() + 1
    alert_id = f"ALT-{alert_count:03d}"

    alert = Alert(
        alert_id=alert_id,
        title=alert_in.title,
        description=alert_in.description,
        source=alert_in.source,
        category=alert_in.category,
        severity=alert_in.severity,
        status=alert_in.status,
        source_ip=alert_in.source_ip,
        destination_ip=alert_in.destination_ip,
        affected_asset=alert_in.affected_asset,
        confidence_score=alert_in.confidence_score,
        detected_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    db.add(alert)

    log = ActivityLog(
        user_id=f"{current_user.name} ({current_user.role})",
        action="ALERT_CREATED",
        description=f"Alert {alert_id} ({alert.title}) manually created.",
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    db.refresh(alert)
    return alert

@router.put("/{id}", response_model=AlertResponse)
def update_alert(
    id: str,
    alert_in: AlertUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "analyst"]))
):
    """
    Updates an alert (requires analyst or admin role).
    """
    if id.isdigit():
        alert = db.query(Alert).filter(Alert.id == int(id)).first()
    else:
        alert = db.query(Alert).filter(Alert.alert_id == id).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert with identifier '{id}' not found."
        )

    update_data = alert_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(alert, field, value)

    log = ActivityLog(
        user_id=f"{current_user.name} ({current_user.role})",
        action="ALERT_UPDATED",
        description=f"Alert {alert.alert_id} updated. Status: {alert.status}.",
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    db.refresh(alert)
    return alert

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_alert(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    """
    Deletes an alert (requires admin role).
    """
    if id.isdigit():
        alert = db.query(Alert).filter(Alert.id == int(id)).first()
    else:
        alert = db.query(Alert).filter(Alert.alert_id == id).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert with identifier '{id}' not found."
        )

    alert_id = alert.alert_id
    db.delete(alert)

    log = ActivityLog(
        user_id=f"{current_user.name} ({current_user.role})",
        action="ALERT_DELETED",
        description=f"Alert {alert_id} was deleted from database.",
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()

    return {"success": True, "message": f"Alert {alert_id} successfully deleted"}
