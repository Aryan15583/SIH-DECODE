# AegisSOC AI — Frontend-Backend API Contract Spec

This spec outlines the exact endpoints, request options, and JSON response models required by the frontend client. The future backend application must implement these API endpoints.

All JSON properties are case-sensitive. All endpoints must return `application/json`.

---

## 1. Authentication Configuration
The frontend API client centrally attaches authentication header properties if a token is present in the browser:
```http
Authorization: Bearer <jwt-token>
```

---

## 2. API Schema Reference

### Common Entities

#### Severity
```typescript
type Severity = "Critical" | "High" | "Medium" | "Low";
```

#### ThreatStatus
```typescript
type ThreatStatus = "Active" | "Investigating" | "Monitoring" | "Contained" | "Resolved";
```

#### AgentStatus
```typescript
type AgentStatus = "Idle" | "Running" | "Paused" | "Success" | "Failed";
```

#### KPI
```json
{
  "label": "Security Score",
  "value": "87",
  "suffix": "/100",
  "trend": "Good",
  "trendDir": "flat",
  "tone": "success"
}
```

#### GraphNode
```json
{
  "id": "node-1",
  "label": "Internal Database",
  "type": "database",
  "x": 45,
  "y": 62,
  "critical": true
}
```

#### GraphEdge
```json
{
  "from": "node-1",
  "to": "node-2",
  "severity": "High"
}
```

---

## 3. Endpoints Spec

### GET `/dashboard`
Fetch primary telemetry metrics, activities, and preview lists for the dashboard page.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
{
  "kpis": [
    { "label": "Security Score", "value": "87", "suffix": "/100", "tone": "success" },
    { "label": "Active Threats", "value": "12", "tone": "danger" },
    { "label": "Critical Incidents", "value": "3", "tone": "danger" },
    { "label": "At-Risk Users", "value": "17", "tone": "warning" },
    { "label": "Compromised Devices", "value": "4", "tone": "primary" }
  ],
  "liveThreatActivity": [
    { "time": "00:00", "events": 12 },
    { "time": "02:00", "events": 16 }
  ],
  "predictions": [
    { "label": "Lateral Movement", "probability": 87, "trend": "up" }
  ],
  "agents": [
    {
      "id": "agent-1",
      "name": "Investigation Agent",
      "status": "Running",
      "currentTask": "Analyzing process trees...",
      "icon": "search"
    }
  ],
  "incidents": [
    {
      "id": "INC-001",
      "title": "Credential Dumping",
      "severity": "Critical",
      "status": "Active",
      "firstSeen": "10:12"
    }
  ],
  "dashboardGraph": {
    "nodes": [],
    "edges": []
  }
}
```

---

### GET `/threats`
Fetch list of active or monitored security threats.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
[
  {
    "id": "THR-001",
    "name": "Malware Outbreak",
    "severity": "High",
    "asset": "WORKSTATION-04",
    "user": "alice.smith",
    "aiConfidence": 92,
    "status": "Active",
    "firstSeen": "2026-08-15T08:00:00Z",
    "lastActivity": "2026-08-15T08:05:00Z",
    "type": "Malware",
    "source": "EDR Agent"
  }
]
```

---

### GET `/threats/:id`
Fetch single threat record.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
{
  "id": "THR-001",
  "name": "Malware Outbreak",
  "severity": "High",
  "asset": "WORKSTATION-04",
  "user": "alice.smith",
  "aiConfidence": 92,
  "status": "Active",
  "firstSeen": "2026-08-15T08:00:00Z",
  "lastActivity": "2026-08-15T08:05:00Z",
  "type": "Malware",
  "source": "EDR Agent",
  "reasons": [
    "Process spawned an obfuscated PowerShell session",
    "Network egress to known malicious command server"
  ],
  "timeline": [
    { "time": "08:00:00", "event": "Threat pattern observed" }
  ],
  "evidence": "Raw event logs and process paths."
}
```

---

### GET `/incidents`
Fetch list of security incidents.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
[
  {
    "id": "INC-001",
    "title": "Database Credential Abuse",
    "severity": "Critical",
    "status": "Active",
    "firstSeen": "10:12"
  }
]
```

---

### GET `/incidents/:id`
Fetch single incident record.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
{
  "id": "INC-001",
  "title": "Database Credential Abuse",
  "severity": "Critical",
  "status": "Active",
  "aiConfidence": 96,
  "firstSeen": "2026-08-15T10:12:00Z",
  "lastSeen": "2026-08-15T10:20:00Z",
  "attacker": "185.190.140.23",
  "attackerLocation": "Netherlands",
  "affectedAssets": [
    { "id": "db-01", "name": "Prod Customer DB", "type": "database" }
  ],
  "timeline": [
    { "time": "10:12:00", "event": "Anomalous database login" }
  ],
  "aiSummary": "Investigation confirms unauthorized database access using compromise credential lease.",
  "mitreTechniques": [
    { "id": "T1110", "name": "Brute Force" }
  ],
  "recommendedActions": [
    "Isolate Database Instance",
    "Revoke DB Account Permissions"
  ],
  "evidence": "Detailed telemetry logs and trace logs."
}
```

---

### GET `/agents`
Fetch status list of active AI Containment Agents.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
[
  {
    "id": "agent-1",
    "name": "Investigation Agent",
    "status": "Running",
    "currentTask": "Decompiling malware payload...",
    "icon": "search"
  }
]
```

---

### GET `/predictions`
Fetch list of predicted attacker actions.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
[
  { "label": "Lateral Movement", "probability": 87, "trend": "up" }
]
```

---

### GET `/attack-graph`
Fetch network attack path coordinates.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
{
  "nodes": [
    { "id": "db-01", "label": "Database", "type": "database", "x": 50, "y": 60 }
  ],
  "edges": [
    { "from": "malware-01", "to": "db-01", "severity": "Critical" }
  ]
}
```

---

### GET `/risk`
Fetch risk profiles and recommendations scoreboards.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
{
  "domains": [
    { "domain": "Endpoints", "score": 82 }
  ],
  "recommendations": [
    { "id": "rec-1", "label": "Enforce MFA on all users", "impact": "High", "reduction": "15%" }
  ],
  "trend": [
    { "month": "Jan", "score": 78 }
  ],
  "history": [
    { "day": "Mon", "incidents": 2 }
  ]
}
```

---

### GET `/network`
Fetch network map coordinates.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
{
  "nodes": [
    { "id": "office", "label": "Main HQ Office", "sub": "192.168.1.0/24", "x": 20, "y": 50 }
  ],
  "connections": [
    { "from": "office", "to": "network" }
  ]
}
```

---

### GET `/reports`
Fetch list of generated PDF security audits.

* **Response Code**: `200 OK`
* **Response Payload**:
```json
[
  {
    "id": "rep-001",
    "name": "Weekly Compliance Audit",
    "type": "Compliance",
    "severity": "High",
    "timestamp": "2026-08-15 12:00",
    "status": "Ready"
  }
]
```

---

## 4. Error Payloads
In the event of database or processing issues, APIs should return a payload with an appropriate HTTP status code (e.g. `500` or `404`) containing:
```json
{
  "message": "Detailed explanation of failure"
}
```
If the backend is not running, the frontend handles fetch network failures locally, rendering inline error containers.
