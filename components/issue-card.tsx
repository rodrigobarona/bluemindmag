'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import type { Issue, IssueTranslation } from '@/content/types/content';

interface IssueCardProps {
  issue: Issue;
  translation: IssueTranslation;
  priority?: boolean;
}

export function IssueCard({ issue, translation, priority = false }: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article 
          className="relative"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
        {/* Cover container with dramatic shadow */}
        <div className="relative overflow-hidden shadow-float group-hover:shadow-cover transition-slow">
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
              <div
              className="absolute top-4 right-4 z-10 px-3 py-1.5 font-ui text-xs font-semibold uppercase tracking-wider"
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
          <h3 className="font-headline text-xl md:text-2xl group-hover:text-brand transition-base">
            {translation.title}
          </h3>
          <p className="font-ui text-muted-foreground text-sm mt-2">
            {translation.subtitle}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

// Large featured card for current issue on homepage
export function IssueCardFeatured({ issue, translation, priority = true }: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article 
          className="relative"
        whileHover={{ y: -12 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
        {/* Cover container with floating shadow */}
        <div className="relative overflow-hidden shadow-float">
            {/* Cover Image */}
          <div className="aspect-magazine-cover relative bg-muted overflow-hidden">
              <Image
                src={issue.cover}
                alt={`${translation.title} cover`}
                fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={priority}
              />
            
            {/* Warm gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Current issue badge */}
            {issue.isCurrent && (
              <div
              className="absolute top-4 right-4 z-10 px-4 py-2 font-ui text-sm font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: issue.accentColor,
                  color: '#ffffff',
                }}
              >
                Current Issue
              </div>
            )}
          </div>
      </motion.article>
    </Link>
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
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article 
        className="relative h-[400px] md:h-[500px] overflow-hidden bg-card"
        whileHover="hover"
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
            hover: { y: -8 },
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article 
        className="relative"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Cover Image with subtle shadow */}
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
            <div
              className="absolute top-3 right-3 z-10 px-2 py-1 font-ui text-xs font-semibold uppercase tracking-wider"
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
          <h3 className="font-headline text-lg md:text-xl group-hover:text-brand transition-base">
            {translation.title}
          </h3>
          <p className="font-ui text-muted-foreground text-sm mt-1">
            {translation.subtitle}
          </p>
        </div>
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
  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <motion.article 
        className="relative"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
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
        
        <div className="mt-3 text-center">
          <span className="font-ui text-xs text-muted-foreground">
            Issue {issue.issueNumber}
          </span>
        </div>
      </motion.article>
    </Link>
  );
}
