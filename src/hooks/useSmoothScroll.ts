"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/useAppStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useSmoothScroll() {
  const setScrollVelocity = useAppStore((s) => s.setScrollVelocity);
  const isLoaded = useAppStore((s) => s.isLoaded);
  const isMenuOpen = useAppStore((s) => s.isMenuOpen);
  const prefersReducedMotion = useAppStore((s) => s.prefersReducedMotion);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // If reduced motion is requested, do not run smooth inertia scroll
    if (prefersReducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      setScrollVelocity(0);

      const onNativeScroll = () => {
        ScrollTrigger.update();
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onNativeScroll);
      };
    }

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Initially stop scroll while preloader is active
    if (!useAppStore.getState().isLoaded) {
      lenis.stop();
    }

    const onScroll = (instance: Lenis) => {
      ScrollTrigger.update();
      setScrollVelocity(instance.velocity);
    };

    lenis.on("scroll", onScroll);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setScrollVelocity, prefersReducedMotion]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis || prefersReducedMotion) return;

    if (!isLoaded || isMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  }, [isLoaded, isMenuOpen, prefersReducedMotion]);

  return lenisRef;
}

