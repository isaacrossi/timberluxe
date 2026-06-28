import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/lib/products";
import ParallaxImage from "@/components/ParallaxImage";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return {
      title: "Product Not Found | Timberluxe",
    };
  }
  return {
    title: `${product.name} | Timberluxe`,
    description: product.description,
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="relative min-h-screen w-full bg-[hsl(42,100%,88%)] p-5 md:p-8 flex flex-col text-stone-900">
      {/* Frame matching the Hero borders for visual continuity */}
      <div className="relative flex-1 border border-stone-900/15 w-full flex flex-col justify-between bg-transparent p-6 md:p-8">
        
        {/* Header Row */}
        <header className="w-full flex items-center justify-between border-b border-stone-900/10 pb-4 z-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-serif tracking-[0.25em] text-base font-bold text-stone-900 leading-none">
              TIMBERLUXE
            </span>
          </Link>
          <Link
            href="/#commissions"
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-600 font-bold hover:text-stone-900 transition-colors py-1"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Back to Works
          </Link>
        </header>

        {/* Main content grid */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center z-10 w-full my-6 md:my-10">
          {/* Left: Product Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-stone-900/15 bg-stone-900/5 shadow-md">
            <ParallaxImage
              src={product.image}
              alt={product.alt}
              sizes="(max-width: 1024px) 100vw, 600px"
              priority
              speed={10}
            />
          </div>

          {/* Right: Details & Specs */}
          <div className="flex flex-col h-full justify-center max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold">
              {product.subtitle}
            </span>
            <h1 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-tight mt-2">
              {product.name}
            </h1>
            <div className="font-sans font-light text-2xl text-stone-900 mt-4 tracking-wide">
              {product.price}
            </div>

            <div className="w-full h-px bg-stone-900/15 my-6" />

            <p className="text-stone-700 text-sm md:text-base leading-relaxed font-light mb-8 font-serif italic">
              &ldquo;{product.description}&rdquo;
            </p>

            {/* Specifications */}
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold mb-2">
                Specifications
              </h2>
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between py-2 border-b border-stone-900/10 text-xs md:text-sm font-light"
                >
                  <span className="text-stone-500 font-medium uppercase tracking-wider">
                    {spec.label}
                  </span>
                  <span className="text-stone-900 font-normal">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/#inquire"
                className="h-12 px-8 flex items-center justify-center rounded-full bg-stone-900 text-stone-100 font-semibold text-xs uppercase tracking-[0.15em] hover:bg-stone-800 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:scale-[1.01]"
              >
                Inquire About This Piece
              </Link>
            </div>
          </div>
        </main>

        {/* Footer info/metadata matching homepage layout */}
        <footer className="w-full border-t border-stone-900/10 pt-4 flex flex-col sm:flex-row justify-between text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold z-10 gap-2 sm:gap-0">
          <span>TIMBERLUXE Atelier © 2026</span>
          <span>Crafted in Melbourne, Australia</span>
        </footer>
      </div>
    </div>
  );
}
