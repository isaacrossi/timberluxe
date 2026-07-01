"use client";

import Image from "next/image";
import { Product } from "@/lib/db";
import { toCurrencyFromCent } from "@/lib/currency";

interface CatalogListTabProps {
  products: Product[];
  handleCreateProduct: () => void;
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (id: string) => Promise<void>;
}

export default function CatalogListTab({
  products,
  handleCreateProduct,
  handleEditProduct,
  handleDeleteProduct,
}: CatalogListTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl text-stone-100 font-light">
            Catalog Management
          </h2>
          <p className="text-stone-400 text-xs font-light">
            Add, update, or remove physical works from the public atelier grid.
          </p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="h-10 px-6 rounded-full bg-amber-500 text-stone-950 font-semibold text-xs uppercase tracking-[0.15em] hover:bg-amber-400 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
        >
          + Create New Work
        </button>
      </div>

      {products.length === 0 ? (
        <div className="w-full border border-stone-850 p-12 text-center text-stone-500 text-sm font-light">
          No items in catalog. Click &quot;+ Create New Work&quot; to add
          your first piece.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="border border-stone-850 bg-[#161619] flex flex-col group overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 border-b border-stone-850">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.alt || product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={idx < 2}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-600 text-xs uppercase tracking-widest">
                    No Image Uploaded
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-lg text-stone-100 font-light truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-amber-500 text-sm font-semibold">
                      {toCurrencyFromCent(product.price)}
                    </span>
                    {product.sold && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded border border-red-500/30 bg-red-950/20 text-red-400 font-bold uppercase tracking-wider font-mono">
                        Sold
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold">
                  {product.subtitle}
                </span>
                <p className="text-stone-400 text-xs font-light leading-relaxed mt-2 line-clamp-2 italic">
                  &quot;{product.description}&quot;
                </p>
              </div>

              {/* Card Actions */}
              <div className="border-t border-stone-850 px-5 py-4 flex gap-4 bg-stone-950/20">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 h-9 flex items-center justify-center rounded border border-stone-850 hover:border-stone-700 text-stone-300 hover:text-stone-100 text-[10px] uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  Edit Piece
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="h-9 w-9 flex items-center justify-center rounded border border-stone-850 hover:border-red-900/30 hover:bg-red-950/10 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                    <path
                      fillRule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3h11V2h-11v1z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
