'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { FlipbookModal } from './flipbook-modal';

interface ReadIssueButtonProps {
  flipbookUrl: string;
  issueTitle: string;
  label: string;
  className?: string;
}

export function ReadIssueButton({
  flipbookUrl,
  issueTitle,
  label,
  className = '',
}: ReadIssueButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm font-medium transition-fast hover:bg-brand ${className}`}
      >
        <BookOpen className="w-5 h-5" />
        {label}
      </button>

      <FlipbookModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        flipbookUrl={flipbookUrl}
        issueTitle={issueTitle}
      />
    </>
  );
}

