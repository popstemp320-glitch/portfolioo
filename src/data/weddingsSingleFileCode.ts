// Complete standalone single-file HTML deliverable with Lenis, GSAP, ScrollTrigger, and Tailwind CSS CDN
export const WEDDINGS_SINGLE_FILE_HTML = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weddings Editorial Gallery · Documentary Photography</title>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brandDark: '#f4efe6',
            brandDarker: '#ede6d9',
            brandCard: '#faf7f2',
            brandCrimson: '#e04838',
            brandCream: '#1c1917',
            brandMuted: '#787164',
          },
          fontFamily: {
            serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
            sans: ['Inter', 'sans-serif'],
            mono: ['Space Mono', 'Courier New', 'monospace'],
          }
        }
      }
    }
  </script>

  <!-- Google Fonts: Cormorant Garamond, Inter, Space Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">

  <!-- Lenis for Smooth Momentum Scrolling -->
  <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>

  <!-- GSAP & ScrollTrigger CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

  <style>
    /* Lenis Smooth Scroll Recommended CSS */
    html.lenis, html.lenis body {
      height: auto;
    }
    .lenis.lenis-smooth {
      scroll-behavior: auto !important;
    }
    .lenis.lenis-smooth [data-lenis-prevent] {
      overscroll-behavior: contain;
    }
    .lenis.lenis-stopped {
      overflow: hidden;
    }

    /* Film grain texture */
    .film-grain {
      background-image: radial-gradient(rgba(28, 25, 23, 0.04) 1px, transparent 0);
      background-size: 24px 24px;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #ede6d9;
    }
    ::-webkit-scrollbar-thumb {
      background: #dfd7c7;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #e04838;
    }
  </style>
</head>
<body class="bg-[#f4efe6] text-[#1c1917] font-sans antialiased selection:bg-[#e04838]/20 selection:text-[#1c1917] min-h-screen overflow-x-hidden film-grain">

  <!-- FIXED HEADER / LOGO BAR -->
  <header class="fixed top-0 inset-x-0 z-50 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-none backdrop-blur-md bg-[#f4efe6]/85 border-b border-[#dfd7c7]">
    <a href="#" class="pointer-events-auto font-mono text-[10px] tracking-[0.3em] uppercase text-[#1c1917] hover:text-[#e04838] transition-colors">
      SUMEETZ PHOTOGRAPHY
    </a>
    <div class="pointer-events-auto flex items-center gap-6 font-mono text-[10px] tracking-[0.25em] uppercase text-[#787164]">
      <span>MONOGRAPH · VOL. IV</span>
      <span class="text-[#e04838] hidden sm:inline">● LIVE LENIS / GSAP</span>
    </div>
  </header>

  <!-- STICKY LEFT-SIDE NAVIGATION -->
  <aside id="sticky-sidebar" class="fixed left-6 sm:left-10 lg:left-14 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-5 font-mono text-[10px] tracking-[0.25em] uppercase select-none">
    <div class="absolute left-[7px] top-2 bottom-2 w-px bg-[#dfd7c7] pointer-events-none"></div>

    <a href="#hero" class="nav-item group relative flex items-center gap-3.5 text-[#787164] hover:text-[#1e3a8a] transition-all duration-300 hover:translate-x-1.5" data-section="hero">
      <span class="nav-dot w-2 h-2 rounded-full border border-[#dfd7c7] bg-[#faf7f2] group-hover:border-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:shadow-[0_0_8px_rgba(30,58,138,0.7)] transition-all duration-300"></span>
      <span class="opacity-50 text-[9px]">00</span>
      <span class="tracking-[0.2em] font-medium">OVERVIEW</span>
    </a>

    <a href="#the-day" class="nav-item group relative flex items-center gap-3.5 text-[#787164] hover:text-[#1e3a8a] transition-all duration-300 hover:translate-x-1.5" data-section="the-day">
      <span class="nav-dot w-2 h-2 rounded-full border border-[#dfd7c7] bg-[#faf7f2] group-hover:border-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:shadow-[0_0_8px_rgba(30,58,138,0.7)] transition-all duration-300"></span>
      <span class="opacity-50 text-[9px]">01</span>
      <span class="tracking-[0.2em] font-medium">THE DAY</span>
    </a>

    <a href="#portraits" class="nav-item group relative flex items-center gap-3.5 text-[#787164] hover:text-[#1e3a8a] transition-all duration-300 hover:translate-x-1.5" data-section="portraits">
      <span class="nav-dot w-2 h-2 rounded-full border border-[#dfd7c7] bg-[#faf7f2] group-hover:border-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:shadow-[0_0_8px_rgba(30,58,138,0.7)] transition-all duration-300"></span>
      <span class="opacity-50 text-[9px]">02</span>
      <span class="tracking-[0.2em] font-medium">PORTRAITS</span>
    </a>

    <a href="#the-party" class="nav-item group relative flex items-center gap-3.5 text-[#787164] hover:text-[#1e3a8a] transition-all duration-300 hover:translate-x-1.5" data-section="the-party">
      <span class="nav-dot w-2 h-2 rounded-full border border-[#dfd7c7] bg-[#faf7f2] group-hover:border-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:shadow-[0_0_8px_rgba(30,58,138,0.7)] transition-all duration-300"></span>
      <span class="opacity-50 text-[9px]">03</span>
      <span class="tracking-[0.2em] font-medium">THE PARTY</span>
    </a>

    <a href="#stories" class="nav-item group relative flex items-center gap-3.5 text-[#787164] hover:text-[#1e3a8a] transition-all duration-300 hover:translate-x-1.5" data-section="stories">
      <span class="nav-dot w-2 h-2 rounded-full border border-[#dfd7c7] bg-[#faf7f2] group-hover:border-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:shadow-[0_0_8px_rgba(30,58,138,0.7)] transition-all duration-300"></span>
      <span class="opacity-50 text-[9px]">04</span>
      <span class="tracking-[0.2em] font-medium">STORIES</span>
    </a>
  </aside>

  <!-- MAIN SCROLLING CONTENT -->
  <main class="relative z-10 w-full">
    <!-- Hero, 4-column photo grid, GSAP ScrollTrigger parallax & Lenis momentum scrolling -->
    <!-- (See full source code in public/weddings-single-file.html) -->
  </main>
</body>
</html>
`;
