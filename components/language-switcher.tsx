'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const locales: { code: Locale; label: string; fullName: string }[] = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'pt', label: 'PT', fullName: 'Português' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'footer';
  className?: string;
}

export function LanguageSwitcher({
  variant = 'default',
  className,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  if (variant === 'minimal') {
    return (
      <div
        role="group"
        aria-label="Language selection"
        className={cn('flex items-center gap-1 text-sm', className)}
      >
        {locales.map((loc, index) => (
          <span key={loc.code} className="flex items-center">
            {index > 0 && (
              <span className="mx-1 text-muted-foreground" aria-hidden="true">
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => handleLocaleChange(loc.code)}
              disabled={isPending}
              aria-pressed={locale === loc.code}
              aria-label={`Switch language to ${loc.fullName}`}
              className={cn(
                'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
                locale === loc.code
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground',
                isPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              {loc.label}
            </button>
          </span>
        ))}
      </div>
    );
  }

  // Footer variant - designed for dark backgrounds
  if (variant === 'footer') {
    return (
      <div
        role="tablist"
        aria-label="Language selection"
        className={cn(
          'inline-flex items-center rounded-full border border-background/20 bg-background/10 p-0.5',
          className
        )}
      >
        {locales.map((loc) => {
          const isActive = locale === loc.code;

          return (
            <button
              key={loc.code}
              type="button"
              role="tab"
              onClick={() => handleLocaleChange(loc.code)}
              disabled={isPending}
              aria-selected={isActive}
              aria-label={`Switch language to ${loc.fullName}`}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-background/70 hover:text-background hover:bg-background/10',
                isPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              {loc.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label="Language selection"
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-muted/50 p-0.5',
        className
      )}
    >
      {locales.map((loc) => {
        const isActive = locale === loc.code;

        return (
          <button
            key={loc.code}
            type="button"
            role="tab"
            onClick={() => handleLocaleChange(loc.code)}
            disabled={isPending}
            aria-selected={isActive}
            aria-label={`Switch language to ${loc.fullName}`}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
              isPending && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loc.label}
          </button>
        );
      })}
    </div>
  );
}
