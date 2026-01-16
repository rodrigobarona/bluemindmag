import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconWorld,
} from '@tabler/icons-react';
import { SiteLayout } from '@/components/site-layout';
import { getTeamMemberById } from '@/content/data/team';
import { getSponsorById } from '@/content/data/sponsors';

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

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <p className="text-brand font-medium uppercase tracking-widest mb-4">
              {t('subtitle')}
            </p>
            <h1 className="headline text-5xl md:text-7xl mb-6">{t('title')}</h1>
            <p className="text-xl text-muted-foreground">
              {t('magazine.description')}
            </p>
          </div>
        </div>
      </section>

      {/* About the Magazine */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="headline text-4xl md:text-5xl mb-6">
                {t('magazine.title')}
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>{t('magazine.description')}</p>
                <p className="text-foreground font-medium italic">
                  &quot;Where surf and science meet.&quot;
                </p>
              </div>
            </div>
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute -inset-4 bg-brand/10 rounded-lg blur-2xl" />
              <div className="relative bg-card border border-border rounded-lg p-8 md:p-12">
                <h3 className="headline text-2xl mb-4">{t('mission.title')}</h3>
                <p className="text-muted-foreground">{t('mission.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chief Editor */}
      <section className="py-20 md:py-32 bg-card border-y border-border">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image placeholder */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                {editor?.image ? (
                  <Image
                    src={editor.image}
                    alt={t('editor.name')}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="headline text-8xl text-muted-foreground/20">
                      PS
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="order-1 lg:order-2">
              <p className="text-brand font-medium uppercase tracking-widest mb-4">
                {t('editor.title')}
              </p>
              <h2 className="headline text-4xl md:text-5xl mb-2">
                {t('editor.name')}
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                {t('editor.credentials')}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
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
                      className="p-2 border border-border rounded-full hover:bg-foreground/5 hover:border-brand transition-colors"
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
                      className="p-2 border border-border rounded-full hover:bg-foreground/5 hover:border-brand transition-colors"
                      aria-label="Instagram"
                    >
                      <IconBrandInstagram className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Publisher - Surfisio */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Info */}
            <div>
              <p className="text-brand font-medium uppercase tracking-widest mb-4">
                {t('publisher.title')}
              </p>
              <h2 className="headline text-4xl md:text-5xl mb-6">
                {t('publisher.name')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
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
                      className="p-2 border border-border rounded-full hover:bg-foreground/5 hover:border-brand transition-colors"
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
                      className="p-2 border border-border rounded-full hover:bg-foreground/5 hover:border-brand transition-colors"
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
                      className="p-2 border border-border rounded-full hover:bg-foreground/5 hover:border-brand transition-colors"
                      aria-label="Instagram"
                    >
                      <IconBrandInstagram className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Image placeholder */}
            <div className="relative">
              <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                {publisher?.image ? (
                  <Image
                    src={publisher.image}
                    alt={t('publisher.name')}
                    fill
                    className="object-contain p-8"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="headline text-6xl text-muted-foreground/20">
                      SURFISIO
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporters - SMI */}
      <section className="py-20 md:py-32 bg-card border-y border-border">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand font-medium uppercase tracking-widest mb-4">
              {t('supporters.title')}
            </p>
            <h2 className="headline text-4xl md:text-5xl mb-6">
              {t('supporters.smi.name')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('supporters.smi.description')}
            </p>

            {smi && (
              <a
                href={smi.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand hover:underline font-medium"
              >
                Visit Surfing Medicine International →
              </a>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="headline text-4xl md:text-5xl mb-6">
              Want to collaborate?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We&apos;re always looking for researchers, writers, and surfers
              who want to share their stories and insights.
            </p>
            <Link
              href="/contact"
              className="inline-flex bg-brand text-brand-foreground px-8 py-4 rounded-full font-medium transition-all hover:opacity-90 hover:scale-105"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

