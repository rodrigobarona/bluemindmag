"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import type { ImageResult } from "@/lib/pexels";
import { generateBlurPlaceholder } from "@/lib/image-utils";

interface PullQuoteProps {
  quote: string;
  attribution?: string;
  className?: string;
}

/**
 * PullQuote - Dramatic full-width quote section
 * Features parallax background and smooth reveal
 */
export function PullQuote({
  quote,
  attribution,
  className = "",
}: PullQuoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={containerRef}
      className={`relative py-24 md:py-32 lg:py-40 overflow-hidden ${className}`}
    >
      {/* Subtle texture background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 -top-20 -bottom-20 bg-secondary"
      />

      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm/5 via-transparent to-brand/5 pointer-events-none" />

      {/* Content */}
      <div className="container-narrow relative z-10">
        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="pullquote text-foreground"
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>

        {attribution && (
          <motion.cite
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="block text-center mt-8 font-ui text-sm text-muted-foreground not-italic tracking-wider"
          >
            — {attribution}
          </motion.cite>
        )}
      </div>
    </section>
  );
}

/**
 * PullQuoteImage - Quote with full-bleed background image
 * Uses Pexels API for dynamic imagery
 */
export function PullQuoteImage({
  quote,
  attribution,
  image,
  className = "",
}: PullQuoteProps & { image?: ImageResult | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  // Use fallback if no image provided
  const imageSrc = image?.srcLarge || image?.src || '/images/hero/ocean-aerial.jpg';
  const imageAlt = image?.alt || 'Ocean atmosphere';
  const blurDataURL = image?.blurDataURL || (image?.avgColor ? generateBlurPlaceholder(image.avgColor) : undefined);

  return (
    <section
      ref={containerRef}
      className={`relative py-32 md:py-40 lg:py-48 overflow-hidden ${className}`}
    >
      {/* Background image with parallax */}
      <motion.div
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 -top-20 -bottom-20"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        
        {/* Film grain */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Content */}
      <div className="container-narrow relative z-10">
        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="pullquote text-white"
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>

        {attribution && (
          <motion.cite
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="block text-center mt-8 font-ui text-sm text-white/60 not-italic tracking-wider"
          >
            — {attribution}
          </motion.cite>
        )}
      </div>

      {/* Photo credit */}
      {image?.photographer && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute bottom-6 right-6 font-ui text-xs text-white/30 z-10"
        >
          Photo:{' '}
          {image.photographerUrl ? (
            <a
              href={image.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/50 transition-colors"
            >
              {image.photographer}
            </a>
          ) : (
            image.photographer
          )}
          {' / Pexels'}
        </motion.div>
      )}
    </section>
  );
}

/**
 * PullQuoteDark - Quote on solid dark background
 */
export function PullQuoteDark({
  quote,
  attribution,
  className = "",
}: PullQuoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={containerRef}
      className={`relative py-32 md:py-40 lg:py-48 overflow-hidden bg-[#0d1117] ${className}`}
    >
      {/* Subtle animated gradient */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 -top-20 -bottom-20 bg-gradient-to-br from-brand/10 via-transparent to-warm/5"
      />

      {/* Content */}
      <div className="container-narrow relative z-10">
        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="pullquote text-white/90"
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>

        {attribution && (
          <motion.cite
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="block text-center mt-8 font-ui text-sm text-white/50 not-italic tracking-wider"
          >
            — {attribution}
          </motion.cite>
        )}
      </div>
    </section>
  );
}
