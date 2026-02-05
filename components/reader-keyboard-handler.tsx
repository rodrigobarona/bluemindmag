"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";

interface ReaderKeyboardHandlerProps {
  issueSlug: string;
  children: React.ReactNode;
}

/**
 * Client component that handles ESC key to navigate back to issue detail page
 * Wraps the read page content and listens for keyboard events
 */
export function ReaderKeyboardHandler({
  issueSlug,
  children,
}: ReaderKeyboardHandlerProps) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Navigate back to issue detail page (same as close button)
        router.push(`/issues/${issueSlug}`);
      }
    },
    [router, issueSlug]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return <>{children}</>;
}
