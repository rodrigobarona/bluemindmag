"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { IssueCoverTilt } from "@/components/issue-cover-tilt";
import { ReadIssueButton } from "@/components/read-issue-button";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  Floating,
  TextReveal,
  LineDraw,
} from "@/components/animations/scroll-reveal";
import type { Issue, IssueTranslation } from "@/content/types/content";

// Hook to prevent hydration mismatch
function useMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}

interface IssueDetailAnimatedProps {
  issue: Issue;
  translation: IssueTranslation;
  locale: string;
  labels: {
    readIssue: string;
    sections: string;
    features: string;
    page: string;
    by: string;
    current: string;
    previewIssue: string;
    inThisIssue: string;
    fullIssue: string;
    startReading: string;
    exploreMore: string;
  };
}

export function IssueDetailHero({
  issue,
  translation,
  locale,
  labels,
}: IssueDetailAnimatedProps) {
  const isMounted = useMounted();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for ambient glow
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.2]);

  return (
    <section
      ref={heroRef}
      className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${issue.accentColor}25 0%, ${issue.accentColor}18 50%, ${issue.accentColor}08 100%)`,
      }}
    >
      {/* Animated ambient glow with parallax */}
      <motion.div
        className="absolute inset-0 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 120% 100% at 15% 20%, ${issue.accentColor}40 0%, transparent 50%)`,
          y: glowY,
          opacity: glowOpacity,
        }}
      />

      <div className="container-editorial relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Cover Image with 3D Tilt Effect */}
          {/* Mobile: no animation, always visible */}
          <div className="relative flex justify-center pt-8 pb-12 lg:hidden">
            <IssueCoverTilt
              cover={issue.cover}
              title={translation.title}
              slug={issue.slug}
              accentColor={issue.accentColor}
              isCurrent={issue.isCurrent}
              currentLabel={labels.current}
            />
          </div>
          {/* Desktop: animated entrance with sticky positioning */}
          <ScrollReveal
            direction="left"
            distance={40}
            duration={0.8}
            threshold={0.05}
            className="relative hidden lg:flex justify-center lg:sticky lg:top-24 pt-8 pb-12"
          >
            <IssueCoverTilt
              cover={issue.cover}
              title={translation.title}
              slug={issue.slug}
              accentColor={issue.accentColor}
              isCurrent={issue.isCurrent}
              currentLabel={labels.current}
            />
          </ScrollReveal>

          {/* Issue Info - Staggered animations */}
          <StaggerContainer className="lg:py-8" staggerDelay={0.12}>
            <StaggerItem>
              <p
                className="font-ui text-sm font-medium uppercase tracking-widest mb-4"
                style={{ color: issue.accentColor }}
              >
                {translation.subtitle}
              </p>
            </StaggerItem>

            <StaggerItem>
              <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl mb-6 text-balance">
                {translation.title}
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="font-body text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed text-balance">
                {translation.description}
              </p>
            </StaggerItem>

            {/* Primary Action - Read Issue */}
            <StaggerItem className="flex flex-wrap items-center gap-6">
              <ReadIssueButton issueSlug={issue.slug} label={labels.readIssue} />
              <a
                href="#features"
                className="font-ui text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: issue.accentColor }}
              >
                {labels.previewIssue}{" "}
                {isMounted ? (
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block"
                  >
                    ↓
                  </motion.span>
                ) : (
                  <span className="inline-block">↓</span>
                )}
              </a>
            </StaggerItem>

            {/* Sections - styled with accent color (from MDX translation) */}
            <StaggerItem className="mt-12 pt-8 border-t border-border/50">
              <p
                className="font-ui text-xs font-medium uppercase tracking-wider mb-4"
                style={{ color: issue.accentColor }}
              >
                {labels.sections}
              </p>
              <div className="flex flex-wrap gap-2">
                {translation.sections.map((section, index) =>
                  isMounted ? (
                    <motion.span
                      key={section}
                      className="px-3 py-1.5 font-ui text-sm border"
                      style={{
                        borderColor: `${issue.accentColor}40`,
                        backgroundColor: `${issue.accentColor}10`,
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: `${issue.accentColor}20`,
                      }}
                    >
                      {section}
                    </motion.span>
                  ) : (
                    <span
                      key={section}
                      className="px-3 py-1.5 font-ui text-sm border"
                      style={{
                        borderColor: `${issue.accentColor}40`,
                        backgroundColor: `${issue.accentColor}10`,
                      }}
                    >
                      {section}
                    </span>
                  )
                )}
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

export function IssueDetailFeatures({
  issue,
  translation,
  locale,
  labels,
}: IssueDetailAnimatedProps) {
  const isMounted = useMounted();

  return (
    <section id="features" className="py-20 md:py-28 border-t border-border overflow-x-clip overflow-y-visible">
      <div className="container-editorial">
        {/* Section Header with line animation */}
        <div className="mb-16 md:mb-20">
          <TextReveal delay={0}>
            <span
              className="font-ui text-xs font-medium uppercase tracking-[0.3em] mb-4 block"
              style={{ color: issue.accentColor }}
            >
              {labels.inThisIssue}
            </span>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl text-balance">
              {labels.features}
            </h2>
          </TextReveal>
          <LineDraw
            className="h-1 w-24 mt-6"
            style={{ backgroundColor: issue.accentColor }}
            delay={0.3}
          />
        </div>

        {/* Feature Cards - Editorial magazine layout */}
        <div className="space-y-24 md:space-y-32">
          {issue.highlights.map((highlight, index) => {
            const highlightTranslation = translation.highlights[highlight.id];
            if (!highlightTranslation) return null;

            const isFirst = index === 0;
            const isEven = index % 2 === 0;

            // First article: Hero style full-width
            if (isFirst) {
              return (
                <ScrollReveal
                  key={highlight.id}
                  direction="up"
                  distance={60}
                  duration={0.8}
                >
                  <article className="group">
                    {/* Large hero image with scale animation */}
                    <motion.div
                      className="relative mb-8 md:mb-12 overflow-hidden"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="aspect-[21/9] md:aspect-[2.5/1] relative overflow-hidden">
                        {isMounted ? (
                          <motion.div
                            className="absolute inset-0"
                            whileInView={{ scale: 1 }}
                            initial={{ scale: 1.1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          >
                            <Image
                              src={highlight.image}
                              alt={highlightTranslation.title}
                              fill
                              className="object-cover"
                              sizes="100vw"
                            />
                          </motion.div>
                        ) : (
                          <div className="absolute inset-0">
                            <Image
                              src={highlight.image}
                              alt={highlightTranslation.title}
                              fill
                              className="object-cover"
                              sizes="100vw"
                            />
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to top, ${issue.accentColor}90 0%, transparent 50%)`,
                          }}
                        />
                        {/* Page number badge */}
                        {isMounted ? (
                          <motion.div
                            className="absolute top-6 left-6 px-4 py-2 font-ui text-sm font-semibold uppercase tracking-wider"
                            style={{
                              backgroundColor: issue.accentColor,
                              color: "#ffffff",
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                          >
                            {labels.page} {highlight.page}
                          </motion.div>
                        ) : (
                          <div
                            className="absolute top-6 left-6 px-4 py-2 font-ui text-sm font-semibold uppercase tracking-wider"
                            style={{
                              backgroundColor: issue.accentColor,
                              color: "#ffffff",
                            }}
                          >
                            {labels.page} {highlight.page}
                          </div>
                        )}
                        {/* Title on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
                          {isMounted ? (
                            <>
                              <motion.span
                                className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-white/70 mb-2 block"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                              >
                                {highlightTranslation.title}
                              </motion.span>
                              <motion.h3
                                className="font-headline text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-4"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                              >
                                {highlightTranslation.headline || highlightTranslation.title}
                              </motion.h3>
                              <motion.p
                                className="font-accent italic text-white/80 text-lg"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                              >
                                {labels.by} {highlightTranslation.author}
                              </motion.p>
                            </>
                          ) : (
                            <>
                              <span className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-white/70 mb-2 block">
                                {highlightTranslation.title}
                              </span>
                              <h3 className="font-headline text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-4">
                                {highlightTranslation.headline || highlightTranslation.title}
                              </h3>
                              <p className="font-accent italic text-white/80 text-lg">
                                {labels.by} {highlightTranslation.author}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    {/* Excerpt below */}
                    <TextReveal delay={0.2} className="max-w-3xl">
                      <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {highlightTranslation.excerpt}
                      </p>
                    </TextReveal>
                  </article>
                </ScrollReveal>
              );
            }

            // Other articles: Side-by-side with large images
            return (
              <ScrollReveal
                key={highlight.id}
                direction={isEven ? "left" : "right"}
                distance={50}
                duration={0.7}
                delay={0.1}
              >
                <article className="group grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Image - larger, with hover effect */}
                  <div className={`lg:col-span-7 ${isEven ? "" : "lg:order-2"}`}>
                    <motion.div
                      className="relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        {isMounted ? (
                          <motion.div
                            className="absolute inset-0"
                            whileInView={{ scale: 1 }}
                            initial={{ scale: 1.1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          >
                            <Image
                              src={highlight.image}
                              alt={highlightTranslation.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                          </motion.div>
                        ) : (
                          <div className="absolute inset-0">
                            <Image
                              src={highlight.image}
                              alt={highlightTranslation.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                          </div>
                        )}
                      </div>
                      {/* Accent color frame on hover */}
                      <div
                        className="absolute inset-0 border-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ borderColor: issue.accentColor }}
                      />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className={`lg:col-span-5 ${isEven ? "" : "lg:order-1"}`}>
                    {/* Page Number with accent line */}
                    <div className="flex items-center gap-4 mb-6">
                      <LineDraw
                        className="w-12 h-0.5"
                        style={{ backgroundColor: issue.accentColor }}
                        delay={0.2}
                      />
                      {isMounted ? (
                        <motion.p
                          className="font-ui text-sm font-medium uppercase tracking-widest"
                          style={{ color: issue.accentColor }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                        >
                          {labels.page} {highlight.page}
                        </motion.p>
                      ) : (
                        <p
                          className="font-ui text-sm font-medium uppercase tracking-widest"
                          style={{ color: issue.accentColor }}
                        >
                          {labels.page} {highlight.page}
                        </p>
                      )}
                    </div>

                    {/* Title (label) */}
                    <TextReveal delay={0.1}>
                      <span 
                        className="font-ui text-xs font-medium uppercase tracking-[0.2em] mb-2 block"
                        style={{ color: issue.accentColor }}
                      >
                        {highlightTranslation.title}
                      </span>
                    </TextReveal>

                    {/* Headline */}
                    <TextReveal delay={0.15}>
                      <h3 className="font-headline text-2xl md:text-3xl lg:text-4xl mb-6 group-hover:text-foreground/80 transition-colors">
                        {highlightTranslation.headline || highlightTranslation.title}
                      </h3>
                    </TextReveal>

                    {/* Excerpt */}
                    <TextReveal delay={0.2}>
                      <p className="font-body text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                        {highlightTranslation.excerpt}
                      </p>
                    </TextReveal>

                    {/* Author */}
                    <TextReveal delay={0.3}>
                      <p className="font-accent italic text-muted-foreground">
                        {labels.by} {highlightTranslation.author}
                      </p>
                    </TextReveal>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function IssueDetailCTA({
  issue,
  translation,
  locale,
  labels,
}: IssueDetailAnimatedProps) {
  const isMounted = useMounted();

  return (
    <section
      className="py-16 md:py-20 relative overflow-x-clip overflow-y-visible"
      style={{
        background: `linear-gradient(135deg, ${issue.accentColor} 0%, ${issue.accentColor}dd 100%)`,
      }}
    >
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <Floating duration={8} distance={20}>
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: "#ffffff" }}
          />
        </Floating>
        <Floating duration={10} distance={15}>
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl opacity-10"
            style={{ background: "#ffffff" }}
          />
        </Floating>
      </div>

      <div className="container-editorial relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content - staggered */}
          <StaggerContainer
            className="text-center lg:text-left"
            staggerDelay={0.1}
          >
            <StaggerItem>
              <span className="inline-block font-ui text-xs font-semibold uppercase tracking-[0.3em] text-white/70 mb-4">
                {labels.fullIssue}
              </span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white mb-6 text-balance">
                {labels.startReading}
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="font-body text-lg text-white/80 mb-10 max-w-md mx-auto lg:mx-0 text-balance">
                {labels.exploreMore}
              </p>
            </StaggerItem>
            <StaggerItem>
              <Link
                href={`/read/${issue.slug}`}
                className="inline-flex items-center gap-3 bg-white text-foreground px-8 py-4 font-ui text-sm font-medium transition-all hover:bg-white/90"
              >
                <BookOpen className="w-5 h-5" />
                {labels.readIssue}
                {isMounted ? (
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Link>
            </StaggerItem>
          </StaggerContainer>

          {/* Issue cover - animated entrance with floating effect */}
          <ScrollReveal
            direction="right"
            distance={40}
            duration={0.9}
            threshold={0.1}
            className="hidden md:flex justify-center items-center relative"
          >
            {/* Large issue number - animated */}
            {isMounted ? (
              <motion.span
                className="absolute top-1/2 left-1/2 translate-x-16 xl:translate-x-24 -translate-y-1/3 font-headline text-[12rem] xl:text-[16rem] leading-none text-white/20 select-none pointer-events-none"
                style={{ letterSpacing: "-0.05em" }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {String(issue.issueNumber).padStart(2, "0")}
              </motion.span>
            ) : (
              <span
                className="absolute top-1/2 left-1/2 translate-x-16 xl:translate-x-24 -translate-y-1/3 font-headline text-[12rem] xl:text-[16rem] leading-none text-white/20 select-none pointer-events-none"
                style={{ letterSpacing: "-0.05em" }}
              >
                {String(issue.issueNumber).padStart(2, "0")}
              </span>
            )}

            {/* Floating cover with hover interaction */}
            <Floating duration={6} distance={8}>
              <Link 
                href={`/read/${issue.slug}`}
                className="group relative lg:-mt-24 z-10 block transition-transform duration-500 hover:rotate-0" 
                style={{ transform: "rotate(3deg)" }}
              >
                <div className="absolute inset-0 bg-black/30 translate-x-6 translate-y-6 blur-2xl transition-all duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
                <div className="relative w-64 xl:w-80 shadow-2xl group-hover:shadow-cover transition-shadow duration-500">
                  <div className="aspect-magazine-cover relative bg-muted overflow-hidden">
                    <Image
                      src={issue.cover}
                      alt={translation.title}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                </div>
              </Link>
            </Floating>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// More Issues section with staggered cards
interface MoreIssuesAnimatedProps {
  issues: Issue[];
  issueTranslations: Record<string, IssueTranslation>;
  locale: string;
  labels: {
    moreIssues: string;
    viewAll: string;
  };
  IssueCard: React.ComponentType<{
    issue: Issue;
    translation: IssueTranslation;
  }>;
}

export function MoreIssuesAnimated({
  issues,
  issueTranslations,
  locale,
  labels,
  IssueCard,
}: MoreIssuesAnimatedProps) {
  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="container-editorial">
        <ScrollReveal direction="up" distance={30} duration={0.5}>
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-headline text-2xl md:text-3xl text-balance">
              {labels.moreIssues}
            </h2>
            <motion.div whileHover={{ x: 4 }} transition={{ type: "spring" }}>
              <Link
                href="/issues"
                className="font-ui text-sm font-medium text-muted-foreground hover:text-brand transition-base flex items-center gap-1"
              >
                {labels.viewAll}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </ScrollReveal>

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          staggerDelay={0.15}
        >
          {issues.map((issue) => (
            <StaggerItem key={issue.id}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <IssueCard
                  issue={issue}
                  translation={issueTranslations[issue.id]}
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

