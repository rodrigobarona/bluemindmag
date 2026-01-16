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
      <article className="relative pb-8">
        <Tilt
          tiltMaxAngleX={12}
          tiltMaxAngleY={12}
          scale={1.03}
          transitionSpeed={300}
          glareEnable={true}
          glareMaxOpacity={0.2}
          glarePosition="all"
          glareBorderRadius="6px"
          perspective={1000}
          className="relative"
        >
          {/* Cover container with floating shadow */}
          <div className="relative overflow-hidden rounded-md cover-shadow">
            {/* Accent border on hover */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-md"
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
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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
        <div className="mt-8 text-center">
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
      <article className="relative pb-12">
        <Tilt
          tiltMaxAngleX={8}
          tiltMaxAngleY={8}
          scale={1.02}
          transitionSpeed={400}
          glareEnable={true}
          glareMaxOpacity={0.15}
          glarePosition="all"
          glareBorderRadius="8px"
          perspective={1200}
          className="relative"
        >
          {/* Cover container with enhanced floating shadow */}
          <div className="relative overflow-hidden rounded-lg cover-shadow-featured">
            {/* Accent border on hover */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-lg"
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
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={priority}
              />
            </div>

            {/* Current issue badge */}
            {issue.isCurrent && (
              <div
                className="absolute top-4 right-4 z-20 px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-full shadow-lg"
                style={{
                  backgroundColor: issue.accentColor,
                  color: '#ffffff',
                }}
              >
                Current Issue
              </div>
            )}
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
      <article className="relative pb-6">
        {/* Cover Image with subtle shadow */}
        <div className="relative overflow-hidden rounded-md cover-shadow transition-base">
          <div className="aspect-magazine-cover relative bg-muted">
            <Image
              src={issue.cover}
              alt={`${translation.title} cover`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          </div>

          {/* Accent border on hover */}
          <div
            className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-md"
            style={{
              boxShadow: `inset 0 0 0 2px ${issue.accentColor}`,
            }}
          />

          {/* Current issue badge */}
          {issue.isCurrent && (
            <div
              className="absolute top-3 right-3 z-10 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-md"
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
        <div className="mt-6 text-center">
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
