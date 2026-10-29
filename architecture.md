# ARCHITECTURE.md — Arsitektur Sistem & Frontend Modern (Stack 2026)

Dokumen ini menetapkan arsitektur teknis, pemilihan teknologi terbaru (Oktober 2026), struktur direktori proyek, alur sinkronisasi *render loop* antara DOM dan WebGL, serta strategi optimasi performa untuk membangun website bergaya [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/) dan [Nothin' Creative Studio](https://www.noth.in/).

## 1. Spesifikasi Tech Stack Terbaru (Standar Produksi Akhir 2026)

Seluruh pustaka dan *framework* di bawah ini menggunakan versi rilis stabil terbaru per Oktober 2026—menghindari *tooling* lawas seperti Webpack, `tailwind.config.js` berbasis CommonJS, `forwardRef` lama, atau Next.js 14/15 (mengingat Next.js 15 telah memasuki masa *End-of-Life* pada Oktober 2026 menurut [Next.js Support Timeline](https://www.herodevs.com/blog-posts/nextjs-eol-dates-version-support-timeline)).

| Lapisan Arsitektur | Teknologi & Paket Resmi | Versi Target (2026) | Alasan Pemilihan & Fitur Modern yang Digunakan |
| :--- | :--- | :--- | :--- |
| **Core Web Framework** | [Next.js](https://nextjs.org/) ([NPM `next`](https://www.npmjs.com/package/next)) | `v16.4.x` ([Panduan Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16)) | Menggunakan **App Router**, **Turbopack** sebagai *bundler* bawaan super cepat, model *caching* eksplisit terbaru, dan dukungan penuh React 19.3. |
| **UI Library & Compiler** | [React](https://react.dev/versions) & `babel-plugin-react-compiler` | `v19.3.x` ([Rilis React 19.3](https://react.dev/blog/2026/09/09/react-19-3)) | Memanfaatkan **React Compiler 1.0** (memoisasi otomatis tanpa `useMemo`/`useCallback` manual), `ref` sebagai *prop* biasa, *Server Actions* untuk formulir, dan *View Transitions*. |
| **Styling & Design Tokens** | [Tailwind CSS](https://tailwindcss.com/) | `v4.1.x` ([Tailwind CSS v4.1](https://tailwindcss.com/blog/tailwindcss-v4-1)) | Mesin **Oxide** berbasis Rust (~10x lebih cepat), konfigurasi **CSS-first** langsung di file `.css` via direktif `@theme` (tanpa `tailwind.config.js`), *native container queries*, dan utilitas *text-shadow*. |
| **3D Engine & WebGL/WebGPU** | [Three.js](https://threejs.org/) + [@react-three/fiber](https://www.npmjs.com/package/@react-three/fiber) + [@react-three/drei](https://www.npmjs.com/package/@react-three/drei) | `three` Terbaru + R3F `v9.8.x` + Drei `v10.7.x` | Deklarasi adegan 3D reaktif di React 19, mendukung *custom GLSL/TSL shaders*, *Environment maps*, `MeshTransmissionMaterial`, dan pemuatan model `.glb` terkompresi Draco/Meshopt. |
| **Choreography & Scroll Animation** | [GSAP](https://gsap.com/) + `@gsap/react` | `v3.12+` ([Dokumentasi GSAP](https://gsap.com/docs/v3/)) | Standar industri pemenang [Awwwards](https://www.awwwards.com/websites/gsap/) untuk animasi `ScrollTrigger`, *pinning* seksi, *split-text*, dan `gsap.quickTo()` untuk kursor magnetik dengan pembersihan memori otomatis via `useGSAP()`. |
| **Smooth Inertial Scrolling** | [Lenis](https://lenis.dev/) (`lenis/react`) | Versi Terbaru (`< 5KB`) | Menjaga posisi *scroll* DOM dan kanvas WebGL [Three.js](https://threejs.org/) tetap sinkron *frame-by-frame* tanpa membajak *scrollbar* asli browser. |
| **Global State Management** | `zustand` | `v5.x` | Penyimpanan *state* super ringan (tanpa *re-render* berlebih) untuk menghubungkan progres *preloader*, status menu *overlay*, varian kursor, dan koordinat *scroll* ke dalam *render loop* 3D. |
| **3D Asset Pipeline** | [Blender](https://www.blender.org/) / [Spline](https://spline.design/) + `gltf-transform` | Blender 4.x / Spline V2 | Pembuatan model *inflated chrome sculpture*, kompresi tekstur ke format **KTX2 / WebP**, dan kompresi geometri dengan **Meshopt / Draco**. |
| **Type Safety, Linting, & Runtime** | TypeScript + Biome + Bun / pnpm | TS `v5.7+` | Pemeriksaan tipe ketat (`strict: true`) termasuk tipe *shader uniforms* dan pemformatan kode instan. |

## 2. Arsitektur Hybrid DOM + Single Persistent WebGL Canvas ("View Tunnel Pattern")

Salah satu kesalahan paling umum pada website 3D adalah membuat banyak elemen `<canvas>` di setiap seksi, yang menyebabkan batas *WebGL Context* browser habis dan halaman menjadi patah-patah (*jank*). Arsitektur proyek ini menerapkan pola **Single Persistent Canvas with Viewport Scissoring**:

1. **Lapisan Dasar (DOM Layer):** Seluruh teks, garis *grid* `1px`, tabel perbandingan, dan formulir dirender sebagai HTML/CSS semantik melalui *React Server Components* (RSC) di [Next.js 16](https://nextjs.org/) agar ramah SEO dan langsung tampil instan.
2. **Lapisan Kanvas Tunggal (Persistent WebGL Layer):** Hanya ada **satu** `<Canvas>` dari [@react-three/fiber](https://www.npmjs.com/package/@react-three/fiber) dengan posisi `fixed inset-0 pointer-events-none z-[15]` (berada di atas background transparan/DOM layer `z-0` dan di bawah interaktif controls `z-20`).
3. **Portal `<View>` dari [@react-three/drei](https://www.npmjs.com/package/@react-three/drei):** Setiap seksi HTML yang membutuhkan objek 3D (seperti *Hero 3D Metallic Torus*, *Section 03 Portfolio Hover Distortion Plane*, dan *Section 04 Format 3D Switcher*) cukup meletakkan `<div ref={viewRef}>` di dalam *grid* HTML. Komponen `<View track={viewRef}>` akan memotong (*scissor*) area kanvas 3D tepat mengikuti posisi dan ukuran elemen HTML tersebut saat pengguna menggulir halaman.
4. **Unified Ticker Loop:** *Ticker* dari [Lenis](https://lenis.dev/), [GSAP](https://gsap.com/), dan `useFrame` pada [@react-three/fiber](https://www.npmjs.com/package/@react-three/fiber) diikat ke dalam satu siklus `requestAnimationFrame` terpusat sehingga tidak ada selisih *frame* (*scroll jitter*) antara garis *grid* HTML dan objek 3D.

## 3. Struktur Direktori Proyek (Next.js 16 App Router)

```text
noir-kinetic-web/
├── public/
│   ├── fonts/                         # Variable fonts (.woff2): Syne, NeueMontreal, JetBrainsMono
│   ├── models/                        # Aset 3D terkompresi Meshopt/Draco (.glb)
│   │   ├── hero-inflated-torus.glb    # Objek 3D utama gaya Nothin'
│   │   └── format-spatial-pod.glb     # Model 3D perbandingan paket gaya Mr. BLACK
│   └── textures/                      # Tekstur KTX2, Matcap metalik, & HDRI ringan
├── src/
│   ├── app/
│   │   ├── globals.css                # Konfigurasi Tailwind CSS v4 (@import "tailwindcss"; @theme)
│   │   ├── layout.tsx                 # Root Server Layout (Font loading, Metadata, Persistent Canvas)
│   │   └── page.tsx                   # Komposisi utama seksi halaman (Server + Client Islands)
│   ├── components/
│   │   ├── canvas/                    # Komponen WebGL / Three.js (Client Components)
│   │   │   ├── GlobalCanvas.tsx       # Single persistent <Canvas> dengan View.Port
│   │   │   ├── HeroMetallicMesh.tsx   # Objek 3D interaktif + fisika kursor & chromatic dispersion
│   │   │   ├── WorkDistortionPlane.tsx# Plane WebGL untuk preview gambar portofolio saat hover
│   │   │   ├── FormatModelViewer.tsx  # Model 3D yang berubah saat toggle Format 01 / 02
│   │   │   └── shaders/               # Kode GLSL / TSL (Vertex & Fragment Shaders)
│   │   │       ├── liquidChrome.vert.glsl
│   │   │       ├── liquidChrome.frag.glsl
│   │   │       └── rgbWaveHover.frag.glsl
│   │   ├── dom/                       # Komponen UI & Layout Brutalist Grid
│   │   │   ├── Preloader.tsx          # Layar pemuatan 0-100% dengan progress nyata useProgress()
│   │   │   ├── HudNavbar.tsx          # Top bar + jam real-time + tombol MENU ::
│   │   │   ├── FullscreenMenu.tsx     # Overlay menu kinetik gaya Nothin'
│   │   │   ├── CustomCursor.tsx       # Kursor magnetik dual-state dengan gsap.quickTo
│   │   │   ├── GridCrosshair.tsx      # Ornamen tanda '+' di sudut sel grid
│   │   │   └── FilmGrainOverlay.tsx   # Lapisan tekstur grain/noise analog
│   │   └── sections/                  # Seksi-seksi utama halaman
│   │       ├── HeroSection.tsx        # Hero tipografi raksasa + 3D View + 3 kartu metrik
│   │       ├── MetricsBentoSection.tsx# Seksi angka bisnis & grafik SVG terpicu scroll
│   │       ├── WorksShowcaseSection.tsx# Daftar portofolio interaktif gaya Nothin'
│   │       ├── SpatialGallerySection.tsx# Galeri museum brutalist + dual-video dolly zoom
│   │       ├── FormatsStickySection.tsx# Split-screen sticky comparison gaya Mr. BLACK
│   │       ├── PocketHudSection.tsx   # Simulasi UI kamera/aplikasi real-time
│   │       └── KineticFooter.tsx      # Accordion FAQ + Marquee + Server Action Contact Form
│   ├── hooks/
│   │   ├── useSmoothScroll.ts         # Integrasi sinkronisasi Lenis + GSAP ScrollTrigger
│   │   ├── useMagneticEffect.ts       # Hook reusable untuk elemen magnetik
│   │   └── useGpuTier.ts              # Deteksi performa perangkat untuk adaptasi kualitas 3D
│   ├── store/
│   │   └── useAppStore.ts             # Zustand v5 store (preloader, cursor state, active format, theme)
│   └── lib/
│       ├── gsap-config.ts             # Registrasi plugin GSAP (ScrollTrigger, SplitText) terpusat
│       └── actions.ts                 # React 19 Server Actions untuk pengiriman form kontak/franchise
├── next.config.ts                     # Konfigurasi Next.js 16 (Turbopack GLSL loader & React Compiler)
├── package.json                       # Daftar dependensi versi terbaru 2026
└── tsconfig.json                      # Konfigurasi TypeScript ketat
```

## 4. Implementasi Kode Inti Arsitektur

### 4.1. Konfigurasi CSS-First di Tailwind CSS v4 (`src/app/globals.css`)
Di [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4), kita tidak lagi menggunakan `tailwind.config.js`. Seluruh *design token* dideklarasikan langsung menggunakan direktif `@theme` di CSS:

```css
@import "tailwindcss";

@theme {
  /* Token Warna OKLCH */
  --color-obsidian: oklch(14.5% 0 0);
  --color-industrial-sage: oklch(29.2% 0.018 135);
  --color-editorial-bone: oklch(94.1% 0.019 82);
  --color-terracotta-volt: oklch(66.5% 0.225 38);

  /* Token Tipografi */
  --font-display: "Syne", sans-serif;
  --font-sans: "Neue Montreal", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Kurva Animasi Kustom */
  --ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-brutalist: cubic-bezier(0.85, 0, 0.15, 1);
}

/* Utilitas Grid Brutalist 1px */
@utility brutalist-cell {
  border-right: 1px solid var(--border-current, rgba(243, 236, 225, 0.14));
  border-bottom: 1px solid var(--border-current, rgba(243, 236, 225, 0.14));
  position: relative;
}
```

### 4.2. Jembatan Sinkronisasi Lenis + GSAP ScrollTrigger (`src/hooks/useSmoothScroll.ts`)
Agar animasi *pinning* dan perubahan warna latar di [GSAP](https://gsap.com/) tidak bergetar saat digulir dengan [Lenis](https://lenis.dev/), keduanya dihubungkan ke dalam satu *ticker*:

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/useAppStore";

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const setScrollVelocity = useAppStore((s) => s.setScrollVelocity);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothWheel: true,
    });

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      setScrollVelocity(e.velocity);
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, [setScrollVelocity]);
}
```

### 4.3. Single Persistent Canvas & Shader Interaktif (`src/components/canvas/GlobalCanvas.tsx`)
Menggunakan [@react-three/fiber](https://www.npmjs.com/package/@react-three/fiber) v9 dan [@react-three/drei](https://www.npmjs.com/package/@react-three/drei) v10 untuk merender seluruh portal `<View>` dalam satu konteks WebGL:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { View, Preload } from "@react-three/drei";
import { Suspense } from "react";

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[15] overflow-hidden">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <View.Port />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

## 5. Pipeline Aset, Strategi Caching, & Target Performa (Core Web Vitals)

Untuk memastikan website seberat [Nothin' Creative Studio](https://www.noth.in/) dan [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/) tetap memuat dengan sangat cepat, arsitektur ini menerapkan aturan anggaran performa (*performance budget*) yang ketat:

| Metrik / Komponen Aset | Target Batas Maksimal | Strategi Optimasi Teknis |
| :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | `< 1.6 detik` | Teks judul *Hero* dan struktur *grid* dirender langsung dari server (SSR) oleh [Next.js 16](https://nextjs.org/) sebelum bundel WebGL dieksekusi. |
| **Interaction to Next Paint (INP)** | `< 100 ms` | Memindahkan kalkulasi deformasi permukaan 3D ke dalam *Vertex Shader* di GPU, bukan menghitung ulang geometri di *main thread* JavaScript. |
| **Cumulative Layout Shift (CLS)** | `0.00` | Seluruh kontainer `<View>` 3D, gambar, dan *font* variabel (`next/font/local`) memiliki rasio aspek dan ukuran yang telah dikunci sejak awal. |
| **Ukuran Model 3D (`.glb`)** | `< 850 KB` per model | Mengompresi geometri dari [Blender](https://www.blender.org/) menggunakan `gltf-transform meshopt` dan mengubah tekstur ke format GPU-native **KTX2**. |
| **Frame Rate Animasi** | `60 FPS` (Desktop & Mobile) | Menerapkan `frameloop="demand"` atau menghentikan *render* pada `<View>` yang sedang berada di luar layar (*off-screen culling*). |
