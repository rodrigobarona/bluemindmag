import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteLayout } from '@/components/site-layout';
import { IssueCardFeatured, IssueCard } from '@/components/issue-card';
import { getAllIssues, getCurrentIssue } from '@/content/data/issues';
import { issueTranslations as enIssueTranslations } from '@/content/i18n/en/issues';
import { issueTranslations as ptIssueTranslations } from '@/content/i18n/pt/issues';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const tCommon = await getTranslations('Common');
  const issues = getAllIssues();
  const currentIssue = getCurrentIssue();

  // Get translations based on locale
  const issueTranslations =
    locale === 'pt' ? ptIssueTranslations : enIssueTranslations;

  return (
    <SiteLayout>
      {/* Hero Section - Clean and editorial */}
      <section className="py-20 md:py-32 lg:py-40">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="text-sm font-medium uppercase tracking-widest text-brand mb-6">
                {t('hero.subtitle')}
              </p>

              <h1 className="headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6">
                {t('hero.title')}
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-4 italic">
                {t('hero.tagline')}
              </p>

              <p className="text-muted-foreground max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {currentIssue && (
                  <Link
                    href={`/issues/${currentIssue.slug}`}
                    className="bg-foreground text-background px-8 py-4 text-sm font-medium transition-fast hover:bg-brand text-center"
                  >
                    {t('hero.cta')}
                  </Link>
                )}
                <Link
                  href="/about"
                  className="border border-border px-8 py-4 text-sm font-medium transition-fast hover:border-foreground text-center"
                >
                  {t('hero.secondary')}
                </Link>
              </div>
            </div>

            {/* Current Issue Cover */}
            {currentIssue && (
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="w-full max-w-sm">
                  <IssueCardFeatured
                    issue={currentIssue}
                    translation={issueTranslations[currentIssue.id]}
                    priority
                  />
                  <div className="mt-6 text-center">
                    <p className="headline text-xl">
                      {issueTranslations[currentIssue.id].title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {issueTranslations[currentIssue.id].subtitle}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section - Minimal */}
      <section className="py-20 md:py-32 border-t border-border">
        <div className="container-narrow">
          <div className="text-center">
            <h2 className="headline text-3xl md:text-4xl mb-8">
              {t('about.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('about.description')}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-foreground hover:text-brand transition-fast"
            >
              {tCommon('learnMore')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Past Issues Grid */}
      {issues.length > 1 && (
        <section className="py-20 md:py-32 border-t border-border bg-muted/30">
          <div className="container-editorial">
            <div className="flex items-center justify-between mb-12">
              <h2 className="headline text-2xl md:text-3xl">{t('archive.title')}</h2>
              <Link
                href="/issues"
                className="text-sm font-medium text-muted-foreground hover:text-brand transition-fast flex items-center gap-1"
              >
                {tCommon('viewAll')}
                <ArrowRight className="w-4 h-4" />
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

    </SiteLayout>
  );
}
