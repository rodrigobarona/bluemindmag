'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Instagram, Linkedin } from 'lucide-react';
import {
  footerNavLinks,
  socialLinks,
  siteConfig,
} from '@/content/data/navigation';
import { LanguageDropdown } from './language-dropdown';
import { NewsletterForm } from './newsletter-form';
import type { ImageResult } from '@/lib/pexels';

interface FooterProps {
  newsletterImage?: ImageResult | null;
}

export function Footer({ newsletterImage }: FooterProps) {
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
      {/* Newsletter Section - With Background Image */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Background image */}
        {newsletterImage && (
          <>
            <Image
              src={newsletterImage.srcLarge || newsletterImage.src}
              alt={newsletterImage.alt}
              fill
              className="object-cover"
              sizes="100vw"
              quality={80}
            />
            <div className="absolute inset-0 bg-black/60" />
            
            {/* Photo credit */}
            {newsletterImage.photographer && (
              <div className="absolute bottom-4 right-4 font-ui text-xs text-white/30 z-10">
                Photo:{' '}
                {newsletterImage.photographerUrl ? (
                  <a
                    href={newsletterImage.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/50 transition-colors"
                  >
                    {newsletterImage.photographer}
                  </a>
                ) : (
                  newsletterImage.photographer
                )}
                {' / Pexels'}
              </div>
            )}
          </>
        )}
        
        {/* Fallback gradient if no image */}
        {!newsletterImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-warm/20 via-foreground to-brand/10" />
        )}
        
        <div className="container-narrow relative z-10">
          <div className="text-center">
            <span className={`font-ui text-xs font-medium uppercase tracking-[0.3em] mb-4 block ${newsletterImage ? 'text-white/60' : 'text-background/60'}`}>
              Newsletter
            </span>
            
            <h2 className={`font-headline text-4xl md:text-5xl lg:text-6xl mb-6 ${newsletterImage ? 'text-white' : 'text-background'}`}>
              {tFooter('newsletter.title')}
            </h2>
            
            <p className={`tagline mb-10 max-w-lg mx-auto text-balance ${newsletterImage ? 'text-white/80' : 'text-background/70'}`}>
              {tFooter('newsletter.description')}
            </p>

            {/* Newsletter Form */}
            <div className="max-w-md mx-auto mb-6">
              <NewsletterForm variant="footer" />
            </div>

            {/* Learn more link */}
            <Link
              href="/newsletter"
              className={`inline-flex items-center gap-2 font-ui text-sm transition-colors ${
                newsletterImage 
                  ? 'text-white/60 hover:text-white' 
                  : 'text-background/60 hover:text-background'
              }`}
            >
              {tFooter('newsletter.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-foreground text-background">
        <div className="container-editorial py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
              <Link href="/" className="inline-block mb-4">
                <span className="font-headline text-4xl md:text-5xl tracking-wider">
                BLUE MIND
              </span>
            </Link>
              <p className="font-accent text-base md:text-lg text-background/60 max-w-xs mb-8">
              {siteConfig.tagline}
            </p>
              {/* Social Links & Language */}
              <div className="flex items-center gap-6">
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
                <div className="h-5 w-px bg-background/20" />
                <LanguageDropdown />
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
          <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 font-ui text-xs text-background/40">
          <p>
              © {currentYear} {siteConfig.name}. {tFooter('rights')}
          </p>
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
