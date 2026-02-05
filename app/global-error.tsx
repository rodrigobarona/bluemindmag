"use client";

import { useEffect } from "react";

/**
 * Global Error Boundary
 * Catches errors in root layout - must include <html> and <body> tags
 * This is the last line of defense for uncaught errors
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
          {/* Masthead */}
          <div className="mb-8 text-center">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#5c5855]">
              Blue Mind Magazine
            </span>
          </div>

          {/* Error Message */}
          <div className="max-w-md text-center">
            <h1
              className="mb-6 text-6xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Error
            </h1>

            <p className="mb-8 text-lg text-[#5c5855]">
              Something went wrong. We apologize for the inconvenience.
            </p>

            {/* Error digest for debugging */}
            {error.digest && (
              <p className="mb-8 text-xs text-[#5c5855]/60">
                Error ID: {error.digest}
              </p>
            )}

            {/* Reset Button */}
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 bg-[#0097b2] px-8 py-4 text-sm font-medium text-white transition-all hover:brightness-110"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
