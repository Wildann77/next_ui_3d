"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import GridCrosshair from "@/components/dom/GridCrosshair";

interface MenuItem {
  number: string;
  label: string;
  sub: string;
  targetId: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    number: "01",
    label: "ARCHITECTURE // VISION",
    sub: "SPATIAL LUXURY & BRUTALIST ROOTS",
    targetId: "hero",
  },
  {
    number: "02",
    label: "DYNAMIC METRICS BENTO",
    sub: "4X2 GRID WITH LIVE COUNTERS & SHADER CARDS",
    targetId: "metrics",
  },
  {
    number: "03",
    label: "AVANT-GARDE SELECTED WORKS",
    sub: "FIVE EDITORIAL CASE STUDIES & RGB DISTORTION",
    targetId: "works",
  },
  {
    number: "04",
    label: "FORMAT SPECS & ROI CALCULATOR",
    sub: "STICKY SPLIT-SCREEN & TURNKEY COMPARISON",
    targetId: "specs",
  },
  {
    number: "05",
    label: "POCKET SYSTEM CAMERA HUD",
    sub: "MOBILE PREVIEW WITH DIGITAL VIEWFINDER",
    targetId: "pocket",
  },
  {
    number: "06",
    label: "TRANSMISSION TERMINAL",
    sub: "KINETIC MARQUEE & REACT 19 SERVER ACTION",
    targetId: "contact",
  },
];

export default function FullscreenMenu() {
  const isMenuOpen = useAppStore((s) => s.isMenuOpen);
  const setIsMenuOpen = useAppStore((s) => s.setIsMenuOpen);
  const setCursorVariant = useAppStore((s) => s.setCursorVariant);
  const setCursorLabel = useAppStore((s) => s.setCursorLabel);

  const containerRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const closeBtnRef = useMagneticEffect<HTMLButtonElement>({
    strength: 0.35,
    cursorVariant: "hover",
    cursorLabel: "CLOSE",
  });

  // GSAP clip-path entry and exit animation
  useEffect(() => {
    const container = containerRef.current;
    const links = linksContainerRef.current?.children;
    if (!container) return;

    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        gsap.set(container, {
          display: "flex",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        });

        const tl = gsap.timeline();
        tl.to(container, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.75,
          ease: "power4.inOut",
        });

        if (links && links.length > 0) {
          tl.fromTo(
            Array.from(links),
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.05,
              ease: "power3.out",
            },
            "-=0.35"
          );
        }
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(container, { display: "none" });
          },
        });

        tl.to(container, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          duration: 0.55,
          ease: "power3.inOut",
        });
      }
    }, container);

    return () => ctx.revert();
  }, [isMenuOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  const handleLinkClick = (targetId: string) => {
    setIsMenuOpen(false);
    setCursorVariant("default");
    setCursorLabel("");
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      style={{ display: "none" }}
      className="fixed inset-0 z-45 bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none border border-[var(--color-hairline-dark)]"
    >
      <GridCrosshair position="top-left" />
      <GridCrosshair position="top-right" />
      <GridCrosshair position="bottom-left" />
      <GridCrosshair position="bottom-right" />

      {/* Top Header inside overlay */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-[var(--color-hairline-dark)]">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[var(--color-terracotta-volt)]" />
          <span className="font-mono text-xs tracking-widest text-[var(--color-editorial-bone)]/70 uppercase">
            NAVIGATION // SYSTEM INDEX [06]
          </span>
        </div>

        <button
          ref={closeBtnRef}
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close navigation overlay"
          className="flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest border border-[var(--color-hairline-dark)] hover:border-[var(--color-terracotta-volt)] hover:text-[var(--color-terracotta-volt)] transition-colors cursor-pointer"
        >
          <span>CLOSE</span>
          <span className="font-bold">[ × ]</span>
        </button>
      </div>

      {/* Center: Giant Editorial Navigation Links with kinetic marquee */}
      <div
        ref={linksContainerRef}
        className="my-auto py-8 flex flex-col gap-2 md:gap-3"
      >
        {MENU_ITEMS.map((item, idx) => {
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.number}
              onPointerEnter={() => {
                setHoveredIndex(idx);
                setCursorVariant("view");
                setCursorLabel("EXPLORE");
              }}
              onPointerLeave={() => {
                setHoveredIndex(null);
                setCursorVariant("default");
                setCursorLabel("");
              }}
              onClick={() => handleLinkClick(item.targetId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLinkClick(item.targetId);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Navigate to ${item.label}`}
              className="group relative cursor-pointer overflow-hidden border-b border-[var(--color-hairline-dark)]/40 pb-2 md:pb-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-terracotta-volt)]"
            >
              <div className="flex items-baseline justify-between transition-transform duration-300 group-hover:translate-x-3">
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span className="font-mono text-xs md:text-sm text-[var(--color-terracotta-volt)] font-bold">
                    ({item.number})
                  </span>
                  <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase group-hover:text-[var(--color-terracotta-volt)] transition-colors">
                    {item.label}
                  </h2>
                </div>

                <span className="hidden md:block font-mono text-xs text-[var(--color-editorial-bone)]/40 tracking-wider">
                  {item.sub}
                </span>
              </div>

              {/* Kinetic Marquee Ticker on Hover */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isHovered ? "max-h-8 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex w-full overflow-hidden">
                  <div className="flex shrink-0 w-max items-center animate-marquee font-mono text-[11px] text-[var(--color-terracotta-volt)] tracking-widest uppercase">
                    <span className="pr-6">
                      ● DISCOVER {item.label} — {item.sub} — NOIR // KINETIC 2026
                    </span>
                    <span className="pr-6">
                      ● DISCOVER {item.label} — {item.sub} — NOIR // KINETIC 2026
                    </span>
                  </div>
                  <div className="flex shrink-0 w-max items-center animate-marquee font-mono text-[11px] text-[var(--color-terracotta-volt)] tracking-widest uppercase" aria-hidden="true">
                    <span className="pr-6">
                      ● DISCOVER {item.label} — {item.sub} — NOIR // KINETIC 2026
                    </span>
                    <span className="pr-6">
                      ● DISCOVER {item.label} — {item.sub} — NOIR // KINETIC 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Telemetry */}
      <div className="w-full pt-6 border-t border-[var(--color-hairline-dark)] flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[var(--color-editorial-bone)]/50 gap-4">
        <div className="flex items-center gap-6">
          <span>LOC: PARIS [48.85°N] // JAKARTA [6.20°S]</span>
          <span className="hidden sm:inline">SYS_STATUS: NOMINAL [60 FPS]</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--color-terracotta-volt)] transition-colors"
          >
            [ X // TWITTER ]
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--color-terracotta-volt)] transition-colors"
          >
            [ GITHUB ]
          </a>
          <a
            href="https://are.na"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--color-terracotta-volt)] transition-colors"
          >
            [ ARE.NA ]
          </a>
        </div>
      </div>
    </div>
  );
}
