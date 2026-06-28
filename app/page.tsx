"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroShader from "@/components/HeroShader";
import ParallaxImage from "@/components/ParallaxImage";
import InquiryForm from "@/components/InquiryForm";
import { products } from "@/lib/products";

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
              <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-stone-100 animate-airy-fade-in animation-delay-300">
                Handcrafted ornamental
                <br />
                <span>timber and resin art</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 mt-3 animate-airy-fade-in animation-delay-600">
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
      <div className="relative z-20 w-full shadow-[0_-20px_50px_rgba(28,25,23,0.15)]">
        {/* Works Section */}
        <section id="commissions" className="bg-[hsl(42,100%,88%)] p-5 md:p-8">
          {/* Frame matching the Hero borders for visual continuity */}
          <div className="relative border border-stone-900/15 w-full flex flex-col justify-between bg-transparent">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 z-10 w-full mt-6 md:mt-8 px-6 md:px-8 pb-8 md:pb-12">
              {products.map((product, idx) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group flex flex-col bg-transparent border border-stone-900/15 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-stone-950/5 h-fit"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-stone-900/15 bg-stone-900/5">
                    <ParallaxImage
                      src={product.image}
                      alt={product.alt}
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority={idx === 0}
                      speed={8}
                    />
                    {/* Greyed-out hover overlay */}
                    <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                      <span className="px-5 py-2 border border-white/30 text-white font-sans text-[10px] uppercase tracking-[0.25em] bg-stone-950/40 backdrop-blur-sm transition-transform duration-300 translate-y-2 group-hover:translate-y-0 font-bold">
                        View Piece
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pt-3 pb-3 flex flex-col bg-transparent">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-sans font-light text-stone-900 text-base tracking-wide">
                        {product.name}
                      </h3>
                      <span className="font-sans font-light text-stone-900 text-base tracking-wide shrink-0">
                        {product.price}
                      </span>
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold mt-1">
                      {product.subtitle}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="philosophy" className="bg-[#2b2517] p-5 md:p-8">
          <div className="relative border border-white/10 w-full flex flex-col bg-transparent text-stone-200">
            {/* Top Part: 50/50 Split Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/10">
              {/* Left Column: Title */}
              <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-start border-b md:border-b-0 md:border-r border-white/10">
                <h2 className="font-serif font-light text-4xl md:text-5xl text-stone-100 mt-6">
                  About
                </h2>
              </div>

              {/* Right Column: Copy */}
              <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center">
                <p className="text-stone-100 font-serif font-light text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                  Timberluxe is a Sydney-based design studio crafting
                  functional, ornamental timber and resin art. We source unique,
                  high-character burl and salvaged slabs, honoring the
                  timber&apos;s organic imperfections.
                </p>
              </div>
            </div>

            {/* Bottom Part: Full-width Grayscale Image */}
            <div className="relative aspect-[21/9] md:aspect-[3/1] w-full overflow-hidden bg-stone-900/5">
              <ParallaxImage
                src="/about_studio.png"
                alt="Raw timber slabs and artisan tools in the Timberluxe Melbourne workshop"
                sizes="100vw"
                speed={10}
                className="grayscale contrast-[1.08] brightness-90"
              />
            </div>
          </div>
        </section>

        {/* Inquire Section */}
        <section id="inquire" className="bg-[hsl(42,100%,88%)] p-5 md:p-8">
          <div className="relative border border-stone-900/15 w-full grid grid-cols-1 md:grid-cols-2 bg-transparent text-stone-900">
            {/* Left Side: Title */}
            <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-start border-b md:border-b-0 md:border-r border-stone-900/15">
              <h2 className="font-serif font-light text-4xl md:text-5xl text-stone-900 mt-6">
                Inquiries
              </h2>
            </div>

            {/* Right Side: Form */}
            <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center bg-transparent">
              <Suspense
                fallback={
                  <div className="h-64 flex items-center justify-center text-xs text-stone-500 uppercase tracking-widest">
                    Loading Form...
                  </div>
                }
              >
                <InquiryForm />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="bg-[hsl(42,100%,88%)] p-5 md:p-8">
          <div className="relative border border-stone-900/15 w-full flex flex-col justify-between bg-transparent text-stone-900">
            {/* Editorial Footer Section */}
            <footer className="w-full pt-12 pb-8 px-6 md:px-8 mt-auto flex flex-col z-10 bg-stone-900/[0.01]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* Brand Column */}
                <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
                  <span className="font-serif tracking-[0.25em] text-lg font-bold text-stone-900 leading-none">
                    TIMBERLUXE
                  </span>
                  <p className="text-stone-600 text-xs md:text-sm font-light leading-relaxed max-w-sm">
                    An independent Australian design collective crafting
                    premium, physical works of art. Fusing high-character
                    hardwoods, custom polymer resin flow, and architectural
                    scale.
                  </p>
                </div>

                {/* Navigation Column */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-bold">
                    Navigation
                  </span>
                  <Link
                    href="#commissions"
                    className="text-stone-700 hover:text-stone-950 transition-colors text-xs font-light"
                  >
                    Works
                  </Link>
                  <Link
                    href="#philosophy"
                    className="text-stone-700 hover:text-stone-950 transition-colors text-xs font-light"
                  >
                    Philosophy
                  </Link>
                  <Link
                    href="#inquire"
                    className="text-stone-700 hover:text-stone-950 transition-colors text-xs font-light"
                  >
                    Acquisitions
                  </Link>
                </div>

                {/* Connect Column */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-bold">
                    Connect
                  </span>
                  <a
                    href="https://instagram.com/pbernatz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-stone-950 transition-colors text-xs font-light"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="text-stone-700 hover:text-stone-950 transition-colors text-xs font-light"
                  >
                    Pinterest
                  </a>
                  <a
                    href="#"
                    className="text-stone-700 hover:text-stone-950 transition-colors text-xs font-light"
                  >
                    Journal
                  </a>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-stone-900/10 pt-6 flex flex-col sm:flex-row justify-between text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold gap-2 sm:gap-0">
                <span>TIMBERLUXE Atelier © 2026</span>
                <span>Crafted in Melbourne, Australia</span>
              </div>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}
