'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { Menu } from '@base-ui/react/menu';
import { Globe, Check, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const locales: { code: Locale; label: string; fullName: string }[] = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'pt', label: 'PT', fullName: 'Português' },
];

interface LanguageDropdownProps {
  className?: string;
}

export function LanguageDropdown({ className }: LanguageDropdownProps) {
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

  const currentLocale = locales.find((l) => l.code === locale);

  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          'text-background/70 hover:text-background hover:bg-background/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-foreground',
          'data-[popup-open]:bg-background/10 data-[popup-open]:text-background',
          isPending && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={isPending}
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLocale?.fullName}</span>
        <ChevronUp className="h-3 w-3 transition-transform data-[popup-open]:rotate-180" />
      </Menu.Trigger>
      
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} side="top" className="outline-none z-50">
          <Menu.Popup
            className={cn(
              'origin-[var(--transform-origin)] rounded-lg py-1 min-w-[140px]',
              'bg-background text-foreground',
              'shadow-lg ring-1 ring-border',
              'transition-[transform,scale,opacity]',
              'data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
              'data-[starting-style]:scale-95 data-[starting-style]:opacity-0'
            )}
          >
            {locales.map((loc) => {
              const isActive = locale === loc.code;

              return (
                <Menu.Item
                  key={loc.code}
                  onClick={() => handleLocaleChange(loc.code)}
                  className={cn(
                    'flex items-center justify-between gap-3 px-3 py-2 text-sm cursor-pointer outline-none select-none',
                    'transition-colors',
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground',
                    'data-[highlighted]:bg-muted data-[highlighted]:text-foreground'
                  )}
                >
                  <span>{loc.fullName}</span>
                  {isActive && <Check className="h-4 w-4 text-brand" />}
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

