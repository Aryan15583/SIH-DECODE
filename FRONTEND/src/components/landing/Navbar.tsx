"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[#050507]/75 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/10"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[#A78BFA]/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Shield className="h-6 w-6 text-[#A78BFA] relative z-10 transition-transform group-hover:scale-105" />
          </div>
          <span className="font-sans font-semibold text-sm tracking-wider text-[#F5F5F7]">
            AegisSOC AI
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Platform", "Features", "AI Agents", "Resources", "Company"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="font-sans text-xs font-medium text-[#92929F] hover:text-[#F5F5F7] transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right Side: CTA Buttons */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/login"
            className="font-sans text-xs font-medium text-[#92929F] hover:text-[#F5F5F7] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/8 bg-[#0D0D14] hover:bg-[#050507] hover:border-[#A78BFA]/40 transition-all duration-300 font-sans text-xs text-[#F5F5F7] group shadow-[0_1px_2px_rgba(255,255,255,0.02)_inset]"
          >
            Sign Up
            <ArrowRight className="h-3 w-3 text-[#A78BFA] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile: Toggle Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg border border-white/5 bg-[#0D0D14] text-[#92929F] hover:text-[#F5F5F7] transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-40 bg-[#050507] flex flex-col px-6 py-8 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-6 mb-8">
            {["Platform", "Features", "AI Agents", "Resources", "Company"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-lg font-medium text-[#92929F] hover:text-[#F5F5F7] transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-3 rounded-xl border border-white/5 bg-[#0D0D14] text-[#92929F] font-semibold text-sm hover:text-[#F5F5F7] transition-all duration-300"
            >
              Login
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 bg-[#8B5CF6] text-white font-semibold text-sm hover:bg-[#7c4dff] transition-all duration-300 shadow-md shadow-[#8B5CF6]/15"
            >
              Sign Up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
