import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from models.agent import Agent
from models.incident import Incident
from models.security_event import SecurityEvent
from models.response_action import ResponseAction
from services.threat_detection import ThreatDetectionEngine
from services.incident_service import IncidentService
from services.response_service import ResponseService
from utils.logger import get_logger
import json

logger = get_logger("orchestrator_simulation")

# Fictional event templates for simulation ingestion
SIMULATED_EVENTS = [
    {
        "event_type": "failed_login",
        "source": "Active Directory Controller",
        "source_ip": "185.190.140.23",
        "username": "sql_admin",
        "hostname": "AD-PRIMARY-CONTROLLER",
        "message": "Multiple failed Kerberos logon attempts using administrator password.",
        "raw_data": '{"port": 88, "error_code": "0xC000006A"}'
    },
    {
        "event_type": "port_scan",
        "source": "Core Switch Egress",
        "source_ip": "198.51.100.12",
        "username": "unknown",
        "hostname": "Firewall Gateway",
        "message": "Recon sweep detected targeting internal databases range.",
        "raw_data": '{"ports_scanned": [3306, 5432, 1521, 27017]}'
    },
    {
        "event_type": "process_spawn",
        "source": "EDR Host Agent",
        "source_ip": "192.168.1.42",
        "username": "john.security",
        "hostname": "DEV-WORKSTATION-01",
        "message": "Flagged suspicious execution: Cobalt Strike Beacon signature hash match.",
        "raw_data": '{"hash": "5d41402abc4b2a76b9719d911017c592", "pid": 9012}'
    }
]

active_ws_connections = []

class OrchestrationSimulationService:
    @staticmethod
    async def start_simulation_loop():
        """
        Background SOC threat & agent simulation loop.
        """
        logger.info("Autonomous SOC Multi-Agent Simulator loop initialized.")
        await asyncio.sleep(5)

        while True:
            try:
                db: Session = SessionLocal()
                await OrchestrationSimulationService._run_simulation_step(db)
                db.close()
            except Exception as e:
                logger.error(f"Error in simulation loop step: {e}")

            # Run step every 15 seconds
            await asyncio.sleep(15)

    @staticmethod
    async def _run_simulation_step(db: Session):
        active_incidents = db.query(Incident).filter(Incident.status.in_(["Open", "Investigating"])).all()

        if active_incidents:
            agents = db.query(Agent).all()
            if not agents:
                return

            for incident in active_incidents:
                category = (incident.attack_type or "").lower()
                if "credential" in category:
                    target_agent = next((a for a in agents if a.agent_uuid == "agent-3"), agents[0])
                elif "malware" in category:
                    target_agent = next((a for a in agents if a.agent_uuid == "agent-1"), agents[0])
                else:
                    target_agent = next((a for a in agents if a.agent_uuid == "agent-2"), agents[0])

                if target_agent:
                    if target_agent.status != "Active":
                        target_agent.status = "Active"
                        target_agent.progress = 0
                        target_agent.current_task = f"Analyzing threat telemetry for {incident.incident_id}..."
                        target_agent.last_activity = datetime.utcnow()
                    else:
                        target_agent.progress += 25
                        target_agent.last_activity = datetime.utcnow()

                        if target_agent.progress == 25:
                            target_agent.current_task = "Correlating network telemetry and MITRE ATT&CK techniques..."
                        elif target_agent.progress == 50:
                            target_agent.current_task = "Evaluating risk index and checking threat intelligence databases..."
                        elif target_agent.progress == 75:
                            target_agent.current_task = "Synthesizing safe response playbook and checking approval state..."
                        elif target_agent.progress >= 100:
                            target_agent.progress = 100
                            target_agent.status = "Standby"
                            target_agent.current_task = "Idle / Monitoring"
                            target_agent.tasks_completed += 1
                            target_agent.incidents_investigated += 1

                            action_type = incident.recommended_actions[0] if incident.recommended_actions else "Collect Evidence"

                            # Check if pending approval exists
                            pending = db.query(ResponseAction).filter(
                                ResponseAction.incident_id == incident.incident_id,
                                ResponseAction.action_type == action_type,
                                ResponseAction.status == "PENDING_APPROVAL"
                            ).first()

                            if pending:
                                logger.info(f"Agent {target_agent.name} is waiting for Human Approval on '{action_type}' for {incident.incident_id}.")
                            else:
                                # Execute safe simulation
                                ResponseService.execute_action(
                                    db=db,
                                    incident_id=incident.incident_id,
                                    action_type=action_type,
                                    executed_by=target_agent.name,
                                    bypass_approval=True
                                )

                    db.commit()

            await OrchestrationSimulationService.broadcast_telemetry_updates()

        else:
            # Quiet window: simulate a new threat event with 20% chance
            if random.random() < 0.20:
                event_template = random.choice(SIMULATED_EVENTS)
                event = SecurityEvent(
                    event_type=event_template["event_type"],
                    source=event_template["source"],
                    source_ip=event_template["source_ip"],
                    username=event_template["username"],
                    hostname=event_template["hostname"],
                    message=event_template["message"],
                    raw_data=event_template["raw_data"],
                    timestamp=datetime.utcnow()
                )
                db.add(event)
                db.commit()
                db.refresh(event)

                alerts = ThreatDetectionEngine.process_event(db, event)
                for alert in alerts:
                    IncidentService.correlate_alert_to_incident(db, alert)
                db.commit()

                await OrchestrationSimulationService.broadcast_telemetry_updates()

    @staticmethod
    async def broadcast_telemetry_updates():
        if not active_ws_connections:
            return

        payload = json.dumps({"event": "telemetry_updated", "timestamp": datetime.utcnow().isoformat()})
        for ws in list(active_ws_connections):
            try:
                await ws.send_text(payload)
            except Exception:
                if ws in active_ws_connections:
                    active_ws_connections.remove(ws)
