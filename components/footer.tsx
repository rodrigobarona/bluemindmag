'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Instagram, Linkedin } from 'lucide-react';
import {
  footerNavLinks,
  socialLinks,
  siteConfig,
} from '@/content/data/navigation';
import { LanguageSwitcher } from './language-switcher';

export function Footer() {
  const t = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');

  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="border-t border-border">
      {/* Main Footer */}
      <div className="bg-foreground text-background">
        <div className="container-editorial py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="inline-block mb-6">
                <span className="font-headline text-2xl tracking-wider">
                  BLUE MIND
                </span>
              </Link>
              <p className="tagline text-background/60 max-w-xs mb-8">
                {siteConfig.tagline}
              </p>
              {/* Social Links */}
              <div className="flex gap-5">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-background/60 hover:text-brand transition-base"
                    aria-label={social.label}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-background/40 mb-6">
                {tFooter('navigation')}
              </h4>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="font-ui text-sm text-background/80 hover:text-brand transition-base"
                >
                  {t('home')}
                </Link>
                <Link
                  href="/issues"
                  className="font-ui text-sm text-background/80 hover:text-brand transition-base"
                >
                  {t('issues')}
                </Link>
                <Link
                  href="/about"
                  className="font-ui text-sm text-background/80 hover:text-brand transition-base"
                >
                  {t('about')}
                </Link>
                <Link
                  href="/contact"
                  className="font-ui text-sm text-background/80 hover:text-brand transition-base"
                >
                  {t('contact')}
                </Link>
              </nav>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-background/40 mb-6">
                {tFooter('legal')}
              </h4>
              <nav className="flex flex-col gap-4">
                {footerNavLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className="font-ui text-sm text-background/80 hover:text-brand transition-base"
                  >
                    {t(link.key)}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-6 font-ui text-xs text-background/40">
            <p>
              © {currentYear} {siteConfig.name}. {tFooter('rights')}
            </p>
            
            {/* Language Switcher */}
            <LanguageSwitcher variant="footer" />
            
            <p>
              {tFooter('publishedBy')}{' '}
              <a
                href="https://surfisio.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-brand transition-base"
              >
                Surfisio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
