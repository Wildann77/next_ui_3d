"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Preloader from "@/components/dom/Preloader";
import HudNavbar from "@/components/dom/HudNavbar";
import FullscreenMenu from "@/components/dom/FullscreenMenu";
import CustomCursor from "@/components/dom/CustomCursor";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useSmoothScroll();

  return (
    <>
      <Preloader />
      <CustomCursor />
      <HudNavbar />
      <FullscreenMenu />
      {children}
    </>
  );
}
