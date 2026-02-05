import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSkeleton } from "@/components/header-skeleton";
import { FooterSkeleton } from "@/components/footer-skeleton";

/**
 * Issues Page Loading Skeleton
 * Matches the exact structure of the issues listing page
 */
export default function IssuesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderSkeleton />

      {/* Hero Section Skeleton */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Background image placeholder */}
        <Skeleton className="absolute inset-0" />

        <div className="container-editorial relative z-10">
          <div className="max-w-3xl">
            {/* Subtitle label */}
            <Skeleton className="h-3 w-32 mb-4" />
            {/* Title */}
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full mb-4" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-2/3 mb-6" />
            {/* Description */}
            <div className="space-y-3 max-w-2xl">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </div>
        </div>
      </section>

      {/* Current Issue Showcase Skeleton */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container-editorial mb-8 md:mb-12">
          <Skeleton className="h-3 w-28 mb-4" />
          <Skeleton className="h-8 md:h-10 w-48" />
        </div>

        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Cover with 3D container */}
            <div className="relative w-full mx-auto lg:mx-0 max-w-sm lg:max-w-md">
              {/* Large issue number behind */}
              <div className="absolute -top-16 -left-8 hidden lg:block">
                <Skeleton className="h-32 w-24 opacity-10" />
              </div>
              {/* Magazine cover */}
              <Skeleton className="aspect-3/4 w-full" />
              {/* Interactive hint */}
              <div className="flex items-center justify-center gap-2 mt-10">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Issue Details */}
            <div className="text-center lg:text-left">
              {/* Subtitle */}
              <Skeleton className="h-3 w-32 mb-3 mx-auto lg:mx-0" />
              {/* Title */}
              <Skeleton className="h-10 md:h-12 lg:h-14 w-full mb-4" />
              <Skeleton className="h-10 md:h-12 lg:h-14 w-3/4 mb-6" />
              {/* Description */}
              <div className="space-y-3 mb-10 max-w-lg mx-auto lg:mx-0">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Highlights */}
              <div className="mb-10">
                <Skeleton className="h-3 w-28 mb-4 mx-auto lg:mx-0" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0" />
                      <div>
                        <Skeleton className="h-4 w-40 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Skeleton className="h-12 w-36" />
                <Skeleton className="h-12 w-36" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Issues Grid Skeleton */}
      <section className="py-20 md:py-28">
        <div className="container-editorial">
          {/* Section header */}
          <div className="mb-16">
            <Skeleton className="h-3 w-28 mb-4" />
            <Skeleton className="h-8 md:h-10 w-48" />
          </div>

          {/* Grid of issue cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-3/4 w-full mb-6" />
                <div className="text-center">
                  <Skeleton className="h-6 w-3/4 mb-2 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSkeleton />
    </div>
  );
}
