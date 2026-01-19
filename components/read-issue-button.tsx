/**
 * @deprecated Use ReadIssueCTA from @/components/issue-cta instead
 * This file is kept for backwards compatibility
 */

import { ReadIssueCTA } from "./issue-cta";

interface ReadIssueButtonProps {
  issueSlug: string;
  label: string;
  className?: string;
}

export function ReadIssueButton({
  issueSlug,
  label,
  className = "",
}: ReadIssueButtonProps) {
  return (
    <ReadIssueCTA
      slug={issueSlug}
      label={label}
      variant="primary"
      size="lg"
      className={`bg-foreground hover:bg-brand ${className}`}
    />
  );
}
