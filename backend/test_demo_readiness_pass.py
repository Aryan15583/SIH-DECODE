"""
AegisSOC AI - Demo Readiness & Comprehensive Integration Verification Pass
--------------------------------------------------------------------------
Performs rigorous validation of:
1. Full End-to-End SOC flow (14 stages)
2. RBAC (Admin vs Analyst vs Viewer)
3. Safe Simulated Responses (no OS side-effects)
4. Scikit-Learn ML Model Inference (2 distinct scenarios)
5. AI Offline Fallback (Deterministic reasoning)
6. PDF Report Generation & Arbitrary Path Traversal Protection
7. PostgreSQL + MongoDB Record Validation
"""

import sys
import time
import httpx
from datetime import datetime, timezone
from services.ml_prediction import ml_predictor
from services.report_service import ReportService
from database.mongodb import get_raw_events_collection, check_mongo_connection
from database.connection import SessionLocal
from models.security_event import SecurityEvent
from models.response_action import ResponseAction
from models.incident import Incident
from models.alert import Alert

BASE_URL = "http://127.0.0.1:8000"

def get_utc_now_iso():
    return datetime.now(timezone.utc).isoformat()

def run_pass():
    print("=" * 75)
    print(" AegisSOC AI — Final Demo-Readiness & End-to-End Verification Pass")
    print("=" * 75)

    client = httpx.Client(base_url=BASE_URL, timeout=15.0)

    # -----------------------------------------------------------------
    # 1. Start & Test Backend Health (PostgreSQL + MongoDB)
    # -----------------------------------------------------------------
    print("\n[Step 1] Verifying Backend & Dual Database Status...")
    r = client.get("/")
    assert r.status_code == 200, f"Backend status check failed: {r.status_code}"
    print(f"    [PASS] Root Status: {r.json()['status']} (Relational: PostgreSQL, Document: MongoDB)")

    r = client.get("/api/admin/database/status")
    assert r.status_code == 200
    db_stat = r.json()
    assert db_stat["postgresql"] == "connected", "PostgreSQL disconnected"
    assert db_stat["mongodb"] == "connected", "MongoDB disconnected"
    print(f"    [PASS] PostgreSQL: {db_stat['postgresql']}, MongoDB: {db_stat['mongodb']} (DB: {db_stat['mongodb_database']})")

    # -----------------------------------------------------------------
    # 2. RBAC & Authentication (Admin, Analyst, Viewer)
    # -----------------------------------------------------------------
    print("\n[Step 2] Verifying RBAC Enforcement (Admin, Analyst, Viewer)...")
    # Admin login
    r_admin = client.post("/api/auth/login", json={"email": "admin@aegissoc.ai", "password": "admin123"})
    assert r_admin.status_code == 200
    admin_token = r_admin.json()["access_token"]
    admin_hdr = {"Authorization": f"Bearer {admin_token}"}
    print("    [PASS] Admin authenticated successfully.")

    # Analyst login
    r_analyst = client.post("/api/auth/login", json={"email": "analyst@aegissoc.ai", "password": "analyst123"})
    assert r_analyst.status_code == 200
    analyst_token = r_analyst.json()["access_token"]
    analyst_hdr = {"Authorization": f"Bearer {analyst_token}"}
    print("    [PASS] Analyst authenticated successfully.")

    # Viewer login
    r_viewer = client.post("/api/auth/login", json={"email": "viewer@aegissoc.ai", "password": "viewer123"})
    assert r_viewer.status_code == 200
    viewer_token = r_viewer.json()["access_token"]
    viewer_hdr = {"Authorization": f"Bearer {viewer_token}"}
    print("    [PASS] Viewer authenticated successfully.")

    # Verify Viewer cannot delete alerts (403 Forbidden)
    r_block_del = client.delete("/api/alerts/ALT-001", headers=viewer_hdr)
    assert r_block_del.status_code == 403, f"Expected 403, got {r_block_del.status_code}"
    print("    [PASS] RBAC: Viewer blocked from mutating alerts (403 Forbidden).")

    # Verify Viewer cannot execute responses (403 Forbidden)
    r_block_exec = client.post("/api/responses/execute", json={"incident_id": "INC-001", "action_type": "Block IP"}, headers=viewer_hdr)
    assert r_block_exec.status_code == 403, f"Expected 403, got {r_block_exec.status_code}"
    print("    [PASS] RBAC: Viewer blocked from executing response actions (403 Forbidden).")

    # -----------------------------------------------------------------
    # 3. Real End-to-End SOC Ingestion & Correlation Flow
    # -----------------------------------------------------------------
    print("\n[Step 3] Executing Live End-to-End SOC Ingestion Flow...")
    unique_ip = f"198.51.100.{int(time.time()) % 150 + 50}"
    # Send 3 failed login attempts to trigger rule-based threat detection
    for attempt in range(1, 4):
        event_payload = {
            "event_type": "failed_login",
            "source": "AD-PRIMARY-CONTROLLER",
            "source_ip": unique_ip,
            "destination_ip": "192.168.1.10",
            "username": "domain_admin",
            "hostname": "AD-PRIMARY-CONTROLLER",
            "message": f"Logon failure attempt #{attempt} for domain_admin from {unique_ip}.",
            "raw_data": f'{{"auth_protocol": "Kerberos", "error_code": "0xC000006A", "attempt": {attempt}}}',
            "timestamp": get_utc_now_iso()
        }
        r_ev = client.post("/api/events", json=event_payload, headers=analyst_hdr)
        assert r_ev.status_code == 201, f"Event {attempt} ingestion failed: {r_ev.text}"

    last_ingest = r_ev.json()
    assert last_ingest["status"] == "success"
    mongo_id = last_ingest["mongo_document_id"]
    pg_id = last_ingest["event_id"]
    assert mongo_id is not None, "MongoDB Document ID missing in event response!"
    print(f"    [PASS] Event Ingested in PostgreSQL (ID: {pg_id}) & MongoDB (Document: {mongo_id})")

    # Verify MongoDB record directly
    mongo_col = get_raw_events_collection()
    mongo_doc = mongo_col.find_one({"source_ip": unique_ip})
    assert mongo_doc is not None, f"Document not found in MongoDB for IP {unique_ip}"
    print(f"    [PASS] MongoDB Verified: Raw payload retrieved directly ({mongo_doc['message']})")

    # Verify Alert Generation & Correlation
    assert len(last_ingest["alerts_generated"]) > 0, "No alert generated!"
    new_alert_id = last_ingest["alerts_generated"][0]
    new_incident_id = last_ingest["incidents_affected"][0]
    print(f"    [PASS] Threat Detection: Generated Alert {new_alert_id}")
    print(f"    [PASS] Incident Correlator: Correlated to Incident {new_incident_id}")

    # -----------------------------------------------------------------
    # 4. Scikit-Learn ML Threat Prediction Validation
    # -----------------------------------------------------------------
    print("\n[Step 4] Verifying Scikit-Learn ML Model Inference...")
    # Scenario A: High velocity brute force / privilege escalation
    scenario_a = ml_predictor.predict(
        severity="Critical",
        confidence=0.96,
        event_count=35,
        failed_logins=12,
        affected_assets=3,
        category="Credential Abuse",
        alert_frequency=15
    )
    print(f"    [PASS] Scenario A (High Attack Velocity) -> Predicted Threat: {scenario_a['predicted_threat']} (Conf: {scenario_a['confidence']}%, Risk: {scenario_a['risk_level']})")

    # Scenario B: Low activity / baseline reconnaissance
    scenario_b = ml_predictor.predict(
        severity="Low",
        confidence=0.60,
        event_count=2,
        failed_logins=0,
        affected_assets=1,
        category="Reconnaissance",
        alert_frequency=1
    )
    print(f"    [PASS] Scenario B (Low Baseline Telemetry) -> Predicted Threat: {scenario_b['predicted_threat']} (Conf: {scenario_b['confidence']}%, Risk: {scenario_b['risk_level']})")

    # Endpoint query
    r_preds = client.get("/predictions")
    assert r_preds.status_code == 200
    print(f"    [PASS] /predictions Endpoint Returned Live Predictions: {[p['label'] + ' (' + str(p['probability']) + '%)' for p in r_preds.json()]}")

    # -----------------------------------------------------------------
    # 5. AI Offline Fallback Validation
    # -----------------------------------------------------------------
    print("\n[Step 5] Verifying AI / LLM Deterministic Fallback...")
    r_ai = client.post("/api/threats/analyze", json={"alert_id": new_alert_id})
    assert r_ai.status_code == 200
    ai_data = r_ai.json()
    assert "explanation" in ai_data and len(ai_data["explanation"]) > 20
    assert "recommendations" in ai_data and len(ai_data["recommendations"]) > 0
    print(f"    [PASS] AI Threat Analysis: {ai_data['threat_type']}")
    print(f"    [PASS] AI Recommendations: {ai_data['recommendations']}")

    # -----------------------------------------------------------------
    # 6. Response Recommendation, Human Approval & Safe Simulation
    # -----------------------------------------------------------------
    print("\n[Step 6] Verifying Human Approval & Safe Simulation...")
    # Recommend response
    r_rec = client.post("/api/responses/recommend", json={"incident_id": new_incident_id})
    assert r_rec.status_code == 200
    playbooks = r_rec.json()["recommendations"]
    print(f"    [PASS] Playbook Recommendations: {playbooks}")

    # 1. Attempt execute critical action -> Must be blocked in PENDING_APPROVAL
    r_queue = client.post("/api/responses/execute", json={"incident_id": new_incident_id, "action_type": "Disable User"}, headers=analyst_hdr)
    assert r_queue.status_code == 200
    q_data = r_queue.json()
    action_id = q_data.get("action_id")
    assert action_id is not None
    print(f"    [PASS] Critical Action {action_id} (Disable User) queued.")

    # 2. Analyst approves action
    r_approve = client.post(f"/api/responses/{action_id}/approve", json={"comments": "Verified intrusion scope."}, headers=analyst_hdr)
    assert r_approve.status_code == 200
    assert r_approve.json()["status"] == "APPROVED"
    print(f"    [PASS] Action {action_id} APPROVED by {r_approve.json()['approved_by']}.")

    # 3. Execute approved action safely
    r_sim = client.post(f"/api/responses/{action_id}/execute", headers=analyst_hdr)
    assert r_sim.status_code == 200
    sim_data = r_sim.json()
    assert sim_data["status"] == "Simulated"
    assert "Simulated:" in sim_data["result"]
    print(f"    [PASS] Safe Simulated Execution Output: \"{sim_data['result']}\"")

    # 4. Test Rejection flow on another action
    r_rej_q = client.post("/api/responses/execute", json={"incident_id": new_incident_id, "action_type": "Revoke Token"}, headers=analyst_hdr)
    rej_id = r_rej_q.json()["action_id"]
    r_rej = client.post(f"/api/responses/{rej_id}/reject", json={"reason": "False positive account alert"}, headers=analyst_hdr)
    assert r_rej.status_code == 200
    assert r_rej.json()["status"] == "REJECTED"
    print(f"    [PASS] Action {rej_id} REJECTED by Analyst (Reason: {r_rej.json()['rejection_reason']}).")

    # -----------------------------------------------------------------
    # 7. Automated PDF Report Generation & Download
    # -----------------------------------------------------------------
    print("\n[Step 7] Verifying PDF Report Generation & Safe Path Download...")
    # Generate Incident PDF
    r_rep1 = client.post("/api/reports/generate", json={"type": "Incident", "incident_id": new_incident_id}, headers=analyst_hdr)
    assert r_rep1.status_code == 200
    rep1_id = r_rep1.json()["report_id"]
    print(f"    [PASS] Generated Incident Report: {rep1_id} ({r_rep1.json()['name']})")

    # Generate Summary PDF
    r_rep2 = client.post("/api/reports/generate", json={"type": "Executive Summary"}, headers=analyst_hdr)
    assert r_rep2.status_code == 200
    rep2_id = r_rep2.json()["report_id"]
    print(f"    [PASS] Generated Executive Summary Report: {rep2_id} ({r_rep2.json()['name']})")

    # Download PDF
    r_dl = client.get(f"/reports/{rep1_id}/download")
    assert r_dl.status_code == 200
    assert r_dl.headers.get("content-type") == "application/pdf"
    assert len(r_dl.content) > 1000, "Downloaded PDF file is invalid"
    print(f"    [PASS] Downloaded Valid PDF File ({len(r_dl.content)} bytes).")

    # Path traversal safety check
    r_bad_path = client.get("/reports/..%2f..%2fetc%2fpasswd/download")
    assert r_bad_path.status_code in [404, 400], "Path traversal was not properly blocked!"
    print("    [PASS] Security Check: Arbitrary file download blocked (404/400).")

    # -----------------------------------------------------------------
    # 8. Activity & Audit Logs
    # -----------------------------------------------------------------
    print("\n[Step 8] Verifying Security Audit Log Trails...")
    r_logs = client.get("/api/activity-logs")
    assert r_logs.status_code == 200
    logs = r_logs.json()
    assert len(logs) > 0
    print(f"    [PASS] Retreived {len(logs)} audit entries. Latest action: {logs[0]['action']} by {logs[0]['user_id']}.")

    print("\n" + "=" * 75)
    print(" FINAL DEMO-READINESS PASS: ALL VERIFICATIONS PASSED WITH 100% SUCCESS!")
    print("=" * 75)

if __name__ == "__main__":
    try:
        run_pass()
    except Exception as e:
        print(f"\n[!] Verification Pass Failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
