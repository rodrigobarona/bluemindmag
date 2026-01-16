'use client';

import Link from 'next/link';
import Image from 'next/image';
import Tilt from 'react-parallax-tilt';
import type { Issue, IssueTranslation } from '@/content/types/content';

interface IssueCardProps {
  issue: Issue;
  translation: IssueTranslation;
  priority?: boolean;
}

export function IssueCard({ issue, translation, priority = false }: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <article className="relative">
        <Tilt
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          scale={1.02}
          transitionSpeed={400}
          glareEnable={true}
          glareMaxOpacity={0.15}
          glarePosition="all"
          glareBorderRadius="4px"
          perspective={1000}
          className="relative"
        >
          {/* Cover container */}
          <div className="relative overflow-hidden rounded cover-shadow">
            {/* Accent border on hover */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded"
              style={{
                boxShadow: `inset 0 0 0 3px ${issue.accentColor}`,
              }}
            />

            {/* Cover Image */}
            <div className="aspect-magazine-cover relative bg-muted">
              <Image
                src={issue.cover}
                alt={`${translation.title} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority}
              />
            </div>

            {/* Current issue badge */}
            {issue.isCurrent && (
              <div
                className="absolute top-4 right-4 z-20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg"
                style={{
                  backgroundColor: issue.accentColor,
                  color: '#ffffff',
                }}
              >
                Current
              </div>
            )}
          </div>
        </Tilt>

        {/* Issue info */}
        <div className="mt-6 text-center">
          <h3 className="headline text-xl md:text-2xl transition-fast group-hover:text-brand">
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

// Large featured card for current issue on homepage
export function IssueCardFeatured({ issue, translation, priority = true }: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <article className="relative">
        <Tilt
          tiltMaxAngleX={8}
          tiltMaxAngleY={8}
          scale={1.01}
          transitionSpeed={500}
          glareEnable={true}
          glareMaxOpacity={0.12}
          glarePosition="all"
          glareBorderRadius="8px"
          perspective={1200}
          className="relative"
        >
          {/* Cover container */}
          <div className="relative overflow-hidden rounded-lg shadow-editorial-lg">
            {/* Accent border on hover */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg"
              style={{
                boxShadow: `inset 0 0 0 4px ${issue.accentColor}`,
              }}
            />

            {/* Cover Image */}
            <div className="aspect-magazine-cover relative bg-muted">
              <Image
                src={issue.cover}
                alt={`${translation.title} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={priority}
              />
            </div>
          </div>
        </Tilt>
      </article>
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
          className="relative overflow-hidden rounded transition-fast hover-lift"
          style={{
            '--tw-ring-color': issue.accentColor,
          } as React.CSSProperties}
        >
          <div className="aspect-magazine-cover relative bg-muted shadow-editorial">
            <Image
              src={issue.cover}
              alt={`${translation.title} cover`}
              fill
              className="object-cover"
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
          <h3 className="headline text-lg md:text-xl transition-fast group-hover:text-brand">
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
