"""
Comprehensive Frontend Integration & Verification Test
-------------------------------------------------------
Verifies that Next.js frontend is serving all pages, compiling without errors,
and successfully communicating with the FastAPI backend on port 8000.
"""

import sys
import httpx
from datetime import datetime

FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "http://127.0.0.1:8000"

def test_frontend():
    print("=" * 70)
    print(" AegisSOC AI - Frontend & Full Integration Verification Suite")
    print("=" * 70)

    client = httpx.Client(timeout=30.0)

    # 1. Test Backend Readiness
    print("\n[+] Checking Backend at " + BACKEND_URL + " ...")
    r = client.get(f"{BACKEND_URL}/")
    assert r.status_code == 200, f"Backend failed: {r.status_code}"
    print(f"    [OK] Backend Root: {r.json()['status']}")

    # 2. Test OpenAPI & Docs
    r = client.get(f"{BACKEND_URL}/openapi.json")
    assert r.status_code == 200, f"OpenAPI failed: {r.status_code}"
    print("    [OK] OpenAPI Schema accessible.")

    r = client.get(f"{BACKEND_URL}/docs")
    assert r.status_code == 200, f"Swagger Docs failed: {r.status_code}"
    print("    [OK] Swagger Docs accessible.")

    # 3. Test Frontend Pages
    print("\n[+] Testing Frontend Pages compilation and response at " + FRONTEND_URL + " ...")
    frontend_routes = [
        "/",
        "/login",
        "/dashboard",
        "/threats",
        "/incidents",
        "/agents",
        "/prediction",
        "/attack-graph",
        "/risk",
        "/network",
        "/reports",
        "/database"
    ]

    for route in frontend_routes:
        url = f"{FRONTEND_URL}{route}"
        r = client.get(url)
        assert r.status_code == 200, f"Route {route} failed with status {r.status_code}: {r.text[:200]}"
        print(f"    [OK] Page: {route.ljust(16)} -> 200 OK (Content-Length: {len(r.content)} bytes)")

    # 4. Test Frontend API Endpoints directly invoked by React client
    print("\n[+] Testing API Endpoints invoked by Frontend React Components...")
    api_tests = [
        ("/dashboard", "GET", "Dashboard Data"),
        ("/threats", "GET", "Threats List"),
        ("/threats/THR-001", "GET", "Threat Detail"),
        ("/incidents", "GET", "Incidents List"),
        ("/incidents/INC-001", "GET", "Incident Detail"),
        ("/agents", "GET", "AI Containment Agents"),
        ("/predictions", "GET", "Scikit-Learn Predictions"),
        ("/attack-graph", "GET", "Attack Graph Path Coordinates"),
        ("/risk", "GET", "Risk Metrics & Scoreboard"),
        ("/network", "GET", "Network Node Coordinates"),
        ("/reports", "GET", "Security Reports"),
        ("/reports/rep-001", "GET", "Report Metadata"),
        ("/reports/rep-001/download", "GET", "PDF Download"),
        ("/api/admin/database/status", "GET", "Database Health Check"),
        ("/api/admin/database/tables", "GET", "Database Schema Tables")
    ]

    for endpoint, method, label in api_tests:
        url = f"{BACKEND_URL}{endpoint}"
        r = client.get(url)
        assert r.status_code == 200, f"API {endpoint} failed with status {r.status_code}: {r.text[:200]}"
        print(f"    [OK] {label.ljust(32)} -> {endpoint.ljust(30)} [200 OK]")

    print("\n" + "=" * 70)
    print(" ALL FRONTEND & BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    try:
        test_frontend()
    except Exception as e:
        print(f"\n[!] Integration Test Failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
