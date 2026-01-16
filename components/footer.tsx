import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';
import {
  footerNavLinks,
  socialLinks,
  siteConfig,
} from '@/content/data/navigation';

export function Footer() {
  const t = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');

  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <IconBrandInstagram className="h-5 w-5" />;
      case 'linkedin':
        return <IconBrandLinkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="border-t border-border bg-card">
      {/* Newsletter CTA Section */}
      <div className="bg-brand/10 border-b border-border">
        <div className="container-editorial py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="headline text-3xl md:text-4xl mb-4">
              {tFooter('newsletter.title')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {tFooter('newsletter.description')}
            </p>
            <Link
              href="/newsletter"
              className="inline-flex bg-brand text-brand-foreground px-6 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90 hover:scale-105"
            >
              {tFooter('newsletter.cta')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-editorial py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="headline text-2xl tracking-wider">
                BLUE MIND
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
              {siteConfig.tagline}. {tFooter('tagline')}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-brand transition-colors"
                  aria-label={social.label}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">
              {tFooter('navigation')}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('home')}
              </Link>
              <Link
                href="/issues"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('issues')}
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('about')}
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('contact')}
              </Link>
            </nav>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">
              {tFooter('legal')}
            </h4>
            <nav className="flex flex-col gap-2">
              {footerNavLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteConfig.name}. {tFooter('rights')}
          </p>
          <p className="text-sm text-muted-foreground">
            {tFooter('publishedBy')}{' '}
            <a
              href="https://surfisio.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Surfisio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

