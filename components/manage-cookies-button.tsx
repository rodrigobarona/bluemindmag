'use client';

import { useConsentManager } from '@c15t/react';
import { cn } from '@/lib/utils';

interface ManageCookiesButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function ManageCookiesButton({ 
  className, 
  children 
}: ManageCookiesButtonProps) {
  const { setIsPrivacyDialogOpen } = useConsentManager();

  return (
    <button
      type="button"
      onClick={() => setIsPrivacyDialogOpen(true)}
      className={cn(
        'font-ui text-sm text-background/80 hover:text-brand transition-base text-left',
        className
      )}
    >
      {children || 'Manage Cookies'}
    </button>
  );
}

