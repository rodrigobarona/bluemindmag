"use client";

import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame } from "motion/react";
import type { Sponsor } from "@/content/types/content";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface SponsorsCarouselProps {
  sponsors: Sponsor[];
  title?: string;
  variant?: "default" | "light";
  speed?: number; // pixels per second
}

/**
 * Parse dimensions from filename convention: name_WxH.ext
 * Example: ferox-surfboards_476x113.svg → { width: 476, height: 113 }
 */
function parseDimensionsFromFilename(path: string): { width: number; height: number } | null {
  const filename = path.split('/').pop() || '';
  const match = filename.match(/_(\d+)x(\d+)\.[a-z]+$/i);
  if (match) {
    return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
  }
  return null;
}

/**
 * Calculate proportional width based on consistent target height
 * All logos display at the same height (56px / h-14)
 * Width scales naturally based on aspect ratio
 */
function getProportionalDimensions(path: string, targetHeight: number = 56): { width: number; height: number } {
  const parsed = parseDimensionsFromFilename(path);
  if (parsed) {
    const aspectRatio = parsed.width / parsed.height;
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }
  // Fallback for logos without dimension convention (assumes ~2.5:1 aspect ratio)
  return { width: 140, height: 56 };
}

/**
 * Renders one set of sponsor logos
 */
function SponsorTrack({ sponsors }: { sponsors: Array<Sponsor & { dimensions: { width: number; height: number } }> }) {
  return (
    <>
      {sponsors.map((sponsor, index) => (
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
            width={sponsor.dimensions.width}
            height={sponsor.dimensions.height}
            loading="lazy"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </a>
      ))}
    </>
  );
}

export function SponsorsCarousel({ sponsors, title, variant = "default", speed = 50 }: SponsorsCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useMotionValue(0);
  
  // Pre-calculate dimensions for all sponsors
  const sponsorsWithDimensions = useMemo(() => 
    sponsors.map(sponsor => ({
      ...sponsor,
      dimensions: getProportionalDimensions(sponsor.logo),
    })), [sponsors]
  );

  // Measure the width of one track
  useEffect(() => {
    if (containerRef.current) {
      // Get the width of the first track (half of the container)
      const firstTrack = containerRef.current.children[0] as HTMLElement;
      if (firstTrack) {
        setTrackWidth(firstTrack.offsetWidth);
      }
    }
  }, [sponsorsWithDimensions]);

  // Animate frame by frame for seamless loop
  useAnimationFrame((_, delta) => {
    // Skip animation if user prefers reduced motion or paused
    if (prefersReducedMotion || isPaused || trackWidth === 0) return;
    
    // Move left by speed * delta (in seconds)
    const moveBy = (speed * delta) / 1000;
    const currentX = x.get();
    const newX = currentX - moveBy;
    
    // When we've scrolled one full track width, reset seamlessly
    if (newX <= -trackWidth) {
      x.set(newX + trackWidth);
    } else {
      x.set(newX);
    }
  });

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
        
        {/* Seamless infinite scroll using motion */}
        <motion.div 
          ref={containerRef}
          className="flex w-fit"
          style={{ x }}
        >
          {/* First track */}
          <div className="flex shrink-0">
            <SponsorTrack sponsors={sponsorsWithDimensions} />
          </div>
          {/* Second track (duplicate for seamless loop) */}
          <div className="flex shrink-0">
            <SponsorTrack sponsors={sponsorsWithDimensions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
