"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowRight, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("aegis_theme") || "dark";
    setTimeout(() => {
      setTheme(storedTheme);
    }, 0);
    if (storedTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.style.colorScheme = "light";
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.style.colorScheme = "dark";
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("aegis_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.style.colorScheme = "light";
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.style.colorScheme = "dark";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem("aegis_auth") === "true");
    };
    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("aegis_auth_change", checkAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("aegis_auth_change", checkAuth);
    };
  }, []);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [mobileMenuOpen]);

  const menuVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -10, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.35,
        ease: shouldReduceMotion ? ("linear" as const) : ([0.16, 1, 0.3, 1] as [number, number, number, number]),
        when: "beforeChildren" as const,
        staggerChildren: shouldReduceMotion ? 0 : 0.05
      }
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -10,
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.25,
        ease: "easeInOut" as const
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        mobileMenuOpen
          ? "py-3 bg-[#050507] border-b border-white/5 shadow-lg shadow-black/10"
          : scrolled
          ? "py-3 bg-[#050507]/75 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/10"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-50">
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

        <nav className="hidden md:flex items-center gap-8">
          {["Platform", "Features", "AI Agents"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="relative font-sans text-xs font-medium text-[#92929F] hover:text-[#F5F5F7] transition-colors py-1 group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#A78BFA] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </nav>

        {/* Right Side: CTA Buttons or Profile Dropdown */}
        <div className="hidden md:flex items-center gap-5 relative">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full border border-white/8 bg-[#0D0D14]/80 text-[#92929F] hover:text-[#F5F5F7] transition-all cursor-pointer focus:outline-none select-none flex items-center justify-center hover:bg-[#0D0D14] w-7.5 h-7.5"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-[#A78BFA]" />
            ) : (
              <Moon className="h-4 w-4 text-[#8B5CF6]" />
            )}
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-[#0D0D14]/80 hover:bg-[#0D0D14] transition-all cursor-pointer select-none"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                  JD
                </div>
                <span className="font-sans text-xs text-[#92929F] hover:text-[#F5F5F7]">
                  John Doe
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/8 bg-[#0D0D14]/95 backdrop-blur-md p-1.5 shadow-xl z-50 flex flex-col gap-1 select-none animate-fade-in">
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-[#92929F] hover:text-[#F5F5F7] hover:bg-white/5 transition-all text-left"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("aegis_auth");
                      window.dispatchEvent(new Event("aegis_auth_change"));
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left cursor-pointer w-full"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="relative font-sans text-xs font-medium text-[#92929F] hover:text-[#F5F5F7] transition-colors py-1 group"
              >
                Login
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#A78BFA] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/8 bg-[#0D0D14] hover:bg-[#050507] hover:border-[#A78BFA]/40 transition-all duration-300 font-sans text-xs text-[#F5F5F7] group shadow-[0_1px_2px_rgba(255,255,255,0.02)_inset]"
              >
                Sign Up
                <ArrowRight className="h-3 w-3 text-[#A78BFA] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Toggle Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-[#0D0D14] text-[#92929F] hover:text-[#F5F5F7] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none shrink-0"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu-panel"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" className="w-4.5 h-4.5">
            <motion.line
              x1="2"
              y1="4"
              x2="16"
              y2="4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={mobileMenuOpen ? { x1: 4, y1: 4, x2: 14, y2: 14 } : { x1: 2, y1: 4, x2: 16, y2: 4 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
            <motion.line
              x1="2"
              y1="9"
              x2="16"
              y2="9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            <motion.line
              x1="2"
              y1="14"
              x2="16"
              y2="14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={mobileMenuOpen ? { x1: 4, y1: 14, x2: 14, y2: 4 } : { x1: 2, y1: 14, x2: 16, y2: 14 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-panel"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-[#050507] flex flex-col pt-[72px] pb-8 px-6 md:hidden shadow-2xl overflow-y-auto scrollbar-none min-h-[100dvh]"
          >
            <nav className="flex flex-col gap-6 mb-8">
              {["Platform", "Features", "AI Agents"].map((item) => (
                <motion.div key={item} variants={itemVariants}>
                  <Link
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-sans text-lg font-medium text-[#92929F] hover:text-[#F5F5F7] transition-colors"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            {/* Mobile Theme Toggle */}
            <motion.div
              variants={itemVariants}
              className="mt-auto mb-4 flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 bg-[#0D0D14]/40 select-none"
            >
              <span className="text-xs font-sans font-medium tracking-wider text-[#92929F] uppercase">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-white/5 bg-[#0D0D14]/40 text-[#92929F] hover:text-[#F5F5F7] transition-all cursor-pointer focus:outline-none flex items-center justify-center"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5 text-[#A78BFA]" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-[#8B5CF6]" />
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants}>
              {isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 rounded-xl border border-white/5 bg-[#0D0D14] text-[#F5F5F7] font-semibold text-sm hover:text-white transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("aegis_auth");
                      window.dispatchEvent(new Event("aegis_auth_change"));
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full py-3 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 font-semibold text-sm hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
