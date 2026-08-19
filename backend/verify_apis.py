"""
AegisSOC AI - Autonomous SOC Comprehensive Verification Suite
--------------------------------------------------------------
Tests the entire end-to-end SOC pipeline against live FastAPI backend,
PostgreSQL database, and MongoDB document store.
"""

import sys
import time
import httpx
from datetime import datetime, timezone

BASE_URL = "http://127.0.0.1:8000"

def get_utc_now_iso():
    return datetime.now(timezone.utc).isoformat()

def run_tests():
    print("=" * 70)
    print(" AegisSOC AI Autonomous SOC Backend Verification Suite")
    print("=" * 70)

    client = httpx.Client(base_url=BASE_URL, timeout=15.0)

    # -------------------------------------------------------------
    # 1. Health & Database Status (PostgreSQL + MongoDB)
    # -------------------------------------------------------------
    print("\n[1/14] Testing Root & Database Status...")
    r = client.get("/")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
    root_data = r.json()
    assert root_data["status"] == "online", "Backend not online"
    assert "PostgreSQL" in root_data["databases"]["relational"]
    assert "MongoDB" in root_data["databases"]["document_store"]
    print(f"    [+] Root status: {root_data}")

    # -------------------------------------------------------------
    # 2. Authentication & JWT Token Handling
    # -------------------------------------------------------------
    print("\n[2/14] Testing Authentication & Token Lifecycle...")
    test_email = f"analyst_{int(time.time())}@aegissoc.ai"
    reg_payload = {
        "name": "Alex Mercer",
        "email": test_email,
        "password": "SecurePassword123!",
        "role": "analyst"
    }
    r = client.post("/api/auth/register", json=reg_payload)
    assert r.status_code == 201, f"Register failed: {r.text}"
    user_data = r.json()
    assert user_data["email"] == test_email
    print(f"    [+] Registered analyst: {user_data['name']} ({user_data['role']})")

    # Login
    r = client.post("/api/auth/login", json={"email": test_email, "password": "SecurePassword123!"})
    assert r.status_code == 200, f"Login failed: {r.text}"
    analyst_token = r.json()["access_token"]
    analyst_headers = {"Authorization": f"Bearer {analyst_token}"}
    print(f"    [+] Analyst authenticated. Token: {analyst_token[:25]}...")

    # Verify /api/auth/me
    r = client.get("/api/auth/me", headers=analyst_headers)
    assert r.status_code == 200, f"/me failed: {r.text}"
    assert r.json()["email"] == test_email
    print("    [+] /api/auth/me verified.")

    # Login with seeded admin
    r = client.post("/api/auth/login", json={"email": "admin@aegissoc.ai", "password": "admin123"})
    assert r.status_code == 200, f"Admin login failed: {r.text}"
    admin_token = r.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("    [+] Admin authenticated.")

    # Login with seeded viewer
    r = client.post("/api/auth/login", json={"email": "viewer@aegissoc.ai", "password": "viewer123"})
    assert r.status_code == 200, f"Viewer login failed: {r.text}"
    viewer_token = r.json()["access_token"]
    viewer_headers = {"Authorization": f"Bearer {viewer_token}"}
    print("    [+] Viewer authenticated.")

    # -------------------------------------------------------------
    # 3. Database Administration & Health Status (PostgreSQL + MongoDB)
    # -------------------------------------------------------------
    print("\n[3/14] Testing Database Admin & Health Endpoint...")
    r = client.get("/api/admin/database/status", headers=admin_headers)
    assert r.status_code == 200, f"DB Status failed: {r.text}"
    db_status = r.json()
    assert db_status["postgresql"] == "connected", f"PostgreSQL not connected: {db_status}"
    assert db_status["mongodb"] == "connected", f"MongoDB not connected: {db_status}"
    print(f"    [+] PostgreSQL: {db_status['postgresql']}")
    print(f"    [+] MongoDB: {db_status['mongodb']} (DB: {db_status['mongodb_database']})")
    print(f"    [+] Total System Tables: {db_status['table_count']}")

    # -------------------------------------------------------------
    # 4. Role-Based Access Control (RBAC) Enforcement
    # -------------------------------------------------------------
    print("\n[4/14] Testing Role-Based Access Control (RBAC)...")
    # Viewer tries to execute a response -> Should be 403 Forbidden
    r = client.post("/api/responses/execute", json={"incident_id": "INC-001", "action_type": "Block IP"}, headers=viewer_headers)
    assert r.status_code == 403, f"Expected 403 for viewer, got {r.status_code}: {r.text}"
    print("    [+] Verified: Viewer cannot execute response actions (403 Forbidden).")

    # Viewer tries to delete an alert -> Should be 403 Forbidden
    r = client.delete("/api/alerts/ALT-001", headers=viewer_headers)
    assert r.status_code == 403, f"Expected 403 for viewer, got {r.status_code}: {r.text}"
    print("    [+] Verified: Viewer cannot delete alerts (403 Forbidden).")

    # -------------------------------------------------------------
    # 5. Dashboard Telemetry & Frontend Compatibility
    # -------------------------------------------------------------
    print("\n[5/14] Testing Dashboard Summary & Consolidated Schema...")
    r = client.get("/dashboard")
    assert r.status_code == 200, f"/dashboard failed: {r.text}"
    dash = r.json()
    assert "kpis" in dash and len(dash["kpis"]) >= 4, "KPIs missing in /dashboard"
    assert "agents" in dash and len(dash["agents"]) >= 3, "Agents missing in /dashboard"
    assert "predictions" in dash and len(dash["predictions"]) >= 3, "Predictions missing in /dashboard"
    assert "incidents" in dash, "Incidents missing in /dashboard"
    assert "dashboardGraph" in dash, "Attack graph missing in /dashboard"
    print(f"    [+] Retreived KPIs: {[k['label'] + '=' + str(k['value']) for k in dash['kpis']]}")
    print(f"    [+] Active AI Agents: {[a['name'] for a in dash['agents']]}")

    # -------------------------------------------------------------
    # 6. Event Ingestion (Dual Storage: PostgreSQL + MongoDB)
    # -------------------------------------------------------------
    print("\n[6/14] Testing Security Event Ingestion & MongoDB Document Store...")
    sim_ip = f"192.168.1.{int(time.time()) % 200 + 50}"
    for i in range(3):
        event_payload = {
            "event_type": "failed_login",
            "source": "AD-PRIMARY-CONTROLLER",
            "source_ip": sim_ip,
            "destination_ip": "192.168.1.10",
            "username": "root_admin",
            "hostname": "AD-PRIMARY-CONTROLLER",
            "message": f"Suspicious logon attempt {i+1} with wrong password.",
            "raw_data": f'{{"auth_protocol": "NTLMv2", "attempt": {i+1}, "port": 389}}',
            "timestamp": get_utc_now_iso()
        }
        r = client.post("/api/events", json=event_payload, headers=analyst_headers)
        assert r.status_code == 201, f"Event ingestion failed: {r.text}"

    ingest_res = r.json()
    assert ingest_res["status"] == "success"
    assert ingest_res["mongo_document_id"] is not None, "MongoDB document ID missing!"
    print(f"    [+] Ingested event in PostgreSQL (ID: {ingest_res['event_id']})")
    print(f"    [+] Stored raw JSON document in MongoDB (ID: {ingest_res['mongo_document_id']})")

    # -------------------------------------------------------------
    # 7. Threat Detection & Correlation Engine
    # -------------------------------------------------------------
    print("\n[7/14] Testing Autonomous Threat Detection & Incident Correlation...")
    assert len(ingest_res["alerts_generated"]) > 0, "No alerts generated from brute-force attempts!"
    new_alert_id = ingest_res["alerts_generated"][0]
    new_incident_id = ingest_res["incidents_affected"][0]
    print(f"    [+] Detection Engine generated Alert: {new_alert_id}")
    print(f"    [+] Correlation Engine linked to Incident: {new_incident_id}")

    # -------------------------------------------------------------
    # 8. ML Threat Prediction Model (Scikit-Learn)
    # -------------------------------------------------------------
    print("\n[8/14] Testing ML Threat Prediction Inference...")
    r = client.get("/predictions")
    assert r.status_code == 200, f"/predictions failed: {r.text}"
    preds = r.json()
    print(f"    [+] ML Dynamic Predictions: {preds}")
    assert any(p["label"] == "Lateral Movement" for p in preds), "Lateral Movement prediction missing"

    # -------------------------------------------------------------
    # 9. AI Threat Analysis & Fallback
    # -------------------------------------------------------------
    print("\n[9/14] Testing AI Threat Analysis & Threat Intel Verification...")
    r = client.post("/api/threats/analyze", json={"alert_id": new_alert_id})
    assert r.status_code == 200, f"AI analyze failed: {r.text}"
    ai_analysis = r.json()
    print(f"    [+] AI Threat Type: {ai_analysis.get('threat_type')}")
    print(f"    [+] AI Explanation: {ai_analysis.get('explanation')}")

    # Threat Intel Feed check
    r = client.post("/api/threats/check", json={"indicator": "185.190.140.23"})
    assert r.status_code == 200
    assert r.json()["found"] is True, "Known malicious IP not flagged by threat intel!"
    print(f"    [+] Threat Intel Match: {r.json()['description']}")

    # -------------------------------------------------------------
    # 10. Response Playbook Recommendations
    # -------------------------------------------------------------
    print("\n[10/14] Testing Response Recommendations...")
    r = client.post("/api/responses/recommend", json={"incident_id": new_incident_id})
    assert r.status_code == 200, f"Recommend failed: {r.text}"
    recs = r.json()["recommendations"]
    print(f"    [+] Recommended Playbooks: {recs}")
    assert len(recs) > 0, "No recommendations returned"

    # -------------------------------------------------------------
    # 11. Human Approval Workflow (Pending -> Approved -> Safe Simulation)
    # -------------------------------------------------------------
    print("\n[11/14] Testing Human Approval State Machine & Safe Simulation...")
    # 1. Queue a critical response action (Disable User)
    r_act = client.post("/api/responses/execute", json={"incident_id": new_incident_id, "action_type": "Disable User"}, headers=analyst_headers)
    assert r_act.status_code == 200
    act_data = r_act.json()
    target_action_id = act_data.get("action_id")
    assert target_action_id is not None
    print(f"    [+] Critical action {target_action_id} (Disable User) queued.")

    # 2. Analyst approves action
    r_app = client.post(f"/api/responses/{target_action_id}/approve", json={"comments": "Verified host anomaly by SOC Analyst."}, headers=analyst_headers)
    assert r_app.status_code == 200
    assert r_app.json()["status"] == "APPROVED"
    print(f"    [+] Action {target_action_id} successfully APPROVED by Analyst ({r_app.json()['approved_by']}).")

    # 3. Safe simulated execution
    r_exec = client.post(f"/api/responses/{target_action_id}/execute", headers=analyst_headers)
    assert r_exec.status_code == 200
    exec_data = r_exec.json()
    assert exec_data["status"] == "Simulated"
    print(f"    [+] Safe Simulated Execution: {exec_data['result']}")

    # 4. Test Rejection flow on another critical action (Disable User)
    r_queue = client.post("/api/responses/execute", json={"incident_id": new_incident_id, "action_type": "Disable User"}, headers=analyst_headers)
    rej_id = r_queue.json()["action_id"]
    r_rej = client.post(f"/api/responses/{rej_id}/reject", json={"reason": "False positive user anomaly."}, headers=analyst_headers)
    assert r_rej.status_code == 200
    assert r_rej.json()["status"] == "REJECTED"
    print(f"    [+] Action {rej_id} successfully marked REJECTED (Reason: {r_rej.json()['rejection_reason']}).")

    # -------------------------------------------------------------
    # 12. Automated PDF Report Generation & Download
    # -------------------------------------------------------------
    print("\n[12/14] Testing Automated PDF Report Generation...")
    gen_payload = {
        "type": "Incident",
        "incident_id": new_incident_id
    }
    r = client.post("/api/reports/generate", json=gen_payload, headers=analyst_headers)
    assert r.status_code == 200, f"Generate report failed: {r.text}"
    rep_res = r.json()
    report_id = rep_res["report_id"]
    print(f"    [+] Generated Incident PDF Report: {report_id} ({rep_res['name']})")

    # Download PDF
    r = client.get(f"/reports/{report_id}/download")
    assert r.status_code == 200, f"Download PDF failed: {r.text}"
    assert r.headers.get("content-type") == "application/pdf"
    assert len(r.content) > 500, "Downloaded PDF is empty"
    print(f"    [+] Successfully downloaded generated PDF ({len(r.content)} bytes).")

    # -------------------------------------------------------------
    # 13. Audit & Activity Logging
    # -------------------------------------------------------------
    print("\n[13/14] Testing Security Audit Logs...")
    r = client.get("/api/activity-logs")
    assert r.status_code == 200, f"Activity logs failed: {r.text}"
    logs = r.json()
    assert len(logs) > 0, "Activity logs list is empty"
    print(f"    [+] Retreived {len(logs)} audit entries. Latest action: {logs[0]['action']} by {logs[0]['user_id']}")

    # -------------------------------------------------------------
    # 14. Full Frontend Contract Route Coverage
    # -------------------------------------------------------------
    print("\n[14/14] Verifying All Frontend Contract Routes...")
    contract_endpoints = [
        "/dashboard",
        "/threats",
        "/threats/THR-001",
        "/incidents",
        "/incidents/INC-001",
        "/agents",
        "/predictions",
        "/attack-graph",
        "/risk",
        "/network",
        "/reports",
        "/reports/rep-001"
    ]
    for ep in contract_endpoints:
        r = client.get(ep)
        assert r.status_code == 200, f"Contract endpoint {ep} failed with {r.status_code}: {r.text}"
        print(f"    [OK] {ep} -> 200 OK")

    print("\n" + "=" * 70)
    print(" ALL 14 VERIFICATION PHASES PASSED WITH ZERO ERRORS!")
    print(" Autonomous SOC Backend is 100% operational, secure, and compliant.")
    print("=" * 70)

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"\n[!] Verification Failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
