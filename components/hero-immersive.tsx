'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface HeroImmersiveProps {
  heroImage?: {
    src: string;
    srcLarge: string;
    srcMedium: string;
    photographer?: string;
    photographerUrl?: string;
    alt: string;
    avgColor?: string;
  } | null;
  tagline?: string;
  issueNumber?: string;
  issueDate?: string;
  issueSlug?: string;
  issueCover?: string;
  issueTitle?: string;
}

/**
 * HeroImmersive - Full-viewport cinematic hero section
 * Features Ken Burns effect, parallax, and staggered text reveals
 */
export function HeroImmersive({
  heroImage,
  tagline = 'Where Surf & Science Meet',
  issueNumber = '0',
  issueDate = 'January 2026',
  issueSlug,
  issueCover,
  issueTitle,
}: HeroImmersiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax effects
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Use fallback local image if no Pexels image
  const imageSrc = heroImage?.srcLarge || heroImage?.src || '/images/hero/ocean-aerial.jpg';
  const imageAlt = heroImage?.alt || 'Ocean waves';

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] w-full overflow-hidden"
    >
      {/* Background Image with Ken Burns */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 -top-20"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        
        {/* Film grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4"
      >
        {/* Surf Science label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <span className="font-ui text-sm tracking-[0.3em] uppercase text-white/70">
            Surf Science
          </span>
        </motion.div>

        {/* BLUE MIND masthead */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-hero text-center text-white mb-6"
        >
          BLUE MIND
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="tagline text-white/90 text-center max-w-md mb-10"
        >
          &ldquo;{tagline}&rdquo;
        </motion.p>

        {/* Current Issue Card - Clickable with thumbnail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {issueSlug ? (
            <Link
              href={`/issues/${issueSlug}`}
              className="group flex items-center gap-5 bg-white/10 backdrop-blur-md rounded-lg px-5 py-4 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              {/* Cover Thumbnail */}
              {issueCover && (
                <div className="relative w-14 h-20 flex-shrink-0 overflow-hidden rounded shadow-lg group-hover:shadow-xl transition-shadow">
                  <Image
                    src={issueCover}
                    alt={issueTitle || `Issue ${issueNumber}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="56px"
                  />
                </div>
              )}
              
              {/* Issue Info */}
              <div className="flex flex-col">
                <span className="font-ui text-xs tracking-[0.2em] uppercase text-white/60 mb-1">
                  Current Issue
                </span>
                <span className="font-headline text-lg text-white tracking-wide">
                  Issue {issueNumber}
                </span>
                <span className="font-ui text-xs text-white/50 mt-0.5">
                  {issueDate}
                </span>
              </div>
              
              {/* Arrow */}
              <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all ml-2" />
            </Link>
          ) : (
            // Fallback if no issue slug (just display info)
            <div className="flex items-center gap-4 font-ui text-sm text-white/60">
              <span className="tracking-widest uppercase">Issue {issueNumber}</span>
              <span className="w-8 h-px bg-white/30" />
              <span className="tracking-wider">{issueDate}</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50"
      >
        <span className="font-ui text-xs tracking-widest uppercase mb-3">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Photo credit */}
      {heroImage?.photographer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-8 right-8 font-ui text-xs text-white/40"
        >
          Photo:{' '}
          {heroImage.photographerUrl ? (
            <a
              href={heroImage.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              {heroImage.photographer}
            </a>
          ) : (
            heroImage.photographer
          )}
          {' / Pexels'}
        </motion.div>
      )}
    </section>
  );
}

/**
 * HeroImmersiveStatic - Simpler hero without Pexels dependency
 * Uses a local image for faster loading
 */
export function HeroImmersiveStatic({
  imageSrc = '/images/hero-fallback.jpg',
  imageAlt = 'Ocean waves',
  tagline = 'Where Surf & Science Meet',
}: {
  imageSrc?: string;
  imageAlt?: string;
  tagline?: string;
}) {
  return (
    <HeroImmersive
      heroImage={{
        src: imageSrc,
        srcLarge: imageSrc,
        srcMedium: imageSrc,
        alt: imageAlt,
      }}
      tagline={tagline}
    />
  );
}
