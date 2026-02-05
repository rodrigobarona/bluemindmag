import { Skeleton } from "@/components/ui/skeleton";

/**
 * Footer Skeleton Component
 * Used as Suspense fallback for progressive footer rendering
 */
export function FooterSkeleton() {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section Skeleton */}
      <section className="relative py-16 md:py-20">
        <div className="absolute inset-0 bg-black/60" />
        <div className="container-editorial relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <Skeleton className="h-10 w-48 mb-4 mx-auto bg-white/10" />
            <Skeleton className="h-4 w-64 mb-8 mx-auto bg-white/10" />
            <div className="flex gap-3 max-w-md mx-auto">
              <Skeleton className="h-12 flex-1 bg-white/10" />
              <Skeleton className="h-12 w-28 bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section Skeleton */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-editorial">
          <Skeleton className="h-8 w-40 mb-8 mx-auto bg-muted" />
          <div className="flex justify-center gap-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-28 bg-muted" />
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer Skeleton */}
      <section className="py-16 md:py-20">
        <div className="container-editorial">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <Skeleton className="h-8 w-40 mb-4 bg-white/10" />
              <Skeleton className="h-4 w-full max-w-xs mb-2 bg-white/10" />
              <Skeleton className="h-4 w-2/3 max-w-xs bg-white/10" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-4 bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-white/10" />
                <Skeleton className="h-3 w-20 bg-white/10" />
                <Skeleton className="h-3 w-14 bg-white/10" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-4 bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 bg-white/10" />
                <Skeleton className="h-3 w-20 bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
