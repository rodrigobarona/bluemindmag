import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconWorld,
} from '@tabler/icons-react';
import { ArrowRight } from 'lucide-react';
import { SiteLayout } from '@/components/site-layout';
import { ScrollReveal } from '@/components/scroll-reveal';
import { PullQuoteImage } from '@/components/pull-quote';
import { getTeamMemberById } from '@/content/data/team';
import { getSponsorById } from '@/content/data/sponsors';
import { getQuoteImage, getPortugalImage, getSurferImage, getCtaImage } from '@/lib/pexels';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });

  return {
    title: t('title'),
    description: t('magazine.description'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('About');
  const editor = getTeamMemberById('pedro-seixas');
  const publisher = getTeamMemberById('surfisio');
  const smi = getSponsorById('surfing-medicine-international');

  // Fetch Pexels images for visual sections
  const [quoteImage, heroImage, surferImage, newsletterImage] = await Promise.all([
    getQuoteImage(),
    getPortugalImage(),
    getSurferImage(),
    getCtaImage(),
  ]);

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
              {t('magazine.description')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* About the Magazine */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <ScrollReveal direction="left">
              <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {locale === 'pt' ? 'A Revista' : 'The Magazine'}
              </span>
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl mb-8">
                {t('magazine.title')}
              </h2>
              <div className="space-y-6 font-body text-lg text-muted-foreground leading-relaxed">
                <p>{t('magazine.description')}</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right" delay={0.2}>
              <div className="bg-gradient-to-br from-warm/10 via-secondary to-brand/5 p-10 md:p-14">
                <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                  {locale === 'pt' ? 'Missão' : 'Mission'}
                </span>
                <h3 className="font-headline text-2xl md:text-3xl mb-6">
                  {t('mission.title')}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {t('mission.description')}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pull Quote with Image */}
      <PullQuoteImage
        quote="Where surf and science meet."
        image={quoteImage}
      />

      {/* Chief Editor */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image - Surfing action shot */}
            <ScrollReveal direction="left" className="order-2 lg:order-1">
              <div className="relative">
                <div className="aspect-square relative bg-secondary overflow-hidden shadow-float">
                  {editor?.image ? (
                    <Image
                      src={editor.image}
                      alt={t('editor.name')}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : surferImage ? (
                    // Use Pexels surfer image as placeholder
                    <>
                      <Image
                        src={surferImage.srcLarge || surferImage.src}
                        alt={t('editor.name')}
                        fill
                        className="object-cover"
                      />
                      {surferImage.photographer && (
                        <div className="absolute bottom-2 left-2 font-ui text-xs text-white/40 bg-black/30 px-2 py-1">
                          Photo: {surferImage.photographer} / Pexels
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-headline text-8xl text-muted-foreground/20">
                        PS
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Info */}
            <ScrollReveal direction="right" delay={0.2} className="order-1 lg:order-2">
              <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-4 block">
                {t('editor.title')}
              </span>
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl mb-3">
                {t('editor.name')}
              </h2>
              <p className="font-ui text-xl text-muted-foreground mb-8">
                {t('editor.credentials')}
              </p>
              <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed">
                {t('editor.bio')}
              </p>

              {/* Social Links */}
              {editor?.social && (
                <div className="flex gap-4">
                  {editor.social.linkedin && (
                    <a
                      href={editor.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-border hover:border-brand hover:text-brand transition-base"
                      aria-label="LinkedIn"
                    >
                      <IconBrandLinkedin className="h-5 w-5" />
                    </a>
                  )}
                  {editor.social.instagram && (
                    <a
                      href={editor.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-border hover:border-brand hover:text-brand transition-base"
                      aria-label="Instagram"
                    >
                      <IconBrandInstagram className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Publisher - Surfisio */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Info */}
            <ScrollReveal direction="left">
              <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-4 block">
                {t('publisher.title')}
              </span>
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl mb-8">
                {t('publisher.name')}
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed">
                {t('publisher.description')}
              </p>

              {/* Social Links */}
              {publisher?.social && (
                <div className="flex gap-4">
                  {publisher.social.website && (
                    <a
                      href={publisher.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-border hover:border-brand hover:text-brand transition-base"
                      aria-label="Website"
                    >
                      <IconWorld className="h-5 w-5" />
                    </a>
                  )}
                  {publisher.social.linkedin && (
                    <a
                      href={publisher.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-border hover:border-brand hover:text-brand transition-base"
                      aria-label="LinkedIn"
                    >
                      <IconBrandLinkedin className="h-5 w-5" />
                    </a>
                  )}
                  {publisher.social.instagram && (
                    <a
                      href={publisher.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-border hover:border-brand hover:text-brand transition-base"
                      aria-label="Instagram"
                    >
                      <IconBrandInstagram className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </ScrollReveal>

            {/* Image - Surfisio Van */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="aspect-video relative overflow-hidden shadow-editorial">
                {publisher?.image ? (
                  <Image
                    src={publisher.image}
                    alt={t('publisher.name')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <span className="font-headline text-6xl text-muted-foreground/20">
                      SURFISIO
                    </span>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Supporters - SMI */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-4 block">
              {t('supporters.title')}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl mb-8">
              {t('supporters.smi.name')}
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed">
              {t('supporters.smi.description')}
            </p>

            {smi && (
              <a
                href={smi.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui inline-flex items-center gap-2 text-brand hover:text-foreground font-medium transition-base"
              >
                {locale === 'pt'
                  ? 'Visitar Surfing Medicine International'
                  : 'Visit Surfing Medicine International'}
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Collaboration CTA */}
      <section className="py-20 md:py-28 bg-warm/5">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Text content */}
            <ScrollReveal>
              <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-4 block">
                {locale === 'pt' ? 'Colabore Connosco' : 'Collaborate With Us'}
              </span>
              <h2 className="font-headline text-3xl md:text-4xl mb-4">
                {locale === 'pt'
                  ? 'Partilhe a sua história'
                  : 'Share your story'}
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                {locale === 'pt'
                  ? 'Estamos sempre à procura de investigadores, escritores e surfistas que queiram partilhar as suas histórias e conhecimentos.'
                  : "We're always looking for researchers, writers, and surfers who want to share their stories and insights."}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-ui text-sm font-medium transition-slow hover:bg-brand"
              >
                {locale === 'pt' ? 'Contacte-nos' : 'Get in Touch'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
            
            {/* Visual element - Pexels image */}
            <ScrollReveal delay={0.2} className="hidden md:block">
              <div className="relative aspect-[4/3] overflow-hidden">
                {surferImage && (
                  <>
                    <Image
                      src={surferImage.srcLarge || surferImage.src}
                      alt={surferImage.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Photo credit */}
                    {surferImage.photographer && (
                      <div className="absolute bottom-3 right-3 font-ui text-xs text-white/50 z-10">
                        Photo:{' '}
                        {surferImage.photographerUrl ? (
                          <a
                            href={surferImage.photographerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white/70 transition-colors"
                          >
                            {surferImage.photographer}
                          </a>
                        ) : (
                          surferImage.photographer
                        )}
                        {' / Pexels'}
                      </div>
                    )}
                  </>
                )}
                {!surferImage && (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-brand/10 to-warm/20" />
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
