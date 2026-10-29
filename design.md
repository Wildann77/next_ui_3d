# DESIGN.md — Spesifikasi Sistem Desain UI/UX ("NOIR // KINETIC")

Dokumen ini mendefinisikan secara menyeluruh sistem desain, arah artistik (*art direction*), anatomi komponen, koreografi animasi, serta interaksi 3D WebGL untuk proyek website portofolio & *flagship case study* yang menggabungkan kekuatan visual dari dua referensi utama:
1. **[Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/)** (oleh VIKI.STUDIO & DOLGANEV — pemenang *Site of the Day* di [Muuuuu.org](https://muuuuu.org/industry/restaurant/24878.html)): Menyumbangkan struktur **Industrial Brutalism**, *exposed 1px Swiss grid*, tekstur *film grain/noise*, *preloader* persentase taktil, bingkai HUD/kamera teknis, serta transisi warna latar dinamis saat *scroll*.
2. **[Nothin' Creative Studio](https://www.noth.in/)** (pemenang *Awwwards Site of the Day* & *FWA of the Day*, tercatat di [DesignRush](https://www.designrush.com/agency/profile/nothin)): Menyumbangkan **Avant-Garde Luxury Editorial Typography**, objek **3D WebGL Metalik/Inflated** yang bereaksi secara *real-time* terhadap fisika kursor, navigasi *full-screen overlay*, penanda metadata dalam tanda kurung `( 01 // SECTION )`, serta *floating action badges* magnetik.

## 1. Visi Estetika & Filosofi Desain: "Brutalist Luxury Meets Kinetic 3D"

Website ini dirancang bukan sekadar sebagai halaman informasi statis, melainkan sebagai **pengalaman sinematik interaktif (*spatial editorial experience*)**. Prinsip utamanya meliputi:

* **Tactile Grid Precision (Dari [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/)):** Setiap seksi dibingkai oleh garis pembatas tipis (`1px solid`) yang membentuk struktur *bento/Swiss grid* terbuka. Pengguna dapat merasakan struktur arsitektur halaman melalui persimpangan garis tambah (`+`) di setiap sudut sel *grid*.
* **Surreal 3D Focal Points (Dari [Nothin' Creative Studio](https://www.noth.in/)):** Di atas *grid* yang kaku dan matematis tersebut, melayang objek 3D *hyper-tactile* berbahan krom cair (*liquid chrome*), kaca *iridescent*, atau balon metalik (*inflated metallic mesh*) yang dibuat dengan [Three.js](https://threejs.org/) dan bereaksi secara organik terhadap gerakan kursor serta kecepatan *scroll*.
* **Dynamic Atmospheric Shifting:** Alih-alih menggunakan satu warna latar dari atas ke bawah, latar belakang halaman melakukan interpolasi warna secara mulus (*smooth color morphing*) menggunakan [GSAP](https://gsap.com/) saat pengguna berpindah antar-bab cerita—dari *Obsidian Noir* ke *Industrial Sage*, lalu ke *Warm Editorial Bone*, dan berakhir di *Hyper Terracotta*.

## 2. Sistem Warna & Token Atmosferik (OKLCH Color Space)

Seluruh warna didefinisikan menggunakan ruang warna modern **OKLCH** di [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) untuk menjamin kontras perseptual yang konsisten dan gradasi *shader* yang bebas *banding*.

| Nama Token CSS | Nilai HEX / OKLCH | Peran Visual & Inspirasi Referensi | Kontras Teks Utama |
| :--- | :--- | :--- | :--- |
| `--bg-obsidian` | `#0A0A0A` / `oklch(14.5% 0 0)` | Latar utama *Hero* & *3D Showcase* (inspirasi monokrom pekat [Nothin' Creative Studio](https://www.noth.in/) dan *dark mode* [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/)) | `#F5F2EB` (Rasio 17.8:1) |
| `--bg-industrial-sage` | `#282D26` / `oklch(29.2% 0.018 135)` | Latar seksi *Metrics & Architecture* (inspirasi *sage green* pada seksi fakta bisnis [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/)) | `#F5F2EB` (Rasio 11.4:1) |
| `--bg-editorial-bone` | `#F3ECE1` / `oklch(94.1% 0.019 82)` | Latar seksi *Interactive Format Comparison* & *Editorial Case Study* (kontras terang yang bersih dan hangat) | `#0E0E0E` (Rasio 16.5:1) |
| `--bg-terracotta-volt` | `#FF5500` / `oklch(66.5% 0.225 38)` | Warna *Preloader*, tombol CTA utama, & seksi *Final Call-to-Action* (aksen oranye industri berenergi tinggi) | `#0A0A0A` (Rasio 7.2:1) |
| `--accent-iridescent` | `#C8B6FF` $\rightarrow$ `#FF85A1` | Spektrum bias cahaya (*chromatic dispersion*) pada material 3D WebGL di *Hero* dan *Hover State* | N/A (Khusus *Shader*) |
| `--border-hairline-dark` | `rgba(243, 236, 225, 0.14)` | Garis *grid* `1px` saat berada di latar gelap (`--bg-obsidian` & `--bg-industrial-sage`) | N/A |
| `--border-hairline-light` | `rgba(14, 14, 14, 0.16)` | Garis *grid* `1px` saat berada di latar terang (`--bg-editorial-bone`) | N/A |

### Lapisan Tekstur & Efek Permukaan (*Surface Shaders*)
* **Global Film Grain Overlay:** Kanvas *procedural noise* beropasitas `3.5%` dengan `mix-blend-mode: overlay` dan `pointer-events: none` yang berjalan di seluruh *viewport* untuk menghilangkan kesan datar digital dan memberikan tekstur analog khas [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/).
* **Crosshair Grid Markers:** Di setiap titik temu garis *grid* utama, terdapat ikon tanda tambah mikro (`+` berukuran `9px × 9px`) yang berputar `90deg` saat kartu di dekatnya di-*hover*.

## 3. Sistem Tipografi & Hierarki Editorial

Kombinasi tipografi dirancang untuk menciptakan ketegangan visual antara **ukuran raksasa yang ekspresif** dan **metadata mikro yang sangat teknis**.

| Peran Tipografi | Rekomendasi Typeface (Variable Fonts) | Ukuran Fluid (`clamp()`) | Line-Height & Tracking | Karakteristik & Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero / Watermark** | `Syne ExtraBold` atau `Clash Display` / `Anton` | `clamp(4.5rem, 13vw, 14rem)` | `0.86` / `-0.04em` | Huruf kapital penuh (*uppercase*), rapat, memenuhi lebar layar seperti judul `"NOTHIN'"` di [Nothin' Creative Studio](https://www.noth.in/) dan `"MR.BLACK"` di [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/). |
| **Section Header (H2)** | `Neue Montreal` / `Plus Jakarta Sans Bold` | `clamp(2.25rem, 5.5vw, 5.5rem)` | `0.95` / `-0.03em` | Digunakan untuk pernyataan aksi di tiap seksi, mendukung animasi *per-character masked reveal*. |
| **Sub-header & Card Title (H3)** | `Neue Montreal Medium` | `clamp(1.35rem, 2.2vw, 2.25rem)` | `1.15` / `-0.015em` | Judul item portofolio dan kartu perbandingan paket. |
| **Body Editorial** | `Inter Variable` / `Geist Sans` | `clamp(1rem, 1.15vw, 1.25rem)` | `1.6` / `0em` | Paragraf penjelasan proyek dengan lebar baca ideal (`55ch`–`65ch`). |
| **Technical Monospace / HUD** | `JetBrains Mono` / `Space Mono` | `0.75rem` – `0.875rem` (`12px`–`14px`) | `1.4` / `+0.08em` | Huruf kapital untuk penomoran `( 01 // METRICS )`, koordinat kursor, waktu lokal, label tombol, dan angka statistik. |

## 4. Sistem Grid, Layout, & Breakpoints Responsif

* **Desktop Grid (`1440px+`):** 12 kolom dengan `gap: 0px` (menggunakan `border-right` dan `border-bottom` `1px` langsung pada kontainer sel agar garis *grid* menyambung sempurna tanpa celah ganda). Margin luar sebesar `24px` yang membingkai seluruh layar seperti jendela bidik kamera (*camera viewfinder*).
* **Tablet Grid (`768px` – `1023px`):** 6 kolom dengan penyederhanaan *sticky sidebar* menjadi *tabbed switcher* horizontal.
* **Mobile Grid (`< 768px`):**
  * **Layout Alami Vertikal**: 2 kolom untuk metadata atas dan 1 kolom penuh untuk seluruh kartu konten, formulir kontak, dan metrik bento. Tanpa celah padding kosong (`min-h-0`).
  * **Interaksi Sentuh 3D (Scroll Prioritas)**: Elemen kanvas 3D menerapkan CSS `touch-action: pan-y`. Gesekan sentuh vertikal tetap meloloskan guliran halaman (*native smooth scroll*), sementara sapuan horizontal memutar objek 3D.
  * **Spatial Gallery Adaptif**: Track dolly-zoom dikompresi ke `h-[180vh]` dengan layar video bioskop melebar `w-[90vw]` agar proporsional di layar ponsel.
  * **Portfolio Showcase Mobile**: Tampilan baris proyek dilengkapi *thumbnail* foto mini inline (`w-14 h-14` / rounded brutalist border) menggantikan kursor hover WebGL desktop. Klik baris tetap memicu *case study modal*.

## 5. Anatomi Halaman & Spesifikasi Seksi demi Seksi

### 5.1. Tactile Boot Preloader (0% $\rightarrow$ 100%)
* **Visual:** Latar belakang `--bg-terracotta-volt` (`#FF5500`) dengan garis *grid* hitam tipis dan indikator diagnostik sistem di keempat sudut layar (mengadaptasi *preloader* [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/)).
* **Elemen Utama:**
  * Penghitung angka raksasa di sudut kanan bawah (`000%` hingga `100%`) menggunakan *font display* `15vw`.
  * Baris log teknis *monospace* di kiri atas yang menampilkan status pemuatan aset secara nyata: `( LOADING GLB MESH... )`, `( COMPILING GLSL SHADERS... )`, `( READY )`.
* **Transisi Keluar:** Saat mencapai `100%`, layar *preloader* terbelah secara vertikal (*curtain split*) atau melipat ke atas menggunakan kurva `expo.inOut` selama `1.1s`, langsung memperlihatkan objek 3D *Hero* yang memantul masuk (*spring scale-in*).

### 5.2. Fixed HUD Navbar & Full-Screen Kinetic Overlay Menu
* **Top HUD Bar:** Bilah navigasi *fixed* setinggi `64px` dengan latar `backdrop-filter: blur(12px)` dan garis bawah `1px`.
  * **Kiri:** Logo monogram minimalis (seperti `N'` pada [Nothin' Creative Studio](https://www.noth.in/)) disertai indikator jam waktu nyata kota studio, misalnya `( PAR 14:30 // JKT 19:30 )`.
  * **Tengah:** Tautan jangkar cepat bergaya *monospace* (`01. VISION`, `02. METRICS`, `03. WORKS`, `04. SPECS`) dengan indikator titik aktif berwarna oranye.
  * **Kanan:** Dua tombol berdampingan—tombol `CONTACT US` dengan *thumbnail* pratinjau mini dan ikon piksel (gaya [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/)), serta tombol `MENU ::` (gaya [Nothin' Creative Studio](https://www.noth.in/)).
* **Full-Screen Menu Modal (`MENU ::`):** Saat diklik, membuka *overlay* layar penuh berwarna `--bg-obsidian` yang berisi daftar navigasi raksasa (`8vw`). Mengarahkan kursor ke salah satu menu akan memunculkan *floating video reel* dari seksi tersebut yang mengikuti posisi *mouse*.

### 5.3. Hero Section: Monolithic Nothin' Editorial Typography + 3D Interactive Chrome Torus
* **Latar & Struktur:** Latar `--bg-obsidian` dengan tata letak monolitik brutalist editorial terinspirasi [Nothin' Creative Studio](https://www.noth.in/).
* **Pusat Visual (3D WebGL Canvas + Centered Negative Space):**
  - Objek 3D *liquid chrome inflated torus* melayang tepat di tengah komposisi kanvas WebGL.
  - Deformasi permukaan fluida responsif terhadap kedekatan kursor mouse (*vertex displacement*), putaran drag inersial 360°, dan pantulan dispersi warna-warni (*iridescent metallic shader*).
* **Tipografi Monolitik Edge-to-Edge:**
  - Di belakang objek 3D membentang tulisan raksasa dari ujung kiri ke kanan layar: **`NOIR // KINETIC`** (`font-display font-black text-[13vw] uppercase tracking-tighter leading-none select-none`).
  - Objek 3D melayang di antara huruf dengan efek kedalaman spatial (*depth layering*).
* **Manifesto & Pill Button (Kiri Atas):**
  - Teks manifesto editorial:
    ```
    NOT A TEMPLATE, AN ARCHITECTURE.
    BECAUSE NOIR IS KINETIC.
    ```
  - Tombol kapsul magnetik brutalist taktil: `[ APPLY FOR CODE → ]` yang meluncur halus ke formulir kontak.
* **Brutalist Peripheral Telemetry & Floating Badges:**
  - Sisi kiri: Lencana vertikal `SOTD // HONORS 2026`.
  - Sisi kanan bawah: Tombol melingkar magnetik `ASK US • NOIR // KINETIC` yang berputar 360°.
  - Baris bawah: 3 sel metrik investasi arsitektural Mr. BLACK (`01 // $683K+ REVENUE`, `02 // 31% MARGIN`, `03 // 6 MONTHS PAYBACK`).

### 5.4. Section 02: Dynamic Metrics & Architecture Bento Grid
* **Transisi Warna:** Saat memasuki seksi ini, latar halaman berubah mulus dari `--bg-obsidian` (`#0A0A0A`) ke `--bg-industrial-sage` (`#282D26`).
* **Layout:** *Bento Grid* 4×2 dengan garis batas `1px` dan *watermark* raksasa samar di latar belakang.
* **Fitur Interaktif:**
  * **Live Number Counters:** Angka metrik beranimasi menghitung naik (*odometer roll*) saat masuk ke *viewport*.
  * **Interactive Mini-Shader Cards:** Setiap kartu memiliki efek *spotlight border* yang menyala mengikuti posisi kursor pengguna (`mouse-x`, `mouse-y`) serta grafik vektor SVG yang menggambar garisnya secara otomatis saat terpicu oleh [GSAP ScrollTrigger](https://gsap.com/docs/v3/).

### 5.5. Section 03: Avant-Garde Portfolio Showcase ("Selected Works")
* **Inspirasi Utama:** Galeri karya [Nothin' Creative Studio](https://www.noth.in/works) (*UTOPIA*, *AURBSE*, *IN_COGNITA*, *HAPTIFY*, *LGM*).
* **Layout & Interaksi:**
  * Menampilkan daftar proyek berformat baris tabel penuh (*full-width editorial rows*) dengan nomor indeks `( 01 )` hingga `( 05 )`, nama klien berukuran `5vw`, kategori layanan dalam *monospace*, dan tahun rilis.
  * **WebGL Image Distortion Preview:** Saat kursor melayang di atas baris proyek, sebuah jendela pratinjau gambar/video melayang muncul mengikuti kursor dengan efek *RGB shift / liquid wave distortion* berbasis *custom fragment shader* [Three.js](https://threejs.org/) yang kekuatannya bergantung pada kecepatan gerak *mouse*.
  * Klik pada salah satu baris akan melakukan transisi *shared-element* menggunakan fitur *View Transitions* di [React 19.3](https://react.dev/blog/2026/09/09/react-19-3) menuju tampilan detail studi kasus.

### 5.5b. Spatial Museum Gallery & Manifesto Video Transition (Inspired by noth.in #studio-video)
* **Inspirasi Utama:** Seksi instalasi galeri pameran arsitektural pada [Nothin' Creative Studio](https://www.noth.in/) (`#studio-video`).
* **Komposisi Ruangan 3D Galeri Beton:**
  * Latar belakang resolusi tinggi foto museum arsitektur brutalist dengan lampu tabung neon overhead dan karpet rumput organik di sudut ruangan.
  * Bingkai layar bioskop 16:9 di tengah ruangan (`cadre-video`) tanpa casing buatan, tampil bersih dan sinematik.
* **Dual-Video & Real-Time Floor Reflection:**
  * Video utama memutar manifesto sinematik meja arsitektur retro-komputer (`NOTHIN_MANIFESTE_CLEAN.mp4`).
  * Video refleksi kembar di lantai mengkilap diputar serentak (`NOTHIN_MANIFESTE_REFLECT_H265.mp4` / `scaleY(-1)`) dengan gradien fade-out bawah untuk simulasi pantulan lantai marmer/beton basah yang memudar masuk (`opacity: 0` ➔ `0.75`).
* **Koreografi CSS Sticky Track Deep Dolly-Zoom Out:**
  * Menggunakan CSS Sticky Track `h-[300vh]` dengan inner viewport `sticky top-0 h-screen w-screen`.
  * **Kondisi Awal (Sebelum Scroll):** Layar video tampil **Full-Screen 100% tepi-ke-tepi** (`scale: 2.2`), menutupi seluruh viewport tanpa bingkai.
  * **Scrubbing Scroll (Dolly Zoom-Out Mendalam):** Saat pengguna menggulir ke bawah, video dan background galeri mundur jauh ke belakang secara serentak (`scale: 2.2` ➔ `0.68` untuk video, `scale: 2.0` ➔ `1.0` untuk ruangan museum), mengungkap seluruh arsitektur aula museum dan lantai beton reflektif.
* **Audio HUD Toggle:**
  * Tombol kapsul `SOUND [ON // OFF]` di bagian atas tengah layar yang mengontrol mute/unmute audio video.

### 5.6. Section 04: Sticky Split-Screen Format & Tier Comparison
* **Transisi Warna:** Latar berubah menjadi terang hangat `--bg-editorial-bone` (`#F3ECE1`) dengan teks hitam pekat (`#0E0E0E`), menciptakan kontras dramatis seperti bagian tengah [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/).
* **Layout Split-Screen:**
  * **Kolom Kiri (Sticky 5 Kolom):** Terkunci (*pinned*) selama pengguna menggulir seksi ini. Menampilkan model 3D interaktif atau *mockup* perangkat/ruang yang berubah bentuk secara *real-time* dari **Format 01 (Compact / Digital Core)** ke **Format 02 (Full Flagship / Spatial Enterprise)**.
  * **Kolom Kanan (Scrollable 7 Kolom):** Berisi kartu spesifikasi detail dengan tabel perbandingan parameter (estimasi investasi, *timeline*, *deliverables*, dan proyeksi ROI), lengkap dengan kalkulator interaktif menggunakan *slider* taktil.

### 5.7. Section 05: "System in Your Pocket" — Interactive HUD & Mobile Preview
* **Inspirasi Utama:** Seksi otomasi aplikasi ponsel dan antarmuka kamera pada [Mr. BLACK Franchise](https://www.google.com/search?q=https://mrblack-case.dolganev.com/).
* **Visual & Interaksi:**
  * Menampilkan *frame* ponsel pintar/antarmuka dasbor di tengah layar dengan *overlay* jendela bidik kamera digital (indikator `REC ●`, *battery bar*, *ISO 400*, dan *timecode* berjalan).
  * Pengguna dapat mengklik tombol *tab* (`[01. REAL-TIME ANALYTICS]`, `[02. AI AUTOMATION]`, `[03. INVENTORY CRM]`) untuk mengganti layar di dalam *mockup* dengan animasi *glitch/scanline* halus.

### 5.8. Section 06: Interactive Accordion Specs & Kinetic Footer (`--bg-terracotta-volt`)
* **Accordion FAQ & Turnkey Process:** Daftar tahapan kerja (`01 // STRATEGY` hingga `05 // LAUNCH`) dengan animasi buka-tutup berbasis tinggi dinamis dan ikon `+` yang berputar menjadi `×`.
* **Kinetic Footer:** Latar berubah ke `--bg-terracotta-volt` (`#FF5500`). Menampilkan *marquee* teks raksasa yang bergerak tanpa henti, formulir kontak interaktif bergaya terminal (`[ ENTER YOUR EMAIL ]`), informasi lokasi kembar (`PARIS // SAINT PETERSBURG // JAKARTA`), serta tombol *Back to Top* magnetik.

## 6. Spesifikasi Koreografi Motion, Kursor, & Micro-Interactions

| Komponen / Efek | Teknologi Penggerak | Parameter Easing & Durasi | Perilaku Detail |
| :--- | :--- | :--- | :--- |
| **Inertial Smooth Scroll** | [Lenis](https://lenis.dev/) | `lerp: 0.08`, `wheelMultiplier: 0.9` | Mengubah guliran *native* menjadi gerakan berbobot yang tersinkronisasi penuh dengan `requestAnimationFrame` [GSAP](https://gsap.com/) dan [Three.js](https://threejs.org/). |
| **Split-Text Headline Reveal** | [GSAP](https://gsap.com/) | `power4.out`, `duration: 0.9s`, `stagger: 0.025s` | Setiap baris judul dibungkus dalam `overflow: hidden` dan bergerak dari `yPercent: 110` beserta `rotateZ: 3deg` ke posisi `0`. |
| **Custom Dual-State Cursor** | React Ref + `gsap.quickTo()` | `duration: 0.25s`, `ease: power3.out` | Titik tengah `6px` + cincin luar `36px` dengan `mix-blend-mode: difference`. Saat di atas elemen interaktif, cincin membesar menjadi `84px` dan menampilkan teks mikro seperti `VIEW`, `DRAG`, atau `OPEN`. |
| **Magnetic Buttons & Badges** | [GSAP](https://gsap.com/) `quickTo` | Tarikan `0.35x` jarak kursor, `elastic.out(1, 0.4)` saat lepas | Tombol `APPLY NOW` dan lencana `ASK US` tertarik secara fisik mengikuti kursor ketika kursor berada dalam radius `60px`. |
| **3D Mouse Velocity Deformation** | [Three.js](https://threejs.org/) Uniforms | `uVelocity` meluruh dengan `damping: 0.92` | Semakin cepat pengguna menggerakkan kursor atau menggulir halaman, semakin kuat distorsi gelombang dan efek *chromatic aberration* pada kanvas WebGL. |

## 7. Standar Aksesibilitas, Responsivitas, & Performa UI

* **Dukungan `prefers-reduced-motion`:** Jika pengguna mengaktifkan mode pengurangan gerak di sistem operasi, *smooth scroll* [Lenis](https://lenis.dev/) dan distorsi *shader* otomatis dinonaktifkan, menyisakan transisi *opacity* sederhana dan posisi objek 3D statis.
* **Adaptive GPU Quality Tiering:** Menggunakan pendeteksi FPS/GPU otomatis—perangkat kelas atas merender *shader* pada `devicePixelRatio: 2` dengan *post-processing bloom* & *chromatic aberration*, sedangkan perangkat *mobile* hemat daya merender pada `devicePixelRatio: 1` dengan tekstur *matcap* ringan agar tetap mengunci **60 FPS**.
* **Navigasi Keyboard & Kontras WCAG AAA/AA:** Seluruh tombol, *accordion*, dan modal menu mendukung navigasi `Tab`, `Enter`, dan `Escape` dengan indikator `focus-visible` berupa bingkai oranye `2px solid #FF5500`.
