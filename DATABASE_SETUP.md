# AegisSOC AI — Dual Database Setup Guide (PostgreSQL + MongoDB)

This document outlines how the database layer is structured, configured, and inspected in **AegisSOC AI**.

---

## 1. Architecture Overview

AegisSOC AI implements a hybrid database model:

```
┌─────────────────────────────────────────────────────────────┐
│                    AegisSOC AI Data Layer                   │
├──────────────────────────────┬──────────────────────────────┤
│    PostgreSQL (Relational)   │    MongoDB (Document Store)  │
├──────────────────────────────┼──────────────────────────────┤
│ • Users & RBAC               │ • Raw Security Events        │
│ • Correlated Incidents       │ • Raw Syslog / EDR Payloads  │
│ • Security Alerts            │ • Threat Intelligence Feeds  │
│ • AI Containment Agents      │ • AI Analysis Context Logs   │
│ • Response Actions           │ • Unstructured JSON Objects  │
│ • Audit & Activity Logs      │                              │
│ • Generated PDF Reports      │                              │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 2. Database Specifications

### A. PostgreSQL (Primary Relational Database)
* **Engine**: PostgreSQL 12.0+ (Tested with PostgreSQL 18.x)
* **Driver**: SQLAlchemy 2.0+ with `psycopg2-binary`
* **Default Database**: `aegis_soc`
* **Default Port**: `5432`
* **Connection String**: `postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/aegis_soc`

### B. MongoDB (Document Store)
* **Engine**: MongoDB 6.0+ / 7.0+
* **Driver**: `pymongo`
* **Default Database**: `aegis_soc`
* **Default Port**: `27017`
* **Connection String**: `mongodb://localhost:27017`
* **Collections**: `raw_security_events`, `threat_intelligence`, `ai_analysis_logs`

---

## 3. Configuration (`backend/.env`)

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/aegis_soc

MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=aegis_soc

JWT_SECRET=supersecretjwtkeyforlocaldevelopmentonlychangeinprod
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

FRONTEND_URL=http://localhost:3000

LLM_API_KEY=
DEV_MODE=true
```

---

## 4. How to Start Databases on Windows 10

### 1. PostgreSQL Service
```powershell
# Check service status
Get-Service postgresql*

# Start service
Start-Service postgresql-x64-18
```

### 2. MongoDB Service
```powershell
# Check service status
Get-Service MongoDB

# Start service
Start-Service MongoDB
```

### 3. Create PostgreSQL Database if not exists:
```powershell
psql -U postgres -c "CREATE DATABASE aegis_soc;"
```

---

## 5. Seed Database & Generate Sample Reports

To populate PostgreSQL and MongoDB with initial high-fidelity SOC scenarios:

```powershell
cd backend
python seed.py
```

Seeded credentials:
* **Admin**: `admin@aegissoc.ai` / `admin123` (Role: `admin`)
* **Analyst**: `analyst@aegissoc.ai` / `analyst123` (Role: `analyst`)
* **Viewer**: `viewer@aegissoc.ai` / `viewer123` (Role: `viewer`)

---

## 6. Inspecting the Database

* **Integrated Web Console**: Log in at `http://localhost:3000/login` and visit `http://localhost:3000/database`
* **Health API**: `GET http://localhost:8000/api/admin/database/status`
* **Swagger UI**: `http://localhost:8000/docs`
