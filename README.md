# AegisSOC AI — Autonomous Security Operations Center (SIH-DECODE)

A comprehensive Autonomous SOC platform built for SIH with Next.js/React frontend and Python FastAPI backend, backed by PostgreSQL, MongoDB, Scikit-Learn ML threat prediction, AI/LLM reasoning, safe response simulation with human approval, and automated PDF report generation.

---

## Architecture

```text
                    AUTONOMOUS SOC
                           │
                    React/Next.js Frontend
                           │
                       REST API
                           │
                       FastAPI
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   PostgreSQL           MongoDB          AI Layer
        │                  │             ┌────┴────┐
        │                  │            LLM       ML
        │                  │
        └──────────┬───────┘
                   │
             SOC Services
                   │
       ┌───────────┼────────────┐
       │           │            │
 Detection      Risk       Orchestration
       │           │            │
       └───────────┼────────────┘
                   │
             Incident
                   │
          Response Recommendation
                   │
            Human Approval
                   │
          Safe Simulated Response
                   │
              Audit Log
                   │
              PDF Report
```

---

## How to Run

### 1. Start Database Services
Ensure PostgreSQL and MongoDB services are running:
```powershell
Start-Service postgresql-x64-18
Start-Service MongoDB
```

### 2. Run Backend
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python seed.py
python main.py
```
*Backend runs on `http://127.0.0.1:8000` (Docs: `http://127.0.0.1:8000/docs`)*

### 3. Run Frontend
```powershell
cd FRONTEND
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

### 4. Run Automated Backend Verification
```powershell
cd backend
python verify_apis.py
```