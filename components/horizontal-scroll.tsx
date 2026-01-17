'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

/**
 * HorizontalScroll - Horizontal scroll with snap points
 * For mobile-first horizontal card scrolling
 */
export function HorizontalScroll({
  children,
  className = '',
}: HorizontalScrollProps) {
  return (
    <div
      className={`flex overflow-x-auto scroll-snap-x gap-4 pb-4 -mx-4 px-4 ${className}`}
    >
      {children}
    </div>
  );
}

interface HorizontalScrollItemProps {
  children: ReactNode;
  className?: string;
  width?: string;
}

/**
 * HorizontalScrollItem - Snap-aligned item for HorizontalScroll
 */
export function HorizontalScrollItem({
  children,
  className = '',
  width = 'w-[85vw] sm:w-[400px]',
}: HorizontalScrollItemProps) {
  return (
    <div className={`flex-shrink-0 snap-start ${width} ${className}`}>
      {children}
    </div>
  );
}

interface HorizontalScrollSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * HorizontalScrollSection - Desktop horizontal scroll driven by vertical scroll
 * Transforms vertical scroll into horizontal movement on larger screens
 */
export function HorizontalScrollSection({
  children,
  className = '',
}: HorizontalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.666%']);

  return (
    <div
      ref={containerRef}
      className={`relative h-[300vh] hidden lg:block ${className}`}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          ref={scrollRef}
          style={{ x }}
          className="flex h-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * HorizontalScrollPanel - Full-width panel for desktop horizontal scroll
 */
export function HorizontalScrollPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex-shrink-0 w-screen h-full ${className}`}>
      {children}
    </div>
  );
}

