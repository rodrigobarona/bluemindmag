import { Skeleton } from "@/components/ui/skeleton";

/**
 * Header Skeleton Component
 * Reusable header skeleton for loading states
 */
export function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container-editorial h-full flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-8 w-8 md:hidden" />
      </div>
    </header>
  );
}
