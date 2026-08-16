"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, ArrowRight, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // easeOutExpo
      },
    },
  };

  const horizonVariants = {
    hidden: { opacity: 0, scaleX: 0.8 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: 0.5,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#050507] overflow-hidden pt-20 pb-20 md:pb-28 px-6">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#A78BFA]/5 blur-[80px] pointer-events-none" />

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Shield Icon with Halo */}
        <motion.div variants={itemVariants} className="relative mb-6">
          <div className="absolute inset-0 bg-[#A78BFA]/20 rounded-full blur-xl scale-125" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl border border-white/10 bg-[#0D0D14]/80 shadow-[0_1px_3px_rgba(255,255,255,0.02)_inset] backdrop-blur-sm">
            <Shield className="h-6 w-6 text-[#A78BFA] drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#92929F] uppercase mb-4"
        >
          Autonomous Security Operations
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-sans text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-[#F5F5F7] max-w-3xl leading-[1.1] mb-6"
        >
          See the threat before <br className="hidden md:inline" />
          it becomes an <span className="text-[#A78BFA] relative inline-block font-normal">incident.</span>
        </motion.h1>

        {/* Supporting Paragraph */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-sm md:text-base font-light text-[#92929F] max-w-xl leading-relaxed mb-10"
        >
          AegisSOC AI continuously detects, investigates, predicts and responds to threats across your environment — with autonomous AI agents working alongside your security team.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-sans text-sm font-medium shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 group cursor-pointer"
          >
            Explore AegisSOC AI
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <Link
            href="#platform"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/8 bg-[#0D0D14]/50 hover:bg-[#0D0D14] hover:border-white/15 text-[#92929F] hover:text-[#F5F5F7] font-sans text-sm font-medium transition-all duration-300"
          >
            <Play className="h-3 w-3 fill-current" />
            See how it works
          </Link>
        </motion.div>
      </motion.div>

      {/* Futuristic Security Perimeter Horizon/Arc */}
      <motion.div
        className="absolute bottom-0 w-full max-w-7xl mx-auto z-10 pointer-events-none flex justify-center px-6"
        variants={horizonVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative w-full h-[180px] md:h-[240px] overflow-hidden">
          {/* Curved Horizon SVG */}
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 1200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 200C300 80 900 80 1200 200"
              stroke="url(#horizon-gradient)"
              strokeWidth="1.5"
            />
            <path
              d="M0 200C300 80 900 80 1200 200"
              stroke="url(#horizon-glow)"
              strokeWidth="8"
              strokeOpacity="0.15"
            />
            <defs>
              <linearGradient id="horizon-gradient" x1="0" y1="200" x2="1200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A78BFA" stopOpacity="0" />
                <stop offset="0.3" stopColor="#A78BFA" stopOpacity="0.4" />
                <stop offset="0.5" stopColor="#F5F5F7" />
                <stop offset="0.7" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="horizon-glow" x1="0" y1="200" x2="1200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" stopOpacity="0" />
                <stop offset="0.5" stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Horizon Subtle Glow Underneath */}
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-4/5 h-[80px] bg-gradient-to-t from-[#8B5CF6]/10 to-transparent blur-md rounded-full" />
          
          {/* Subtle Grid dots / ticks along horizon or bottom */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
