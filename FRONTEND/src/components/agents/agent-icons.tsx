import {
  UserCog,
  Radar,
  Waypoints,
  Globe,
  Crosshair,
  Network,
  Fingerprint,
  Bug,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  FileText,
  ListChecks,
  User,
  Bot,
} from "lucide-react";

export const AGENT_ICONS: Record<string, typeof Bot> = {
  "user-cog": UserCog,
  radar: Radar,
  waypoints: Waypoints,
  globe: Globe,
  crosshair: Crosshair,
  network: Network,
  fingerprint: Fingerprint,
  bug: Bug,
  "shield-alert": ShieldAlert,
  "shield-check": ShieldCheck,
  "shield-off": ShieldOff,
  "file-text": FileText,
  "list-checks": ListChecks,
  user: User,
};

export function getAgentIcon(icon: string) {
  return AGENT_ICONS[icon] ?? Bot;
}
