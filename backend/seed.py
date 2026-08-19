import os
import sys
from datetime import datetime, timedelta
from database.connection import SessionLocal, Base, engine
from database.mongodb import get_raw_events_collection, check_mongo_connection
from models.user import User
from models.alert import Alert
from models.incident import Incident
from models.agent import Agent
from models.report import Report as ReportModel
from models.security_event import SecurityEvent
from models.response_action import ResponseAction
from models.activity_log import ActivityLog
from utils.security import hash_password
from services.report_service import ReportService

def seed_database():
    print("=" * 60)
    print("AegisSOC AI - Seeding Relational & Document Databases")
    print("=" * 60)

    # 1. Connect to PostgreSQL
    print("[+] Connecting to PostgreSQL...")
    db = SessionLocal()

    try:
        print("[+] Recreating PostgreSQL database tables...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

        now = datetime.utcnow()

        # 2. Seed MongoDB
        print("[+] Checking MongoDB connectivity & seeding raw events...")
        mongo_status = check_mongo_connection()
        raw_events_col = None
        if mongo_status.get("status") == "connected":
            raw_events_col = get_raw_events_collection()
            raw_events_col.delete_many({}) # clean slate
            print("    MongoDB collection 'raw_security_events' cleaned.")
        else:
            print(f"    [!] Warning: MongoDB not reachable ({mongo_status.get('error')}). Continuing PostgreSQL seeding.")

        # 3. Seed Users
        print("[+] Seeding Users...")
        users = [
            User(
                name="SOC Admin",
                email="admin@aegissoc.ai",
                password_hash=hash_password("admin123"),
                role="admin",
                is_active=True
            ),
            User(
                name="Security Analyst",
                email="analyst@aegissoc.ai",
                password_hash=hash_password("analyst123"),
                role="analyst",
                is_active=True
            ),
            User(
                name="Compliance Auditor",
                email="viewer@aegissoc.ai",
                password_hash=hash_password("viewer123"),
                role="viewer",
                is_active=True
            )
        ]
        db.add_all(users)

        # 4. Seed AI Agents
        print("[+] Seeding AI Agents...")
        agents = [
            Agent(
                agent_uuid="agent-1",
                name="Investigation Agent",
                role="Threat Hunting & Reverse Engineering",
                description="Specialized in process telemetry analysis, static binary decoding, and attack-vector reconstruction.",
                status="Active",
                progress=65,
                tasks_completed=142,
                incidents_investigated=28,
                accuracy=0.96,
                current_task="Decompiling obfuscated ransomware payload...",
                last_activity=now - timedelta(minutes=2),
                icon="search"
            ),
            Agent(
                agent_uuid="agent-2",
                name="Containment Agent",
                role="Active Threat Interdiction",
                description="Automated orchestration agent running playbooks to block network ingress/egress and isolate endpoints.",
                status="Standby",
                progress=0,
                tasks_completed=85,
                incidents_investigated=19,
                accuracy=0.92,
                current_task="Monitoring firewall states...",
                last_activity=now - timedelta(minutes=15),
                icon="shield"
            ),
            Agent(
                agent_uuid="agent-3",
                name="Credential Analyst Agent",
                role="IAM & Directory Verification",
                description="Monitors anomalous directory permissions, credential abuse, and domain controller trust relationship events.",
                status="Standby",
                progress=0,
                tasks_completed=204,
                incidents_investigated=41,
                accuracy=0.98,
                current_task="Idle",
                last_activity=now - timedelta(hours=1),
                icon="key"
            )
        ]
        db.add_all(agents)

        # 5. Seed Security Events
        print("[+] Seeding Security Events (PostgreSQL + MongoDB)...")
        raw_events_data = [
            {
                "event_type": "failed_login",
                "source": "AD-PRIMARY-CONTROLLER",
                "source_ip": "198.51.100.12",
                "destination_ip": "192.168.1.10",
                "username": "Administrator",
                "hostname": "AD-PRIMARY-CONTROLLER",
                "message": "Kerberos logon failure: Unknown password.",
                "raw_data": '{"event_id": 4625, "status": "0xC000006A", "sub_status": "0xC000006A"}',
                "timestamp": now - timedelta(minutes=30)
            },
            {
                "event_type": "failed_login",
                "source": "AD-PRIMARY-CONTROLLER",
                "source_ip": "198.51.100.12",
                "destination_ip": "192.168.1.10",
                "username": "Administrator",
                "hostname": "AD-PRIMARY-CONTROLLER",
                "message": "Kerberos logon failure: Unknown password.",
                "raw_data": '{"event_id": 4625, "status": "0xC000006A", "sub_status": "0xC000006A"}',
                "timestamp": now - timedelta(minutes=29)
            },
            {
                "event_type": "failed_login",
                "source": "AD-PRIMARY-CONTROLLER",
                "source_ip": "198.51.100.12",
                "destination_ip": "192.168.1.10",
                "username": "Administrator",
                "hostname": "AD-PRIMARY-CONTROLLER",
                "message": "Kerberos logon failure: Unknown password.",
                "raw_data": '{"event_id": 4625, "status": "0xC000006A", "sub_status": "0xC000006A"}',
                "timestamp": now - timedelta(minutes=28)
            },
            {
                "event_type": "process_spawn",
                "source": "EDR Agent",
                "source_ip": "192.168.1.15",
                "destination_ip": "203.0.113.50",
                "username": "alice.smith",
                "hostname": "WORKSTATION-04",
                "message": "Suspicious process 'trojan.exe' spawned by powershell.exe, initiated external connection to ransomware domain.",
                "raw_data": '{"pid": 4821, "cmdline": "powershell.exe -ExecutionPolicy Bypass -File C:\\\\Users\\\\alice\\\\Downloads\\\\trojan.ps1", "hash": "5d41402abc4b2a76b9719d911017c592"}',
                "timestamp": now - timedelta(minutes=20)
            },
            {
                "event_type": "network_flow",
                "source": "Core Firewall",
                "source_ip": "185.190.140.23",
                "destination_ip": "192.168.1.10",
                "username": "system",
                "hostname": "Firewall Gateway",
                "message": "Connection blocked: malicious IP match on outbound egress.",
                "raw_data": '{"action": "blocked", "port": 443, "protocol": "TCP"}',
                "timestamp": now - timedelta(minutes=15)
            }
        ]

        events = []
        for e_dict in raw_events_data:
            mongo_id = None
            if raw_events_col is not None:
                try:
                    res = raw_events_col.insert_one(dict(e_dict))
                    mongo_id = str(res.inserted_id)
                except Exception:
                    pass

            event = SecurityEvent(
                event_type=e_dict["event_type"],
                source=e_dict["source"],
                source_ip=e_dict["source_ip"],
                destination_ip=e_dict["destination_ip"],
                username=e_dict["username"],
                hostname=e_dict["hostname"],
                message=e_dict["message"],
                raw_data=e_dict["raw_data"],
                mongo_document_id=mongo_id,
                timestamp=e_dict["timestamp"]
            )
            events.append(event)
        db.add_all(events)

        # 6. Seed Alerts
        print("[+] Seeding Alerts...")
        alerts = [
            Alert(
                alert_id="ALT-001",
                title="Credential Dumping (Mimikatz)",
                description="LSASS process memory access request flagged from suspicious process. Potential attempts to dump hashes.",
                source="EDR Agent",
                category="Credential Abuse",
                severity="Critical",
                status="Investigating",
                source_ip="192.168.1.10",
                destination_ip="185.190.140.23",
                affected_asset="AD-PRIMARY-CONTROLLER",
                confidence_score=0.96,
                detected_at=now - timedelta(minutes=25),
                created_at=now - timedelta(minutes=25)
            ),
            Alert(
                alert_id="ALT-002",
                title="Malware Outbreak (Cobalt Strike)",
                description="Malicious payload trojan.exe execution detected and outbound C2 connection established.",
                source="EDR Agent",
                category="Malware",
                severity="High",
                status="New",
                source_ip="192.168.1.15",
                destination_ip="203.0.113.50",
                affected_asset="WORKSTATION-04",
                confidence_score=0.92,
                detected_at=now - timedelta(minutes=20),
                created_at=now - timedelta(minutes=20)
            ),
            Alert(
                alert_id="ALT-003",
                title="Reconnaissance Port Scan",
                description="Failed SSH login sweep originating from local subnets. Sequential scan over 1-1024 range.",
                source="Core Firewall",
                category="Reconnaissance",
                severity="Medium",
                status="Resolved",
                source_ip="198.51.100.12",
                destination_ip="192.168.1.254",
                affected_asset="Firewall Gateway",
                confidence_score=0.88,
                detected_at=now - timedelta(hours=2),
                created_at=now - timedelta(hours=2)
            )
        ]
        db.add_all(alerts)

        # 7. Seed Incidents
        print("[+] Seeding Incidents...")
        incidents = [
            Incident(
                incident_id="INC-001",
                title="Database Credential Abuse",
                description="Correlated alert activity indicating administrative credential harvesting and LSASS process dumping on the Active Directory Controller.",
                severity="Critical",
                status="Investigating",
                attack_type="Credential Abuse",
                risk_score=96,
                assigned_to="Security Analyst",
                attacker="185.190.140.23",
                attacker_location="Netherlands",
                affected_assets=[{"id": "db-01", "name": "Prod Customer DB", "type": "database"}],
                timeline=[
                    {"time": "10:12:00", "event": "Anomalous database login attempt"},
                    {"time": "10:15:00", "event": "LSASS registry dumping pattern detected"}
                ],
                ai_summary="Autonomous correlation confirms unauthorized access using brute-forced credentials. Source IP correlates to active ransomware distributor subnet.",
                mitre_techniques=[{"id": "T1110", "name": "Brute Force"}],
                recommended_actions=["Isolate Database Instance", "Revoke DB Account Permissions"],
                evidence="Correlated events trace LSASS memory dumps via EDR.",
                created_at=now - timedelta(minutes=25),
                updated_at=now - timedelta(minutes=5)
            ),
            Incident(
                incident_id="INC-002",
                title="Malware Infection",
                description="Malicious payload trojan.exe execution detected and outbound C2 connection established on WORKSTATION-04.",
                severity="High",
                status="Open",
                attack_type="Malware",
                risk_score=85,
                assigned_to="Investigation Agent",
                attacker="203.0.113.50",
                attacker_location="Russia",
                affected_assets=[{"id": "endpoint-01", "name": "WORKSTATION-04", "type": "endpoint"}],
                timeline=[
                    {"time": "08:00:00", "event": "Malware pattern observed"},
                    {"time": "08:05:00", "event": "Host isolated automatically"}
                ],
                ai_summary="Cobalt strike beacon observed communicating with Russian C2 subnet.",
                mitre_techniques=[{"id": "T1204", "name": "User Execution"}],
                recommended_actions=["Isolate Endpoint", "Collect Evidence"],
                evidence="EDR alert trace hashes: 5d41402abc4b2a76b9719d911017c592",
                created_at=now - timedelta(minutes=20),
                updated_at=now - timedelta(minutes=10)
            )
        ]
        db.add_all(incidents)

        # 8. Seed Response Actions (with Human Approval states)
        print("[+] Seeding Response Actions & Approval States...")
        responses = [
            ResponseAction(
                action_uuid="ACT-001",
                incident_id="INC-001",
                action_type="Block IP",
                description="Simulated network blocking rule for attacker 185.190.140.23.",
                status="APPROVED",
                requires_approval=True,
                approved_by="Security Analyst",
                approved_at=now - timedelta(minutes=12),
                executed_by="SOC Automation Agent",
                execution_time=now - timedelta(minutes=10),
                result="Simulated: IP 185.190.140.23 would be blocked on perimeter firewalls."
            ),
            ResponseAction(
                action_uuid="ACT-002",
                incident_id="INC-002",
                action_type="Isolate Endpoint",
                description="Simulated machine host network isolation for WORKSTATION-04.",
                status="PENDING_APPROVAL",
                requires_approval=True,
                executed_by="Investigation Agent",
                result="Awaiting analyst approval before network isolation."
            ),
            ResponseAction(
                action_uuid="ACT-003",
                incident_id="INC-001",
                action_type="Reset Credentials",
                description="Force credential rotation on compromised service accounts.",
                status="EXECUTED",
                requires_approval=True,
                approved_by="SOC Admin",
                approved_at=now - timedelta(minutes=8),
                executed_by="SOC Admin",
                execution_time=now - timedelta(minutes=7),
                result="Simulated: Credentials for database service account rotated."
            )
        ]
        db.add_all(responses)

        # 9. Seed Reports & Generate PDFs
        print("[+] Generating and Seeding PDF Reports...")
        pdf_rep1 = ReportService.generate_incident_report(
            incident_id="INC-001",
            title="Database Credential Abuse & LSASS Dumping",
            severity="Critical",
            risk_score=96,
            status="Investigating",
            attacker="185.190.140.23",
            attacker_location="Netherlands",
            ai_summary="Autonomous correlation confirms unauthorized access using brute-forced credentials.",
            timeline=[
                {"time": "10:12:00", "event": "Anomalous database login attempt"},
                {"time": "10:15:00", "event": "LSASS registry dumping pattern detected"}
            ],
            recommended_actions=["Isolate Database Instance", "Revoke DB Account Permissions"],
            evidence="LSASS memory dump signature 098f6bcd4621d373cade4e832627b4f6."
        )

        pdf_rep2 = ReportService.generate_security_summary_report(
            report_id="REP-002",
            total_alerts=3,
            critical_alerts=1,
            active_incidents=2,
            risk_score=87
        )

        reports = [
            ReportModel(
                report_uuid="rep-001",
                name="Post-Mortem Incident Audit report INC-001",
                type="Audit",
                severity="Critical",
                timestamp=now - timedelta(hours=6),
                status="Ready",
                pdf_path=pdf_rep1
            ),
            ReportModel(
                report_uuid="rep-002",
                name="Weekly Executive Threat & Multi-Agent Operations Audit",
                type="Compliance",
                severity="High",
                timestamp=now - timedelta(days=2),
                status="Ready",
                pdf_path=pdf_rep2
            )
        ]
        db.add_all(reports)

        # 10. Seed Activity Logs
        print("[+] Seeding Activity Logs...")
        logs = [
            ActivityLog(
                user_id="System",
                action="SYSTEM_INIT",
                description="AegisSOC AI Backend started. Database schemas initialized on PostgreSQL & MongoDB.",
                timestamp=now - timedelta(hours=4)
            ),
            ActivityLog(
                user_id="admin@aegissoc.ai",
                action="USER_LOGIN",
                description="Admin logged in to the dashboard.",
                timestamp=now - timedelta(hours=2)
            ),
            ActivityLog(
                user_id="Autonomous Detection Engine",
                action="ALERT_GENERATED",
                description="Correlated alert ALT-001 generated from syslog feeds.",
                timestamp=now - timedelta(minutes=25)
            ),
            ActivityLog(
                user_id="Autonomous Correlation Agent",
                action="INCIDENT_CREATED",
                description="Alert escalated to security incident INC-001.",
                timestamp=now - timedelta(minutes=25)
            ),
            ActivityLog(
                user_id="Security Analyst",
                action="RESPONSE_APPROVED",
                description="Analyst approved response action ACT-001 (Block IP).",
                timestamp=now - timedelta(minutes=12)
            )
        ]
        db.add_all(logs)

        db.commit()
        print("=" * 60)
        print("Database Seeding Completed Successfully!")
        print("=" * 60)

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
