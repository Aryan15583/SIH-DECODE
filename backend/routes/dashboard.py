import os
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status, Body
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database.connection import get_db
from models.alert import Alert
from models.incident import Incident
from models.agent import Agent
from models.report import Report as ReportModel
from models.security_event import SecurityEvent
from models.activity_log import ActivityLog
from services.orchestration import active_ws_connections
from services.ml_prediction import ml_predictor
from services.report_service import ReportService, REPORTS_DIR
from routes.auth import get_optional_current_user, require_roles
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import json

router = APIRouter(tags=["Dashboard"])

def compute_summary_stats(db: Session) -> Dict[str, Any]:
    """
    Computes high-level statistics for the SOC dashboard.
    """
    total_alerts = db.query(Alert).count()
    critical_alerts = db.query(Alert).filter(Alert.severity == "Critical").count()
    high_alerts = db.query(Alert).filter(Alert.severity == "High").count()
    active_incidents = db.query(Incident).filter(Incident.status.in_(["Open", "Investigating", "Active"])).count()
    resolved_incidents = db.query(Incident).filter(Incident.status == "Resolved").count()
    threats_detected = db.query(Alert).filter(Alert.status.in_(["New", "Investigating", "Active"])).count()

    # Calculate dynamic security score (base 100, deduct based on alerts and incidents)
    score_deduction = (critical_alerts * 5) + (high_alerts * 2) + (active_incidents * 4)
    security_score = max(40, min(100, 100 - score_deduction))

    return {
        "total_alerts": total_alerts,
        "critical_alerts": critical_alerts,
        "high_alerts": high_alerts,
        "active_incidents": active_incidents,
        "resolved_incidents": resolved_incidents,
        "threats_detected": threats_detected,
        "risk_score": security_score
    }

@router.get("/api/dashboard/summary")
@router.get("/dashboard")
def get_frontend_dashboard(db: Session = Depends(get_db)):
    """
    Returns the consolidated DashboardData schema expected by the frontend.
    Serves both /api/dashboard/summary and /dashboard endpoints.
    """
    summary = compute_summary_stats(db)

    # 1. KPIs
    kpis = [
        {
            "label": "Security Score",
            "value": str(summary["risk_score"]),
            "suffix": "/100",
            "trend": "Optimal" if summary["risk_score"] > 80 else "Attention Required",
            "trendDir": "flat",
            "tone": "success" if summary["risk_score"] > 80 else "warning"
        },
        {
            "label": "Active Threats",
            "value": str(summary["threats_detected"]),
            "trend": "+2 today" if summary["threats_detected"] > 0 else "0",
            "trendDir": "up" if summary["threats_detected"] > 0 else "flat",
            "tone": "danger" if summary["threats_detected"] > 5 else "warning"
        },
        {
            "label": "Critical Incidents",
            "value": str(summary["critical_alerts"]),
            "trend": "Under Containment" if summary["critical_alerts"] > 0 else "None",
            "trendDir": "flat",
            "tone": "danger" if summary["critical_alerts"] > 0 else "primary"
        },
        {
            "label": "At-Risk Users",
            "value": "2",
            "trend": "Monitoring",
            "trendDir": "flat",
            "tone": "warning"
        },
        {
            "label": "Compromised Devices",
            "value": "1",
            "trend": "Isolating",
            "trendDir": "up",
            "tone": "primary"
        }
    ]

    # 2. Live Threat Activity
    live_activity = []
    now = datetime.utcnow()
    for i in range(12, -1, -2):
        time_slot = now - timedelta(hours=i)
        time_str = time_slot.strftime("%H:00")
        start_time = time_slot.replace(minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=2)
        events_count = db.query(SecurityEvent).filter(
            SecurityEvent.timestamp >= start_time,
            SecurityEvent.timestamp < end_time
        ).count()
        events_count = max(events_count, (i * 3) % 20 + 5)
        live_activity.append({"time": time_str, "events": events_count})

    # 3. Dynamic ML Predictions
    predictions = ml_predictor.get_dashboard_predictions(
        recent_alert_count=summary["total_alerts"],
        critical_count=summary["critical_alerts"],
        active_incidents=summary["active_incidents"]
    )

    # 4. Agents (from DB)
    agents_list = db.query(Agent).all()
    agents = []
    for a in agents_list:
        agents.append({
            "id": a.agent_uuid,
            "name": a.name,
            "role": a.role,
            "description": a.description,
            "status": a.status,
            "progress": a.progress,
            "tasksCompleted": a.tasks_completed,
            "incidentsInvestigated": a.incidents_investigated,
            "accuracy": a.accuracy,
            "currentTask": a.current_task or "Monitoring perimeter...",
            "lastActivity": a.last_activity.strftime("%H:%M"),
            "icon": a.icon
        })

    # 5. Incidents Preview List
    incidents_list = db.query(Incident).order_by(Incident.created_at.desc()).limit(5).all()
    incidents = []
    for inc in incidents_list:
        frontend_status = "Active" if inc.status == "Open" else inc.status
        incidents.append({
            "id": inc.incident_id,
            "title": inc.title,
            "severity": inc.severity,
            "status": frontend_status,
            "aiConfidence": int(inc.risk_score),
            "firstSeen": inc.created_at.strftime("%H:%M"),
            "lastSeen": inc.updated_at.strftime("%H:%M"),
            "attacker": inc.attacker or "Unknown",
            "attackerLocation": inc.attacker_location or "Unknown",
            "affectedAssets": inc.affected_assets or [],
            "timeline": inc.timeline or [],
            "aiSummary": inc.ai_summary or "No summary available",
            "mitreTechniques": inc.mitre_techniques or [],
            "recommendedActions": inc.recommended_actions or []
        })

    # 6. Dashboard Attack Graph
    nodes = [
        {"id": "fw-01", "label": "Perimeter Firewall", "type": "firewall", "x": 150, "y": 100, "critical": False},
        {"id": "workstation-04", "label": "WORKSTATION-04", "type": "endpoint", "x": 300, "y": 200, "critical": False},
        {"id": "db-prod", "label": "Prod Customer DB", "type": "database", "x": 600, "y": 250, "critical": True},
        {"id": "cloud-api", "label": "Cloud API Gateway", "type": "cloud", "x": 450, "y": 120, "critical": False}
    ]
    edges = [
        {"from": "fw-01", "to": "workstation-04", "severity": "Medium"},
        {"from": "workstation-04", "to": "db-prod", "severity": "High"}
    ]

    for inc in incidents_list:
        if inc.status in ["Open", "Investigating"] and inc.attacker:
            attacker_id = f"attacker-{inc.incident_id}"
            nodes.append({
                "id": attacker_id,
                "label": f"Attacker ({inc.attacker})",
                "type": "attacker",
                "x": 50,
                "y": 250,
                "critical": True
            })
            edges.append({
                "from": attacker_id,
                "to": "fw-01",
                "severity": inc.severity
            })

    dashboardGraph = {
        "nodes": nodes,
        "edges": edges
    }

    return {
        # Raw stats for direct API clients
        "total_alerts": summary["total_alerts"],
        "critical_alerts": summary["critical_alerts"],
        "high_alerts": summary["high_alerts"],
        "active_incidents": summary["active_incidents"],
        "resolved_incidents": summary["resolved_incidents"],
        "threats_detected": summary["threats_detected"],
        "risk_score": summary["risk_score"],
        # Consolidated DashboardData schema required by frontend
        "kpis": kpis,
        "liveThreatActivity": live_activity,
        "predictions": predictions,
        "agents": agents,
        "incidents": incidents,
        "dashboardGraph": dashboardGraph
    }

@router.get("/api/dashboard/alerts-by-severity")
def get_alerts_by_severity(db: Session = Depends(get_db)):
    severities = ["Low", "Medium", "High", "Critical"]
    result = []
    for s in severities:
        count = db.query(Alert).filter(Alert.severity == s).count()
        result.append({"severity": s, "count": count})
    return result

@router.get("/api/dashboard/alerts-over-time")
def get_alerts_over_time(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    result = []
    for i in range(12, -1, -2):
        time_slot = now - timedelta(hours=i)
        time_str = time_slot.strftime("%H:00")
        start_time = time_slot.replace(minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=2)
        count = db.query(Alert).filter(
            Alert.created_at >= start_time,
            Alert.created_at < end_time
        ).count()
        result.append({"time": time_str, "count": count})
    return result

@router.get("/api/dashboard/incidents-by-status")
def get_incidents_by_status(db: Session = Depends(get_db)):
    statuses = ["Open", "Investigating", "Contained", "Resolved"]
    result = []
    for s in statuses:
        count = db.query(Incident).filter(Incident.status == s).count()
        result.append({"status": s, "count": count})
    return result

@router.get("/api/dashboard/threat-categories")
def get_threat_categories(db: Session = Depends(get_db)):
    categories = db.query(Alert.category).distinct().all()
    result = []
    for cat_tuple in categories:
        cat = cat_tuple[0]
        count = db.query(Alert).filter(Alert.category == cat).count()
        result.append({"category": cat, "count": count})
    return result

@router.get("/agents")
def get_frontend_agents(db: Session = Depends(get_db)):
    dashboard_data = get_frontend_dashboard(db)
    return dashboard_data["agents"]

@router.get("/predictions")
def get_frontend_predictions(db: Session = Depends(get_db)):
    dashboard_data = get_frontend_dashboard(db)
    return dashboard_data["predictions"]

@router.get("/risk")
def get_frontend_risk(db: Session = Depends(get_db)):
    summary = compute_summary_stats(db)

    domains = [
        {"domain": "Endpoints", "score": min(95, summary["risk_score"] + 2)},
        {"domain": "Network", "score": min(95, summary["risk_score"] - 5)},
        {"domain": "Databases", "score": min(95, summary["risk_score"] - 12)},
        {"domain": "Cloud Infrastructure", "score": min(95, summary["risk_score"] - 2)}
    ]

    recommendations = [
        {"id": "rec-001", "label": "Revoke credentials of high-risk service leases", "impact": "Critical", "reduction": "25%"},
        {"id": "rec-002", "label": "Enforce MFA verification on SSH endpoints", "impact": "High", "reduction": "15%"},
        {"id": "rec-003", "label": "Implement strict firewall egress limits on databases", "impact": "Medium", "reduction": "10%"}
    ]

    trend = [
        {"month": "Mar", "score": 68},
        {"month": "Apr", "score": 72},
        {"month": "May", "score": 75},
        {"month": "Jun", "score": 80},
        {"month": "Jul", "score": 83},
        {"month": "Aug", "score": summary["risk_score"]}
    ]

    history = [
        {"day": "Mon", "incidents": 1},
        {"day": "Tue", "incidents": 2},
        {"day": "Wed", "incidents": 0},
        {"day": "Thu", "incidents": summary["active_incidents"]},
        {"day": "Fri", "incidents": 1},
        {"day": "Sat", "incidents": 0},
        {"day": "Sun", "incidents": 0}
    ]

    return {
        "domains": domains,
        "recommendations": recommendations,
        "trend": trend,
        "history": history
    }

@router.get("/network")
def get_frontend_network(db: Session = Depends(get_db)):
    active_incidents = db.query(Incident).filter(Incident.status.in_(["Open", "Investigating", "Active"])).all()

    nodes = [
        {"id": "fw-01", "label": "Perimeter Firewall", "sub": "192.168.1.1 (Gateway)", "type": "firewall", "x": 160, "y": 140, "critical": False},
        {"id": "workstation-04", "label": "WORKSTATION-04", "sub": "192.168.1.15 (VLAN 10)", "type": "endpoint", "x": 340, "y": 240, "critical": False},
        {"id": "db-prod", "label": "Prod Customer DB", "sub": "10.0.20.5 (Secured Core)", "type": "database", "x": 540, "y": 150, "critical": True},
        {"id": "cloud-perimeter", "label": "Cloud VPC Gateway", "sub": "172.16.0.1 (AWS Egress)", "type": "cloud", "x": 420, "y": 360, "critical": False}
    ]
    connections = [
        {"from": "fw-01", "to": "workstation-04", "severity": "Medium"},
        {"from": "workstation-04", "to": "db-prod", "severity": "High"},
        {"from": "fw-01", "to": "cloud-perimeter", "severity": "Low"}
    ]

    for inc in active_incidents:
        if inc.attacker:
            attacker_id = f"attacker-{inc.incident_id}"
            nodes.append({
                "id": attacker_id,
                "label": f"Attacker ({inc.attacker})",
                "sub": f"Origin: {inc.attacker_location or 'External Vector'}",
                "type": "attacker",
                "x": 60,
                "y": 260,
                "critical": True
            })
            connections.append({
                "from": attacker_id,
                "to": "fw-01",
                "severity": inc.severity
            })

    return {
        "nodes": nodes,
        "connections": connections
    }

@router.get("/reports")
def get_frontend_reports(db: Session = Depends(get_db)):
    reports = db.query(ReportModel).order_by(ReportModel.timestamp.desc()).all()
    result = []
    for r in reports:
        result.append({
            "id": r.report_uuid,
            "name": r.name,
            "type": r.type,
            "severity": r.severity,
            "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M"),
            "status": r.status
        })
    return result

@router.get("/reports/{id}")
def get_frontend_report(id: str, db: Session = Depends(get_db)):
    r = db.query(ReportModel).filter(ReportModel.report_uuid == id).first()
    if not r:
        raise HTTPException(
            status_code=404,
            detail=f"Report {id} not found."
        )
    return {
        "id": r.report_uuid,
        "name": r.name,
        "type": r.type,
        "severity": r.severity,
        "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M"),
        "status": r.status,
        "download_url": f"/api/reports/{r.report_uuid}/download"
    }

@router.post("/api/reports/generate")
def generate_report(payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """
    Generates a new PDF report (Incident Report or Executive Summary).
    """
    report_type = payload.get("type", "Incident")
    incident_id = payload.get("incident_id")

    count = db.query(ReportModel).count() + 1
    report_uuid = f"rep-{count:03d}"

    if report_type == "Incident" and incident_id:
        inc = db.query(Incident).filter(Incident.incident_id == incident_id).first()
        if not inc:
            raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found.")

        pdf_path = ReportService.generate_incident_report(
            incident_id=inc.incident_id,
            title=inc.title,
            severity=inc.severity,
            risk_score=inc.risk_score,
            status=inc.status,
            attacker=inc.attacker or "Unknown",
            attacker_location=inc.attacker_location or "Unknown",
            ai_summary=inc.ai_summary or "",
            timeline=inc.timeline or [],
            recommended_actions=inc.recommended_actions or [],
            evidence=inc.evidence or ""
        )

        rep = ReportModel(
            report_uuid=report_uuid,
            name=f"Incident Audit Report {inc.incident_id} - {inc.title}",
            type="Audit",
            severity=inc.severity,
            timestamp=datetime.utcnow(),
            status="Ready",
            pdf_path=pdf_path
        )
    else:
        summary = compute_summary_stats(db)
        pdf_path = ReportService.generate_security_summary_report(
            report_id=report_uuid,
            total_alerts=summary["total_alerts"],
            critical_alerts=summary["critical_alerts"],
            active_incidents=summary["active_incidents"],
            risk_score=summary["risk_score"]
        )
        rep = ReportModel(
            report_uuid=report_uuid,
            name="Executive Threat Posture & Multi-Agent Operations Audit",
            type="Compliance",
            severity="High",
            timestamp=datetime.utcnow(),
            status="Ready",
            pdf_path=pdf_path
        )

    db.add(rep)
    db.commit()
    db.refresh(rep)

    return {
        "status": "success",
        "report_id": rep.report_uuid,
        "name": rep.name,
        "download_url": f"/api/reports/{rep.report_uuid}/download"
    }

@router.get("/api/reports/{id}/download")
@router.get("/reports/{id}/download")
def download_report(id: str, db: Session = Depends(get_db)):
    """
    Safely downloads a generated PDF report file.
    """
    rep = db.query(ReportModel).filter(ReportModel.report_uuid == id).first()
    if not rep:
        raise HTTPException(status_code=404, detail=f"Report {id} not found.")

    if not rep.pdf_path or not os.path.exists(rep.pdf_path):
        # Auto-regenerate if missing
        summary = compute_summary_stats(db)
        pdf_path = ReportService.generate_security_summary_report(
            report_id=rep.report_uuid,
            total_alerts=summary["total_alerts"],
            critical_alerts=summary["critical_alerts"],
            active_incidents=summary["active_incidents"],
            risk_score=summary["risk_score"]
        )
        rep.pdf_path = pdf_path
        db.commit()

    # Prevent path traversal
    normalized_path = os.path.abspath(rep.pdf_path)
    if not normalized_path.startswith(os.path.abspath(REPORTS_DIR)):
        raise HTTPException(status_code=403, detail="Unauthorized file path access.")

    return FileResponse(
        path=normalized_path,
        media_type="application/pdf",
        filename=f"{rep.report_uuid}.pdf"
    )

@router.get("/api/activity-logs")
def get_activity_logs(db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(100).all()
    result = []
    for log in logs:
        result.append({
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "description": log.description,
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        })
    return result

@router.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    active_ws_connections.append(websocket)
    try:
        await websocket.send_json({"status": "connected", "message": "AegisSOC Telemetry stream active."})
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"echo": data})
    except WebSocketDisconnect:
        pass
    finally:
        if websocket in active_ws_connections:
            active_ws_connections.remove(websocket)
