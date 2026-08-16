"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const TABS = ["Profile", "Organization", "Security", "Notifications", "AI Agents", "Integrations", "Appearance"] as const;

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border-2 transition-colors cursor-pointer",
        on ? "border-primary bg-primary" : "border-border-2 bg-border-2"
      )}
    >
      <span
        className={cn(
          "absolute top-0 left-0 h-5 w-5 rounded-full bg-white transition-transform duration-200",
          on ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-text-2">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-border-1 bg-surface-1 px-3 py-2 text-sm text-text-1 outline-none focus:border-primary/50"
      />
    </div>
  );
}

function Row({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-1 py-3.5 last:border-0">
      <div>
        <p className="text-sm text-text-1">{label}</p>
        <p className="text-xs text-text-2">{description}</p>
      </div>
      <Toggle defaultChecked={defaultChecked} />
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");
  const { push } = useToast();

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
      <Card className="h-fit p-2">
        <nav className="flex flex-row overflow-x-auto lg:flex-col gap-1 pb-1.5 lg:pb-0 scrollbar-thin select-none">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-3 py-2 text-left text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0",
                tab === t ? "bg-primary/15 text-text-1 border border-primary/30" : "text-text-2 hover:bg-white/5 hover:text-text-1 border border-transparent"
              )}
            >
              {t}
            </button>
          ))}
        </nav>
      </Card>

      <div className="flex flex-col gap-5">
        {tab === "Profile" && (
          <Card>
            <CardHeader title="Profile" subtitle="Manage your personal account details" />
            <div className="grid grid-cols-1 gap-4 p-5 pt-3 sm:grid-cols-2">
              <Field label="Full Name" defaultValue="John Doe" />
              <Field label="Email" defaultValue="john.doe@aegissoc.ai" type="email" />
              <Field label="Role" defaultValue="Security Admin" />
              <Field label="Phone" defaultValue="+1 555-123-4567" />
            </div>
            <div className="flex justify-end gap-2 border-t border-border-1 p-5">
              <Button variant="primary" onClick={() => push("Profile updated", "Your changes have been saved.", "success")}>
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {tab === "Organization" && (
          <Card>
            <CardHeader title="Organization" subtitle="Company-wide configuration" />
            <div className="grid grid-cols-1 gap-4 p-5 pt-3 sm:grid-cols-2">
              <Field label="Organization Name" defaultValue="Northwind Security" />
              <Field label="Primary Domain" defaultValue="northwind.io" />
              <Field label="Time Zone" defaultValue="UTC" />
              <Field label="Seats" defaultValue="42" />
            </div>
          </Card>
        )}

        {tab === "Security" && (
          <Card>
            <CardHeader title="Security" subtitle="Authentication and access policies" />
            <div className="px-5">
              <Row label="Require SSO for all users" description="Enforce single sign-on across the organization" defaultChecked />
              <Row label="Enforce MFA" description="Require multi-factor authentication on every login" defaultChecked />
              <Row label="Session timeout after 30 min" description="Automatically sign out idle sessions" />
              <Row label="IP allow-listing" description="Restrict console access to approved IP ranges" />
            </div>
          </Card>
        )}

        {tab === "Notifications" && (
          <Card>
            <CardHeader title="Notifications" subtitle="Choose what AegisSOC AI notifies you about" />
            <div className="px-5">
              <Row label="Critical incidents" description="Immediate alert for Critical severity incidents" defaultChecked />
              <Row label="Agent status changes" description="Notify when an autonomous agent changes status" />
              <Row label="Weekly report ready" description="Email when the weekly report finishes generating" defaultChecked />
              <Row label="Risk score changes" description="Notify on significant risk score movement" />
            </div>
          </Card>
        )}

        {tab === "AI Agents" && (
          <Card>
            <CardHeader title="AI Agent Configuration" subtitle="Control autonomy and approval requirements" />
            <div className="px-5">
              <Row label="Autonomous containment actions" description="Allow the Response Agent to act without approval on Critical incidents" />
              <Row label="Auto-generate incident reports" description="Report Agent creates a report whenever an incident is resolved" defaultChecked />
              <Row label="Proactive threat hunting" description="Threat Hunter continuously scans for dormant threats" defaultChecked />
              <Row label="Model explainability logging" description="Log the reasoning behind every AI recommendation" defaultChecked />
            </div>
          </Card>
        )}

        {tab === "Integrations" && (
          <Card>
            <CardHeader title="Integrations" subtitle="Connect AegisSOC AI to your existing stack" />
            <div className="grid grid-cols-1 gap-3 p-5 pt-3 sm:grid-cols-2">
              {["Slack", "Jira", "Splunk", "Microsoft Sentinel", "PagerDuty", "ServiceNow"].map((name) => (
                <div key={name} className="flex items-center justify-between rounded-lg border border-border-1 p-3.5">
                  <span className="text-sm text-text-1">{name}</span>
                  <Button size="sm" variant="outline" onClick={() => push(`${name} connected`, undefined, "success")}>
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "Appearance" && (
          <Card>
            <CardHeader title="Appearance" subtitle="Display preferences" />
            <div className="px-5">
              <Row label="Dark mode" description="AegisSOC AI is optimized for a dark, low-glare interface" defaultChecked />
              <Row label="Compact density" description="Reduce spacing for higher information density" />
              <Row label="Reduce motion" description="Minimize animations across the platform" />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
