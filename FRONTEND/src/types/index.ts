export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";

export type ThreatStatus = "Active" | "Investigating" | "Contained" | "Resolved" | "Monitoring";

export type AgentStatus = "Active" | "Investigating" | "Standby" | "Completed";

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  progress: number;
  tasksCompleted: number;
  incidentsInvestigated: number;
  accuracy: number;
  currentTask: string;
  lastActivity: string;
  icon: string;
}

export interface Threat {
  id: string;
  name: string;
  severity: Severity;
  asset: string;
  user: string;
  aiConfidence: number;
  status: ThreatStatus;
  firstSeen: string;
  lastActivity: string;
  type: string;
  source: string;
  reasons?: string[];
  timeline?: { time: string; event: string }[];
  evidence?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: ThreatStatus;
  aiConfidence: number;
  firstSeen: string;
  lastSeen: string;
  attacker: string;
  attackerLocation: string;
  affectedAssets: { id: string; name: string; type: string }[];
  timeline: { time: string; event: string }[];
  aiSummary: string;
  mitreTechniques: { id: string; name: string }[];
  recommendedActions: string[];
  evidence?: string;
  incidentGraph?: { nodes: GraphNode[]; edges: GraphEdge[] };
}

export interface Prediction {
  label: string;
  probability: number;
  trend: "up" | "down" | "flat";
}

export interface Report {
  id: string;
  name: string;
  type: string;
  severity: Severity | "Executive";
  timestamp: string;
  status: "Ready" | "Generating" | "Scheduled";
}

export interface GraphNode {
  id: string;
  label: string;
  type: "user" | "endpoint" | "server" | "database" | "cloud" | "attacker" | "malware" | "firewall";
  x: number;
  y: number;
  critical?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  severity?: Severity;
}

export interface KPI {
  label: string;
  value: string | null;
  suffix?: string;
  trend?: string;
  trendDir?: "up" | "down" | "flat";
  tone?: "success" | "danger" | "warning" | "primary";
}

export interface DashboardData {
  kpis: KPI[];
  liveThreatActivity: { time: string; events: number }[];
  predictions: Prediction[];
  agents: Agent[];
  incidents: Incident[];
  dashboardGraph?: { nodes: GraphNode[]; edges: GraphEdge[] };
}

export interface RiskDomain {
  domain: string;
  score: number;
}

export interface RiskRecommendation {
  id: string;
  label: string;
  impact: string;
  reduction: string;
}

export interface RiskTrend {
  month: string;
  score: number;
}

export interface IncidentHistory {
  day: string;
  incidents: number;
}

export interface RiskData {
  domains: RiskDomain[];
  recommendations: RiskRecommendation[];
  trend: RiskTrend[];
  history: IncidentHistory[];
}

export interface NetworkNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
}

export interface NetworkConnection {
  from: string;
  to: string;
}

export interface NetworkData {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
}
