"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Setup RequestAnimationFrame loop for Lenis
    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Set up GSAP scroll reveal animations using context for React cleanup
    const ctx = gsap.context(() => {
      // Individual element fade & slide up
      gsap.utils.toArray(".reveal-up").forEach((el: unknown) => {
        const element = el as HTMLElement;
        gsap.fromTo(
          element,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Staggered reveal of child elements
      gsap.utils.toArray(".reveal-stagger").forEach((container: unknown) => {
        const parent = container as HTMLElement;
        const childrenList = parent.querySelectorAll(".reveal-item");
        gsap.fromTo(
          childrenList,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: parent,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    // 3. Global smooth scroll interceptor for hash links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("#") && href !== "#") {
          const targetEl = document.querySelector(href) as HTMLElement;
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, {
              offset: -80, // Offset to account for sticky navbar
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return <>{children}</>;
}
