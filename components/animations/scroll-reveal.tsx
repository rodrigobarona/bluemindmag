"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode, useState, useEffect, useRef } from "react";

// Hook to prevent hydration mismatch
function useMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 40,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const isMounted = useMounted();
  const elementRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Check if element is in viewport on mount and trigger animation
  useEffect(() => {
    if (!isMounted || !elementRef.current) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const rect = elementRef.current?.getBoundingClientRect();
      if (rect) {
        // If element is at least partially in viewport, animate immediately
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) {
          setShouldAnimate(true);
        }
      }
    }, 50);

    // Fallback: always show after 500ms if animation hasn't triggered
    const fallbackTimer = setTimeout(() => {
      setShouldAnimate(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [isMounted]);

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { y: 0, x: distance };
      case "right":
        return { y: 0, x: -distance };
      case "none":
        return { y: 0, x: 0 };
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  // SSR fallback - return visible content
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial="hidden"
      animate={shouldAnimate ? "visible" : undefined}
      whileInView="visible"
      onAnimationComplete={() => setShouldAnimate(true)}
      viewport={{ once, amount: threshold, margin: "100px 0px -50px 0px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation wrapper
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
  threshold = 0.2,
}: StaggerContainerProps) {
  const isMounted = useMounted();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

// Child item for stagger animation
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  distance = 30,
}: StaggerItemProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      case "none":
        return {};
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

// Parallax scroll effect
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // Negative = slower, positive = faster
}

export function Parallax({ children, className, speed = 0.5 }: ParallaxProps) {
  const isMounted = useMounted();

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: speed * 100 }}
      transition={{ type: "tween", ease: "linear" }}
      viewport={{ once: false }}
    >
      {children}
    </motion.div>
  );
}

// Floating animation (for decorative elements)
interface FloatingProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}

export function Floating({
  children,
  className,
  duration = 6,
  distance = 15,
}: FloatingProps) {
  const isMounted = useMounted();

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale on scroll into view
interface ScaleRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function ScaleReveal({
  children,
  className,
  delay = 0,
  once = true,
}: ScaleRevealProps) {
  const isMounted = useMounted();

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount: 0.3 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Line draw animation
interface LineDrawProps {
  className?: string;
  direction?: "horizontal" | "vertical";
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export function LineDraw({
  className,
  direction = "horizontal",
  delay = 0,
  duration = 0.8,
  style,
}: LineDrawProps) {
  const isMounted = useMounted();
  const isHorizontal = direction === "horizontal";

  if (!isMounted) {
    return <div className={className} style={style} />;
  }

  return (
    <motion.div
      className={className}
      initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
      whileInView={{ scaleX: 1, scaleY: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      style={{ transformOrigin: isHorizontal ? "left" : "top", ...style }}
    />
  );
}

// Text reveal with mask
interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function TextReveal({
  children,
  className,
  delay = 0,
}: TextRevealProps) {
  const isMounted = useMounted();

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
