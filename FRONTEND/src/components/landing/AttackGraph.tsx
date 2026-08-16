"use client";

import { motion } from "framer-motion";
import { Skull, Monitor, Database, Cloud, Server } from "lucide-react";
import { useState } from "react";

export default function AttackGraph() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    { id: "attacker", label: "Threat Actor", type: "attacker", x: 10, y: 50, icon: Skull, ip: "185.12.188.23", status: "Origin" },
    { id: "workstation", label: "Workstation (PC-104)", type: "endpoint", x: 40, y: 50, icon: Monitor, ip: "10.0.4.104", status: "Compromised" },
    { id: "database", label: "Database Core", type: "database", x: 70, y: 25, icon: Database, ip: "10.0.12.15", status: "Targeted" },
    { id: "fileserver", label: "File Server", type: "server", x: 70, y: 75, icon: Server, ip: "10.0.12.8", status: "Lateral Movement" },
    { id: "cloud", label: "Cloud Egress (AWS)", type: "cloud", x: 92, y: 50, icon: Cloud, ip: "us-east-1.amazonaws.com", status: "Threatened" },
  ];

  return (
    <section className="relative bg-[#050507] py-24 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/5">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-[#A78BFA]/2 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Area (Spans 5 cols): Content */}
          <div className="lg:col-span-5 max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-sans text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#92929F] uppercase mb-4"
            >
              Visual Correlation
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-sans text-3xl md:text-5xl font-extralight tracking-tight text-[#F5F5F7] mb-6 leading-[1.2]"
            >
              Every incident has a path. <br className="hidden md:inline" />
              Aegis makes it visible.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-sm md:text-base font-light text-[#92929F] max-w-xl leading-relaxed mb-6"
            >
              Reconstruct complex multi-stage attacks across your perimeter, active directories, databases, and cloud egress vectors. View chronological flow connections to trace the root cause instantly.
            </motion.p>
          </div>

          {/* Right Area (Spans 7 cols): Technical Attack Path SVG Visualization */}
          <div className="lg:col-span-7 p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0D0D14]/40 relative min-h-[340px] flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-[260px] origin-center max-sm:scale-[0.85] max-[380px]:scale-[0.72]">
              
              {/* SVG connection lines with flowing pulses */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Attacker -> Workstation */}
                <line x1="10%" y1="50%" x2="40%" y2="50%" stroke="#ff4d5a" strokeWidth="1.5" strokeOpacity="0.8" />
                <line x1="10%" y1="50%" x2="40%" y2="50%" stroke="#ff4d5a" strokeWidth="3" strokeDasharray="5 20" strokeLinecap="round" className="animate-[dash_4s_linear_infinite]" />

                {/* Workstation -> Database */}
                <line x1="40%" y1="50%" x2="70%" y2="25%" stroke="#ff4d5a" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.5" />
                <line x1="40%" y1="50%" x2="70%" y2="25%" stroke="#ff4d5a" strokeWidth="2.5" strokeDasharray="5 25" strokeLinecap="round" className="animate-[dash_6s_linear_infinite]" />

                {/* Workstation -> File Server */}
                <line x1="40%" y1="50%" x2="70%" y2="75%" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.6" />
                <line x1="40%" y1="50%" x2="70%" y2="75%" stroke="#A78BFA" strokeWidth="2.5" strokeDasharray="5 25" strokeLinecap="round" className="animate-[dash_6s_linear_infinite]" />

                {/* Database -> Cloud */}
                <line x1="70%" y1="25%" x2="92%" y2="50%" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />

                {/* File Server -> Cloud */}
                <line x1="70%" y1="75%" x2="92%" y2="50%" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.5" />
                <line x1="70%" y1="75%" x2="92%" y2="50%" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="5 20" strokeLinecap="round" className="animate-[dash_5s_linear_infinite]" />
              </svg>

              {/* Node Components */}
              {nodes.map((node) => {
                const Icon = node.icon;
                const isActive = activeNode === node.id;
                const isAttacker = node.type === "attacker";
                const isEndpoint = node.type === "endpoint";
                
                return (
                  <div
                    key={node.id}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    {/* Ring wrapper */}
                    <div className="relative">
                      {/* Attacker alert ping ring */}
                      {isAttacker && (
                        <span className="absolute inset-0 rounded-full bg-[#ff4d5a]/25 animate-ping opacity-60 scale-125" />
                      )}
                      {isEndpoint && (
                        <span className="absolute inset-0 rounded-full bg-[#ff4d5a]/15 animate-ping opacity-50 scale-110" />
                      )}
                      
                      <div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-[#0D0D14] border-[#A78BFA] scale-110 shadow-[0_0_12px_rgba(167,139,250,0.4)]"
                            : isAttacker
                            ? "bg-[#ff4d5a]/10 border-[#ff4d5a]/50 text-[#ff4d5a]"
                            : isEndpoint
                            ? "bg-[#ff4d5a]/5 border-[#ff4d5a]/30 text-[#ff4d5a]"
                            : "bg-[#0D0D14] border-white/10 text-[#92929F] group-hover:border-white/20 group-hover:text-[#F5F5F7]"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                    </div>

                    {/* Node label */}
                    <span className="mt-2 whitespace-nowrap text-[10px] md:text-xs font-semibold tracking-wide text-[#92929F] group-hover:text-[#F5F5F7] bg-[#050507]/90 px-2 py-0.5 border border-white/5 rounded-md shadow-sm">
                      {node.label}
                    </span>
                  </div>
                );
              })}

              {/* Node Detail Popup Card */}
              <div className="absolute top-2 left-2 pointer-events-none transition-all duration-300">
                {activeNode ? (
                  (() => {
                    const node = nodes.find((n) => n.id === activeNode);
                    if (!node) return null;
                    return (
                      <div className="p-3 rounded-lg border border-white/8 bg-[#0D0D14]/95 shadow-md flex flex-col gap-1 min-w-[150px] animate-fade-in font-sans">
                        <span className="text-[10px] uppercase font-semibold text-[#A78BFA] tracking-wider">
                          {node.status}
                        </span>
                        <span className="text-xs font-semibold text-[#F5F5F7]">
                          {node.label}
                        </span>
                        <span className="text-[10px] font-mono text-[#92929F]">
                          {node.ip}
                        </span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-3 rounded-lg border border-white/5 bg-[#0D0D14]/40 text-[10px] text-[#92929F] max-w-[160px]">
                    Hover over incident path nodes to view threat parameters.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global CSS Dash Animation definition */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </section>
  );
}
