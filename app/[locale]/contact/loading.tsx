import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSkeleton } from "@/components/header-skeleton";
import { FooterSkeleton } from "@/components/footer-skeleton";

/**
 * Contact Page Loading Skeleton
 * Matches the exact structure of the contact page
 */
export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderSkeleton />

      {/* Hero Section Skeleton */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Background image placeholder */}
        <Skeleton className="absolute inset-0" />

        <div className="container-editorial relative z-10">
          <div className="max-w-3xl">
            {/* Label */}
            <Skeleton className="h-3 w-24 mb-4" />
            {/* Title */}
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full mb-4" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-1/2 mb-6" />
            {/* Tagline */}
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </section>

      {/* Contact Content Section */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Contact Form Column */}
            <div className="lg:col-span-7">
              {/* Form Header */}
              <div className="mb-10">
                <Skeleton className="h-8 md:h-10 w-48 mb-4" />
                <Skeleton className="h-4 w-full max-w-lg mb-2" />
                <Skeleton className="h-4 w-3/4 max-w-lg" />
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name field */}
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>

                {/* Email field */}
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>

                {/* Subject field */}
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>

                {/* Message field */}
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-32 w-full" />
                </div>

                {/* Submit button */}
                <Skeleton className="h-12 w-32" />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-5">
              {/* Personal Note */}
              <div className="pb-8 mb-8 border-b border-border">
                <div className="flex items-start gap-4 mb-6">
                  {/* Avatar */}
                  <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                  <div>
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-8 w-8 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                </div>
              </div>

              {/* Book a Chat */}
              <div className="space-y-8">
                <div>
                  <Skeleton className="h-3 w-28 mb-5" />
                  <Skeleton className="h-14 w-full mb-4" />
                  <Skeleton className="h-4 w-full" />
                </div>

                {/* Social Links */}
                <div className="pt-8 border-t border-border">
                  <Skeleton className="h-3 w-32 mb-5" />
                  <div className="flex gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full mt-4" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Contribute CTA Section */}
      <section className="py-16 md:py-20 bg-brand/5 border-t border-brand/10">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <Skeleton className="h-3 w-36 mb-4 mx-auto" />
            <Skeleton className="h-8 md:h-10 w-full mb-4" />
            <Skeleton className="h-8 md:h-10 w-2/3 mb-4 mx-auto" />
            <div className="space-y-2 mb-8">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5 mx-auto" />
            </div>
            <Skeleton className="h-12 w-44 mx-auto" />
          </div>
        </div>
      </section>

      <FooterSkeleton />
    </div>
  );
}
