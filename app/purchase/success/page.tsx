import Link from 'next/link';
import Image from 'next/image';
import { getProductById, saveProduct } from '@/lib/db';

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    simulated?: string;
    productId?: string;
  }>;
}

export default async function PurchaseSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const { simulated, productId } = params;

  const product = productId ? await getProductById(productId) : null;
  const isSimulated = simulated === 'true';

  if (product && !product.sold) {
    product.sold = true;
    await saveProduct(product);
  }

  return (
    <div className="min-h-screen w-full bg-[hsl(42,100%,88%)] p-5 md:p-8 flex flex-col justify-center items-center text-stone-900 font-sans">
      <div className="max-w-xl w-full border border-stone-900/15 bg-transparent p-8 md:p-12 flex flex-col items-center text-center shadow-sm relative">
        
        {/* Animated Checkmark */}
        <div className="w-16 h-16 rounded-full bg-stone-900/5 flex items-center justify-center border border-stone-900/10 mb-8 animate-pulse">
          <svg className="w-8 h-8 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-bold mb-2">
          Payment Received
        </span>
        <h1 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-tight mb-8">
          Acquisition Confirmed
        </h1>

        {product && (
          <div className="w-full flex flex-col items-center gap-6 border-y border-stone-900/10 py-8 mb-8 bg-stone-900/[0.01]">
            <div className="relative aspect-[4/3] w-48 border border-stone-900/10 overflow-hidden bg-stone-900/5">
              <Image 
                src={product.image} 
                alt={product.alt || product.name} 
                fill 
                sizes="192px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <h2 className="font-serif font-light text-xl text-stone-900">
                {product.name}
              </h2>
              <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold mt-1">
                {product.subtitle}
              </span>
              <span className="font-mono text-stone-900 text-sm font-semibold mt-3">
                ${product.price} AUD
              </span>
            </div>
          </div>
        )}

        {isSimulated && (
          <div className="w-full mb-8 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-850 rounded text-left flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-amber-600">
              Developer Simulation Mode
            </span>
            <p className="text-xs font-light leading-relaxed">
              No real transactions occurred. This screen confirms that your checkout process redirects correctly and registers the payment workflow.
            </p>
          </div>
        )}

        <p className="text-stone-600 text-xs md:text-sm font-light leading-relaxed mb-8 max-w-sm">
          A receipt has been generated. The atelier will coordinate white-glove courier delivery for this physical work shortly.
        </p>

        <Link
          href="/"
          className="h-12 px-8 flex items-center justify-center rounded-full bg-stone-900 text-stone-100 font-semibold text-xs uppercase tracking-[0.2em] hover:bg-stone-850 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:scale-[1.01]"
        >
          Return to Atelier
        </Link>
      </div>
    </div>
  );
}
