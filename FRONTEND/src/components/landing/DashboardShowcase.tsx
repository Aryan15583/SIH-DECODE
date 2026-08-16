"use client";

import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { ThreatChart } from "@/components/dashboard/ThreatChart";
import { PredictionList } from "@/components/dashboard/PredictionList";
import { Card, CardHeader } from "@/components/ui/Card";
import { kpis, predictions } from "@/lib/mock-data";
import { Shield, RefreshCw } from "lucide-react";

export default function DashboardShowcase() {
  // We take 3 relevant KPIs for the landing page mockup
  const selectedKpis = kpis.slice(0, 3);

  return (
    <section className="relative bg-[#08080D] py-24 md:py-36 px-6 overflow-hidden border-t border-white/5">
      {/* Accent Radial Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[300px] bg-gradient-to-b from-[#A78BFA]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header Content */}
        <div className="text-center max-w-2xl mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-sans text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#92929F] uppercase mb-4"
          >
            A Complete SOC
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans text-3xl md:text-5xl font-extralight tracking-tight text-[#F5F5F7] mb-6"
          >
            One intelligent system.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-sm md:text-base font-light text-[#92929F] leading-relaxed"
          >
            From real-time detection to automated investigation and response — everything your security team needs to stay ahead of attackers.
          </motion.p>
        </div>

        {/* 3D Tilted Dashboard Showcase Browser Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-full max-w-5xl rounded-2xl border border-white/8 bg-[#050507] shadow-[0_24px_80px_rgba(0,0,0,0.8),0_1px_3px_rgba(255,255,255,0.02)_inset] overflow-hidden transform md:[transform:rotateX(2deg)] pointer-events-auto"
        >
          {/* Browser Header */}
          <div className="flex items-center gap-4 px-4 py-3 bg-[#0D0D14] border-b border-white/5 select-none">
            {/* Window Controls */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-md mx-auto flex items-center justify-between gap-2 px-3 py-1 rounded-md bg-[#050507] border border-white/5 text-[10px] text-[#92929F] font-sans">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-[#A78BFA] opacity-80" />
                <span className="text-white/40">https://</span>
                <span className="text-[#F5F5F7]">aegissocai.vercel.app/</span>
              </div>
              <RefreshCw className="h-2.5 w-2.5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
            </div>
            
            <div className="w-14" /> {/* Spacer to align address bar */}
          </div>

          {/* Browser Dashboard Content Area */}
          <div className="p-6 bg-[#050507] text-left">
            <div className="flex flex-col gap-5">
              {/* KPIs row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedKpis.map((k) => (
                  <StatCard key={k.label} {...k} />
                ))}
              </div>

              {/* Main charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Live Threat Activity chart */}
                <Card className="lg:col-span-2">
                  <CardHeader title="Live Threat Activity" subtitle="Security events observed across the last 24 hours" />
                  <div className="px-2 pb-4 pt-2">
                    <ThreatChart />
                  </div>
                </Card>

                {/* AI Predictions list */}
                <Card>
                  <CardHeader title="AI Predictions" subtitle="Likelihood of next attacker action" />
                  <div className="p-5 pt-4">
                    <PredictionList predictions={predictions} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
