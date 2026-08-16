"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function ThreatPrediction() {
  const predictionItems = [
    { label: "Lateral Movement", prob: 87, trend: "up" },
    { label: "Data Exfiltration", prob: 64, trend: "up" },
    { label: "Account Takeover", prob: 41, trend: "flat" },
    { label: "Privilege Escalation", prob: 33, trend: "down" },
  ];

  return (
    <section id="features" className="relative bg-[#08080D] py-24 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/5">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/2 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Heading & Context */}
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-sans text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#92929F] uppercase mb-4"
            >
              Predictive Intelligence
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-sans text-3xl md:text-5xl font-extralight tracking-tight text-[#F5F5F7] mb-6 leading-[1.2]"
            >
              Don&apos;t just detect the attack. <br />
              Predict what&apos;s next.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-sm md:text-base font-light text-[#92929F] leading-relaxed mb-6"
            >
              By correlation of anomalous behavior patterns, user sessions, and threat feeds, AegisSOC AI maps active campaigns to MITRE ATT&CK techniques, generating probabilistic forecasts of the attacker&apos;s trajectory.
            </motion.p>
          </div>

          {/* Right Column: Visualization */}
          <div className="p-8 rounded-2xl border border-white/5 bg-[#0D0D14]/40 shadow-[0_1px_3px_rgba(255,255,255,0.01)_inset]">
            <div className="flex flex-col gap-6 md:gap-8">
              {predictionItems.map((item, idx) => {
                return (
                  <div key={item.label} className="group">
                    {/* Header: Label, Trend, Score */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-sans text-xs md:text-sm font-medium text-[#F5F5F7]">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-3">
                        {item.trend === "up" && (
                          <span className="flex items-center gap-0.5 text-[#ff4d5a] text-[10px] font-semibold bg-[#ff4d5a]/5 px-2 py-0.5 rounded border border-[#ff4d5a]/10">
                            <TrendingUp className="h-3 w-3" />
                            RISING
                          </span>
                        )}
                        {item.trend === "down" && (
                          <span className="flex items-center gap-0.5 text-[#39d98a] text-[10px] font-semibold bg-[#39d98a]/5 px-2 py-0.5 rounded border border-[#39d98a]/10">
                            <TrendingDown className="h-3 w-3" />
                            FALLING
                          </span>
                        )}
                        {item.trend === "flat" && (
                          <span className="flex items-center gap-0.5 text-[#8d9aaa] text-[10px] font-semibold bg-[#8d9aaa]/5 px-2 py-0.5 rounded border border-[#8d9aaa]/10">
                            <Minus className="h-3 w-3" />
                            STABLE
                          </span>
                        )}
                        <span className="font-sans text-sm md:text-base font-semibold text-[#A78BFA]">
                          {item.prob}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#050507] border border-white/5 relative">
                      {/* Animated Progress Bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.prob}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6]/60 to-[#A78BFA]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
