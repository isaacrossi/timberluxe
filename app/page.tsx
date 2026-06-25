"use client";

import Image from "next/image";
import HeroShader from "@/components/HeroShader";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-[#18181a]">
      {/* 1. STICKY HERO SECTION (stays pinned behind as you scroll) */}
      <section className="sticky top-0 h-screen w-full p-5 md:p-8 overflow-hidden flex flex-col z-10">
        {/* WebGL Canvas Background */}
        <HeroShader />

        {/* Inset Border Frame (draws the fine frame lines over the shader background) */}
        <div className="relative flex-1 border border-white/10 flex flex-col justify-between overflow-hidden">
          {/* Header Pane */}
          <header className="w-full flex items-center justify-between border-b border-white/10 py-4 px-6 md:px-8 pointer-events-auto animate-airy-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.25em] text-base font-bold text-stone-200 leading-none">
                  TIMBERLUXE
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
              <a
                href="#philosophy"
                className="hover:text-stone-100 transition-colors py-1"
              >
                Philosophy
              </a>
              <a
                href="#commissions"
                className="hover:text-stone-100 transition-colors py-1"
              >
                Commissions
              </a>
              <a
                href="#process"
                className="hover:text-stone-100 transition-colors py-1"
              >
                The Process
              </a>
              <a
                href="#inquire"
                className="hover:text-stone-100 transition-colors py-1"
              >
                Inquire
              </a>
            </nav>
          </header>

          {/* Main Hero Panel (bottom-left aligned) */}
          <main className="flex-1 flex flex-col justify-end px-6 md:px-8 pb-12 md:pb-16 pointer-events-auto">
            <div className="max-w-2xl flex flex-col gap-6">
              <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-stone-100 animate-airy-fade-in animation-delay-200">
                Handcrafted ornamental
                <br />
                <span>timber and resin art</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 mt-3 animate-airy-fade-in animation-delay-400">
                <a
                  href="#inquire"
                  className="h-12 px-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-950 font-semibold text-xs uppercase tracking-[0.15em] hover:bg-stone-200 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:scale-[1.01]"
                >
                  Inquire
                </a>
                <a
                  href="#commissions"
                  className="h-12 px-8 flex items-center justify-center rounded-full border border-stone-700 text-stone-300 font-semibold text-xs uppercase tracking-[0.15em] hover:border-stone-500 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm hover:scale-[1.01]"
                >
                  Explore Works
                </a>
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* 2. REVEALED CONTENT SECTION (slides up and covers the hero) */}
      <section className="relative z-20 w-full min-h-screen bg-[hsl(42,100%,88%)] p-5 md:p-8 shadow-[0_-20px_50px_rgba(28,25,23,0.15)] flex flex-col justify-between">
        {/* Frame matching the Hero borders for visual continuity */}
        <div className="relative flex-1 border border-stone-900/15 w-full flex flex-col justify-between bg-transparent">

          {/* Header Row */}
          <div className="w-full flex items-center justify-between pt-6 md:pt-8 px-6 md:px-8 pb-4 z-10">
            <span className="font-serif font-light text-4xl md:text-5xl text-stone-900">
              Works
            </span>
            <span className="font-serif text-4xl text-stone-600 font-light">
              (03)
            </span>
          </div>

          {/* Product Column Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 z-10 w-full mt-6 md:mt-8 px-6 md:px-8 pb-8 md:pb-12">
            {/* Product 1: Sashimono Joint */}
            {/* Product 1: Plum Board */}
            <div className="group flex flex-col bg-transparent border border-stone-900/15 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-stone-950/5 h-fit">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-stone-900/15 bg-stone-900/5">
                <Image
                  src="/plum_resin.jpg"
                  alt="Maple burl and magenta resin display piece"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  priority
                />
              </div>
              <div className="px-4 pt-3 pb-3 flex flex-col bg-transparent">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-sans font-light text-stone-900 text-base tracking-wide">
                    Burl & Plum Board
                  </h3>
                  <span className="font-sans font-light text-stone-900 text-base tracking-wide shrink-0">
                    $ 350
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold mt-1">
                  01 / Maple Burl & Magenta Resin
                </span>
              </div>
            </div>

            {/* Product 2: Charcoal Serving Board */}
            <div className="group flex flex-col bg-transparent border border-stone-900/15 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-stone-950/5 h-fit">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-stone-900/15 bg-stone-900/5">
                <Image
                  src="/smoke_resin.jpg"
                  alt="Burl wood and smoke grey epoxy serving board"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
              </div>
              <div className="px-4 pt-3 pb-3 flex flex-col bg-transparent">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-sans font-light text-stone-900 text-base tracking-wide">
                    Charcoal Serving Board
                  </h3>
                  <span className="font-sans font-light text-stone-900 text-base tracking-wide shrink-0">
                    $ 299
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold mt-1">
                  02 / Smoked Oak & Charcoal Resin
                </span>
              </div>
            </div>

            {/* Product 3: Teal River Plank */}
            <div className="group flex flex-col bg-transparent border border-stone-900/15 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-stone-950/5 h-fit">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-stone-900/15 bg-stone-900/5">
                <Image
                  src="/teal_resin.jpg"
                  alt="English burr wood and teal resin river board"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
              </div>
              <div className="px-4 pt-3 pb-3 flex flex-col bg-transparent">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-sans font-light text-stone-900 text-base tracking-wide">
                    Teal River Plank
                  </h3>
                  <span className="font-sans font-light text-stone-900 text-base tracking-wide shrink-0">
                    $ 480
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold mt-1">
                  03 / English Burr & Teal Resin
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
