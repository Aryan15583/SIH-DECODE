from sqlalchemy.orm import Session
from datetime import datetime
from models.response_action import ResponseAction
from models.activity_log import ActivityLog
from models.incident import Incident
from typing import List, Dict, Any

# Actions that are critical/high-impact and require human approval
CRITICAL_RESPONSE_ACTIONS = [
    "Block IP",
    "Isolate Endpoint",
    "Disable User",
    "Reset Credentials",
    "Create Firewall Rule"
]

class ResponseService:
    @staticmethod
    def get_recommendations(incident_title: str) -> List[str]:
        """
        Recommends simulated remediation actions based on incident type.
        """
        title_lower = incident_title.lower()
        if "brute" in title_lower or "failed login" in title_lower or "credential" in title_lower:
            return ["Block IP", "Reset Credentials", "Collect Evidence"]
        elif "malware" in title_lower or "trojan" in title_lower or "ransomware" in title_lower or "cobalt" in title_lower:
            return ["Isolate Endpoint", "Collect Evidence", "Create Firewall Rule"]
        elif "scan" in title_lower or "recon" in title_lower:
            return ["Block IP", "Create Firewall Rule", "Collect Evidence"]
        else:
            return ["Collect Evidence", "Isolate Endpoint"]

    @staticmethod
    def create_pending_action(
        db: Session,
        incident_id: str,
        action_type: str,
        proposed_by: str = "Investigation Agent"
    ) -> ResponseAction:
        """
        Creates a response action in PENDING_APPROVAL state.
        """
        # Count existing actions to generate sequential action UUID
        count = db.query(ResponseAction).count() + 1
        action_uuid = f"ACT-{count:03d}"

        requires_approval = action_type in CRITICAL_RESPONSE_ACTIONS

        action = ResponseAction(
            action_uuid=action_uuid,
            incident_id=incident_id,
            action_type=action_type,
            description=f"Automated playbook recommendation: {action_type} for incident {incident_id}.",
            status="PENDING_APPROVAL" if requires_approval else "APPROVED",
            requires_approval=requires_approval,
            executed_by=proposed_by,
            created_at=datetime.utcnow()
        )
        db.add(action)

        log = ActivityLog(
            user_id=proposed_by,
            action="RESPONSE_RECOMMENDED",
            description=f"Action {action_uuid} ({action_type}) queued for incident {incident_id}. Approval required: {requires_approval}.",
            timestamp=datetime.utcnow()
        )
        db.add(log)
        db.commit()
        db.refresh(action)
        return action

    @staticmethod
    def approve_action(
        db: Session,
        action_identifier: str,
        approved_by: str = "Security Analyst",
        comments: str = None
    ) -> ResponseAction:
        """
        Approves a pending response action.
        """
        # Find action by int id or action_uuid
        if action_identifier.isdigit():
            action = db.query(ResponseAction).filter(ResponseAction.id == int(action_identifier)).first()
        else:
            action = db.query(ResponseAction).filter(ResponseAction.action_uuid == action_identifier).first()

        if not action:
            raise ValueError(f"Response action '{action_identifier}' not found.")

        if action.status not in ["PENDING_APPROVAL", "REJECTED"]:
            raise ValueError(f"Action '{action_identifier}' is already in '{action.status}' state.")

        action.status = "APPROVED"
        action.approved_by = approved_by
        action.approved_at = datetime.utcnow()
        if comments:
            action.description = f"{action.description or ''} | Approval Note: {comments}"

        log = ActivityLog(
            user_id=approved_by,
            action="RESPONSE_APPROVED",
            description=f"Response action {action.action_uuid or action.id} ({action.action_type}) was APPROVED by {approved_by}.",
            timestamp=datetime.utcnow()
        )
        db.add(log)
        db.commit()
        db.refresh(action)
        return action

    @staticmethod
    def reject_action(
        db: Session,
        action_identifier: str,
        rejected_by: str = "Security Analyst",
        reason: str = "Denied by analyst review"
    ) -> ResponseAction:
        """
        Rejects a pending response action.
        """
        if action_identifier.isdigit():
            action = db.query(ResponseAction).filter(ResponseAction.id == int(action_identifier)).first()
        else:
            action = db.query(ResponseAction).filter(ResponseAction.action_uuid == action_identifier).first()

        if not action:
            raise ValueError(f"Response action '{action_identifier}' not found.")

        action.status = "REJECTED"
        action.rejection_reason = reason
        action.approved_by = rejected_by
        action.approved_at = datetime.utcnow()

        log = ActivityLog(
            user_id=rejected_by,
            action="RESPONSE_REJECTED",
            description=f"Response action {action.action_uuid or action.id} ({action.action_type}) was REJECTED by {rejected_by}. Reason: {reason}",
            timestamp=datetime.utcnow()
        )
        db.add(log)
        db.commit()
        db.refresh(action)
        return action

    @staticmethod
    def execute_action(
        db: Session,
        incident_id: str,
        action_type: str,
        executed_by: str = "SOC Analyst",
        action_id: str = None,
        bypass_approval: bool = False
    ) -> Dict[str, Any]:
        """
        Executes a safe simulated remediation action.
        Verifies human approval status if required.
        """
        # If action_id is provided, look it up
        action_model = None
        if action_id:
            if str(action_id).isdigit():
                action_model = db.query(ResponseAction).filter(ResponseAction.id == int(action_id)).first()
            else:
                action_model = db.query(ResponseAction).filter(ResponseAction.action_uuid == str(action_id)).first()

        # If no existing action model, check if an action of this type exists in PENDING / APPROVED
        if not action_model:
            action_model = db.query(ResponseAction).filter(
                ResponseAction.incident_id == incident_id,
                ResponseAction.action_type == action_type
            ).order_by(ResponseAction.id.desc()).first()

        # Check approval requirement
        is_critical = action_type in CRITICAL_RESPONSE_ACTIONS
        if is_critical and not bypass_approval:
            if not action_model:
                action_model = ResponseService.create_pending_action(
                    db=db,
                    incident_id=incident_id,
                    action_type=action_type,
                    proposed_by=executed_by
                )
                return {
                    "action": action_type,
                    "action_id": action_model.action_uuid or f"ACT-{action_model.id:03d}",
                    "status": "PENDING_APPROVAL",
                    "approval_status": "PENDING_APPROVAL",
                    "result": f"Action '{action_type}' requires Human Approval from an Analyst/Admin before simulated execution."
                }
            elif action_model.status == "PENDING_APPROVAL":
                return {
                    "action": action_type,
                    "action_id": action_model.action_uuid or f"ACT-{action_model.id:03d}",
                    "status": "PENDING_APPROVAL",
                    "approval_status": "PENDING_APPROVAL",
                    "result": f"Action '{action_type}' requires Human Approval from an Analyst/Admin before simulated execution."
                }
            elif action_model.status == "REJECTED":
                return {
                    "action": action_type,
                    "action_id": action_model.action_uuid or f"ACT-{action_model.id:03d}",
                    "status": "REJECTED",
                    "approval_status": "REJECTED",
                    "result": f"Action '{action_type}' was REJECTED by analyst ({action_model.rejection_reason}). Cannot execute."
                }

        # Query incident details for simulation context
        incident = db.query(Incident).filter(Incident.incident_id == incident_id).first()
        target = "target asset"
        if incident:
            if incident.attacker:
                target = incident.attacker
            elif incident.affected_assets and isinstance(incident.affected_assets, list) and len(incident.affected_assets) > 0:
                target = incident.affected_assets[0].get("name", "unknown asset")

        # Safe Simulated Execution Messages (NEVER modifies actual OS/firewall)
        action_lower = action_type.lower()
        if "block" in action_lower:
            result_msg = f"Simulated: Perimeter firewall rule synthesized. Ingress traffic from {target} blocked on TCP/UDP 0-65535."
            description = f"Simulated blocking of malicious host/IP {target}."
        elif "isolate" in action_lower:
            result_msg = f"Simulated: EDR network containment policy enforced. Endpoint {target} isolated to SOC management VLAN."
            description = f"Simulated network isolation of asset {target}."
        elif "disable" in action_lower:
            result_msg = f"Simulated: Directory sync updated. AD account for {target} locked and active Kerberos tickets revoked."
            description = f"Simulated disabling of compromised user account."
        elif "reset" in action_lower:
            result_msg = f"Simulated: Credential rotation policy enforced for {target}. Forced password reset flag active."
            description = f"Simulated password reset and session invalidation."
        elif "firewall" in action_lower:
            result_msg = f"Simulated: Dynamic ACL injected. Drop rule active for subnet containing {target}."
            description = f"Simulated creation of perimeter firewall rule."
        elif "collect" in action_lower:
            result_msg = f"Simulated: Forensic capture complete. Process trees, network sockets, and volatile memory hashes collected from {target}."
            description = f"Simulated forensic evidence collection from {target}."
        else:
            result_msg = f"Simulated: General response action '{action_type}' safely simulated for {target}."
            description = f"Simulated execution of custom action: {action_type}."

        if not action_model:
            count = db.query(ResponseAction).count() + 1
            action_uuid = f"ACT-{count:03d}"
            action_model = ResponseAction(
                action_uuid=action_uuid,
                incident_id=incident_id,
                action_type=action_type,
                description=description,
                status="EXECUTED",
                requires_approval=is_critical,
                approved_by=executed_by,
                approved_at=datetime.utcnow(),
                executed_by=executed_by,
                execution_time=datetime.utcnow(),
                result=result_msg
            )
            db.add(action_model)
        else:
            action_model.status = "EXECUTED"
            action_model.executed_by = executed_by
            action_model.execution_time = datetime.utcnow()
            action_model.result = result_msg

        # Update Incident status to Contained / update timeline
        if incident:
            if incident.status == "Open":
                incident.status = "Contained"
            timeline = list(incident.timeline or [])
            timeline.append({
                "time": datetime.utcnow().strftime("%H:%M:%S"),
                "event": f"Simulated Response: '{action_type}' executed by {executed_by}."
            })
            incident.timeline = timeline
            incident.updated_at = datetime.utcnow()

        # Log Activity
        activity = ActivityLog(
            user_id=executed_by,
            action="RESPONSE_EXECUTED",
            description=f"Simulated response action '{action_type}' for incident {incident_id}.",
            timestamp=datetime.utcnow()
        )
        db.add(activity)
        db.commit()
        db.refresh(action_model)

        return {
            "action": action_type,
            "action_id": action_model.action_uuid or f"ACT-{action_model.id:03d}",
            "status": "Simulated",
            "approval_status": "APPROVED",
            "result": result_msg
        }
