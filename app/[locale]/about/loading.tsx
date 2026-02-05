import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSkeleton } from "@/components/header-skeleton";
import { FooterSkeleton } from "@/components/footer-skeleton";

/**
 * About Page Loading Skeleton
 * Matches the exact structure of the about page
 */
export default function AboutLoading() {
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
            <Skeleton className="h-3 w-28 mb-4" />
            {/* Title */}
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full mb-4" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-2/3 mb-6" />
            {/* Description */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </div>
        </div>
      </section>

      {/* About the Magazine Section Skeleton */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left column */}
            <div>
              <Skeleton className="h-3 w-28 mb-4" />
              <Skeleton className="h-10 md:h-12 lg:h-14 w-full mb-4" />
              <Skeleton className="h-10 md:h-12 lg:h-14 w-3/4 mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </div>

            {/* Right column - Mission box */}
            <div className="bg-muted/30 p-10 md:p-14">
              <Skeleton className="h-3 w-20 mb-4" />
              <Skeleton className="h-7 md:h-8 w-full mb-4" />
              <Skeleton className="h-7 md:h-8 w-3/4 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pull Quote Section Skeleton */}
      <section className="relative py-32 md:py-40">
        <Skeleton className="absolute inset-0" />
        <div className="relative z-10 container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-8 md:h-10 w-full mb-4 mx-auto" />
            <Skeleton className="h-8 md:h-10 w-2/3 mx-auto" />
          </div>
        </div>
      </section>

      {/* Chief Editor Section Skeleton */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image column */}
            <div className="order-2 lg:order-1">
              <Skeleton className="aspect-square w-full max-w-md mx-auto lg:mx-0" />
            </div>

            {/* Info column */}
            <div className="order-1 lg:order-2">
              <Skeleton className="h-3 w-24 mb-4" />
              <Skeleton className="h-10 md:h-12 lg:h-14 w-full mb-2" />
              <Skeleton className="h-5 w-48 mb-8" />
              <div className="space-y-4 mb-10">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              {/* Social links */}
              <div className="flex gap-4">
                <Skeleton className="h-11 w-11" />
                <Skeleton className="h-11 w-11" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publisher Section Skeleton */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Info column */}
            <div>
              <Skeleton className="h-3 w-24 mb-4" />
              <Skeleton className="h-10 md:h-12 lg:h-14 w-full mb-4" />
              <Skeleton className="h-10 md:h-12 lg:h-14 w-2/3 mb-8" />
              <div className="space-y-4 mb-10">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              {/* Social links */}
              <div className="flex gap-4">
                <Skeleton className="h-11 w-11" />
                <Skeleton className="h-11 w-11" />
                <Skeleton className="h-11 w-11" />
              </div>
            </div>

            {/* Image column */}
            <div>
              <Skeleton className="aspect-video w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Supporters Section Skeleton */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-3 w-24 mb-4 mx-auto" />
            <Skeleton className="h-10 md:h-12 w-full mb-4" />
            <Skeleton className="h-10 md:h-12 w-2/3 mb-8 mx-auto" />
            <div className="space-y-4 mb-10">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5 mx-auto" />
            </div>
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </section>

      {/* Collaboration CTA Section Skeleton */}
      <section className="py-20 md:py-28 bg-warm/5">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Text content */}
            <div>
              <Skeleton className="h-3 w-28 mb-4" />
              <Skeleton className="h-8 md:h-10 w-full mb-4" />
              <Skeleton className="h-8 md:h-10 w-2/3 mb-6" />
              <div className="space-y-4 mb-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-12 w-40" />
            </div>

            {/* Visual element */}
            <div className="hidden md:block">
              <Skeleton className="aspect-4/3 w-full" />
            </div>
          </div>
        </div>
      </section>

      <FooterSkeleton />
    </div>
  );
}
