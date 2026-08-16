"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FinalCTA() {
  const router = useRouter();
  return (
    <section id="final-cta" className="relative bg-[#050507] py-28 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/5">
      {/* Centered Glowing Accent Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-[#A78BFA]/5 blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center relative z-10">
        
        {/* Subtle Shield Glow Behind */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-[#A78BFA]/15 rounded-full blur-xl scale-125" />
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl border border-white/8 bg-[#0D0D14] shadow-[0_1px_2px_rgba(255,255,255,0.01)_inset]">
            <Shield className="h-5 w-5 text-[#A78BFA] drop-shadow-[0_0_6px_rgba(167,139,250,0.4)]" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-sans text-3xl md:text-5xl font-extralight tracking-tight text-[#F5F5F7] mb-6 max-w-2xl leading-[1.2]"
        >
          The next attack won&apos;t wait. <br className="md:inline hidden" />
          Your SOC shouldn&apos;t either.
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-sm md:text-base font-light text-[#92929F] max-w-xl leading-relaxed mb-10"
        >
          Deploy AegisSOC AI in minutes and empower your security <br className="hidden md:inline" /> operations team with autonomous, multi-agent defense lines.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button
            onClick={() => {
              const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("aegis_auth") === "true";
              if (isAuthenticated) {
                router.push("/dashboard");
              } else {
                router.push("/login");
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-sans text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] transition-all duration-300 group cursor-pointer"
          >
            Open AegisSOC AI
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
