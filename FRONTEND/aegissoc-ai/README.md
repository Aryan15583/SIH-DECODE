# AegisSOC AI — Autonomous Security Operations

A frontend-only, production-quality UI prototype for an AI-powered multi-agent
Security Operations Center (SOC), built with Next.js 15 (App Router),
TypeScript, Tailwind CSS v4, Recharts, Lucide React and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects straight to `/dashboard`.
`/login` is also available as a standalone page.

## Pages

- `/login` — premium dark login screen
- `/dashboard` — Overview / SOC command center
- `/agents` — AI Security Agents grid + detail panel
- `/threats` — Live Threats table with working filters + `/threats/[id]` detail
- `/incidents` — Incident list + `/incidents/[id]` full investigation workspace
- `/prediction` — Threat Prediction with predicted attack path graph
- `/attack-graph` — Full interactive attack graph with zoom/filter controls
- `/risk` — Risk Center with radar chart, trends and recommendations
- `/reports` — Reports management with generate/download/share mock actions
- `/network` — Infrastructure / Network Map
- `/settings` — Tabbed settings (Profile, Security, AI Agents, Integrations, etc.)

## Architecture

- `src/lib/mock-data.ts` — single source of truth for all mock data. Swap this
  out for real API/FastAPI calls later without touching UI components.
- `src/components/ui/` — Card, Badge, Button, Modal, Toast primitives
- `src/components/layout/` — Sidebar, TopNavbar, AppShell (persistent layout)
- `src/components/graph/AttackGraphCanvas.tsx` — reusable SVG node-graph used
  across dashboard, attack-graph, prediction and incident pages
- `src/components/<feature>/` — feature-specific components (agents, threats,
  incidents, risk, reports, network)
- `src/app/(app)/` — route group sharing the sidebar/navbar layout
- `src/app/login/` — standalone route without the app shell

## Design System

Dark navy/indigo/purple palette, defined as CSS variables in
`src/app/globals.css` and exposed as Tailwind theme tokens (`bg-bg-0`,
`bg-surface-1`, `text-text-2`, `bg-primary`, `bg-danger`, etc.) — matching the
enterprise cybersecurity SaaS spec (backgrounds `#060D16`/`#08111C`/`#0B1420`,
cards `#101C29`/`#132231`, primary `#5865F2`, secondary `#7C5CFF`, cyber blue
`#22B8F0`, success/warning/danger `#39D98A`/`#F5B942`/`#FF4D5A`).

This is a frontend-only prototype: all data is mocked, no backend, auth, or
real AI/detection logic is implemented. The service layer boundary
(`lib/mock-data.ts`) is designed to be swapped for real FastAPI/REST/WebSocket
calls later.
