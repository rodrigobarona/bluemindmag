'use client';

import * as React from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { IconMenu2 } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { mainNavLinks } from '@/content/data/navigation';

export function Header() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Check if we're on the homepage (has immersive hero)
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/pt';

  // Handle scroll for header background
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sheet on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/en' || pathname === '/pt';
    }
    return pathname.includes(href);
  };

  // Dynamic styling based on scroll and page
  const isTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-gradient-to-b from-black/60 via-black/30 to-transparent'
          : 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
      )}
    >
      <div className="container-editorial">
        <nav
          className="flex h-16 md:h-18 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            aria-label="Blue Mind Magazine - Home"
          >
            <span
              className={cn(
                'font-headline text-3xl md:text-4xl tracking-wider transition-colors',
                isTransparent ? 'text-white' : 'text-foreground'
              )}
              style={isTransparent ? { textShadow: '0 2px 8px rgba(0,0,0,0.3)' } : undefined}
            >
              BLUE MIND
            </span>
            <span
              className={cn(
                'hidden sm:inline font-ui text-sm uppercase tracking-[0.2em] transition-colors',
                isTransparent ? 'text-white/80' : 'text-muted-foreground'
              )}
            >
              Magazine
            </span>
          </Link>

          {/* Desktop Navigation - Simple Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {mainNavLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full transition-colors',
                  isActiveLink(link.href)
                    ? isTransparent
                      ? 'bg-white/20 text-white'
                      : 'bg-muted text-foreground'
                    : isTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                style={isTransparent ? { textShadow: '0 1px 3px rgba(0,0,0,0.2)' } : undefined}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/newsletter"
              className={cn(
                buttonVariants({ size: 'sm' }),
                'font-ui text-sm font-medium rounded-full transition-all',
                isTransparent
                  ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                  : 'bg-foreground text-background hover:bg-brand'
              )}
            >
              {t('subscribe')}
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  'transition-colors',
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-foreground hover:bg-muted'
                )}
                aria-label="Open navigation menu"
              >
                <IconMenu2 className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
                  <SheetTitle className="text-left">
                    <span className="font-headline text-4xl tracking-wider">
                      BLUE MIND
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col p-6" aria-label="Mobile navigation">
                  <ul className="space-y-1">
                    {mainNavLinks.map((link) => (
                      <li key={link.key}>
                        <SheetClose
                          render={
                    <Link
                      href={link.href}
                              className={cn(
                                'flex items-center py-3 px-4 rounded-full text-base font-medium transition-colors',
                                isActiveLink(link.href)
                                  ? 'bg-muted text-foreground'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                              )}
                            />
                          }
                    >
                      {t(link.key)}
                        </SheetClose>
                      </li>
                ))}
                  </ul>

                  {/* Divider */}
                  <div className="my-6 border-t border-border" />

              {/* Mobile Actions */}
                  <div className="space-y-4">
                    <SheetClose
                      render={
                <Link
                  href="/newsletter"
                          className={cn(buttonVariants({ size: 'lg' }), 'w-full rounded-full')}
                        />
                      }
                    >
                      {t('subscribe')}
                    </SheetClose>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
              </div>
        </nav>
            </div>
    </header>
  );
}
