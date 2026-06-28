"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  speed?: number; // Percentage range of motion (e.g. 10 translates from -5% to +5%)
}

export default function ParallaxImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  speed = 10,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const imgWrapper = imgWrapperRef.current;
    if (!container || !imgWrapper) return;

    let ticking = false;

    const updateParallax = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only calculate transforms if the element is in the viewport
      if (rect.bottom > 0 && rect.top < viewportHeight) {
        // Calculate scroll progress from 0 (entering screen) to 1 (leaving screen)
        const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        
        // Bound the progress and map to centered coordinate (-0.5 to 0.5)
        const centeredProgress = Math.max(0, Math.min(1, scrollProgress)) - 0.5;
        
        // Compute translateY offset (e.g. +5% to -5% if speed is 10)
        const yOffset = -centeredProgress * speed;
        
        imgWrapper.style.transform = `translateY(${yOffset}%) scale(1.15)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateParallax, { passive: true });
    
    // Initial position trigger
    updateParallax();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateParallax);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      <div
        ref={imgWrapperRef}
        className="absolute w-full h-[120%] top-[-10%] left-0 transition-transform duration-75 ease-out will-change-transform"
        style={{ transform: "translateY(0%) scale(1.15)" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}
