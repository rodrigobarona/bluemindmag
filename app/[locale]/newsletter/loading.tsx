import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSkeleton } from "@/components/header-skeleton";
import { FooterSkeleton } from "@/components/footer-skeleton";

/**
 * Newsletter Page Loading Skeleton
 * Matches the exact structure of the newsletter page
 */
export default function NewsletterLoading() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderSkeleton />

      {/* Hero Section Skeleton */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Background image placeholder */}
        <Skeleton className="absolute inset-0" />

        <div className="container-editorial relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <Skeleton className="h-8 w-40 rounded-full mb-8 mx-auto" />

            {/* Title */}
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full mb-4" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-2/3 mb-6 mx-auto" />

            {/* Subtitle */}
            <Skeleton className="h-6 w-3/4 mb-4 mx-auto" />

            {/* Description */}
            <Skeleton className="h-5 w-full max-w-xl mb-10 mx-auto" />

            {/* Newsletter Form */}
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>

            {/* Privacy note */}
            <Skeleton className="h-3 w-48 mt-6 mx-auto" />
          </div>
        </div>
      </section>

      {/* Personal Note Section */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Avatar */}
              <Skeleton className="w-24 h-24 rounded-full shrink-0 mx-auto md:mx-0" />

              {/* Quote */}
              <div className="text-center md:text-left flex-1">
                <Skeleton className="h-10 w-10 mb-4 mx-auto md:mx-0" />
                <div className="space-y-2 mb-6">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 mb-1 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-40 mx-auto md:mx-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container-editorial">
          {/* Section header */}
          <div className="text-center mb-16">
            <Skeleton className="h-3 w-28 mb-4 mx-auto" />
            <Skeleton className="h-10 md:h-12 w-64 mx-auto" />
          </div>

          {/* Features grid - 2x2 */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-8 bg-muted/30 border border-border">
                {/* Icon */}
                <Skeleton className="h-12 w-12 rounded-xl mb-5" />
                {/* Title */}
                <Skeleton className="h-6 w-3/4 mb-3" />
                {/* Description */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-foreground">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-8">
                <div>
                  <Skeleton className="h-10 md:h-12 w-20 mb-2 mx-auto bg-background/20" />
                  <Skeleton className="h-3 w-16 mx-auto bg-background/20" />
                </div>
                {i < 2 && (
                  <div className="hidden md:block w-px h-16 bg-background/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sell Section */}
      <section className="py-20 md:py-28 bg-brand/5 border-t border-brand/10">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <Skeleton className="h-3 w-24 mb-4 mx-auto" />
            <Skeleton className="h-10 md:h-12 w-full mb-4" />
            <Skeleton className="h-10 md:h-12 w-2/3 mb-6 mx-auto" />
            <Skeleton className="h-5 w-3/4 max-w-lg mb-10 mx-auto" />
            <Skeleton className="h-12 w-44 mx-auto" />
          </div>
        </div>
      </section>

      <FooterSkeleton />
    </div>
  );
}
