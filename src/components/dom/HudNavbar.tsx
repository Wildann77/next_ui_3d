"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import GridCrosshair from "@/components/dom/GridCrosshair";

interface NavItem {
  id: string;
  label: string;
  number: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", number: "01", label: "VISION" },
  { id: "metrics", number: "02", label: "METRICS" },
  { id: "works", number: "03", label: "WORKS" },
  { id: "specs", number: "04", label: "SPECS" },
];

export default function HudNavbar() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const isMenuOpen = useAppStore((s) => s.isMenuOpen);
  const setIsMenuOpen = useAppStore((s) => s.setIsMenuOpen);
  const [activeNav, setActiveNav] = useState("hero");

  // Real-time multi-timezone studio clock (Paris UTC+1 / Jakarta UTC+7)
  const [timezones, setTimezones] = useState({
    paris: "--:--",
    jakarta: "--:--",
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const formatTime = (timeZone: string) =>
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone,
        }).format(now);

      setTimezones({
        paris: formatTime("Europe/Paris"),
        jakarta: formatTime("Asia/Jakarta"),
      });
    };

    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  // Magnetic refs for CTA buttons
  const contactBtnRef = useMagneticEffect<HTMLButtonElement>({
    strength: 0.3,
    cursorVariant: "hover",
    cursorLabel: "CONTACT",
  });

  const menuBtnRef = useMagneticEffect<HTMLButtonElement>({
    strength: 0.3,
    cursorVariant: "hover",
    cursorLabel: "MENU",
  });

  // Dynamic Scroll Spy: orange dot tracks active section in view
  useEffect(() => {
    if (!isLoaded) return;

    const updateActiveSection = () => {
      const sectionElements = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      })).filter((s): s is { id: string; el: HTMLElement } => s.el !== null);

      if (sectionElements.length === 0) return;

      const viewportAnchor = window.innerHeight * 0.35;
      let active = sectionElements[0].id;

      for (const { id, el } of sectionElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportAnchor) {
          active = id;
        }
      }

      setActiveNav(active);
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    updateActiveSection();

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, [isLoaded]);

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const target = document.getElementById(id);
    if (target) {
      const targetTop = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    }
  };

  if (!isLoaded) return null;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[var(--color-obsidian)]/80 backdrop-blur-md border-b border-[var(--color-hairline-dark)] px-4 md:px-8 flex items-center justify-between select-none transition-all duration-500">
      <GridCrosshair position="bottom-left" />
      <GridCrosshair position="bottom-right" />

      {/* Left: Brand Monogram + Studio Timezone */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => scrollToSection("hero")}
          aria-label="NOIR // KINETIC - Scroll to vision overview"
          className="font-display font-extrabold tracking-tighter text-base hover:text-[var(--color-terracotta-volt)] transition-colors flex items-center gap-2 group cursor-pointer"
        >
          <span className="w-2 h-2 bg-[var(--color-terracotta-volt)] inline-block transform rotate-45 group-hover:rotate-90 transition-transform duration-300" />
          <span>NOIR // KINETIC</span>
        </button>

        <div className="hidden sm:flex items-center text-xs font-mono text-[var(--color-editorial-bone)]/50 tracking-wider">
          <span className="text-[var(--color-hairline-dark)]">/</span>
          <span className="mx-2">
            ( PAR {timezones.paris} {"//"} JKT {timezones.jakarta} )
          </span>
        </div>
      </div>

      {/* Center: Monospace Quick Anchor Navigation */}
      <nav className="hidden lg:flex items-center gap-8 font-mono text-xs tracking-widest text-[var(--color-editorial-bone)]/70">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              aria-label={`Scroll to section ${item.label}`}
              className="flex items-center gap-1.5 hover:text-[var(--color-editorial-bone)] transition-colors cursor-pointer py-1 group"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[var(--color-terracotta-volt)] scale-100 shadow-[0_0_8px_var(--color-terracotta-volt)]"
                    : "bg-transparent scale-0 group-hover:scale-75 group-hover:bg-[var(--color-editorial-bone)]/40"
                }`}
              />
              <span className="text-[var(--color-editorial-bone)]/40">
                {item.number}.
              </span>
              <span className={isActive ? "text-[var(--color-editorial-bone)] font-semibold" : ""}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right: Contact CTA Button with Thumbnail Preview + Menu Toggle */}
      <div className="flex items-center gap-3">
        {/* Contact CTA with miniature thumbnail preview */}
        <button
          ref={contactBtnRef}
          onClick={() => scrollToSection("contact")}
          aria-label="Contact Us - Open transmission terminal"
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider border border-[var(--color-hairline-dark)] hover:border-[var(--color-terracotta-volt)] bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] transition-all cursor-pointer group"
        >
          {/* Miniature 3x3 pixel grid thumbnail */}
          <span className="grid grid-cols-2 gap-0.5 w-3 h-3 p-0.5 border border-[var(--color-editorial-bone)]/40 group-hover:border-[var(--color-terracotta-volt)] transition-colors">
            <span className="bg-[var(--color-terracotta-volt)]" />
            <span className="bg-[var(--color-editorial-bone)]/30 group-hover:bg-[var(--color-terracotta-volt)]/60" />
            <span className="bg-[var(--color-editorial-bone)]/30 group-hover:bg-[var(--color-terracotta-volt)]/60" />
            <span className="bg-[var(--color-terracotta-volt)]" />
          </span>
          <span>CONTACT US</span>
          <span className="text-[var(--color-terracotta-volt)] font-bold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
            ↗
          </span>
        </button>

        {/* Menu Toggle Button (Nothin' Creative Studio style) */}
        <button
          ref={menuBtnRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono uppercase tracking-widest border transition-all cursor-pointer ${
            isMenuOpen
              ? "border-[var(--color-terracotta-volt)] bg-[var(--color-terracotta-volt)] text-[var(--color-obsidian)] font-bold"
              : "border-[var(--color-hairline-dark)] hover:border-[var(--color-editorial-bone)] bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)]"
          }`}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span>{isMenuOpen ? "CLOSE" : "MENU"}</span>
          <span className={isMenuOpen ? "text-[var(--color-obsidian)]" : "text-[var(--color-terracotta-volt)]"}>
            ::
          </span>
        </button>
      </div>
    </header>
  );
}
