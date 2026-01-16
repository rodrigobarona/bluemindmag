import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SiteLayout } from '@/components/site-layout';
import { FlipbookViewer } from '@/components/flipbook-viewer';
import { IssueCard } from '@/components/issue-card';
import { getIssueBySlug, getAllIssues } from '@/content/data/issues';
import { getSponsorsByIds } from '@/content/data/sponsors';
import { issueTranslations as enIssueTranslations } from '@/content/i18n/en/issues';
import { issueTranslations as ptIssueTranslations } from '@/content/i18n/pt/issues';
import { getIssueThemeStyles } from '@/lib/get-issue-theme';
import type { Locale } from '@/content/types/content';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Generate static paths for all issues
export async function generateStaticParams() {
  const issues = getAllIssues();
  return issues.map((issue) => ({
    slug: issue.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const issue = getIssueBySlug(slug);

  if (!issue) {
    return {
      title: 'Issue Not Found',
    };
  }

  const issueTranslations =
    locale === 'pt' ? ptIssueTranslations : enIssueTranslations;
  const translation = issueTranslations[issue.id];

  return {
    title: `${translation.title} - ${translation.subtitle}`,
    description: translation.description,
    openGraph: {
      title: `${translation.title} | Blue Mind Magazine`,
      description: translation.description,
      type: 'article',
      publishedTime: issue.date,
    },
  };
}

export default async function IssueDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const issue = getIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  const t = await getTranslations('Issues');
  const issueTranslations =
    locale === 'pt' ? ptIssueTranslations : enIssueTranslations;
  const translation = issueTranslations[issue.id];
  const sponsors = getSponsorsByIds(issue.sponsors);
  const flipbookUrl = locale === 'pt' ? issue.flipbook.pt : issue.flipbook.en;

  // Get other issues for "More Issues" section
  const allIssues = getAllIssues();
  const otherIssues = allIssues.filter((i) => i.id !== issue.id).slice(0, 3);

  return (
    <SiteLayout>
      {/* Apply issue accent color theme */}
      <div style={getIssueThemeStyles(issue)}>
        {/* Hero Section */}
        <section
          className="relative py-20 md:py-32 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${issue.accentColor}15 0%, transparent 50%)`,
          }}
        >
          <div className="container-editorial">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Cover Image */}
              <div className="relative flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Shadow/glow effect */}
                  <div
                    className="absolute -inset-4 rounded-lg blur-3xl opacity-30"
                    style={{ backgroundColor: issue.accentColor }}
                  />

                  {/* Cover */}
                  <div className="relative aspect-magazine-cover overflow-hidden rounded-sm shadow-2xl">
                    <Image
                      src={issue.cover}
                      alt={`${translation.title} cover`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Current issue badge */}
                  {issue.isCurrent && (
                    <div
                      className="absolute -top-4 -right-4 px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-full shadow-lg"
                      style={{
                        backgroundColor: issue.accentColor,
                        color: '#ffffff',
                      }}
                    >
                      {t('current')}
                    </div>
                  )}
                </div>
              </div>

              {/* Issue Info */}
              <div>
                <p
                  className="font-medium uppercase tracking-widest mb-4"
                  style={{ color: issue.accentColor }}
                >
                  {issue.isCurrent ? t('current') : translation.subtitle}
                </p>

                <h1 className="headline text-5xl md:text-7xl lg:text-8xl mb-4">
                  {translation.title}
                </h1>

                <p className="text-xl text-muted-foreground mb-6">
                  {translation.subtitle}
                </p>

                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  {translation.description}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#flipbook"
                    className="bg-brand text-brand-foreground px-6 py-3 rounded-full font-medium transition-all hover:opacity-90"
                  >
                    {t('readIssue')}
                  </a>
                  <a
                    href="#features"
                    className="border border-foreground/20 px-6 py-3 rounded-full font-medium transition-all hover:bg-foreground/5"
                  >
                    {t('features')} ↓
                  </a>
                </div>

                {/* Sections */}
                <div className="mt-12">
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
                    {t('sections')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {issue.sections.map((section) => (
                      <span
                        key={section}
                        className="px-3 py-1 text-sm bg-foreground/5 rounded-full"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flipbook Section */}
        <section id="flipbook" className="py-20 md:py-32 bg-card border-y border-border">
          <div className="container-editorial">
            <div className="max-w-5xl mx-auto">
              <h2 className="headline text-3xl md:text-4xl mb-8 text-center">
                {t('readIssue')}
              </h2>
              <FlipbookViewer
                src={flipbookUrl}
                title={translation.title}
                accentColor={issue.accentColor}
              />
            </div>
          </div>
        </section>

        {/* Features/Highlights Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="container-editorial">
            <h2 className="headline text-4xl md:text-5xl mb-12">
              {t('features')}
            </h2>

            <div className="space-y-16">
              {issue.highlights.map((highlight) => {
                const highlightTranslation =
                  translation.highlights[highlight.id];

                if (!highlightTranslation) return null;

                return (
                  <article
                    key={highlight.id}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    {/* Feature Image */}
                    <div className="relative aspect-[21/9] bg-card overflow-hidden">
                      <Image
                        src={highlight.image}
                        alt={highlightTranslation.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                        <p
                          className="text-sm font-medium uppercase tracking-wider mb-2"
                          style={{ color: issue.accentColor }}
                        >
                          {t('page')} {highlight.page}
                        </p>
                        <h3 className="headline text-3xl md:text-4xl lg:text-5xl text-white mb-3">
                          {highlightTranslation.title}
                        </h3>
                        <p className="text-white/80 text-lg max-w-2xl mb-2">
                          {highlightTranslation.excerpt}
                        </p>
                        <p className="text-white/60 text-sm">
                          {t('by')} {highlightTranslation.author}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Placeholder for features without images */}
              {issue.highlights.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Feature highlights coming soon.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section
          className="py-20 md:py-32 relative overflow-hidden"
          style={{
            backgroundColor: `${issue.accentColor}15`,
          }}
        >
          <div className="container-editorial relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="headline text-4xl md:text-5xl mb-6">
                Don&apos;t miss an issue
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Subscribe to our newsletter for the latest in surf science,
                exclusive content, and early access to new issues.
              </p>
              <Link
                href="/newsletter"
                className="inline-flex bg-brand text-brand-foreground px-8 py-4 rounded-full font-medium transition-all hover:opacity-90 hover:scale-105"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
        {sponsors.length > 0 && (
          <section className="py-16 border-t border-border">
            <div className="container-editorial">
              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8">
                  {t('supportedBy')}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                  {sponsors.map((sponsor) => (
                    <a
                      key={sponsor.id}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={150}
                        height={60}
                        className="h-12 w-auto object-contain"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* More Issues */}
        {otherIssues.length > 0 && (
          <section className="py-20 md:py-32 bg-card border-t border-border">
            <div className="container-editorial">
              <div className="flex items-center justify-between mb-12">
                <h2 className="headline text-3xl md:text-4xl">More Issues</h2>
                <Link
                  href="/issues"
                  className="text-brand hover:underline font-medium"
                >
                  View All →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {otherIssues.map((otherIssue) => (
                  <IssueCard
                    key={otherIssue.id}
                    issue={otherIssue}
                    translation={issueTranslations[otherIssue.id]}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

