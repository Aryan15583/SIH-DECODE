import type {
  Agent,
  Threat,
  Incident,
  Prediction,
  Report,
  GraphNode,
  GraphEdge,
} from "@/types";

export const kpis = [
  { label: "Security Score", value: "87", suffix: "/100", trend: "Good", trendDir: "flat" as const, tone: "success" as const },
  { label: "Active Threats", value: "12", trend: "22%", trendDir: "down" as const, tone: "danger" as const },
  { label: "Critical Incidents", value: "3", trend: "30%", trendDir: "down" as const, tone: "danger" as const },
  { label: "At-Risk Users", value: "17", trend: "17%", trendDir: "down" as const, tone: "warning" as const },
  { label: "Compromised Devices", value: "4", trend: "30%", trendDir: "up" as const, tone: "primary" as const },
];

export const liveThreatActivity = [
  { time: "00:00", events: 14 }, { time: "02:00", events: 9 }, { time: "04:00", events: 6 },
  { time: "06:00", events: 11 }, { time: "08:00", events: 22 }, { time: "10:00", events: 31 },
  { time: "12:00", events: 27 }, { time: "14:00", events: 38 }, { time: "16:00", events: 33 },
  { time: "18:00", events: 24 }, { time: "20:00", events: 18 }, { time: "22:00", events: 15 },
];

export const predictions: Prediction[] = [
  { label: "Lateral Movement", probability: 87, trend: "up" },
  { label: "Data Exfiltration", probability: 64, trend: "up" },
  { label: "Account Takeover", probability: 41, trend: "flat" },
  { label: "Privilege Escalation", probability: 33, trend: "down" },
];

export const agents: Agent[] = [
  {
    id: "soc-analyst",
    name: "SOC Analyst",
    role: "Orchestration",
    description: "Coordinates every autonomous agent and prioritizes the SOC queue in real time.",
    status: "Active",
    progress: 82,
    tasksCompleted: 124,
    incidentsInvestigated: 28,
    accuracy: 96,
    currentTask: "Triaging 6 new alerts from Server-22",
    lastActivity: "2 min ago",
    icon: "user-cog",
  },
  {
    id: "detection",
    name: "Detection Agent",
    role: "Detection",
    description: "Watches telemetry across endpoints, identity and network for anomalous behavior.",
    status: "Active",
    progress: 91,
    tasksCompleted: 341,
    incidentsInvestigated: 52,
    accuracy: 94,
    currentTask: "Scanning PC-104 for encryption behavior",
    lastActivity: "Just now",
    icon: "radar",
  },
  {
    id: "correlation",
    name: "Correlation Agent",
    role: "Correlation",
    description: "Links related alerts across sources into a single coherent incident narrative.",
    status: "Active",
    progress: 76,
    tasksCompleted: 118,
    incidentsInvestigated: 44,
    accuracy: 93,
    currentTask: "Correlating INC-2048 with 3 related alerts",
    lastActivity: "1 min ago",
    icon: "waypoints",
  },
  {
    id: "threat-intel",
    name: "Threat Intelligence Agent",
    role: "Enrichment",
    description: "Enriches incidents with IOC reputation, actor attribution and campaign context.",
    status: "Investigating",
    progress: 58,
    tasksCompleted: 96,
    incidentsInvestigated: 31,
    accuracy: 91,
    currentTask: "Attributing attacker IP 185.12.188.23",
    lastActivity: "3 min ago",
    icon: "globe",
  },
  {
    id: "threat-hunter",
    name: "Threat Hunter",
    role: "Proactive Hunting",
    description: "Proactively hunts for dormant threats and living-off-the-land techniques.",
    status: "Active",
    progress: 64,
    tasksCompleted: 87,
    incidentsInvestigated: 19,
    accuracy: 90,
    currentTask: "Hunting for lateral movement on Server-12",
    lastActivity: "4 min ago",
    icon: "crosshair",
  },
  {
    id: "network-analyst",
    name: "Network Analyst",
    role: "Network",
    description: "Analyzes flow logs and firewall telemetry for suspicious traffic patterns.",
    status: "Active",
    progress: 70,
    tasksCompleted: 152,
    incidentsInvestigated: 22,
    accuracy: 92,
    currentTask: "Reviewing egress traffic from Database-01",
    lastActivity: "5 min ago",
    icon: "network",
  },
  {
    id: "identity-analyst",
    name: "Identity Analyst",
    role: "Identity",
    description: "Tracks authentication anomalies, impossible travel and privilege changes.",
    status: "Standby",
    progress: 12,
    tasksCompleted: 64,
    incidentsInvestigated: 14,
    accuracy: 95,
    currentTask: "Idle — waiting for identity alerts",
    lastActivity: "18 min ago",
    icon: "fingerprint",
  },
  {
    id: "malware-analyst",
    name: "Malware Analyst",
    role: "Malware",
    description: "Performs automated static and behavioral analysis on suspicious binaries.",
    status: "Standby",
    progress: 8,
    tasksCompleted: 41,
    incidentsInvestigated: 9,
    accuracy: 89,
    currentTask: "Idle — sandbox queue empty",
    lastActivity: "26 min ago",
    icon: "bug",
  },
  {
    id: "risk-analyst",
    name: "Risk Analyst",
    role: "Risk Scoring",
    description: "Continuously recalculates organizational risk posture across six domains.",
    status: "Active",
    progress: 45,
    tasksCompleted: 73,
    incidentsInvestigated: 0,
    accuracy: 97,
    currentTask: "Recomputing device risk after patch cycle",
    lastActivity: "6 min ago",
    icon: "shield-alert",
  },
  {
    id: "response",
    name: "Response Agent",
    role: "Response",
    description: "Recommends and, when approved, executes automated containment actions.",
    status: "Investigating",
    progress: 88,
    tasksCompleted: 59,
    incidentsInvestigated: 27,
    accuracy: 98,
    currentTask: "Preparing isolation action for PC-104",
    lastActivity: "Just now",
    icon: "shield-check",
  },
  {
    id: "report",
    name: "Report Agent",
    role: "Reporting",
    description: "Generates human-readable incident and executive reports on a schedule.",
    status: "Completed",
    progress: 100,
    tasksCompleted: 210,
    incidentsInvestigated: 0,
    accuracy: 99,
    currentTask: "Weekly Security Report generated",
    lastActivity: "14 min ago",
    icon: "file-text",
  },
];

export const threats: Threat[] = [
  { id: "T-1", name: "Ransomware Behavior", severity: "Critical", asset: "PC-104", user: "R. Fox", aiConfidence: 98, status: "Active", firstSeen: "14:20:12", lastActivity: "14:36:32", type: "Malware", source: "EDR" },
  { id: "T-2", name: "Credential Theft", severity: "High", asset: "Server-27", user: "A. Hoang", aiConfidence: 95, status: "Active", firstSeen: "13:45:20", lastActivity: "14:01:04", type: "Identity", source: "IdP Logs" },
  { id: "T-3", name: "Impossible Travel", severity: "High", asset: "Laptop-84", user: "R. Fox", aiConfidence: 88, status: "Investigating", firstSeen: "14:22:15", lastActivity: "14:24:40", type: "Identity", source: "SSO" },
  { id: "T-4", name: "Port Scanning", severity: "Medium", asset: "Server-22", user: "—", aiConfidence: 95, status: "Monitoring", firstSeen: "14:20:55", lastActivity: "14:33:12", type: "Network", source: "Firewall" },
  { id: "T-5", name: "Suspicious Login", severity: "Medium", asset: "User-23", user: "R. Askon", aiConfidence: 83, status: "Investigating", firstSeen: "13:25:20", lastActivity: "13:40:02", type: "Identity", source: "SSO" },
  { id: "T-6", name: "Data Exfiltration", severity: "Critical", asset: "Server-99", user: "—", aiConfidence: 95, status: "Active", firstSeen: "13:25:45", lastActivity: "14:29:51", type: "Network", source: "DLP" },
  { id: "T-7", name: "Privilege Escalation", severity: "High", asset: "Domain Controller", user: "svc-backup", aiConfidence: 90, status: "Active", firstSeen: "12:58:03", lastActivity: "14:12:19", type: "Identity", source: "EDR" },
  { id: "T-8", name: "Lateral Movement", severity: "Critical", asset: "File Server", user: "R. Fox", aiConfidence: 92, status: "Investigating", firstSeen: "14:01:07", lastActivity: "14:34:56", type: "Network", source: "NDR" },
  { id: "T-9", name: "Malware Detection", severity: "High", asset: "PC-58", user: "J. Aine", aiConfidence: 97, status: "Contained", firstSeen: "11:40:11", lastActivity: "12:05:33", type: "Malware", source: "EDR" },
  { id: "T-10", name: "Brute Force Login", severity: "Low", asset: "VPN Gateway", user: "—", aiConfidence: 71, status: "Resolved", firstSeen: "10:12:00", lastActivity: "10:44:21", type: "Network", source: "VPN Logs" },
];

export const incidents: Incident[] = [
  {
    id: "INC-2048",
    title: "Possible Ransomware Attack",
    severity: "Critical",
    status: "Active",
    aiConfidence: 98,
    firstSeen: "14:01:00",
    lastSeen: "14:36:32",
    attacker: "185.12.188.23",
    attackerLocation: "Unknown — flagged infrastructure",
    affectedAssets: [
      { id: "PC-104", name: "PC-104 (Windows 10)", type: "endpoint" },
      { id: "FS-01", name: "File Server", type: "server" },
      { id: "DA-01", name: "Domain Admin", type: "identity" },
    ],
    timeline: [
      { time: "14:01", event: "Phishing email delivered to R. Fox" },
      { time: "14:07", event: "Malicious attachment opened on PC-104" },
      { time: "14:08", event: "Credential harvested from local session" },
      { time: "14:26", event: "Lateral movement detected toward File Server" },
      { time: "14:32", event: "Mass file encryption behavior detected" },
    ],
    aiSummary:
      "AegisSOC AI correlated a phishing delivery on PC-104 with rapid, high-entropy file writes consistent with ransomware. The Detection Agent flagged encryption behavior at 98% confidence; the Correlation Agent linked it to an earlier credential-theft alert on the same host, indicating the attacker pivoted from initial access to encryption in under 30 minutes.",
    mitreTechniques: [
      { id: "T1566", name: "Phishing" },
      { id: "T1078", name: "Valid Accounts" },
      { id: "T1021", name: "Remote Services" },
      { id: "T1486", name: "Data Encrypted for Impact" },
    ],
    recommendedActions: ["Isolate Device", "Block IP", "Disable Account", "Quarantine File"],
  },
  {
    id: "INC-2049",
    title: "Suspected Credential Stuffing Campaign",
    severity: "High",
    status: "Investigating",
    aiConfidence: 91,
    firstSeen: "13:10:00",
    lastSeen: "14:02:11",
    attacker: "94.156.35.12",
    attackerLocation: "Datacenter ASN — high abuse score",
    affectedAssets: [
      { id: "SSO-01", name: "Corporate SSO", type: "identity" },
      { id: "VPN-01", name: "VPN Gateway", type: "network" },
    ],
    timeline: [
      { time: "13:10", event: "Burst of 420 failed logins across 38 accounts" },
      { time: "13:24", event: "Successful login on account svc-backup" },
      { time: "13:41", event: "MFA challenge triggered and denied" },
      { time: "14:02", event: "Source IP added to network watchlist" },
    ],
    aiSummary:
      "The Identity Analyst detected a distributed credential-stuffing pattern targeting the corporate SSO. One account authenticated successfully before MFA blocked the session. The Threat Intelligence Agent confirmed the source IP is part of a known credential-stuffing botnet.",
    mitreTechniques: [
      { id: "T1110", name: "Brute Force" },
      { id: "T1078", name: "Valid Accounts" },
    ],
    recommendedActions: ["Block IP", "Disable Account", "Force Password Reset"],
  },
  {
    id: "INC-2050",
    title: "Anomalous Outbound Data Transfer",
    severity: "Medium",
    status: "Monitoring",
    aiConfidence: 76,
    firstSeen: "12:15:00",
    lastSeen: "13:02:47",
    attacker: "Internal — Server-99",
    attackerLocation: "Corporate data center",
    affectedAssets: [{ id: "SRV-99", name: "Server-99", type: "server" }],
    timeline: [
      { time: "12:15", event: "3.2 GB outbound transfer to unfamiliar endpoint" },
      { time: "12:40", event: "Transfer resumed after brief pause" },
      { time: "13:02", event: "DLP policy flagged sensitive file signatures" },
    ],
    aiSummary:
      "Network Analyst flagged an unusual volume of outbound traffic from Server-99 to an endpoint outside normal baselines. DLP signatures suggest customer records may be included. Confidence is moderate pending deeper content inspection.",
    mitreTechniques: [{ id: "T1041", name: "Exfiltration Over C2 Channel" }],
    recommendedActions: ["Restrict Egress", "Create Ticket", "Notify Data Owner"],
  },
];

export const reports: Report[] = [
  { id: "R-1", name: "Daily Security Report — Aug 15", type: "Daily", severity: "Info", timestamp: "2026-08-15 06:00", status: "Ready" },
  { id: "R-2", name: "Weekly Security Report — Wk 33", type: "Weekly", severity: "Info", timestamp: "2026-08-11 06:00", status: "Ready" },
  { id: "R-3", name: "INC-2048 Incident Report", type: "Incident", severity: "Critical", timestamp: "2026-08-15 14:40", status: "Ready" },
  { id: "R-4", name: "Executive Summary — Q3", type: "Executive", severity: "Executive", timestamp: "2026-08-10 09:00", status: "Ready" },
  { id: "R-5", name: "INC-2049 Incident Report", type: "Incident", severity: "High", timestamp: "2026-08-15 14:05", status: "Ready" },
  { id: "R-6", name: "Daily Security Report — Aug 14", type: "Daily", severity: "Info", timestamp: "2026-08-14 06:00", status: "Ready" },
  { id: "R-7", name: "Monthly Compliance Digest", type: "Executive", severity: "Executive", timestamp: "2026-08-01 06:00", status: "Ready" },
  { id: "R-8", name: "Daily Security Report — Aug 16", type: "Daily", severity: "Info", timestamp: "2026-08-16 06:00", status: "Scheduled" },
];

export const riskDomains = [
  { domain: "Identity", score: 87 },
  { domain: "Device", score: 66 },
  { domain: "Network", score: 78 },
  { domain: "Data", score: 87 },
  { domain: "Cloud", score: 58 },
  { domain: "Endpoint", score: 74 },
];

export const riskRecommendations = [
  { id: "RR-1", label: "Enable MFA for 17 at-risk users", impact: "High", reduction: "-9 pts" },
  { id: "RR-2", label: "Patch Server-22 (CVE-2026-1104)", impact: "High", reduction: "-7 pts" },
  { id: "RR-3", label: "Restrict exposed cloud storage bucket", impact: "Medium", reduction: "-5 pts" },
  { id: "RR-4", label: "Rotate compromised service credentials", impact: "High", reduction: "-6 pts" },
  { id: "RR-5", label: "Update endpoint protection on 12 devices", impact: "Medium", reduction: "-4 pts" },
];

export const riskTrend = [
  { month: "Mar", score: 71 }, { month: "Apr", score: 74 }, { month: "May", score: 69 },
  { month: "Jun", score: 78 }, { month: "Jul", score: 82 }, { month: "Aug", score: 87 },
];

export const incidentHistory = [
  { day: "Mon", incidents: 4 }, { day: "Tue", incidents: 7 }, { day: "Wed", incidents: 3 },
  { day: "Thu", incidents: 9 }, { day: "Fri", incidents: 6 }, { day: "Sat", incidents: 2 }, { day: "Sun", incidents: 1 },
];

export const predictionFactors = [
  { id: "PF-1", label: "Current Tactics", detail: "Credential access followed by internal reconnaissance matches known ransomware precursors.", icon: "list-checks" },
  { id: "PF-2", label: "Environmental Weakness", detail: "PC-104 is missing the latest EDR policy update and runs an unpatched SMB service.", icon: "shield-off" },
  { id: "PF-3", label: "Threat Intelligence", detail: "Attacker IP overlaps with infrastructure used in three prior ransomware campaigns.", icon: "globe" },
  { id: "PF-4", label: "User Behavior", detail: "R. Fox's account shows access patterns outside their normal working hours baseline.", icon: "user" },
];

// ---- Attack graph datasets ----

export const dashboardGraph: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    { id: "attacker", label: "Attacker", type: "attacker", x: 40, y: 60 },
    { id: "user", label: "R. Fox", type: "user", x: 200, y: 20 },
    { id: "pc104", label: "PC-104", type: "endpoint", x: 200, y: 110 },
    { id: "fileserver", label: "File Server", type: "server", x: 360, y: 60 },
    { id: "db", label: "Database", type: "database", x: 500, y: 110 },
    { id: "cloud", label: "Cloud", type: "cloud", x: 500, y: 20 },
  ],
  edges: [
    { from: "attacker", to: "user", severity: "Critical" },
    { from: "attacker", to: "pc104", severity: "Critical" },
    { from: "user", to: "pc104", severity: "High" },
    { from: "pc104", to: "fileserver", severity: "Critical" },
    { from: "fileserver", to: "db", severity: "High" },
    { from: "fileserver", to: "cloud", severity: "Medium" },
  ],
};

export const fullAttackGraph: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    { id: "attacker", label: "Threat Actor", type: "attacker", x: 60, y: 260, critical: true },
    { id: "malware", label: "Malware Payload", type: "malware", x: 220, y: 120 },
    { id: "user1", label: "R. Fox", type: "user", x: 220, y: 260 },
    { id: "user2", label: "A. Hoang", type: "user", x: 220, y: 400 },
    { id: "pc104", label: "PC-104", type: "endpoint", x: 400, y: 120, critical: true },
    { id: "laptop84", label: "Laptop-84", type: "endpoint", x: 400, y: 400 },
    { id: "firewall", label: "Firewall", type: "firewall", x: 560, y: 60 },
    { id: "server22", label: "Server-22", type: "server", x: 560, y: 200, critical: true },
    { id: "fileserver", label: "File Server", type: "server", x: 560, y: 340 },
    { id: "dc", label: "Domain Controller", type: "server", x: 740, y: 120 },
    { id: "db", label: "Database", type: "database", x: 740, y: 260 },
    { id: "cloud", label: "Cloud (AWS)", type: "cloud", x: 740, y: 400 },
  ],
  edges: [
    { from: "attacker", to: "malware", severity: "Critical" },
    { from: "malware", to: "user1", severity: "Critical" },
    { from: "user1", to: "pc104", severity: "Critical" },
    { from: "user2", to: "laptop84", severity: "Medium" },
    { from: "pc104", to: "firewall", severity: "High" },
    { from: "pc104", to: "server22", severity: "Critical" },
    { from: "laptop84", to: "fileserver", severity: "Medium" },
    { from: "server22", to: "dc", severity: "Critical" },
    { from: "server22", to: "db", severity: "High" },
    { from: "fileserver", to: "db", severity: "Medium" },
    { from: "dc", to: "cloud", severity: "Low" },
  ],
};

export const predictedAttackPath: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    { id: "device", label: "Current Compromised Device", type: "endpoint", x: 60, y: 180, critical: true },
    { id: "server", label: "Server-12", type: "server", x: 280, y: 100 },
    { id: "identity", label: "Service Identity", type: "user", x: 280, y: 260 },
    { id: "admin", label: "Domain Admin", type: "server", x: 500, y: 180, critical: true },
    { id: "database", label: "Database", type: "database", x: 700, y: 180, critical: true },
  ],
  edges: [
    { from: "device", to: "server", severity: "High" },
    { from: "device", to: "identity", severity: "Medium" },
    { from: "server", to: "admin", severity: "Critical" },
    { from: "identity", to: "admin", severity: "High" },
    { from: "admin", to: "database", severity: "Critical" },
  ],
};

export const incidentGraph: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    { id: "attacker", label: "Attacker", type: "attacker", x: 40, y: 20 },
    { id: "root", label: "Phishing Email", type: "malware", x: 40, y: 150 },
    { id: "pc104", label: "PC-104", type: "endpoint", x: 240, y: 90, critical: true },
    { id: "fileserver", label: "File Server", type: "server", x: 440, y: 30 },
    { id: "domainadmin", label: "Domain Admin", type: "user", x: 440, y: 150 },
  ],
  edges: [
    { from: "attacker", to: "root", severity: "Critical" },
    { from: "root", to: "pc104", severity: "Critical" },
    { from: "pc104", to: "fileserver", severity: "High" },
    { from: "pc104", to: "domainadmin", severity: "Critical" },
  ],
};

export const networkNodes = [
  { id: "office", label: "Office", sub: "12 Users · 24 Devices", x: 8, y: 55 },
  { id: "network", label: "Network", sub: "Firewalls · Switches · Routers", x: 30, y: 20 },
  { id: "cloud", label: "Cloud", sub: "AWS · Azure · GCP", x: 78, y: 15 },
  { id: "datacenter", label: "Data Center", sub: "Routers · 24 Devices", x: 55, y: 70 },
  { id: "servers", label: "Servers / Databases", sub: "18 Servers · 6 Databases", x: 85, y: 72 },
];
