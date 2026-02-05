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

      {/* Hero Section Skeleton - 2 column grid */}
      <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden bg-muted/30">
        <div className="container-editorial relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Cover Image Column */}
            <div className="relative flex justify-center pt-8 pb-12">
              <div className="relative">
                {/* Current issue badge */}
                <Skeleton className="absolute -top-2 -right-2 h-6 w-20 z-10" />
                {/* Magazine cover */}
                <Skeleton className="w-64 md:w-72 lg:w-80 aspect-[3/4]" />
              </div>
            </div>

            {/* Issue Info Column */}
            <div className="lg:py-8">
              {/* Subtitle (date) */}
              <Skeleton className="h-4 w-32 mb-4" />
              {/* Title */}
              <Skeleton className="h-12 md:h-14 lg:h-16 w-full mb-4" />
              <Skeleton className="h-12 md:h-14 lg:h-16 w-3/4 mb-6" />
              {/* Description */}
              <div className="space-y-3 mb-8 max-w-lg">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-6 mb-12">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
              {/* Sections divider */}
              <div className="pt-8 border-t border-border/50">
                <Skeleton className="h-3 w-20 mb-4" />
                {/* Section tags */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-editorial">
          {/* Section Header */}
          <div className="mb-16 md:mb-20">
            <Skeleton className="h-3 w-28 mb-4" />
            <Skeleton className="h-10 md:h-12 lg:h-14 w-48" />
            <Skeleton className="h-1 w-24 mt-6" />
          </div>

          {/* Feature Articles - Editorial layout */}
          <div className="space-y-24 md:space-y-32">
            {/* First Article - Hero style full-width */}
            <article>
              <div className="relative mb-8 md:mb-12">
                <div className="aspect-[21/9] md:aspect-[2.5/1] relative">
                  <Skeleton className="absolute inset-0" />
                  {/* Page badge */}
                  <Skeleton className="absolute top-6 left-6 h-8 w-20" />
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
                    <Skeleton className="h-3 w-32 mb-2" />
                    <Skeleton className="h-10 md:h-12 lg:h-14 w-full max-w-2xl mb-4" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
              </div>
              <div className="max-w-3xl">
                <Skeleton className="h-5 md:h-6 w-full mb-2" />
                <Skeleton className="h-5 md:h-6 w-4/5" />
              </div>
            </article>

            {/* Second Article - Side by side (image left) */}
            <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <Skeleton className="aspect-[4/3] w-full" />
              </div>
              <div className="lg:col-span-5">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-12 h-0.5" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-8 md:h-10 w-full mb-2" />
                <Skeleton className="h-8 md:h-10 w-3/4 mb-6" />
                <div className="space-y-2 mb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </article>

            {/* Third Article - Side by side (image right) */}
            <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 lg:order-2">
                <Skeleton className="aspect-[4/3] w-full" />
              </div>
              <div className="lg:col-span-5 lg:order-1">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-12 h-0.5" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-8 md:h-10 w-full mb-2" />
                <Skeleton className="h-8 md:h-10 w-3/4 mb-6" />
                <div className="space-y-2 mb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="text-center lg:text-left">
              <Skeleton className="h-3 w-24 mb-4 mx-auto lg:mx-0" />
              <Skeleton className="h-10 md:h-12 lg:h-14 w-full mb-4" />
              <Skeleton className="h-10 md:h-12 lg:h-14 w-2/3 mb-6" />
              <Skeleton className="h-5 w-full max-w-md mb-10 mx-auto lg:mx-0" />
              <Skeleton className="h-12 w-40 mx-auto lg:mx-0" />
            </div>
            {/* Cover image */}
            <div className="hidden md:flex justify-center items-center relative">
              <Skeleton className="absolute h-48 w-32 opacity-20" />
              <Skeleton className="w-64 xl:w-80 aspect-[3/4] rotate-3" />
            </div>
          </div>
        </div>
      </section>

      {/* More Issues Section Skeleton */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container-editorial">
          {/* Section header */}
          <div className="flex items-center justify-between mb-12">
            <Skeleton className="h-8 md:h-9 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Issue cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
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
