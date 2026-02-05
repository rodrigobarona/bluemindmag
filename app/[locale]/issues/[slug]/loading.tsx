import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSkeleton } from "@/components/header-skeleton";
import { FooterSkeleton } from "@/components/footer-skeleton";

/**
 * Issue Detail Page Loading Skeleton
 * Matches the exact structure of the issue detail page
 */
export default function IssueDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderSkeleton />

      {/* Animated Hero Section Skeleton */}
      <section className="relative min-h-[70vh] flex items-end pb-16 md:pb-24">
        {/* Background cover image */}
        <Skeleton className="absolute inset-0" />

        <div className="container-editorial relative z-10">
          <div className="max-w-3xl">
            {/* Current issue badge */}
            <Skeleton className="h-6 w-24 mb-4" />
            {/* Title */}
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full mb-4" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-2/3 mb-6" />
            {/* Subtitle */}
            <Skeleton className="h-5 w-32 mb-8" />
            {/* CTA button */}
            <Skeleton className="h-14 w-44" />
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20 md:py-28">
        <div className="container-editorial">
          {/* Section header */}
          <div className="mb-12">
            <Skeleton className="h-3 w-24 mb-4" />
            <Skeleton className="h-8 md:h-10 w-48" />
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted/30 p-6">
                {/* Feature image */}
                <Skeleton className="aspect-16/10 w-full mb-4" />
                {/* Page number */}
                <Skeleton className="h-8 w-12 mb-2" />
                {/* Title */}
                <Skeleton className="h-5 w-3/4 mb-2" />
                {/* Author */}
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <Skeleton className="h-3 w-32 mb-4 mx-auto" />
            <Skeleton className="h-10 md:h-12 w-full mb-4" />
            <Skeleton className="h-10 md:h-12 w-2/3 mb-6 mx-auto" />
            <div className="space-y-3 mb-10 max-w-lg mx-auto">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5 mx-auto" />
            </div>
            <Skeleton className="h-14 w-44 mx-auto" />
          </div>
        </div>
      </section>

      {/* More Issues Section Skeleton */}
      <section className="py-20 md:py-28">
        <div className="container-editorial">
          {/* Section header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <Skeleton className="h-3 w-24 mb-4" />
              <Skeleton className="h-8 md:h-10 w-40" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Issue cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
