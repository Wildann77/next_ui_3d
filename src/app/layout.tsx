import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { FilmGrainOverlay } from "@/components/dom/FilmGrainOverlay";
import GlobalCanvas from "@/components/canvas/GlobalCanvas";
import ClientProviders from "@/components/dom/ClientProviders";
import "./globals.css";

const syne = localFont({
  src: "../../public/fonts/Syne-Variable.woff2",
  variable: "--font-syne",
  display: "swap",
  weight: "400 800",
});

const neueMontreal = localFont({
  src: "../../public/fonts/NeueMontreal-Variable.woff2",
  variable: "--font-neue-montreal",
  display: "swap",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "../../public/fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: "100 800",
});

export const viewport: Viewport = {
  themeColor: "#0E0E0E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://noir-kinetic.studio"),
  title: {
    default: "NOIR // KINETIC — Brutalist Luxury Meets Avant-Garde 3D",
    template: "%s | NOIR // KINETIC",
  },
  description:
    "Spatial editorial case study and portfolio combining Industrial Brutalism and Avant-Garde 3D WebGL interactions. High-performance Next.js 16 + React 19.3.",
  keywords: [
    "Industrial Brutalism",
    "Avant-Garde 3D",
    "WebGL Portfolio",
    "Three.js",
    "React Three Fiber",
    "Next.js 16 App Router",
    "React 19",
    "Tailwind CSS v4",
    "Spatial Computing",
    "Creative Development",
  ],
  authors: [
    { name: "NOIR // KINETIC Studio", url: "https://noir-kinetic.studio" },
  ],
  creator: "NOIR // KINETIC",
  publisher: "NOIR // KINETIC",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NOIR // KINETIC — Brutalist Luxury Meets Avant-Garde 3D",
    description:
      "Spatial editorial case study and portfolio combining Industrial Brutalism and Avant-Garde 3D WebGL interactions.",
    url: "https://noir-kinetic.studio",
    siteName: "NOIR // KINETIC",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "NOIR // KINETIC Brutalist Luxury 3D Spatial Architecture",
        type: "image/webp",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOIR // KINETIC — Brutalist Luxury Meets Avant-Garde 3D",
    description:
      "Spatial editorial case study and portfolio combining Industrial Brutalism and Avant-Garde 3D WebGL interactions.",
    images: ["/images/og-image.webp"],
    creator: "@noirkinetic",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://noir-kinetic.studio/#website",
      url: "https://noir-kinetic.studio",
      name: "NOIR // KINETIC",
      description:
        "Spatial editorial case study and portfolio combining Industrial Brutalism and Avant-Garde 3D WebGL interactions.",
      publisher: {
        "@id": "https://noir-kinetic.studio/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://noir-kinetic.studio/#organization",
      name: "NOIR // KINETIC",
      url: "https://noir-kinetic.studio",
      logo: "https://noir-kinetic.studio/images/og-image.webp",
      sameAs: [
        "https://github.com/noir-kinetic",
        "https://twitter.com/noirkinetic",
      ],
      knowsAbout: [
        "WebGL",
        "Three.js",
        "React 19",
        "Spatial UX",
        "Brutalist Design",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${neueMontreal.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] min-h-screen relative selection:bg-[var(--color-terracotta-volt)] selection:text-[var(--color-obsidian)]">
        <FilmGrainOverlay />
        <GlobalCanvas />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
