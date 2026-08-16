"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  const links = [
    { name: "Platform", href: "#platform" },
    { name: "Features", href: "#features" },
    { name: "AI Agents", href: "#ai-agents" },
    { name: "Resources", href: "#resources" },
    { name: "Company", href: "#company" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <footer className="relative bg-[#050507] pt-20 pb-12 px-6 border-t border-white/5 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 mb-16">
          
          {/* Left Side: Logo & Description */}
          <div className="flex flex-col gap-4 max-w-sm">
            <Link href="/" className="flex items-center gap-2 group self-start">
              <Shield className="h-5 w-5 text-[#A78BFA]" />
              <span className="font-sans font-semibold text-sm tracking-wider text-[#F5F5F7]">
                AegisSOC AI
              </span>
            </Link>
            <p className="font-sans text-xs md:text-sm font-light text-[#92929F] leading-relaxed">
              Autonomous Security Operations Platform. Continuous detection, investigation, correlation, and response driven by multi-agent AI technology.
            </p>
          </div>

          {/* Right Side: Links */}
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            <div className="flex flex-col gap-4">
              <span className="font-sans text-[10px] font-semibold text-[#F5F5F7] tracking-[0.2em] uppercase">
                Platform
              </span>
              <div className="flex flex-col gap-2.5">
                {links.slice(0, 3).map((lnk) => (
                  <Link
                    key={lnk.name}
                    href={lnk.href}
                    className="font-sans text-xs text-[#92929F] hover:text-[#F5F5F7] transition-colors"
                  >
                    {lnk.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-sans text-[10px] font-semibold text-[#F5F5F7] tracking-[0.2em] uppercase">
                Legal
              </span>
              <div className="flex flex-col gap-2.5">
                <Link
                  href="#privacy"
                  className="font-sans text-xs text-[#92929F] hover:text-[#F5F5F7] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#terms"
                  className="font-sans text-xs text-[#92929F] hover:text-[#F5F5F7] transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Brand Footer Text */}
        <div className="mt-16 mb-8 w-full overflow-hidden select-none pointer-events-none text-center border-t border-white/5 pt-12">
          <h2 className="font-sans font-black text-[11vw] tracking-tighter leading-none text-white/[0.02] uppercase bg-gradient-to-b from-white/[0.03] to-transparent bg-clip-text text-transparent whitespace-nowrap">
            AegisSOC AI.
          </h2>
        </div>

        {/* Centered Copyright */}
        <div className="mt-4 flex justify-center text-center select-none">
          <p className="font-sans text-[9px] md:text-[10px] tracking-[0.15em] font-medium text-[#92929F]/70 uppercase">
            &copy; 2026 AEGISSOC AI. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
