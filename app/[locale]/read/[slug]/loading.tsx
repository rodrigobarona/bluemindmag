import { Skeleton } from "@/components/ui/skeleton";

/**
 * Read Issue (Flipbook) Page Loading Skeleton
 * Matches the exact structure of the flipbook reader page
 */
export default function ReadIssueLoading() {
  return (
    <div className="flipbook-reader">
      {/* Header Skeleton */}
      <header className="flipbook-reader__header">
        {/* Issue info */}
        <Skeleton className="h-4 w-48 bg-white/20" />

        {/* ESC hint */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <Skeleton className="h-3 w-32 bg-white/10" />
        </div>

        {/* Close button */}
        <Skeleton className="h-9 w-9 rounded bg-white/10" />
      </header>

      {/* Flipbook Content Area Skeleton */}
      <div className="flipbook-reader__content">
        <div className="relative w-full h-full flex items-center justify-center bg-black/95">
          {/* Flipbook placeholder */}
          <div className="relative w-full max-w-6xl mx-auto aspect-16/10">
            <Skeleton className="absolute inset-0 bg-white/5" />

            {/* Loading indicator in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Skeleton className="h-16 w-16 rounded-full mb-4 bg-white/10" />
              <Skeleton className="h-4 w-32 bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
