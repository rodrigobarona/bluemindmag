'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

const locales = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'pt', label: 'PT', fullName: 'Português' },
] as const;

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

export function LanguageSwitcher({
  variant = 'default',
  className = '',
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale prefix if present
    let newPath = pathname;

    // Handle paths that start with locale
    if (pathname.startsWith('/en')) {
      newPath = pathname.replace('/en', '') || '/';
    } else if (pathname.startsWith('/pt')) {
      newPath = pathname.replace('/pt', '') || '/';
    }

    // Build new path with new locale
    const finalPath = newLocale === 'en' ? newPath : `/${newLocale}${newPath}`;

    startTransition(() => {
      router.replace(finalPath);
    });
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 text-sm ${className}`}>
        {locales.map((loc, index) => (
          <span key={loc.code} className="flex items-center">
            {index > 0 && (
              <span className="mx-1 text-muted-foreground">/</span>
            )}
            <button
              onClick={() => handleLocaleChange(loc.code)}
              disabled={isPending || locale === loc.code}
              className={`transition-colors ${
                locale === loc.code
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              } ${isPending ? 'opacity-50' : ''}`}
              aria-label={`Switch to ${loc.fullName}`}
            >
              {loc.label}
            </button>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border border-border bg-background/50 p-0.5 ${className}`}
    >
      {locales.map((loc) => (
        <button
          key={loc.code}
          onClick={() => handleLocaleChange(loc.code)}
          disabled={isPending}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
            locale === loc.code
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground'
          } ${isPending ? 'opacity-50' : ''}`}
          aria-label={`Switch to ${loc.fullName}`}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}

