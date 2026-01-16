import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IconCheck, IconSparkles } from '@tabler/icons-react';
import { SiteLayout } from '@/components/site-layout';
import { BeehiivEmbed } from '@/components/beehiiv-embed';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Newsletter' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function NewsletterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Newsletter');

  const features = [
    'New issue announcements',
    'Exclusive surf science insights',
    'Community stories and events',
    'Early access to content',
  ];

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, var(--brand) 0%, transparent 50%)',
          }}
        />

        <div className="container-editorial relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 rounded-full text-brand font-medium text-sm mb-6">
              <IconSparkles className="h-4 w-4" />
              Free Newsletter
            </div>

            <h1 className="headline text-5xl md:text-7xl mb-6">{t('title')}</h1>

            <p className="text-xl md:text-2xl text-muted-foreground italic mb-4">
              {t('subtitle')}
            </p>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              {t('description')}
            </p>

            {/* Beehiiv Subscribe Form */}
            <div className="max-w-lg mx-auto">
              <BeehiivEmbed />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-card border-y border-border">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <h2 className="headline text-3xl md:text-4xl text-center mb-12">
              {t('features.title')}
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 bg-background border border-border rounded-lg"
                >
                  <div className="p-2 bg-brand/10 rounded-full">
                    <IconCheck className="h-5 w-5 text-brand" />
                  </div>
                  <p className="text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-brand/10">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="headline text-4xl md:text-5xl mb-6">
              Prefer to read first?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Check out our latest issue and see what Blue Mind Magazine is all
              about.
            </p>
            <Link
              href="/issues"
              className="inline-flex border border-foreground/20 px-8 py-4 rounded-full font-medium transition-all hover:bg-foreground/5"
            >
              Browse Issues
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

