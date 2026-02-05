"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";

/**
 * Route Error Boundary
 * Catches errors in pages with branded styling and reset functionality
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      {/* Section Label */}
      <div className="mb-8 text-center">
        <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Something Went Wrong
        </span>
      </div>

      {/* Error Display */}
      <div className="max-w-lg text-center">
        <h1 className="font-headline text-6xl md:text-7xl lg:text-8xl mb-6 text-foreground">
          ERROR
        </h1>

        <p className="font-body text-lg text-muted-foreground mb-4 leading-relaxed">
          We encountered an unexpected error while loading this page.
        </p>

        <p className="font-body text-base text-muted-foreground/80 mb-8">
          Please try again, or return to the homepage if the problem persists.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="font-ui text-xs text-muted-foreground/50 mb-8">
            Reference: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="group inline-flex items-center justify-center gap-3 bg-brand text-white px-8 py-4 font-ui text-sm font-medium transition-slow hover:brightness-110"
          >
            <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-border px-8 py-4 font-ui text-sm font-medium transition-slow hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="mt-16 w-16 h-px bg-border" />
    </div>
  );
}
