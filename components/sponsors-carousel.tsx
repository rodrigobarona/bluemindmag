"use client";

import Image from "next/image";
import { useState } from "react";
import type { Sponsor } from "@/content/types/content";

interface SponsorsCarouselProps {
  sponsors: Sponsor[];
  title?: string;
  variant?: "default" | "light";
}

export function SponsorsCarousel({ sponsors, title, variant = "default" }: SponsorsCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate sponsors multiple times for seamless infinite loop
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors];

  // Use white gradients for light variant (forced light mode for logo visibility)
  const gradientClass = variant === "light" 
    ? "from-white" 
    : "from-background";

  return (
    <div className="w-full">
      {title && (
        <h3 className={`font-headline text-2xl md:text-3xl text-center mb-10 ${
          variant === "light" ? "text-gray-900" : ""
        }`}>
          {title}
        </h3>
      )}
      
      {/* Marquee container */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade edges */}
        <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r ${gradientClass} to-transparent z-10 pointer-events-none`} />
        <div className={`absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l ${gradientClass} to-transparent z-10 pointer-events-none`} />
        
        {/* Scrolling track */}
        <div 
          className="flex"
          style={{
            animation: 'marquee 30s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {duplicatedSponsors.map((sponsor, index) => (
            <a
              key={`${sponsor.id}-${index}`}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-8 md:px-12 opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
              title={sponsor.name}
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.alt || sponsor.name}
                width={160}
                height={60}
                loading="lazy"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
