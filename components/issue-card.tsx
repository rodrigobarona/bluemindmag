'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import type { Issue, IssueTranslation } from '@/content/types/content';

interface IssueCardProps {
  issue: Issue;
  translation: IssueTranslation;
  priority?: boolean;
}

export function IssueCard({ issue, translation, priority = false }: IssueCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for natural movement
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  // Transform mouse position to rotation (max 8 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  // Glare/shine effect position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  // Shadow movement for depth
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], ['-10px', '10px']);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], ['-10px', '10px']);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative cursor-pointer"
      >
        {/* Card container with perspective */}
        <div className="perspective-1000 relative">
          {/* Cover image with float effect */}
          <motion.div
            style={{
              translateZ: 30,
              boxShadow: useTransform(
                [shadowX, shadowY],
                ([x, y]) => `${x} ${y} 30px rgba(0, 0, 0, 0.4)`
              ),
            }}
            className="relative overflow-hidden rounded-sm"
          >
            {/* Accent color border on hover */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 0 2px ${issue.accentColor}`,
              }}
            />

            {/* Cover Image */}
            <div className="aspect-magazine-cover relative bg-card">
              <Image
                src={issue.cover}
                alt={`${translation.title} cover`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority}
              />
            </div>

            {/* Glare overlay */}
            <motion.div
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.12), transparent 60%)`,
              }}
              className="absolute inset-0 pointer-events-none z-20"
            />
          </motion.div>

          {/* Current issue badge */}
          {issue.isCurrent && (
            <div
              className="absolute -top-3 -right-3 z-30 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full"
              style={{
                backgroundColor: issue.accentColor,
                color: '#ffffff',
              }}
            >
              Current
            </div>
          )}
        </div>

        {/* Issue info */}
        <div className="mt-5 text-center">
          <h3 className="headline text-xl md:text-2xl transition-colors group-hover:text-brand">
            {translation.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {translation.subtitle}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

// Simplified card without 3D effect for mobile/archive grids
export function IssueCardSimple({
  issue,
  translation,
  priority = false,
}: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <article className="relative">
        {/* Cover Image */}
        <div
          className="relative overflow-hidden rounded-sm transition-all duration-300 group-hover:ring-2"
          style={{
            '--tw-ring-color': issue.accentColor,
          } as React.CSSProperties}
        >
          <div className="aspect-magazine-cover relative bg-card">
            <Image
              src={issue.cover}
              alt={`${translation.title} cover`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          </div>

          {/* Current issue badge */}
          {issue.isCurrent && (
            <div
              className="absolute top-3 right-3 z-10 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-full"
              style={{
                backgroundColor: issue.accentColor,
                color: '#ffffff',
              }}
            >
              Current
            </div>
          )}
        </div>

        {/* Issue info */}
        <div className="mt-4 text-center">
          <h3 className="headline text-lg md:text-xl transition-colors group-hover:text-brand">
            {translation.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {translation.subtitle}
          </p>
        </div>
      </article>
    </Link>
  );
}

