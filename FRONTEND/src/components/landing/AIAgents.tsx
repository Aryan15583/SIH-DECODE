"use client";

import { motion } from "framer-motion";
import { UserCog, Radar, Waypoints, Globe, Crosshair } from "lucide-react";

export default function AIAgents() {
  const agentsList = [
    {
      name: "SOC Analyst",
      task: "Triaging 6 new alerts from Server-22",
      status: "ACTIVE",
      icon: UserCog,
    },
    {
      name: "Detection Agent",
      task: "Scanning PC-104 for encryption behavior",
      status: "ACTIVE",
      icon: Radar,
    },
    {
      name: "Correlation Agent",
      task: "Correlating INC-2048 with 3 related alerts",
      status: "ACTIVE",
      icon: Waypoints,
    },
    {
      name: "Threat Intelligence",
      task: "Attributing attacker IP 185.12.188.23",
      status: "ACTIVE",
      icon: Globe,
    },
    {
      name: "Threat Hunter",
      task: "Hunting for lateral movement on Server-12",
      status: "ACTIVE",
      icon: Crosshair,
    },
  ];

  return (
    <section id="ai-agents" className="relative bg-[#050507] py-24 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/2 blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#92929F] uppercase mb-4"
          >
            Autonomous Orchestration
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans text-3xl md:text-5xl font-extralight tracking-tight text-[#F5F5F7]"
          >
            Security doesn&apos;t sleep. <br className="md:hidden" />
            Neither does Aegis.
          </motion.h2>
        </div>

        {/* Vertical Flow System */}
        <div className="relative pl-6 sm:pl-8 md:pl-24">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[31px] sm:left-[39px] md:left-[95px] top-4 bottom-4 w-px bg-gradient-to-b from-[#A78BFA]/40 via-white/10 to-[#8B5CF6]/40">
            {/* Animated Pulse along the line */}
            <motion.div
              animate={{
                top: ["0%", "100%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-[-1.5px] w-1 h-20 bg-gradient-to-b from-transparent via-[#A78BFA] to-transparent rounded-full shadow-[0_0_8px_#A78BFA]"
            />
          </div>

          {/* Agents Node List */}
          <div className="flex flex-col gap-10 md:gap-16">
            {agentsList.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative flex items-start gap-3 sm:gap-4 md:gap-8 group"
                >
                  {/* Glowing Node Point */}
                  <div className="absolute left-[-5px] md:left-[-13px] top-1.5 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#A78BFA]/30 rounded-full blur-[6px] scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="w-6 h-6 rounded-full border border-white/10 bg-[#0D0D14] flex items-center justify-center z-10 relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] shadow-[0_0_6px_#A78BFA] group-hover:scale-125 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Agent Card */}
                  <div className="flex-1 flex items-center justify-between gap-3 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-white/5 bg-[#0D0D14]/30 hover:bg-[#0D0D14]/70 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Icon container */}
                      <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-[#050507] text-[#92929F] group-hover:text-[#A78BFA] group-hover:border-[#A78BFA]/20 transition-all duration-300">
                        <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </span>
                      
                      {/* Agent Info */}
                      <div className="min-w-0">
                        <h4 className="font-sans text-xs md:text-sm font-semibold tracking-wider text-[#F5F5F7]">
                          {agent.name}
                        </h4>
                        <p className="font-sans text-[11px] sm:text-xs font-light text-[#92929F] mt-1 truncate max-w-[130px] sm:max-w-[220px] md:max-w-md">
                          {agent.task}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#39d98a]/20 bg-[#39d98a]/5 text-[#39d98a] select-none shrink-0 font-sans text-[9px] sm:text-[10px] font-semibold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39d98a] animate-pulse" />
                      {agent.status}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
