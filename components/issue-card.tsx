'use client';

import { useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles } from 'lucide-react';
import type { Issue, IssueTranslation } from '@/content/types/content';
import { CurrentIssueBadge, IssueHoverCTA } from './issue-cta';
import { useReducedMotion, ANIMATION_CONFIG } from '@/lib/use-reduced-motion';

interface IssueCardProps {
  issue: Issue;
  translation: IssueTranslation;
  priority?: boolean;
}

export function IssueCard({ issue, translation, priority = false }: IssueCardProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article 
          className="relative"
        whileHover={prefersReducedMotion ? {} : { y: ANIMATION_CONFIG.lift.large }}
        transition={{ duration: ANIMATION_CONFIG.duration.base, ease: ANIMATION_CONFIG.ease.out }}
        >
        {/* Cover as semantic figure */}
        <figure className="relative overflow-hidden shadow-float group-hover:shadow-cover transition-slow">
            {/* Cover Image */}
          <div className="aspect-magazine-cover relative bg-muted overflow-hidden">
              <Image
                src={issue.cover}
                alt={`${translation.title} cover`}
                fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority}
              />
            
            {/* Warm overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Current issue badge */}
            {issue.isCurrent && (
              <CurrentIssueBadge
                label="Current"
                accentColor={issue.accentColor}
                className="absolute top-4 right-4 z-10"
              />
            )}
          
          {/* Issue info as figcaption */}
          <figcaption className="mt-6 text-center">
            <h3 className="font-headline text-xl md:text-2xl group-hover:text-brand transition-base">
              {translation.title}
            </h3>
            <p className="font-ui text-muted-foreground text-sm mt-2">
              {translation.subtitle}
            </p>
          </figcaption>
        </figure>
      </motion.article>
    </Link>
  );
}

// Large featured card for current issue on homepage with 3D tilt effect
export function IssueCardFeatured({ issue, translation, priority = true }: IssueCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the tilt
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [12, -12]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-12, 12]),
    springConfig
  );

  // Parallax layers
  const glowX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-20, 20]),
    springConfig
  );
  const glowY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-20, 20]),
    springConfig
  );
  const shadowX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [30, -30]),
    springConfig
  );
  const shadowY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [30, -30]),
    springConfig
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || prefersReducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normalizedX = (e.clientX - centerX) / rect.width;
    const normalizedY = (e.clientY - centerY) / rect.height;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      {/* Floating shadow layer */}
      <motion.div
        className="absolute inset-4 -z-20 opacity-40"
        style={{
          x: shadowX,
          y: shadowY,
          background: `linear-gradient(135deg, ${issue.accentColor}40 0%, transparent 60%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Main cover container with 3D transform */}
      <motion.div
        className="relative w-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <Link href={`/read/${issue.slug}`} className="group block w-full">
          <article className="relative w-full">
            {/* Cover container with floating shadow */}
            <div className="relative w-full overflow-hidden shadow-float group-hover:shadow-cover transition-slow">
              {/* Cover Image */}
              <div className="aspect-magazine-cover relative bg-muted overflow-hidden">
                <Image
                  src={issue.cover}
                  alt={`${translation.title} cover`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={priority}
                />

                {/* Glossy reflection effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-slow pointer-events-none"
                  style={{
                    background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)`,
                    x: glowX,
                    y: glowY,
                  }}
                />

                {/* Warm gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-slow" />

                {/* CTA on hover */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-slow">
                  <IssueHoverCTA label="Read Now" />
                </div>
              </div>

              {/* Current issue badge */}
              {issue.isCurrent && (
                <CurrentIssueBadge
                  label="Current Issue"
                  accentColor={issue.accentColor}
                  size="lg"
                  className="absolute top-4 right-4 z-10"
                />
              )}
            </div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl pointer-events-none"
              style={{
                background: issue.accentColor,
                x: useTransform(mouseX, [-0.5, 0.5], [10, -10]),
                y: useTransform(mouseY, [-0.5, 0.5], [10, -10]),
              }}
            />
          </article>
        </Link>
      </motion.div>

      {/* Interactive hint */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-ui text-xs text-muted-foreground/60 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Sparkles className="w-3 h-3" />
        Move cursor
      </motion.div>
    </motion.div>
  );
}

// Horizontal scroll card for sections
export function IssueCardHorizontal({ 
  issue, 
  translation,
  sectionTitle,
  sectionDescription,
}: IssueCardProps & { 
  sectionTitle?: string;
  sectionDescription?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article 
        className="relative h-[400px] md:h-[500px] overflow-hidden bg-card"
        whileHover={prefersReducedMotion ? undefined : "hover"}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={issue.cover}
            alt={`${translation.title}`}
            fill
            className="object-cover"
            sizes="85vw"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        {/* Content */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white"
          variants={{
            hover: { y: ANIMATION_CONFIG.lift.large },
          }}
          transition={{ duration: ANIMATION_CONFIG.duration.base, ease: ANIMATION_CONFIG.ease.out }}
        >
          {sectionTitle && (
            <span className="font-ui text-xs uppercase tracking-[0.2em] text-white/70 mb-2 block">
              {sectionTitle}
            </span>
          )}
          <h3 className="font-headline text-2xl md:text-3xl mb-2">
            {translation.title}
          </h3>
          {sectionDescription && (
            <p className="font-body text-white/70 text-sm md:text-base line-clamp-2">
              {sectionDescription}
            </p>
          )}
        </motion.div>
      </motion.article>
    </Link>
  );
}

// Simplified card for archive grids
export function IssueCardSimple({
  issue,
  translation,
  priority = false,
}: IssueCardProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article 
        className="relative"
        whileHover={prefersReducedMotion ? {} : { y: ANIMATION_CONFIG.lift.base }}
        transition={{ duration: ANIMATION_CONFIG.duration.base, ease: ANIMATION_CONFIG.ease.out }}
      >
        {/* Cover as semantic figure */}
        <figure>
          <div className="relative overflow-hidden shadow-editorial group-hover:shadow-editorial-lg transition-slow">
            <div className="aspect-magazine-cover relative bg-muted overflow-hidden">
              <Image
                src={issue.cover}
                alt={`${translation.title} cover`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority}
              />
            </div>

            {/* Current issue badge */}
            {issue.isCurrent && (
              <CurrentIssueBadge
                label="Current"
                accentColor={issue.accentColor}
                size="sm"
                className="absolute top-3 right-3 z-10"
              />
            )}
          </div>

          {/* Issue info as figcaption */}
          <figcaption className="mt-4 text-center">
            <h3 className="font-headline text-lg md:text-xl group-hover:text-brand transition-base">
              {translation.title}
            </h3>
            <p className="font-ui text-muted-foreground text-sm mt-1">
              {translation.subtitle}
            </p>
          </figcaption>
        </figure>
      </motion.article>
    </Link>
  );
}

// Mini card for archive grids
export function IssueCardMini({
  issue,
  translation,
  priority = false,
}: IssueCardProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article 
        className="relative"
        whileHover={prefersReducedMotion ? {} : { y: ANIMATION_CONFIG.lift.small }}
        transition={{ duration: ANIMATION_CONFIG.duration.fast, ease: 'easeOut' }}
      >
        <figure>
          <div className="relative overflow-hidden shadow-editorial">
            <div className="aspect-magazine-cover relative bg-muted overflow-hidden">
              <Image
                src={issue.cover}
                alt={`${translation.title} cover`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
                priority={priority}
              />
            </div>
          </div>
          
          <figcaption className="mt-3 text-center">
            <span className="font-ui text-xs text-muted-foreground">
              Issue {issue.issueNumber}
            </span>
          </figcaption>
        </figure>
      </motion.article>
    </Link>
  );
}
