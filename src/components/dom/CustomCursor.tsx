"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";

export default function CustomCursor() {
  const cursorVariant = useAppStore((s) => s.cursorVariant);
  const cursorLabel = useAppStore((s) => s.cursorLabel);
  const prefersReducedMotion = useAppStore((s) => s.prefersReducedMotion);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    // Detect coarse/touch screen or reduced motion
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      isTouchRef.current = true;
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Center offsets
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" });

    let isVisible = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (!isVisible) {
        dotX(e.clientX, e.clientX);
        dotY(e.clientY, e.clientY);
        ringX(e.clientX, e.clientX);
        ringY(e.clientY, e.clientY);
        isVisible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.25, overwrite: "auto" });
      } else {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      }
    };

    const handlePointerLeave = () => {
      isVisible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.25, overwrite: "auto" });
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  // Animate ring expansion and label based on variant
  useEffect(() => {
    if (isTouchRef.current) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    const isExpanded = cursorVariant !== "default" || Boolean(cursorLabel);

    if (isExpanded) {
      gsap.to(ring, {
        width: 84,
        height: 84,
        borderColor: "var(--color-terracotta-volt)",
        backgroundColor: "rgba(255, 85, 0, 0.18)",
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(dot, {
        opacity: 0,
        scale: 0,
        duration: 0.2,
        overwrite: "auto",
      });
      gsap.to(label, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        delay: 0.05,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(ring, {
        width: 36,
        height: 36,
        borderColor: "rgba(243, 236, 225, 0.4)",
        backgroundColor: "transparent",
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(dot, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        overwrite: "auto",
      });
      gsap.to(label, {
        opacity: 0,
        scale: 0.8,
        duration: 0.15,
        overwrite: "auto",
      });
    }
  }, [cursorVariant, cursorLabel]);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block"
      style={{ mixBlendMode: "difference" }}
    >
      {/* Outer Magnetic Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-[var(--color-editorial-bone)]/40 flex items-center justify-center transition-colors pointer-events-none will-change-transform"
      >
        <span
          ref={labelRef}
          className="font-mono text-[10px] font-bold tracking-widest text-[var(--color-editorial-bone)] uppercase opacity-0 scale-75 select-none"
        >
          {cursorLabel || (cursorVariant !== "default" ? cursorVariant.toUpperCase() : "")}
        </span>
      </div>

      {/* Inner Pin Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-volt)] pointer-events-none will-change-transform"
      />
    </div>
  );
}
