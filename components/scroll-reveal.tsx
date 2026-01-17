'use client';

import { motion, type Variants } from 'motion/react';
import { type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  margin?: string;
}

const getVariants = (
  direction: 'up' | 'down' | 'left' | 'right' | 'none',
  distance: number
): Variants => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { y: 0, x: 0 },
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };
};

/**
 * ScrollReveal - Animates children when they enter the viewport
 * 
 * @example
 * <ScrollReveal direction="up" delay={0.2}>
 *   <h2>This fades in from below</h2>
 * </ScrollReveal>
 */
export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 60,
  once = true,
  margin = '-100px',
}: ScrollRevealProps) {
  const variants = getVariants(direction, distance);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth ease-out
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollFade - Simple opacity fade on scroll
 */
export function ScrollFade({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  margin = '-50px',
}: Omit<ScrollRevealProps, 'direction' | 'distance'>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once, margin }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollScale - Scale animation on scroll
 */
export function ScrollScale({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  once = true,
  initialScale = 0.95,
}: Omit<ScrollRevealProps, 'direction' | 'distance'> & { initialScale?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, margin: '-100px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

