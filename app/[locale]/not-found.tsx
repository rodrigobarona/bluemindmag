import { Link } from "@/i18n/navigation";
import { ArrowLeft, Search, Home } from "lucide-react";

/**
 * Custom 404 Page
 * Branded not-found experience matching site design
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      {/* Section Label */}
      <div className="mb-8 text-center">
        <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Page Not Found
        </span>
      </div>

      {/* 404 Display */}
      <div className="max-w-lg text-center">
        <h1 className="font-headline text-8xl md:text-9xl lg:text-[10rem] mb-6 text-foreground leading-none">
          404
        </h1>

        <p className="font-body text-lg text-muted-foreground mb-4 leading-relaxed">
          The page you&apos;re looking for seems to have drifted away.
        </p>

        <p className="font-body text-base text-muted-foreground/80 mb-10">
          Perhaps it was swept out to sea, or maybe the URL was mistyped.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-3 bg-brand text-white px-8 py-4 font-ui text-sm font-medium transition-slow hover:brightness-110"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>

          <Link
            href="/issues"
            className="inline-flex items-center justify-center gap-2 border border-border px-8 py-4 font-ui text-sm font-medium transition-slow hover:bg-muted"
          >
            <Search className="w-4 h-4" />
            Browse Issues
          </Link>
        </div>
      </div>

      {/* Decorative Wave Element */}
      <div className="mt-16 flex items-center gap-4 text-muted-foreground/30">
        <div className="w-8 h-px bg-current" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-6 h-6"
        >
          <path d="M2 12c1.5-1.5 3-2 4.5-2s3 .5 4.5 2c1.5 1.5 3 2 4.5 2s3-.5 4.5-2" />
        </svg>
        <div className="w-8 h-px bg-current" />
      </div>

      {/* Helpful Links */}
      <div className="mt-12 text-center">
        <p className="font-ui text-xs text-muted-foreground/60 mb-4">
          You might be looking for:
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link
            href="/about"
            className="font-ui text-sm text-muted-foreground hover:text-brand transition-base"
          >
            About Us
          </Link>
          <Link
            href="/newsletter"
            className="font-ui text-sm text-muted-foreground hover:text-brand transition-base"
          >
            Newsletter
          </Link>
          <Link
            href="/contact"
            className="font-ui text-sm text-muted-foreground hover:text-brand transition-base"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
