'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { mainNavLinks } from '@/content/data/navigation';

export function Header() {
  const t = useTranslations('Navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container-editorial">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-fast hover:opacity-70"
          >
            <span className="headline text-lg sm:text-xl tracking-widest">
              BLUE MIND
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground uppercase tracking-wider">
              Magazine
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {mainNavLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm text-muted-foreground transition-fast hover:text-foreground uppercase tracking-wide"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <LanguageSwitcher />
            <Link
              href="/newsletter"
              className="bg-foreground text-background px-5 py-2 text-sm font-medium transition-fast hover:bg-brand"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -mr-2 text-foreground"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container-editorial py-8 space-y-8">
              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-6">
                {mainNavLinks.map((link, index) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="headline text-3xl hover:text-brand transition-fast"
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <LanguageSwitcher variant="minimal" />
                <Link
                  href="/newsletter"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-foreground text-background px-5 py-2 text-sm font-medium"
                >
                  Subscribe
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
