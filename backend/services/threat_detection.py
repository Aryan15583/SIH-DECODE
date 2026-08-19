from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from models.security_event import SecurityEvent
from models.alert import Alert
from models.activity_log import ActivityLog
from typing import List

# Fictional Threat Intelligence Feeds
KNOWN_MALICIOUS_IPS = {
    "185.190.140.23": "Netherlands (Known ransomware distributor / C2 gateway)",
    "203.0.113.50": "Russia (Suspected APT actor proxy node)",
    "198.51.100.12": "China (SSH & RDP brute-force scanning botnet)",
    "192.0.2.45": "Unknown (Tor exit relay & credential stuffing source)"
}

KNOWN_MALICIOUS_HASHES = {
    "098f6bcd4621d373cade4e832627b4f6": "Mimikatz LSASS Credential Dumper",
    "5d41402abc4b2a76b9719d911017c592": "Cobalt Strike HTTPS Beacon Payload",
    "7d793037a0760186574b0282f2f435e7": "LockBit 3.0 Ransomware Encryptor"
}

class ThreatDetectionEngine:
    @staticmethod
    def process_event(db: Session, event: SecurityEvent) -> List[Alert]:
        """
        Processes a newly ingested security event against correlation rules.
        Returns a list of newly generated Alerts.
        """
        generated_alerts = []
        content_to_check = f"{event.message or ''} {event.raw_data or ''} {event.event_type or ''}".lower()

        # Rule 1: Threat Intelligence IP Match
        if event.source_ip in KNOWN_MALICIOUS_IPS:
            intel_desc = KNOWN_MALICIOUS_IPS[event.source_ip]
            alert = ThreatDetectionEngine._create_alert(
                db,
                title="Threat Intelligence IP Match",
                description=f"Traffic observed from/to known malicious IP {event.source_ip}. Threat Intel Context: {intel_desc}",
                source=event.source,
                category="Threat Intelligence",
                severity="High",
                source_ip=event.source_ip,
                destination_ip=event.destination_ip,
                affected_asset=event.hostname or "Network Perimeter",
                confidence_score=0.95
            )
            generated_alerts.append(alert)

        # Rule 2: Malware Indicators (Signatures / Hashes / Tool names)
        matched_malware = None
        for file_hash, malware_name in KNOWN_MALICIOUS_HASHES.items():
            if file_hash in content_to_check:
                matched_malware = malware_name
                break
        
        if not matched_malware:
            if "mimikatz" in content_to_check or "lsass" in content_to_check or "dumping" in content_to_check:
                matched_malware = "Credential Dumping Tool (Mimikatz)"
            elif "cobalt" in content_to_check or "beacon" in content_to_check:
                matched_malware = "Cobalt Strike Beacon"
            elif "ransomware" in content_to_check or "lockbit" in content_to_check:
                matched_malware = "Ransomware Infiltration"
            elif "trojan" in content_to_check or "backdoor" in content_to_check or "malware" in content_to_check:
                matched_malware = "Generic Malware Signature"

        if matched_malware:
            alert = ThreatDetectionEngine._create_alert(
                db,
                title="Malware Execution Detected",
                description=f"Malware execution activity flagged on host {event.hostname or 'End User Workstation'}. Pattern matched: '{matched_malware}'. Log context: '{event.message}'",
                source=event.source,
                category="Malware",
                severity="Critical",
                source_ip=event.source_ip,
                destination_ip=event.destination_ip,
                affected_asset=event.hostname or "WORKSTATION-04",
                confidence_score=0.98
            )
            generated_alerts.append(alert)

        # Rule 3: Brute Force (Failed Login Threshold Correlation)
        if event.event_type == "failed_login" or "failed login" in content_to_check or "logon failure" in content_to_check:
            # Query count of failed logins from this IP
            recent_failed_logins = db.query(SecurityEvent).filter(
                SecurityEvent.source_ip == event.source_ip,
                SecurityEvent.event_type == "failed_login"
            ).count()

            # Trigger alert once threshold (>= 3 attempts) is reached
            if recent_failed_logins >= 3:
                alert = ThreatDetectionEngine._create_alert(
                    db,
                    title="Brute Force Password Guessing",
                    description=f"Multiple failed authentication attempts ({recent_failed_logins} logs) detected from source IP {event.source_ip} targeting username '{event.username or 'admin'}' on host '{event.hostname or 'Gateway'}'.",
                    source=event.source,
                    category="Credential Abuse",
                    severity="High",
                    source_ip=event.source_ip,
                    destination_ip=event.destination_ip,
                    affected_asset=event.hostname or "AD-PRIMARY-CONTROLLER",
                    confidence_score=0.92
                )
                generated_alerts.append(alert)

        # Rule 4: Reconnaissance & Port Scanning
        if event.event_type == "port_scan" or "port scan" in content_to_check or "reconnaissance" in content_to_check or "sweep" in content_to_check:
            alert = ThreatDetectionEngine._create_alert(
                db,
                title="Reconnaissance Port Scan",
                description=f"Sequential port sweep activity flagged from source {event.source_ip or 'external IP'} targeting internal subnet addresses.",
                source=event.source,
                category="Reconnaissance",
                severity="Medium",
                source_ip=event.source_ip,
                destination_ip=event.destination_ip,
                affected_asset=event.hostname or "Firewall Gateway",
                confidence_score=0.88
            )
            generated_alerts.append(alert)

        # Rule 5: Suspicious Login / Anomalous Access
        if "suspicious login" in content_to_check or "anomalous access" in content_to_check or "privilege escalation" in content_to_check:
            alert = ThreatDetectionEngine._create_alert(
                db,
                title="Suspicious Administrative Access",
                description=f"Anomalous administrative login session established by '{event.username or 'user'}' on {event.hostname or 'server'} outside of baseline hours.",
                source=event.source,
                category="Credential Abuse",
                severity="High",
                source_ip=event.source_ip,
                destination_ip=event.destination_ip,
                affected_asset=event.hostname or "AD-PRIMARY-CONTROLLER",
                confidence_score=0.89
            )
            generated_alerts.append(alert)

        return generated_alerts

    @staticmethod
    def _create_alert(
        db: Session,
        title: str,
        description: str,
        source: str,
        category: str,
        severity: str,
        source_ip: str = None,
        destination_ip: str = None,
        affected_asset: str = None,
        confidence_score: float = 0.0
    ) -> Alert:
        """
        Helper method to insert and log an Alert model.
        """
        alert_count = db.query(Alert).count() + 1
        alert_id = f"ALT-{alert_count:03d}"

        alert_model = Alert(
            alert_id=alert_id,
            title=title,
            description=description,
            source=source,
            category=category,
            severity=severity,
            status="New",
            source_ip=source_ip,
            destination_ip=destination_ip,
            affected_asset=affected_asset,
            confidence_score=confidence_score,
            detected_at=datetime.utcnow(),
            created_at=datetime.utcnow()
        )
        db.add(alert_model)

        log = ActivityLog(
            user_id="Autonomous Detection Engine",
            action="ALERT_GENERATED",
            description=f"Rule engine correlated alert {alert_id} ({title}) with severity {severity}.",
            timestamp=datetime.utcnow()
        )
        db.add(log)
        db.commit()
        db.refresh(alert_model)
        return alert_model
