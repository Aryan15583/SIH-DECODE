"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Lock, UserX, Ban, FilePlus2, Zap } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { Threat } from "@/types";

const TABS = ["Overview", "Timeline", "Entities", "Evidence", "Response"] as const;

const timeline = (t: Threat) => [
  { time: t.firstSeen, event: `${t.name} pattern first observed on ${t.asset}` },
  { time: "+2m", event: "AI Detection Agent raised confidence to " + Math.max(t.aiConfidence - 6, 40) + "%" },
  { time: "+5m", event: "Correlation Agent linked related telemetry from " + t.source },
  { time: t.lastActivity, event: `Confidence stabilized at ${t.aiConfidence}%, status set to ${t.status}` },
];

const reasons = [
  "Behavioral pattern deviates from established baseline",
  "Signature overlaps with known attacker tooling",
  "Sequence of actions matches MITRE ATT&CK technique library",
  "Asset risk score elevated due to recent exposure",
];

export function ThreatDetailClient({ threat }: { threat: Threat }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const { push } = useToast();

  function act(label: string) {
    push(`${label} action queued`, `Response Agent will execute on ${threat.asset} pending approval.`, "success");
  }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/threats" className="flex w-fit items-center gap-1 text-xs text-text-2 hover:text-text-1">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Threats
      </Link>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-text-1">{threat.name} Detected</h2>
              <SeverityBadge severity={threat.severity} />
            </div>
            <p className="mt-1 text-sm text-text-2">{threat.id} · {threat.type} · Source: {threat.source}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => act("Isolate Device")}>
              <Lock className="h-3.5 w-3.5" /> Isolate Device
            </Button>
            <Button variant="outline" size="sm" onClick={() => act("Block IP")}>
              <Ban className="h-3.5 w-3.5" /> Block IP
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border-1 p-3">
            <p className="text-[11px] text-text-2">AI Confidence</p>
            <p className="mt-1 text-lg font-bold text-text-1">{threat.aiConfidence}%</p>
          </div>
          <div className="rounded-lg border border-border-1 p-3">
            <p className="text-[11px] text-text-2">First Seen</p>
            <p className="mt-1 text-lg font-bold text-text-1">{threat.firstSeen}</p>
          </div>
          <div className="rounded-lg border border-border-1 p-3">
            <p className="text-[11px] text-text-2">Last Activity</p>
            <p className="mt-1 text-lg font-bold text-text-1">{threat.lastActivity}</p>
          </div>
          <div className="rounded-lg border border-border-1 p-3">
            <p className="text-[11px] text-text-2">Status</p>
            <div className="mt-1.5"><StatusBadge status={threat.status} /></div>
          </div>
        </div>
      </Card>

      <div className="flex gap-1 overflow-x-auto border-b border-border-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
              tab === t ? "border-primary text-text-1" : "border-transparent text-text-2 hover:text-text-1"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Why AI Detected It" />
            <ul className="flex flex-col gap-3 p-5 pt-4">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-text-2">
                  <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Recommended Response" />
            <div className="flex flex-col gap-2 p-5 pt-4">
              <Button variant="outline" className="justify-start" onClick={() => act("Isolate Device")}>
                <Lock className="h-3.5 w-3.5" /> Isolate Device
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => act("Disable Account")}>
                <UserX className="h-3.5 w-3.5" /> Disable Account
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => act("Block IP Address")}>
                <Ban className="h-3.5 w-3.5" /> Block IP Address
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => act("Create Incident")}>
                <FilePlus2 className="h-3.5 w-3.5" /> Create Incident
              </Button>
            </div>
          </Card>
        </div>
      )}

      {tab === "Timeline" && (
        <Card>
          <CardHeader title="Attack Timeline" />
          <div className="p-5 pt-4">
            <ol className="relative flex flex-col gap-6 border-l border-border-2 pl-5">
              {timeline(threat).map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
                  <p className="text-xs text-text-2">{e.time}</p>
                  <p className="text-sm text-text-1">{e.event}</p>
                </li>
              ))}
            </ol>
          </div>
        </Card>
      )}

      {tab === "Entities" && (
        <Card>
          <CardHeader title="Affected Entities" />
          <div className="grid grid-cols-1 gap-3 p-5 pt-4 sm:grid-cols-3">
            {[threat.asset, threat.user, threat.source].map((e) => (
              <div key={e} className="rounded-lg border border-border-1 p-4 text-center">
                <p className="text-sm font-medium text-text-1">{e}</p>
                <p className="text-xs text-text-2">Involved entity</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Evidence" && (
        <Card>
          <CardHeader title="Evidence" />
          <div className="p-5 pt-4 text-sm text-text-2">
            Raw telemetry, process trees and packet captures collected by {threat.source} are attached to this
            threat for offline review by the Investigation Agent.
          </div>
        </Card>
      )}

      {tab === "Response" && (
        <Card>
          <CardHeader title="Response Actions" />
          <div className="grid grid-cols-2 gap-3 p-5 pt-4 sm:grid-cols-4">
            {[
              { label: "Isolate Endpoint", icon: Lock },
              { label: "Block IP Address", icon: Ban },
              { label: "Disable Account", icon: UserX },
              { label: "Create Ticket", icon: FilePlus2 },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => act(label)}
                className="flex flex-col items-center gap-2 rounded-xl border border-border-1 bg-bg-1/40 p-4 text-center hover:border-primary/40 cursor-pointer"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-xs text-text-1">{label}</span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
