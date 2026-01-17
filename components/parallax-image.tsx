'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  parallaxStrength?: number;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  overlay?: boolean;
  overlayOpacity?: number;
  kenBurns?: boolean;
}

/**
 * ParallaxImage - Image with parallax scroll effect
 * 
 * @example
 * <ParallaxImage
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   parallaxStrength={50}
 *   overlay
 * />
 */
export function ParallaxImage({
  src,
  alt,
  className = '',
  parallaxStrength = 50,
  priority = false,
  fill = false,
  width,
  height,
  overlay = false,
  overlayOpacity = 0.4,
  kenBurns = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Transform scroll progress to parallax movement
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [-parallaxStrength, parallaxStrength]
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y }}
        className={`absolute inset-0 ${kenBurns ? 'ken-burns' : ''}`}
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            className="object-cover w-full h-full"
          />
        )}
      </motion.div>
      
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

/**
 * ParallaxContainer - Container with parallax background
 */
export function ParallaxContainer({
  children,
  backgroundSrc,
  backgroundAlt = 'Background',
  className = '',
  parallaxStrength = 30,
  overlay = true,
}: {
  children: React.ReactNode;
  backgroundSrc: string;
  backgroundAlt?: string;
  className?: string;
  parallaxStrength?: number;
  overlay?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [-parallaxStrength, parallaxStrength]
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 -top-20 -bottom-20"
      >
        <Image
          src={backgroundSrc}
          alt={backgroundAlt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      
      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

