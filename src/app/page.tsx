import HeroSection from "@/components/dom/HeroSection";
import MetricsBentoSection from "@/components/dom/MetricsBentoSection";
import WorksShowcaseSection from "@/components/dom/WorksShowcaseSection";
import SpatialGallerySection from "@/components/dom/SpatialGallerySection";
import FormatsStickySection from "@/components/dom/FormatsStickySection";
import PocketHudSection from "@/components/dom/PocketHudSection";
import KineticFooter from "@/components/dom/KineticFooter";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-transparent text-[var(--color-editorial-bone)] p-4 sm:p-6 md:p-10 pt-20 sm:pt-24 md:pt-28 block relative">
      {/* Section 01: Hero Display Section */}
      <HeroSection />

      {/* Section 02: Dynamic Metrics & Architecture Bento Grid */}
      <MetricsBentoSection />

      {/* Section 03: Avant-Garde Portfolio Showcase */}
      <WorksShowcaseSection />

      {/* Section 03b: Spatial Museum Gallery & Manifesto Video Transition */}
      <SpatialGallerySection />

      {/* Section 04: Sticky Split-Screen Format Comparison & ROI Simulator */}
      <FormatsStickySection />

      {/* Section 05: "System in Your Pocket" Camera HUD Section */}
      <PocketHudSection />

      {/* Section 06: Accordion Specs & Kinetic Footer Terminal */}
      <KineticFooter />
    </main>
  );
}
