"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";
import GridCrosshair from "@/components/dom/GridCrosshair";

const DIAGNOSTIC_LOGS = [
  "( 01 // INITIALIZING KINETIC SUBSYSTEM )",
  "( 02 // CALIBRATING 1PX BRUTALIST GRID & OKLCH PALETTE )",
  "( 03 // LOADING GLB MESH & WEBGL TEXTURES )",
  "( 04 // COMPILING GLSL SHADERS & UNIFIED TICKER )",
  "( 05 // SYSTEM READY — LAUNCHING VIEW TUNNEL )",
];

export default function Preloader() {
  const { progress: realProgress, active } = useProgress();
  const setIsLoaded = useAppStore((s) => s.setIsLoaded);
  const prefersReducedMotion = useAppStore((s) => s.prefersReducedMotion);
  const [displayProgress, setDisplayProgress] = useState(() =>
    useAppStore.getState().prefersReducedMotion ? 100 : 0
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationTriggeredRef = useRef(false);

  // Progressive simulated boot timer combined with real asset loader
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      // Advance simulated progress smoothly
      const increment = Math.floor(Math.random() * 8) + 4;
      current = Math.min(100, current + increment);

      // Take max of real R3F progress and simulated progress
      const target = active ? Math.max(current, Math.round(realProgress)) : current;
      setDisplayProgress(target);

      if (target >= 100) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [active, realProgress, prefersReducedMotion]);

  // Curtain split exit animation when progress reaches 100%
  useEffect(() => {
    if (displayProgress < 100 || animationTriggeredRef.current) return;
    animationTriggeredRef.current = true;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        setIsLoaded(true);
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
        return;
      }

      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          setIsLoaded(true);
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
        },
      });

      tl.to(contentRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      })
        .to(
          topPanelRef.current,
          {
            yPercent: -100,
            duration: 1.1,
            ease: "expo.inOut",
          },
          "-=0.1"
        )
        .to(
          bottomPanelRef.current,
          {
            yPercent: 100,
            duration: 1.1,
            ease: "expo.inOut",
          },
          "<"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [displayProgress, setIsLoaded, prefersReducedMotion]);

  const logIndex = Math.min(
    DIAGNOSTIC_LOGS.length - 1,
    Math.floor((displayProgress / 100) * DIAGNOSTIC_LOGS.length)
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto"
      aria-live="polite"
      aria-label="Tactile Boot Preloader"
    >
      {/* Top Split Panel */}
      <div
        ref={topPanelRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-terracotta-volt)] border-b border-black/15 will-change-transform"
      />

      {/* Bottom Split Panel */}
      <div
        ref={bottomPanelRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--color-terracotta-volt)] border-t border-black/15 will-change-transform"
      />

      {/* Grid Hairlines & Crosshairs */}
      <div className="absolute inset-4 sm:inset-8 border border-black/20 pointer-events-none">
        <GridCrosshair position="top-left" />
        <GridCrosshair position="top-right" />
        <GridCrosshair position="bottom-left" />
        <GridCrosshair position="bottom-right" />
      </div>

      {/* Content Layer */}
      <div
        ref={contentRef}
        className="relative z-10 w-full h-full p-8 sm:p-14 flex flex-col justify-between text-black"
      >
        {/* Top Header Diagnostics */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs uppercase tracking-wider">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-black animate-ping" />
              <span className="font-bold">SYS // TACTILE BOOT DIAGNOSTICS</span>
            </div>
            <span className="text-black/60">
              CORE: NEXT 16.4 // REACT 19.3 // THREE R3F 9.8
            </span>
            <span className="text-black font-semibold mt-1">
              {DIAGNOSTIC_LOGS[logIndex]}
            </span>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="px-2 py-0.5 border border-black/40 font-bold">
              BOOT PHASE 02 // MOTION ENGINE
            </span>
            <span className="text-black/60">LOC: PARIS // SAINT PETERSBURG // JAKARTA</span>
          </div>
        </header>

        {/* Center Technical Grid Indicator */}
        <div className="self-center font-mono text-xs text-black/40 tracking-[0.3em] uppercase hidden md:block">
          + + + NOIR // KINETIC VIEWPORT VIEW TUNNEL PROTOCOL + + +
        </div>

        {/* Bottom Percentage Display */}
        <footer className="flex flex-col sm:flex-row items-end justify-between gap-6 border-t border-black/15 pt-6">
          <div className="font-mono text-xs text-black/70 flex flex-col gap-1 self-start sm:self-end">
            <span>SPEC: OKLCH COLOR SPACE // UNIFIED TICKER</span>
            <span className="font-bold text-black">
              STATUS: {displayProgress < 100 ? "SYNCING ASSETS..." : "COMPILATION COMPLETE"}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-black/60 hidden sm:inline">
              INDEX
            </span>
            <span className="font-display font-extrabold text-[20vw] sm:text-[15vw] leading-[0.8] tracking-tighter text-black tabular-nums">
              {String(displayProgress).padStart(3, "0")}%
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
