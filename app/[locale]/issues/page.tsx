import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { SiteLayout } from '@/components/site-layout';
import { IssueCard } from '@/components/issue-card';
import { getAllIssues } from '@/content/data/issues';
import { issueTranslations as enIssueTranslations } from '@/content/i18n/en/issues';
import { issueTranslations as ptIssueTranslations } from '@/content/i18n/pt/issues';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Issues' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function IssuesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Issues');
  const issues = getAllIssues();

  // Get translations based on locale
  const issueTranslations =
    locale === 'pt' ? ptIssueTranslations : enIssueTranslations;

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
            <p className="text-xl text-muted-foreground">{t('description')}</p>
          </div>
        </div>
      </section>

      {/* Issues Grid */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {issues.map((issue, index) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                translation={issueTranslations[issue.id]}
                priority={index < 3}
              />
            ))}
          </div>

          {/* Empty state */}
          {issues.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No issues available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

