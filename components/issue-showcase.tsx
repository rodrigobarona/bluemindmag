"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import type {
  Issue,
  IssueTranslation,
  IssueHighlightTranslation,
} from "@/content/types/content";

interface IssueShowcaseProps {
  issue: Issue;
  translation: IssueTranslation;
  locale: string;
}

export function IssueShowcase({
  issue,
  translation,
  locale,
}: IssueShowcaseProps) {
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

    // Normalize to -0.5 to 0.5
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

  // Get first 3 highlights for display
  const highlightKeys = issue.highlights?.slice(0, 3).map((h) => h.id) || [];
  const highlightTranslations = highlightKeys
    .map((key) => translation.highlights?.[key])
    .filter(Boolean) as IssueHighlightTranslation[];

  return (
    <div
      className="relative"
      style={{ "--issue-accent": issue.accentColor } as React.CSSProperties}
    >
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${issue.accentColor}20 0%, transparent 70%)`,
        }}
      />

      <div className="container-editorial relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Cover with 3D Tilt Effect */}
          <motion.div
            ref={containerRef}
            className="relative w-full mx-auto lg:mx-0 max-w-sm lg:max-w-md"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1200 }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Large issue number behind cover - using issue accent color */}
            <div
              className="absolute -top-16 -left-8 text-display-number pointer-events-none select-none hidden lg:block opacity-[0.08]"
              style={{ color: issue.accentColor }}
            >
              {String(issue.issueNumber).padStart(2, "0")}
            </div>

            {/* Floating shadow layer */}
            <motion.div
              className="absolute inset-4 -z-20 opacity-40"
              style={{
                x: shadowX,
                y: shadowY,
                background: `linear-gradient(135deg, ${issue.accentColor}40 0%, transparent 60%)`,
                filter: "blur(40px)",
              }}
            />

            {/* Main cover container */}
            <motion.div
              className="relative w-full"
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
            >
              <Link href={`/read/${issue.slug}`} className="group block w-full">
                {/* The actual cover */}
                <div className="relative w-full overflow-hidden shadow-float group-hover:shadow-cover transition-slow">
                  <div className="aspect-magazine-cover relative bg-muted overflow-hidden">
                    <Image
                      src={issue.cover}
                      alt={`${translation.title} cover`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                      priority
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
                        {locale === "pt" ? "Ler Agora" : "Read Now"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-base" />
                      </span>
                    </div>
                  </div>

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
                <motion.div
                  className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
                  style={{
                    background: "var(--warm)",
                    x: useTransform(mouseX, [-0.5, 0.5], [-15, 15]),
                    y: useTransform(mouseY, [-0.5, 0.5], [-15, 15]),
                  }}
                />
              </Link>
            </motion.div>

            {/* Interactive hint */}
            <motion.div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-ui text-xs text-muted-foreground/60 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovering ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="w-3 h-3" />
              {locale === "pt" ? "Mova o cursor" : "Move cursor"}
            </motion.div>
          </motion.div>

          {/* Issue Details */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="font-ui text-xs font-medium uppercase tracking-[0.3em] mb-3 block"
              style={{ color: issue.accentColor }}
            >
              {translation.subtitle}
            </span>

            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl mb-6">
              {translation.title}
            </h2>

            <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {translation.description}
            </p>

            {/* Highlights */}
            {highlightTranslations.length > 0 && (
              <div className="mb-10">
                <span className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
                  {locale === "pt" ? "Nesta Edição" : "In This Issue"}
                </span>
                <div className="space-y-3">
                  {highlightTranslations.map((highlight, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 text-left"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                        style={{ backgroundColor: issue.accentColor }}
                      />
                      <div>
                        <span className="font-ui text-sm font-medium block">
                          {highlight.title}
                        </span>
                        <span className="font-body text-sm text-muted-foreground">
                          {highlight.author}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                href={`/read/${issue.slug}`}
                className="inline-flex items-center justify-center gap-3 text-white px-8 py-4 font-ui text-sm font-medium transition-slow group hover:brightness-110"
                style={{ backgroundColor: issue.accentColor }}
              >
                <BookOpen className="w-4 h-4" />
                {locale === "pt" ? "Ler Edição" : "Read Issue"}
              </Link>

              <Link
                href={`/issues/${issue.slug}`}
                className="inline-flex items-center justify-center gap-3 border border-border px-8 py-4 font-ui text-sm font-medium transition-slow group issue-secondary-cta"
                style={
                  {
                    "--hover-color": issue.accentColor,
                  } as React.CSSProperties
                }
              >
                {locale === "pt" ? "Ver Detalhes" : "View Details"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-base" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
