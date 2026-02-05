/**
 * @deprecated Use ReadIssueCTA from @/components/issue-cta instead
 * This file is kept for backwards compatibility
 */

import { ReadIssueCTA } from "./issue-cta";

interface ReadIssueButtonProps {
  issueSlug: string;
  label: string;
  className?: string;
  // Analytics tracking props (optional)
  issueId?: string;
  issueNumber?: number;
  issueTitle?: string;
  locale?: string;
}

export function ReadIssueButton({
  issueSlug,
  label,
  className = "",
  issueId,
  issueNumber,
  issueTitle,
  locale,
}: ReadIssueButtonProps) {
  return (
    <ReadIssueCTA
      slug={issueSlug}
      label={label}
      variant="primary"
      size="lg"
      className={`bg-foreground text-background hover:bg-brand hover:text-white ${className}`}
      issueId={issueId}
      issueNumber={issueNumber}
      issueTitle={issueTitle}
      locale={locale}
    />
  );
}
