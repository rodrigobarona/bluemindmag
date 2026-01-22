'use client';

import { motion, type Variants } from 'motion/react';
import { Children, type ReactNode } from 'react';
import { useReducedMotion, ANIMATION_CONFIG } from '@/lib/use-reduced-motion';

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  margin?: string;
}

const getItemVariants = (
  direction: 'up' | 'down' | 'left' | 'right' | 'none',
  distance: number,
  prefersReducedMotion: boolean
): Variants => {
  // If reduced motion is preferred, only animate opacity
  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.01 },
      },
    };
  }

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
      transition: {
        duration: ANIMATION_CONFIG.duration.slow,
        ease: ANIMATION_CONFIG.ease.out,
      },
    },
  };
};

/**
 * StaggerList - Animates children with staggered timing
 * Respects prefers-reduced-motion for accessibility
 * 
 * @example
 * <StaggerList staggerDelay={0.1}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </StaggerList>
 */
export function StaggerList({
  children,
  className = '',
  staggerDelay = ANIMATION_CONFIG.stagger.base,
  initialDelay = 0.2,
  direction = 'up',
  distance = ANIMATION_CONFIG.distance.base,
  once = true,
  margin = '-50px',
}: StaggerListProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: prefersReducedMotion ? 0 : initialDelay,
      },
    },
  };

  const itemVariants = getItemVariants(direction, distance, prefersReducedMotion);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={containerVariants}
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

/**
 * StaggerText - Stagger animation for text/headings
 * Respects prefers-reduced-motion
 */
export function StaggerText({
  children,
  className = '',
  staggerDelay = ANIMATION_CONFIG.stagger.fast,
  once = true,
}: {
  children: string;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const words = children.split(' ');

  // If reduced motion, render without animation wrapper
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: ANIMATION_CONFIG.distance.small,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.duration.base,
        ease: ANIMATION_CONFIG.ease.out,
      },
    },
  };

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={containerVariants}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

/**
 * StaggerLetters - Letter-by-letter animation
 * Respects prefers-reduced-motion
 */
export function StaggerLetters({
  children,
  className = '',
  staggerDelay = 0.02,
  once = true,
}: {
  children: string;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const letters = children.split('');

  // If reduced motion, render without animation wrapper
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.duration.fast,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={containerVariants}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

