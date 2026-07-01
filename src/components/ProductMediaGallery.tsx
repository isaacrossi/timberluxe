"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ProductMedia } from '@/lib/db';

interface ProductMediaGalleryProps {
  mainImage: string;
  mainAlt: string;
  media?: ProductMedia[];
}

export default function ProductMediaGallery({
  mainImage,
  mainAlt,
  media = [],
}: ProductMediaGalleryProps) {
  // Combine main image and extra media into a single normalized array
  const allMedia: ProductMedia[] = [
    { type: 'image', url: mainImage, alt: mainAlt },
    ...media,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = allMedia[activeIndex] || allMedia[0];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Active Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-stone-900/15 bg-stone-900/5 shadow-md">
        {activeItem.type === 'video' ? (
          <video
            key={activeItem.url} // Force reload player when URL changes
            src={activeItem.url}
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover bg-stone-950"
          />
        ) : (
          <Image
            src={activeItem.url}
            alt={activeItem.alt || "Product Image"}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover"
          />
        )}
      </div>

      {/* Thumbnails Row */}
      {allMedia.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-400">
          {allMedia.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[4/3] w-20 border transition-all duration-350 bg-stone-900/5 overflow-hidden shrink-0 cursor-pointer ${
                activeIndex === idx 
                  ? 'border-amber-600 shadow-sm ring-1 ring-amber-600/30' 
                  : 'border-stone-900/10 hover:border-stone-900/30'
              }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full relative flex items-center justify-center bg-stone-950">
                  <video
                    src={item.url}
                    muted
                    className="w-full h-full object-cover opacity-70"
                  />
                  {/* Play Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-stone-900/80 border border-white/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={item.alt || `Thumbnail ${idx}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
