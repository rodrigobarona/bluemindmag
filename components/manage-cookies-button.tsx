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
  const { setIsPrivacyDialogOpen, isPrivacyDialogOpen } = useConsentManager();

  // Toggle the dialog - matching the c15t documentation example pattern
  const handleClick = () => {
    setIsPrivacyDialogOpen(!isPrivacyDialogOpen);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'font-ui text-sm text-background/80 hover:text-brand transition-base text-left',
        className
      )}
    >
      {children || 'Manage Cookies'}
    </button>
  );
}

