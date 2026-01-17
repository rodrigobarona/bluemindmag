import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface ReadIssueButtonProps {
  issueSlug: string;
  label: string;
  className?: string;
}

export function ReadIssueButton({
  issueSlug,
  label,
  className = '',
}: ReadIssueButtonProps) {
  return (
    <Link
      href={`/read/${issueSlug}`}
      className={`group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-ui text-sm font-medium transition-base hover:bg-brand ${className}`}
      >
        <BookOpen className="w-5 h-5" />
        {label}
    </Link>
  );
}
