# TASK.md — Peta Jalan & Checklist Eksekusi Proyek ("NOIR // KINETIC")

Dokumen ini berisi rincian langkah kerja (*actionable engineering tasks*) dari tahap inisialisasi hingga rilis produksi untuk membangun website yang memadukan estetika **Industrial Brutalism** dari [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/) dan **Avant-Garde 3D Editorial** dari [Nothin' Creative Studio](https://www.noth.in/).

## Ringkasan Fase Pengerjaan

| Fase | Nama Fase | Fokus Utama | Deliverable Utama |
| :--- | :--- | :--- | :--- |
| **Fase 1** | **Scaffolding & Design System** | Setup [Next.js 16](https://nextjs.org/), [React 19.3](https://react.dev/blog/2026/09/09/react-19-3), [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-1), & *Swiss Grid* | Struktur proyek berjalan dengan sistem *font*, warna OKLCH, dan *grid* `1px` |
| **Fase 2** | **Core Motion, Preloader, & Navigation** | Integrasi [Lenis](https://lenis.dev/), [GSAP](https://gsap.com/), *Preloader* 0–100%, HUD Navbar, & Kursor | Pengalaman navigasi, *smooth scroll*, dan transisi warna latar berfungsi penuh |
| **Fase 3** | **WebGL 3D Pipeline & Hero Sculpture** | Setup [Three.js](https://threejs.org/) + [@react-three/fiber](https://www.npmjs.com/package/@react-three/fiber), *Single Canvas*, & *Shader* 3D | Objek 3D metalik di *Hero* dan distorsi gambar portofolio bereaksi terhadap kursor |
| **Fase 4** | **Pembangunan Seksi Konten & Interaksi** | Implementasi *Bento Metrics*, *Works Showcase*, *Sticky Formats*, & *Pocket HUD* | Seluruh 6 seksi halaman selesai dengan animasi `ScrollTrigger` dan kalkulator interaktif |
| **Fase 5** | **Optimasi GPU, Aksesibilitas, & QA** | Kompresi `.glb`, *GPU tiering*, audit Lighthouse, & *deployment* | Website siap produksi dengan 60 FPS stabil dan skor performa tinggi |

## Fase 1: Inisialisasi Proyek & Fondasi Design System

- [x] **1.1. Inisialisasi Proyek Next.js 16 & React 19.3**
  - [x] Jalankan instalasi proyek baru dengan [Next.js 16](https://nextjs.org/docs/app/getting-started/installation) menggunakan TypeScript, App Router, dan **Turbopack** (`bunx create-next-app@latest noir-kinetic --typescript --tailwind --app --turbopack`).
  - [x] Aktifkan `reactCompiler: true` di dalam `next.config.ts` untuk memanfaatkan kompilator otomatis dari [React 19.3](https://react.dev/blog/2026/09/09/react-19-3).
  - [x] Konfigurasikan aturan pemuatan file *shader* (`.glsl`, `.vert`, `.frag`) sebagai *raw string* di pengaturan Turbopack pada `next.config.ts`.
- [x] **1.2. Instalasi Dependensi Animasi & 3D Terbaru**
  - [x] Instal paket *smooth scroll* dan animasi: `lenis`, `gsap`, dan `@gsap/react` ([GSAP Docs](https://gsap.com/docs/v3/)).
  - [x] Instal ekosistem 3D WebGL: `three`, `@types/three`, [`@react-three/fiber`](https://www.npmjs.com/package/@react-three/fiber) (`^9.8.2`), dan [`@react-three/drei`](https://www.npmjs.com/package/@react-three/drei) (`^10.7.9`).
  - [x] Instal manajemen *state* ringan `zustand` (`^5.0.0`).
- [x] **1.3. Konfigurasi Token Tailwind CSS v4 & Tipografi**
  - [x] Muat 3 *variable font* lokal (`Syne`, `Neue Montreal`, dan `JetBrains Mono`) di `src/app/layout.tsx` menggunakan `next/font/local` dengan `display: "swap"`.
  - [x] Definisikan token warna OKLCH (`--color-obsidian`, `--color-industrial-sage`, `--color-editorial-bone`, `--color-terracotta-volt`) dan utilitas `.brutalist-cell` di dalam blok `@theme` pada `src/app/globals.css` sesuai panduan [Tailwind CSS v4](https://tailwindcss.com/docs).
- [x] **1.4. Pembuatan Komponen Ornamen Brutalist & Atmosfer**
  - [x] Bangun komponen `<FilmGrainOverlay />` menggunakan efek SVG `feTurbulence` ringan atau kanvas *noise* statis beropasitas `3.5%`.
  - [x] Bangun komponen `<GridCrosshair />` untuk menampilkan tanda `+` mikro di setiap sudut persimpangan sel *grid* seperti pada [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/).


## Fase 2: Core Motion Engine, Preloader, & Sistem Navigasi

- [x] **2.1. Manajemen State Global (`useAppStore.ts`)**
  - [x] Buat *store* Zustand untuk menyimpan `isLoaded` (status *preloader*), `isMenuOpen` (status modal menu), `cursorVariant` (`"default" | "hover" | "drag" | "view"`), `cursorLabel`, `scrollVelocity`, dan `activeTheme` (`"dark" | "sage" | "light" | "orange"`).
- [x] **2.2. Sinkronisasi Lenis Smooth Scroll & GSAP Ticker**
  - [x] Buat *hook* `useSmoothScroll.ts` yang menghubungkan instance [Lenis](https://lenis.dev/) dengan `gsap.ticker` dan `ScrollTrigger.update()`.
  - [x] Pastikan *scroll* terkunci (`lenis.stop()`) selama *preloader* berjalan atau saat *Full-Screen Menu* sedang terbuka, lalu aktif kembali (`lenis.start()`) setelah selesai.
- [x] **2.3. Pembangunan Tactile Boot Preloader (`Preloader.tsx`)**
  - [x] Gunakan `useProgress()` dari [`@react-three/drei`](https://www.npmjs.com/package/@react-three/drei) untuk membaca persentase pemuatan aset 3D secara nyata (`0%` hingga `100%`).
  - [x] Buat tampilan latar oranye `--color-terracotta-volt` dengan angka persentase raksasa (`15vw`) dan daftar status pemuatan *monospace* ala [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/).
  - [x] Rancang timeline [GSAP](https://gsap.com/) untuk membelah layar *preloader* ke atas saat mencapai `100%` dan memicu animasi masuk pada *Hero Section*.
- [x] **2.4. HUD Top Navbar & Full-Screen Overlay Menu**
  - [x] Bangun `<HudNavbar />` dengan jam *real-time* multi-zona waktu, tautan seksi bernomor (`01`–`04`), tombol `CONTACT US` ber-thumbnail, dan tombol `MENU ::` ala [Nothin' Creative Studio](https://www.noth.in/).
  - [x] Bangun `<FullscreenMenu />` dengan animasi bukaan *clip-path* menggunakan [GSAP](https://gsap.com/) dan efek teks bergulir (*kinetic marquee*) saat item menu di-*hover*.
- [x] **2.5. Custom Dual-State Magnetic Cursor (`CustomCursor.tsx`)**
  - [x] Implementasikan pengikut kursor menggunakan `gsap.quickTo()` untuk performa 60 FPS tanpa memicu *re-render* React.
  - [x] Buat *hook* `useMagneticEffect.ts` untuk memberikan efek tarikan pegas pada tombol CTA dan *floating badge* `ASK US`.

## Fase 3: Pipeline 3D WebGL & Shader Interaktif

- [x] **3.1. Arsitektur Single Persistent Canvas (`GlobalCanvas.tsx`)**
  - [x] Pasang komponen `<GlobalCanvas />` di dalam `src/app/layout.tsx` menggunakan `<View.Port />` dari [`@react-three/drei`](https://www.npmjs.com/package/@react-three/drei) agar seluruh objek 3D di berbagai seksi dirender dalam satu konteks WebGL [Three.js](https://threejs.org/).
- [x] **3.2. Hero 3D Interactive Chrome Sculpture (`HeroMetallicMesh.tsx`)**
  - [x] Siapkan geometri 3D *inflated torus / abstract knot* dari [Blender](https://www.blender.org/) atau [Spline](https://spline.design/) dan kompres ke format `.glb`.
  - [x] Tulis *custom vertex & fragment shader* (`liquidChrome.vert.glsl` & `liquidChrome.frag.glsl`) atau gunakan `MeshTransmissionMaterial` dengan *chromatic aberration* yang merespons posisi kursor (`uMouse`) dan kecepatan gulir (`uVelocity`) seperti objek utama di [Nothin' Creative Studio](https://www.noth.in/).
  - [x] Tambahkan interaksi *drag-to-rotate* dengan pegas kembali ke posisi semula.
- [x] **3.3. Shader Distorsi Gambar untuk Galeri Portofolio (`WorkDistortionPlane.tsx`)**
  - [x] Buat bidang 3D (`<mesh>` dengan `planeGeometry(1, 1, 32, 32)`) yang mengikuti posisi kursor saat pengguna melayang di atas baris proyek portofolio.
  - [x] Tambahkan *fragment shader* `rgbWaveHover.frag.glsl` yang memisahkan saluran warna R, G, dan B serta melengkungkan gambar berdasarkan kecepatan geser *mouse*.

## Fase 4: Pembangunan Seksi Halaman & Interaksi Konten

- [x] **4.1. Section 01: Hero Section (`HeroSection.tsx`)**
  - [x] Susun tipografi judul raksasa dengan animasi *split-line masked reveal* menggunakan [GSAP](https://gsap.com/).
  - [x] Buat 3 kartu statistik bawah (`$683K+`, `31% MARGIN`, `6 MONTHS`) dengan garis batas `1px`, font *monospace*, dan tombol `APPLY NOW` magnetik seperti pada [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/).
  - [x] Pasang *floating badge* penghargaan di sisi kiri dan tombol melingkar `ASK US` yang berputar di kanan bawah seperti pada [Nothin' Creative Studio](https://www.noth.in/).
- [x] **4.1b. Hero Section Redesign: Nothin' Monolithic Typography + Centered 3D Torus**
  - [x] Ubah layout Hero menjadi tipografi monolitik raksasa `NOIR // KINETIC` (13vw) membentang dari tepi ke tepi di belakang objek 3D.
  - [x] Posisikan kanvas 3D liquid chrome torus persis di tengah komposisi kanvas dengan depth-layering visual.
  - [x] Pasang manifesto editorial kiri atas: `"NOT A TEMPLATE, AN ARCHITECTURE / BECAUSE NOIR IS KINETIC"` dan tombol kapsul magnetik `[ APPLY FOR CODE → ]`.
  - [x] Pertahankan 3 kotak statistik Mr. BLACK dan peripheral badges (SOTD Honors & Ask Us).
- [x] **4.2. Section 02: Dynamic Metrics & Bento Grid (`MetricsBentoSection.tsx`)**
  - [x] Pasang pemicu `ScrollTrigger` untuk mengubah warna latar halaman secara halus dari `--color-obsidian` ke `--color-industrial-sage`.
  - [x] Bangun kartu *Bento Grid* 4×2 dengan penghitung angka otomatis (*odometer counter*), grafik SVG teranimasi, dan *border spotlight* yang menyala mengikuti posisi kursor.
- [x] **4.3. Section 03: Avant-Garde Portfolio Showcase (`WorksShowcaseSection.tsx`)**
  - [x] Buat daftar baris karya (*UTOPIA*, *AURBSE*, *IN_COGNITA*, *HAPTIFY*, *LGM*) lengkap dengan filter kategori bergaya tanda kurung `( ALL )`, `( BRANDING )`, `( WEBGL )`, `( AI SYSTEMS )` mengadaptasi [Nothin' Works](https://www.noth.in/works).
  - [x] Hubungkan peristiwa `onPointerMove` di setiap baris ke komponen `<WorkDistortionPlane />` dan tambahkan transisi detail menggunakan *View Transitions* di [React 19.3](https://react.dev/blog/2026/09/09/react-19-3).
- [x] **4.3b. Spatial Museum Gallery & Manifesto Video Transition (`SpatialGallerySection.tsx`)**
  - [x] Bangun komponen `SpatialGallerySection.tsx` di antara Section 03 (Works) dan Section 04 (Formats).
  - [x] Pasang latar museum beton brutalist dengan lampu tabung neon dan bingkai layar bioskop 16:9.
  - [x] Integrasikan dual-video player: video utama manifesto + refleksi lantai real-time (`scaleY(-1)`).
  - [x] Terapkan arsitektur CSS Sticky Track (`h-[300vh]`, `w-screen`) dengan *deep dolly zoom-out* (`scale: 2.2` ➔ `0.68`) dari kondisi awal video *full-screen* hingga masuk jauh ke dinding galeri museum.
  - [x] Tambahkan tombol audio HUD toggle `SOUND [ON // OFF]` di bagian atas tengah layar.
- [x] **4.4. Section 04: Sticky Split-Screen Format Comparison (`FormatsStickySection.tsx`)**
  - [x] Buat transisi latar ke warna terang `--color-editorial-bone` (`#F3ECE1`) saat memasuki seksi ini.
  - [x] Kunci (*pin*) kolom kiri menggunakan [GSAP ScrollTrigger](https://gsap.com/docs/v3/) yang menampilkan `<FormatModelViewer />` (model 3D yang bertransformasi antara **01 / COMPACT CORE** dan **02 / FLAGSHIP LOUNGE**).
  - [x] Buat kalkulator ROI interaktif di kolom kanan dengan *slider* investasi yang langsung memperbarui estimasi laba bulanan dan durasi balik modal secara *real-time*.
- [x] **4.5. Section 05: "System in Your Pocket" Camera/HUD Section (`PocketHudSection.tsx`)**
  - [x] Rancang bingkai jendela bidik kamera digital (`REC ●`, *timecode* aktif, koordinat *grid*) di sekeliling *mockup* antarmuka ponsel/dasbor ala [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/).
  - [x] Buat pengalih *tab* interaktif dengan efek transisi *scanline* saat berpindah antar-fitur otomasi.
- [x] **4.6. Section 06: Accordion Specs & Kinetic Footer (`KineticFooter.tsx`)**
  - [x] Bangun komponen *Accordion* untuk 5 tahapan *Turnkey Support* dan FAQ dengan animasi tinggi elemen yang mulus.
  - [x] Buat seksi penutup berlatar `--color-terracotta-volt` (`#FF5500`) dengan teks *infinite marquee* dan formulir kontak yang terhubung ke *React 19 Server Actions* (`useActionState`).

## Fase 5: Optimasi Performa, Audit Aksesibilitas, & Deployment

- [x] **5.1. Adaptive GPU Tiering & Fallback Mobile**
  - [x] Implementasikan `useGpuTier.ts` untuk menurunkan `dpr` kanvas ke `1` dan menonaktifkan *post-processing* berat pada perangkat seluler kelas bawah agar frame rate tetap terkunci di **60 FPS**.
  - [x] Uji dukungan `@media (prefers-reduced-motion: reduce)` untuk memastikan pengguna yang sensitif terhadap gerakan tetap dapat mengakses seluruh konten dengan nyaman.
- [x] **5.1b. Peningkatan Responsivitas Mobile & Standar Touch Gestures**
  - [x] Implementasikan `touch-action: pan-y` pada canvas 3D View tunnel agar scroll vertikal lancar tanpa terhalang drag rotasi 3D.
  - [x] Adaptasikan `SpatialGallerySection.tsx`: track `h-[180vh]` di mobile (vs `h-[300vh]` desktop) dan video scale `w-[90vw]`.
  - [x] Tambahkan thumbnail preview gambar inline pada baris proyek `WorksShowcaseSection.tsx` khusus viewport mobile.
  - [x] Koreksi `min-h-[1400px]` pada `FormatsStickySection.tsx` menjadi `min-h-0 lg:min-h-[1400px]` untuk eliminasi whitespace kosong di mobile.
  - [x] Fine-tuning tipografi Hero `NOIR // KINETIC` dan padding container pada layar sempit (< 400px).
- [x] **5.2. Audit Core Web Vitals & SEO**
  - [x] Pastikan seluruh aset model `.glb` di bawah `850 KB` dan gambar pratinjau portofolio menggunakan format **AVIF/WebP**.
  - [x] Tambahkan metadata OpenGraph, JSON-LD *structured data*, dan uji skor Lighthouse (target: **Performance ≥ 92**, **Accessibility 100**, **Best Practices 100**, **SEO 100**).
- [ ] **5.3. Deployment Produksi**
  - [ ] Hubungkan repositori ke pipeline CI/CD untuk *preview deployment* otomatis dan rilis ke jaringan *edge* global.
