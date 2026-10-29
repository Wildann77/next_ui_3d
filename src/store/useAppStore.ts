import { create } from "zustand";

export type CursorVariant = "default" | "hover" | "drag" | "view";
export type ActiveTheme = "dark" | "sage" | "light" | "orange";

export interface HoveredProject {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
}

export interface AppState {
  isLoaded: boolean;
  isMenuOpen: boolean;
  cursorVariant: CursorVariant;
  cursorLabel: string;
  scrollVelocity: number;
  activeTheme: ActiveTheme;
  hoveredProject: HoveredProject | null;
  gpuTier: 1 | 2 | 3;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  setCursorVariant: (cursorVariant: CursorVariant) => void;
  setCursorLabel: (cursorLabel: string) => void;
  setScrollVelocity: (scrollVelocity: number) => void;
  setActiveTheme: (activeTheme: ActiveTheme) => void;
  setHoveredProject: (hoveredProject: HoveredProject | null) => void;
  setGpuTier: (gpuTier: 1 | 2 | 3) => void;
  setIsMobile: (isMobile: boolean) => void;
  setPrefersReducedMotion: (prefersReducedMotion: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoaded: false,
  isMenuOpen: false,
  cursorVariant: "default",
  cursorLabel: "",
  scrollVelocity: 0,
  activeTheme: "dark",
  hoveredProject: null,
  gpuTier: 2,
  isMobile: false,
  prefersReducedMotion: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
  setCursorVariant: (cursorVariant) => set({ cursorVariant }),
  setCursorLabel: (cursorLabel) => set({ cursorLabel }),
  setScrollVelocity: (scrollVelocity) => set({ scrollVelocity }),
  setActiveTheme: (activeTheme) => set({ activeTheme }),
  setHoveredProject: (hoveredProject) => set({ hoveredProject }),
  setGpuTier: (gpuTier) => set({ gpuTier }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setPrefersReducedMotion: (prefersReducedMotion) => set({ prefersReducedMotion }),
}));

