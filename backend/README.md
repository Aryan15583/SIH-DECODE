# AegisSOC AI — Autonomous Security Operations Center Backend

FastAPI backend providing autonomous threat detection, event correlation, dynamic ML predictions, multi-agent orchestration, safe simulated remediation with human approval, and automated PDF report generation.

---

## 1. Technology Stack

* **Language**: Python 3.12
* **Web Framework**: FastAPI 0.110+ with Uvicorn
* **Relational Database**: PostgreSQL (via SQLAlchemy 2.0 & `psycopg2-binary`)
* **Document Store**: MongoDB (via `pymongo`)
* **Machine Learning**: Scikit-Learn (Random Forest Threat Classifier)
* **Report Generation**: ReportLab (PDF Engine)
* **Security & Auth**: JWT (`python-jose`), Passlib (`bcrypt`), RBAC (`admin`, `analyst`, `viewer`)

---

## 2. Project Structure

```text
backend/
├── database/
│   ├── connection.py        # PostgreSQL engine & session local
│   └── mongodb.py           # MongoDB connection & collection helpers
├── models/
│   ├── user.py              # User authentication & role
│   ├── alert.py             # Security alerts
│   ├── incident.py          # Security incidents & MITRE techniques
│   ├── security_event.py    # Structured security event metadata
│   ├── response_action.py   # Response actions & human approval state
│   ├── activity_log.py      # System audit logs
│   ├── agent.py             # Autonomous containment agent stats
│   └── report.py            # PDF report metadata
├── routes/
│   ├── auth.py              # JWT authentication & RBAC dependencies
│   ├── dashboard.py         # Consolidated telemetry & PDF downloads
│   ├── alerts.py            # Alert lifecycle management
│   ├── incidents.py         # Incident management & escalation
│   ├── events.py            # Security event ingestion (PostgreSQL + MongoDB)
│   ├── threats.py           # Threat intelligence feeds & AI analysis
│   ├── responses.py         # Human approval (approve, reject, execute)
│   └── database_admin.py    # Database inspection & health checks
├── schemas/                 # Pydantic validation schemas
├── services/
│   ├── threat_detection.py  # Rule-based detection engine
│   ├── risk_scoring.py      # Deterministic 0-100 risk scoring
│   ├── incident_service.py  # Multi-alert correlation engine
│   ├── ml_prediction.py     # Scikit-Learn ML threat predictor
│   ├── response_service.py  # Safe simulated actions & approval logic
│   ├── orchestration.py     # Multi-agent simulation loop
│   ├── report_service.py    # ReportLab automated PDF report generator
│   └── llm_service.py       # AI/LLM threat analysis with mock fallback
├── static/reports/          # Generated PDF reports storage
├── main.py                  # FastAPI application entrypoint
├── seed.py                  # Relational + Document database seeder
├── verify_apis.py           # Comprehensive 14-phase automated verification suite
├── requirements.txt         # Cleaned dependency requirements
└── .env.example             # Environment variable template
```

---

## 3. Quick Start (Windows 10)

### Step 1: Set Up Python 3.12 Virtual Environment
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Step 2: Ensure PostgreSQL & MongoDB Services Are Running
```powershell
Start-Service postgresql-x64-18
Start-Service MongoDB
```

### Step 3: Configure Environment
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

### Step 4: Seed Database
```powershell
python seed.py
```

### Step 5: Start FastAPI Backend
```powershell
python main.py
```
*API is accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000) and Swagger docs at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*

### Step 6: Run Comprehensive Verification Test Suite
In another terminal:
```powershell
python verify_apis.py
```

---

## 4. Default Seeded User Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@aegissoc.ai` | `admin123` | Full administrative control, user management, response approval, report generation |
| **Analyst** | `analyst@aegissoc.ai` | `analyst123` | Alert investigation, incident management, AI analysis, response approval & execution |
| **Viewer** | `viewer@aegissoc.ai` | `viewer123` | Read-only telemetry, reports, and dashboards |
