'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { LanguageSwitcher } from './language-switcher';
import { mainNavLinks } from '@/content/data/navigation';

export function Header() {
  const t = useTranslations('Navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container-editorial">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="headline text-xl md:text-2xl tracking-wider">
              BLUE MIND
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {mainNavLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground uppercase tracking-wide"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/newsletter"
              className="bg-brand text-brand-foreground px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-90 hover:scale-105"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 -mr-2"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <IconX className="h-6 w-6" />
            ) : (
              <IconMenu2 className="h-6 w-6" />
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container-editorial py-6 space-y-6">
              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-4">
                {mainNavLinks.map((link, index) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="headline text-3xl hover:text-brand transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <LanguageSwitcher variant="minimal" />
                <Link
                  href="/newsletter"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-brand text-brand-foreground px-4 py-2 rounded-full text-sm font-medium"
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

