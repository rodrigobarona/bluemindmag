'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { mainNavLinks } from '@/content/data/navigation';

export function Header() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();

  // Check if we're on the homepage (has immersive hero)
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/pt';

  // Handle scroll events for header visibility and style
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Show header when scrolling up, hide when scrolling down (after threshold)
    if (latest > 100) {
      setIsVisible(latest < previous);
    } else {
      setIsVisible(true);
    }

    // Change header style after scrolling past hero (approx 100vh)
    setIsScrolled(latest > 80);
  });

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Determine header styling based on scroll position and page
  const headerBg = isMenuOpen
    ? 'bg-background'
    : isScrolled
    ? 'bg-background/95 backdrop-blur-sm'
    : isHomePage
    ? 'bg-gradient-to-b from-black/50 via-black/25 to-transparent'
    : 'bg-background';

  const borderColor = isScrolled || !isHomePage ? 'border-border' : 'border-transparent';

  // Text shadow for better readability on hero images
  const heroTextShadow = !isScrolled && isHomePage && !isMenuOpen
    ? { textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)' }
    : {};

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg} border-b ${borderColor}`}
    >
      <nav className="container-editorial">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span 
              className={`font-headline text-xl md:text-2xl tracking-wider transition-colors duration-300 ${
                isMenuOpen || isScrolled || !isHomePage ? 'text-foreground' : 'text-white'
              }`}
              style={heroTextShadow}
            >
              BLUE MIND
            </span>
            <span 
              className={`hidden sm:inline font-ui text-xs uppercase tracking-wider transition-colors duration-300 ${
                isMenuOpen || isScrolled || !isHomePage ? 'text-muted-foreground' : 'text-white/80'
              }`}
              style={heroTextShadow}
            >
              Magazine
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {mainNavLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`font-ui text-sm uppercase tracking-wide transition-all duration-300 ${
                  isScrolled || !isHomePage
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/90 hover:text-white'
                }`}
                style={heroTextShadow}
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
              className={`px-5 py-2.5 font-ui text-sm font-medium transition-all duration-300 ${
                isScrolled || !isHomePage
                  ? 'bg-foreground text-background hover:bg-brand'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/20'
              }`}
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 -mr-2 transition-colors duration-300 ${
              isMenuOpen || isScrolled || !isHomePage ? 'text-foreground' : 'text-white'
            }`}
            style={heroTextShadow}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container-editorial py-10 space-y-10">
              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-6">
                {mainNavLinks.map((link, index) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-headline text-4xl hover:text-brand transition-base block"
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between pt-8 border-t border-border"
              >
                <LanguageSwitcher variant="minimal" />
                <Link
                  href="/newsletter"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-foreground text-background px-6 py-3 font-ui text-sm font-medium hover:bg-brand transition-base"
                >
                  Subscribe
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
