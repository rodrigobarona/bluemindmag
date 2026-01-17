'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface IssueCoverTiltProps {
  cover: string;
  title: string;
  slug: string;
  accentColor: string;
  isCurrent?: boolean;
  currentLabel?: string;
  showHint?: boolean;
  priority?: boolean;
}

export function IssueCoverTilt({
  cover,
  title,
  slug,
  accentColor,
  isCurrent = false,
  currentLabel = 'Current Issue',
  showHint = true,
  priority = true,
}: IssueCoverTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the tilt
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [12, -12]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-12, 12]),
    springConfig
  );

  // Parallax layers
  const glowX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-20, 20]),
    springConfig
  );
  const glowY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-20, 20]),
    springConfig
  );
  const shadowX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [30, -30]),
    springConfig
  );
  const shadowY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [30, -30]),
    springConfig
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

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
      className="relative w-full max-w-sm mx-auto"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      {/* Floating shadow layer */}
      <motion.div
        className="absolute inset-4 -z-10 opacity-40"
        style={{
          x: shadowX,
          y: shadowY,
          background: `linear-gradient(135deg, ${accentColor}40 0%, transparent 60%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Main cover container with 3D transform */}
      <motion.div
        className="relative"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <Link href={`/read/${slug}`} className="group block">
          {/* Cover */}
          <div className="relative overflow-hidden shadow-cover">
            <div className="aspect-magazine-cover relative bg-muted overflow-hidden">
              <Image
                src={cover}
                alt={`${title} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
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

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-slow" />

              {/* CTA on hover */}
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-slow">
                <span className="inline-flex items-center gap-2 font-ui text-sm font-medium text-white">
                  <BookOpen className="w-4 h-4" />
                  Read Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-base" />
                </span>
              </div>
            </div>

            {/* Current issue badge - inside the cover like homepage */}
            {isCurrent && (
              <div
                className="absolute top-4 right-4 z-10 px-4 py-2 font-ui text-sm font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: accentColor,
                  color: '#ffffff',
                }}
              >
                {currentLabel}
              </div>
            )}
          </div>

          {/* Floating decorative element */}
          <motion.div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl pointer-events-none"
            style={{
              background: accentColor,
              x: useTransform(mouseX, [-0.5, 0.5], [10, -10]),
              y: useTransform(mouseY, [-0.5, 0.5], [10, -10]),
            }}
          />
        </Link>
      </motion.div>

      {/* Interactive hint */}
      {showHint && (
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-ui text-xs text-muted-foreground/60 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Sparkles className="w-3 h-3" />
          Move cursor
        </motion.div>
      )}
    </motion.div>
  );
}

