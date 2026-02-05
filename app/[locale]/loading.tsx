import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSkeleton } from "@/components/header-skeleton";
import { FooterSkeleton } from "@/components/footer-skeleton";

/**
 * Home Page Loading Skeleton
 * Pixel-perfect skeleton matching the exact structure of the home page
 */
export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderSkeleton />

      {/* Section 1: Hero Skeleton - Full viewport */}
      <section className="relative h-screen min-h-[600px] w-full flex flex-col items-center justify-center">
        {/* Background placeholder */}
        <Skeleton className="absolute inset-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          {/* Surf Science label */}
          <Skeleton className="h-3 w-24 mb-4" />

          {/* BLUE MIND masthead */}
          <Skeleton className="h-16 md:h-20 lg:h-24 w-64 md:w-80 mb-6" />

          {/* Tagline */}
          <Skeleton className="h-5 w-48 md:w-64 mb-10" />

          {/* Issue card skeleton */}
          <div className="flex items-center gap-5 bg-muted/50 rounded-lg px-5 py-4">
            {/* Cover thumbnail */}
            <Skeleton className="w-14 h-20 shrink-0" />
            {/* Issue info */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-2 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-2 w-12" />
            </div>
            {/* Arrow */}
            <Skeleton className="h-5 w-5 ml-2" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <Skeleton className="h-3 w-12 mb-3" />
          <Skeleton className="h-5 w-5" />
        </div>
      </section>

      {/* Section 2: Current Issue Feature Skeleton */}
      <section className="py-24 md:py-32 lg:py-40">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Cover column */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Large issue number behind */}
                <div className="absolute -top-16 -left-8 hidden lg:block">
                  <Skeleton className="h-32 w-24 opacity-10" />
                </div>
                {/* Magazine cover */}
                <Skeleton className="aspect-3/4 w-full max-w-sm mx-auto lg:mx-0" />
                {/* Interactive hint */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>

            {/* Content column */}
            <div className="lg:col-span-7 lg:pl-8">
              <div className="lg:py-8">
                {/* Subtitle label */}
                <Skeleton className="h-3 w-32 mb-3" />
                {/* Title */}
                <Skeleton className="h-12 md:h-14 lg:h-16 w-full mb-4" />
                <Skeleton className="h-12 md:h-14 lg:h-16 w-3/4 mb-8" />
                {/* Description */}
                <div className="space-y-3 mb-10 max-w-xl">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-12 w-36" />
                  <Skeleton className="h-12 w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Quick Contents Skeleton */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container-editorial">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>

          {/* Grid of 5 cards (desktop) */}
          <div className="hidden md:grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-16/10 relative">
                <Skeleton className="absolute inset-0" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <Skeleton className="h-6 w-8 mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>

          {/* Horizontal scroll (mobile) */}
          <div className="md:hidden flex gap-4 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-[260px] shrink-0 aspect-16/10 relative">
                <Skeleton className="absolute inset-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Pull Quote Skeleton */}
      <section className="relative py-32 md:py-40">
        <Skeleton className="absolute inset-0" />
        <div className="relative z-10 container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-8 md:h-10 w-full mb-4 mx-auto" />
            <Skeleton className="h-8 md:h-10 w-3/4 mb-8 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </section>

      {/* Section 5: Past Issues Archive Skeleton */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          {/* Section header */}
          <div className="flex items-end justify-between mb-16">
            <div>
              <Skeleton className="h-3 w-24 mb-4" />
              <Skeleton className="h-10 md:h-12 w-64" />
            </div>
            <Skeleton className="hidden md:block h-4 w-20" />
          </div>

          {/* Grid of mini issue cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-3/4 w-full mb-3" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>

          {/* Mobile view all link */}
          <div className="mt-12 text-center md:hidden">
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        </div>
      </section>

      {/* Section 6: About Teaser Skeleton */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-narrow">
          <div className="text-center">
            <Skeleton className="h-3 w-24 mb-4 mx-auto" />
            <Skeleton className="h-8 md:h-10 w-64 mb-8 mx-auto" />
            <div className="space-y-3 mb-10 max-w-2xl mx-auto">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4 mx-auto" />
            </div>
            <Skeleton className="h-4 w-28 mx-auto" />
          </div>
        </div>
      </section>

      <FooterSkeleton />
    </div>
  );
}
