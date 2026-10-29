"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppStore, type CursorVariant } from "@/store/useAppStore";

interface MagneticOptions {
  strength?: number;
  cursorVariant?: CursorVariant;
  cursorLabel?: string;
  enabled?: boolean;
}

export function useMagneticEffect<T extends HTMLElement = HTMLElement>(
  options: MagneticOptions = {}
) {
  const {
    strength = 0.35,
    cursorVariant = "hover",
    cursorLabel = "",
    enabled = true,
  } = options;

  const elementRef = useRef<T | null>(null);
  const setCursorVariant = useAppStore((s) => s.setCursorVariant);
  const setCursorLabel = useAppStore((s) => s.setCursorLabel);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || !enabled) return;

    // Skip on touch-only devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.3,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.3,
      ease: "power3.out",
    });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      xTo(deltaX);
      yTo(deltaY);
    };

    const handlePointerEnter = () => {
      setCursorVariant(cursorVariant);
      if (cursorLabel) {
        setCursorLabel(cursorLabel);
      }
    };

    const handlePointerLeave = () => {
      setCursorVariant("default");
      setCursorLabel("");
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerenter", handlePointerEnter);
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointerleave", handlePointerLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, cursorVariant, cursorLabel, enabled, setCursorVariant, setCursorLabel]);

  return elementRef;
}
