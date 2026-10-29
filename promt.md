Eksekusi target: [MASUKKAN_TASK_ID_ATAU_FASE — contoh: Task 1.1 / Fase 1]

Ikuti protokol NOIR // KINETIC:

1. KONSULTASI SUMBER (SOURCE OF TRUTH)
- Baca target & checklist di [task.md](file:///mnt/windows/Users/boyblanco/Documents/code/web/next_ui_3d/task.md).
- Rujuk aturan arsitektur di [AGENTS.md](file:///mnt/windows/Users/boyblanco/Documents/code/web/next_ui_3d/AGENTS.md) & [architecture.md](file:///mnt/windows/Users/boyblanco/Documents/code/web/next_ui_3d/architecture.md), token visual di [design.md](file:///mnt/windows/Users/boyblanco/Documents/code/web/next_ui_3d/design.md).
- Kunci guardrails: Single Canvas View Tunnel (`@react-three/drei`), Unified Ticker (Lenis + GSAP + R3F), CSS-First Tailwind v4 `@theme` (tanpa tailwind.config.js), React 19.3 Compiler (tanpa useMemo/useCallback manual).
- Dilarang menebak behavior API, library, atau tipe TypeScript. Wajib gunakan **MCP Context7** (`context7`) atau **search_web** untuk verifikasi dokumentasi resmi (Next.js 16 App Router, React 19.3, Tailwind CSS v4, Three.js, R3F v9, Drei v10, GSAP v3, Lenis, Zustand v5).

2. IMPLEMENTASI & VERIFIKASI (DoD)
- Tulis kode modular, TypeScript strict (no `any`), pisahkan Server Components (RSC) vs Client Components.
- Verifikasi: typecheck lolos, bebas scroll jitter, performa 60 FPS terjaga.
- Tandai checklist `[x]` pada sub-task bersangkutan di [task.md](file:///mnt/windows/Users/boyblanco/Documents/code/web/next_ui_3d/task.md).

3. PROTOKOL DEVIASI & SINKRONISASI DOKUMEN (WAJIB)
- Jika butuh ubah implementasi di luar spesifikasi dokumen (beda lib/API/workaround):
  a. Usulkan opsi ke user dulu secara ringkas (alasan & dampak). JANGAN ubah dokumen sepihak.
  b. Setelah disetujui user, SINKRONKAN SEMUA dokumen terkait ([task.md](file:///mnt/windows/Users/boyblanco/Documents/code/web/next_ui_3d/task.md), [architecture.md](file:///mnt/windows/Users/boyblanco/Documents/code/web/next_ui_3d/architecture.md), [design.md](file:///mnt/windows/Users/boyblanco/Documents/code/web/next_ui_3d/design.md), [AGENTS.md](file:///mnt/windows/Users/boyblanco/Documents/code/web/next_ui_3d/AGENTS.md)) agar konsisten 100%.

4. OUTPUT
- Terse / caveman style: daftar file dibuat/diedit, status task [x], dan kendala jika ada.
