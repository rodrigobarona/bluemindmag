import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  IconMail,
  IconBrandInstagram,
  IconBrandLinkedin,
} from '@tabler/icons-react';
import { SiteLayout } from '@/components/site-layout';
import { ContactForm } from '@/components/contact-form';
import { ScrollReveal } from '@/components/scroll-reveal';
import { socialLinks, siteConfig } from '@/content/data/navigation';
import { getCtaImage, getQuoteImage } from '@/lib/pexels';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Contact');
  
  // Fetch Pexels images
  const [newsletterImage, heroImage] = await Promise.all([
    getCtaImage(),
    getQuoteImage(), // Using quote image for a calm, atmospheric background
  ]);

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
    <SiteLayout newsletterImage={newsletterImage}>
      {/* Hero Section - With background image */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background image */}
        {heroImage && (
          <>
            <Image
              src={heroImage.srcLarge || heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
            
            {/* Photo credit */}
            {heroImage.photographer && (
              <div className="absolute bottom-4 right-4 font-ui text-xs text-white/30 z-10">
                Photo:{' '}
                {heroImage.photographerUrl ? (
                  <a
                    href={heroImage.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/50 transition-colors"
                  >
                    {heroImage.photographer}
                  </a>
                ) : (
                  heroImage.photographer
                )}
                {' / Pexels'}
              </div>
            )}
          </>
        )}
        
        {/* Fallback gradient */}
        {!heroImage && <div className="absolute inset-0 bg-secondary" />}

        <div className="container-editorial relative z-10">
          <ScrollReveal className="max-w-3xl">
            <span 
              className={`font-ui text-xs font-medium uppercase tracking-[0.3em] mb-4 block ${heroImage ? 'text-white/70' : 'text-brand'}`}
              style={heroImage ? { textShadow: '0 1px 3px rgba(0,0,0,0.3)' } : undefined}
            >
              {t('subtitle')}
            </span>
            <h1 
              className={`font-headline text-5xl md:text-7xl lg:text-8xl mb-6 ${heroImage ? 'text-white' : ''}`}
              style={heroImage ? { textShadow: '0 2px 8px rgba(0,0,0,0.3)' } : undefined}
            >
              {t('title')}
            </h1>
            <p 
              className={`font-body text-xl leading-relaxed ${heroImage ? 'text-white/80' : 'text-muted-foreground'}`}
              style={heroImage ? { textShadow: '0 1px 3px rgba(0,0,0,0.2)' } : undefined}
            >
              {t('description')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="lg:pl-8">
              <div className="sticky top-24 space-y-8">
                {/* Email */}
                <div className="p-6 bg-card border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brand/10">
                      <IconMail className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <h3 className="font-ui font-semibold">Email</h3>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-brand hover:underline"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('info.response')}
                  </p>
                </div>

                {/* Social Links */}
                <div className="p-6 bg-card border border-border">
                  <h3 className="font-ui font-semibold mb-4">
                    {locale === 'pt' ? 'Siga-nos' : 'Follow Us'}
                  </h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-background border border-border hover:bg-foreground/5 hover:border-brand transition-colors"
                        aria-label={social.label}
                      >
                        {getSocialIcon(social.platform)}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="p-6 bg-warm/10">
                  <h3 className="font-ui font-semibold mb-2">
                    {locale === 'pt' ? 'Quer contribuir?' : 'Want to contribute?'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'pt'
                      ? 'Estamos sempre à procura de investigadores, escritores e surfistas que queiram partilhar as suas histórias. Envie-nos uma mensagem com as suas ideias!'
                      : "We're always looking for researchers, writers, and surfers who want to share their stories. Send us a message with your ideas!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
