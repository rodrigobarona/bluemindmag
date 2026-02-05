"use client";

import { useEffect, useRef } from "react";
import { trackScrollDepth, type ScrollDepthMilestone } from "./analytics";

/**
 * Hook to track scroll depth milestones
 * Tracks when user scrolls to 25%, 50%, 75%, and 100% of the page
 * Each milestone is only fired once per page load
 */
export function useScrollDepth() {
  const milestonesFired = useRef<Set<ScrollDepthMilestone>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      // Define milestones
      const milestones: ScrollDepthMilestone[] = [25, 50, 75, 100];

      // Check and fire milestones
      for (const milestone of milestones) {
        if (
          scrollPercentage >= milestone &&
          !milestonesFired.current.has(milestone)
        ) {
          milestonesFired.current.add(milestone);
          trackScrollDepth(milestone);
        }
      }
    };

    // Throttle scroll handler for performance
    let ticking = false;
    const throttledHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandler, { passive: true });

    // Check initial scroll position (in case user is already scrolled)
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledHandler);
    };
  }, []);

  // Return tracked milestones for debugging if needed
  return milestonesFired.current;
}
