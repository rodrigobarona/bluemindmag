import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { SiteLayout } from '@/components/site-layout';
import { IssueCard } from '@/components/issue-card';
import { getAllIssues, getCurrentIssue } from '@/content/data/issues';
import { issueTranslations as enIssueTranslations } from '@/content/i18n/en/issues';
import { issueTranslations as ptIssueTranslations } from '@/content/i18n/pt/issues';
import type { Locale } from '@/content/types/content';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const issues = getAllIssues();
  const currentIssue = getCurrentIssue();

  // Get translations based on locale
  const issueTranslations =
    locale === 'pt' ? ptIssueTranslations : enIssueTranslations;

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />

        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="container-editorial relative z-10 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="text-brand font-medium uppercase tracking-widest mb-4 animate-fade-in">
                {t('hero.subtitle')}
              </p>

              <h1 className="headline text-6xl md:text-8xl lg:text-9xl mb-6 animate-fade-in-up">
                {t('hero.title')}
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-4 italic animate-fade-in-up">
                {t('hero.tagline')}
              </p>

              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 animate-fade-in-up">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
                {currentIssue && (
                  <Link
                    href={`/issues/${currentIssue.slug}`}
                    className="bg-brand text-brand-foreground px-8 py-4 rounded-full font-medium transition-all hover:opacity-90 hover:scale-105 text-center"
                  >
                    {t('hero.cta')}
                  </Link>
                )}
                <Link
                  href="/issues"
                  className="border border-foreground/20 px-8 py-4 rounded-full font-medium transition-all hover:bg-foreground/5 text-center"
                >
                  {t('hero.secondary')}
                </Link>
              </div>
            </div>

            {/* Current Issue Cover */}
            {currentIssue && (
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="w-full max-w-sm">
                  <IssueCard
                    issue={currentIssue}
                    translation={issueTranslations[currentIssue.id]}
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32 bg-card border-y border-border">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="headline text-4xl md:text-5xl mb-6">
              {t('about.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t('about.description')}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-8 text-brand hover:underline font-medium"
            >
              Learn more about us →
            </Link>
          </div>
        </div>
      </section>

      {/* Issues Archive Grid */}
      {issues.length > 1 && (
        <section className="py-20 md:py-32">
          <div className="container-editorial">
            <div className="flex items-center justify-between mb-12">
              <h2 className="headline text-3xl md:text-4xl">{t('archive.title')}</h2>
              <Link
                href="/issues"
                className="text-brand hover:underline font-medium"
              >
                {t('archive.viewAll')}
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {issues.slice(0, 6).map((issue, index) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  translation={issueTranslations[issue.id]}
                  priority={index < 2}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA Section */}
      <section className="py-20 md:py-32 bg-brand/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, var(--brand) 0%, transparent 70%)`,
            }}
          />
        </div>

        <div className="container-editorial relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="headline text-4xl md:text-5xl mb-6">
              {t('newsletter.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('newsletter.description')}
            </p>
            <Link
              href="/newsletter"
              className="inline-flex bg-brand text-brand-foreground px-8 py-4 rounded-full font-medium transition-all hover:opacity-90 hover:scale-105"
            >
              {t('newsletter.cta')}
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
