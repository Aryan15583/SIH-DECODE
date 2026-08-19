from sqlalchemy.orm import Session
from datetime import datetime
from models.incident import Incident
from models.alert import Alert
from models.activity_log import ActivityLog
from services.risk_scoring import RiskScoringService
from services.llm_service import LLMService
from services.response_service import ResponseService
import uuid

class IncidentService:
    @staticmethod
    def correlate_alert_to_incident(db: Session, alert: Alert) -> Incident:
        """
        Correlates a new Alert to an active Incident, or escalates it to a new Incident.
        """
        # Look for active incidents (Open or Investigating) with same source IP or same affected asset
        active_incident = db.query(Incident).filter(
            Incident.status.in_(["Open", "Investigating"]),
            (
                (Incident.attacker == alert.source_ip) | 
                (Incident.description.like(f"%{alert.affected_asset}%")) |
                (Incident.title.like(f"%{alert.category}%"))
            )
        ).first()

        if active_incident:
            # 1. Update Timeline
            current_time = datetime.utcnow().strftime("%H:%M:%S")
            timeline_list = list(active_incident.timeline or [])
            timeline_list.append({
                "time": current_time,
                "event": f"Correlated Alert: {alert.title} (Severity: {alert.severity}) from {alert.source}"
            })
            active_incident.timeline = timeline_list

            # 2. Recalculate Risk Score
            alerts_count = db.query(Alert).filter(
                (Alert.source_ip == active_incident.attacker) |
                (Alert.affected_asset == alert.affected_asset)
            ).count()

            assets_count = len(active_incident.affected_assets or [])
            active_incident.risk_score = RiskScoringService.calculate_score(
                severity=active_incident.severity if active_incident.severity == "Critical" else alert.severity,
                confidence_score=alert.confidence_score,
                num_affected_assets=max(1, assets_count),
                num_related_alerts=max(1, alerts_count),
                category=alert.category
            )

            # 3. Update AI Summary
            llm = LLMService()
            active_incident.ai_summary = llm.generate_incident_summary(
                incident_title=active_incident.title,
                status=active_incident.status,
                risk_score=active_incident.risk_score,
                alerts_count=alerts_count
            )

            active_incident.updated_at = datetime.utcnow()

            # 4. Log correlation
            log = ActivityLog(
                user_id="Autonomous Correlation Agent",
                action="INCIDENT_UPDATED",
                description=f"Correlated alert {alert.alert_id} into incident {active_incident.incident_id}. New risk score: {active_incident.risk_score}.",
                timestamp=datetime.utcnow()
            )
            db.add(log)
            db.commit()
            db.refresh(active_incident)
            return active_incident

        else:
            # Create new incident
            incident_count = db.query(Incident).count() + 1
            incident_id = f"INC-{incident_count:03d}"

            # Attacker GeoIP / Location Mock
            location = "External WAN"
            if alert.source_ip:
                if alert.source_ip.startswith("192.168.") or alert.source_ip.startswith("10.") or alert.source_ip.startswith("127."):
                    location = "Internal LAN"
                elif alert.source_ip == "185.190.140.23":
                    location = "Netherlands"
                elif alert.source_ip == "203.0.113.50":
                    location = "Russia"
                elif alert.source_ip == "198.51.100.12":
                    location = "China"
                else:
                    location = "External WAN"

            # MITRE Technique mapping
            mitre_map = {
                "credential abuse": [{"id": "T1110", "name": "Brute Force"}, {"id": "T1078", "name": "Valid Accounts"}],
                "malware": [{"id": "T1204", "name": "User Execution"}, {"id": "T1059", "name": "Command and Scripting Interpreter"}],
                "reconnaissance": [{"id": "T1595", "name": "Active Scanning"}],
                "threat intelligence": [{"id": "T1071", "name": "Application Layer Protocol"}]
            }
            mitre = mitre_map.get(alert.category.lower(), [{"id": "T1204", "name": "Exploitation of Vulnerability"}])

            # Affected Assets
            assets = []
            if alert.affected_asset:
                asset_type = "endpoint"
                if "db" in alert.affected_asset.lower() or "sql" in alert.affected_asset.lower():
                    asset_type = "database"
                elif "srv" in alert.affected_asset.lower() or "server" in alert.affected_asset.lower() or "controller" in alert.affected_asset.lower():
                    asset_type = "server"
                elif "firewall" in alert.affected_asset.lower() or "gateway" in alert.affected_asset.lower():
                    asset_type = "firewall"
                assets.append({
                    "id": f"asset-{int(uuid.uuid4().int % 1000):03d}",
                    "name": alert.affected_asset,
                    "type": asset_type
                })
            else:
                assets.append({
                    "id": "asset-001",
                    "name": "WORKSTATION-04",
                    "type": "endpoint"
                })

            # Recommended Actions
            recommended = ResponseService.get_recommendations(alert.title)

            # AI Summary & Risk Score
            llm = LLMService()
            risk_score = RiskScoringService.calculate_score(
                severity=alert.severity,
                confidence_score=alert.confidence_score,
                num_affected_assets=len(assets),
                num_related_alerts=1,
                category=alert.category
            )

            ai_summary = llm.generate_incident_summary(
                incident_title=alert.title,
                status="Open",
                risk_score=risk_score,
                alerts_count=1
            )

            current_time = datetime.utcnow().strftime("%H:%M:%S")
            timeline = [
                {"time": current_time, "event": f"Threat pattern observed: {alert.title}"}
            ]

            new_incident = Incident(
                incident_id=incident_id,
                title=f"Investigate {alert.title}",
                description=f"Automated incident escalated from {alert.alert_id} ({alert.title}). Context: {alert.description}",
                severity=alert.severity,
                status="Open",
                attack_type=alert.category,
                risk_score=risk_score,
                assigned_to="SOC Autonomous Agent",
                attacker=alert.source_ip or "Unknown",
                attacker_location=location,
                affected_assets=assets,
                timeline=timeline,
                ai_summary=ai_summary,
                mitre_techniques=mitre,
                recommended_actions=recommended,
                evidence=f"Correlated Alert details:\n{alert.description}\nSource IP: {alert.source_ip}\nDestination IP: {alert.destination_ip}",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(new_incident)

            # Queue pending approval response action for top recommended action
            if recommended and len(recommended) > 0:
                top_action = recommended[0]
                ResponseService.create_pending_action(
                    db=db,
                    incident_id=incident_id,
                    action_type=top_action,
                    proposed_by="Investigation Agent"
                )

            log = ActivityLog(
                user_id="Autonomous Correlation Agent",
                action="INCIDENT_CREATED",
                description=f"Escalated alert {alert.alert_id} to new incident {incident_id} ({new_incident.title}).",
                timestamp=datetime.utcnow()
            )
            db.add(log)
            db.commit()
            db.refresh(new_incident)
            return new_incident
