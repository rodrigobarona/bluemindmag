"use client";

import { useRef, useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Sparkles } from "lucide-react";
import { CurrentIssueBadge, IssueHoverCTA } from "./issue-cta";

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
  currentLabel = "Current Issue",
  showHint = true,
  priority = true,
}: IssueCoverTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          filter: "blur(40px)",
        }}
      />

      {/* Main cover container with 3D transform */}
      <motion.div
        className="relative"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
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
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-slow" />

              {/* CTA on hover */}
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-slow">
                <IssueHoverCTA label="Read Now" />
              </div>
            </div>

            {/* Current issue badge */}
            {isCurrent && (
              <CurrentIssueBadge
                label={currentLabel}
                accentColor={accentColor}
                size="lg"
                className="absolute top-4 right-4 z-10"
              />
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
      {showHint && isMounted && (
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-ui text-xs text-muted-foreground/60 flex items-center gap-2"
          initial={false}
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
