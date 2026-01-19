"use client";

import { Link } from "@/i18n/navigation";
import { BookOpen, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// ============================================
// ISSUE CTA COMPONENTS
// Centralized Call-to-Action components for issues
// ============================================

interface ReadIssueCTAProps {
  slug: string;
  label?: string;
  accentColor?: string;
  variant?: "primary" | "white" | "outline";
  size?: "default" | "lg";
  className?: string;
  showIcon?: boolean;
  animated?: boolean;
}

/**
 * Primary CTA for reading an issue
 * Supports multiple variants: primary (accent color), white, outline
 */
export function ReadIssueCTA({
  slug,
  label = "Read Issue",
  accentColor,
  variant = "primary",
  size = "default",
  className,
  showIcon = true,
  animated = false,
}: ReadIssueCTAProps) {
  const sizeClasses = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-sm",
  };

  const variantClasses = {
    primary: "text-white hover:brightness-110 shadow-sm",
    white: "bg-white text-foreground hover:bg-white/90",
    outline: "border border-foreground/20 dark:border-foreground/30 bg-transparent text-foreground hover:bg-foreground/5",
  };

  const baseClasses = cn(
    "group inline-flex items-center justify-center gap-3 font-ui font-medium transition-all",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const style =
    variant === "primary" && accentColor
      ? { backgroundColor: accentColor }
      : undefined;

  const content = (
    <>
      {showIcon && <BookOpen className="w-5 h-5" />}
      {label}
      {animated ? (
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.span>
      ) : null}
    </>
  );

  return (
    <Link href={`/read/${slug}`} className={baseClasses} style={style}>
      {content}
    </Link>
  );
}

interface ViewDetailsCTAProps {
  slug: string;
  label?: string;
  accentColor?: string;
  size?: "default" | "lg";
  className?: string;
}

/**
 * Secondary CTA for viewing issue details
 * Outline style with accent color hover
 */
export function ViewDetailsCTA({
  slug,
  label = "View Details",
  accentColor,
  size = "default",
  className,
}: ViewDetailsCTAProps) {
  const sizeClasses = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <Link
      href={`/issues/${slug}`}
      className={cn(
        "inline-flex items-center justify-center gap-2 border border-foreground/20 dark:border-foreground/30 text-foreground font-ui font-medium transition-all issue-secondary-cta hover:bg-foreground/5",
        sizeClasses[size],
        className
      )}
      style={{ "--hover-color": accentColor } as React.CSSProperties}
    >
      {label}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

interface CurrentIssueBadgeProps {
  label?: string;
  accentColor: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

/**
 * Badge indicating the current issue
 * Uses issue accent color as background
 */
export function CurrentIssueBadge({
  label = "Current Issue",
  accentColor,
  size = "default",
  className,
}: CurrentIssueBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  return (
    <div
      className={cn(
        "font-ui font-semibold uppercase tracking-wider text-white",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: accentColor }}
    >
      {label}
    </div>
  );
}

interface IssueHoverCTAProps {
  label?: string;
  showIcon?: boolean;
}

/**
 * CTA that appears on hover (used inside cover cards)
 * White text on transparent/dark overlay
 */
export function IssueHoverCTA({
  label = "Read Now",
  showIcon = true,
}: IssueHoverCTAProps) {
  return (
    <span className="inline-flex items-center gap-2 font-ui text-sm font-medium text-white">
      {showIcon && <BookOpen className="w-4 h-4" />}
      {label}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </span>
  );
}

