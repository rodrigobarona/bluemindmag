import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getIssueBySlug, getAllIssues, getIssueTranslations } from '@/content/data/issues';
import type { Locale } from '@/content/types/content';
import { IconX } from '@tabler/icons-react';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/content/data/navigation';
import { generateReadIssueSchema, generateBreadcrumbSchema } from '@/lib/schema';

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
  const t = await getTranslations({ locale, namespace: 'Issues' });

  if (!issue) {
    return { title: 'Issue Not Found' };
  }

  // Get translations from MDX (single source of truth)
  const issueTranslations = getIssueTranslations(locale as Locale);
  const translation = issueTranslations[issue.id];
  const baseUrl = siteConfig.url;

  const title = `${t('readIssue')} ${issue.issueNumber} - ${translation.title}`;
  const description = translation.description;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Blue Mind Magazine`,
      description,
      type: 'article',
      publishedTime: issue.date,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(translation.title)}&subtitle=${encodeURIComponent(t('readNow'))}&type=read`,
          width: 1200,
          height: 630,
          alt: translation.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Blue Mind Magazine`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ReadIssuePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const issue = getIssueBySlug(slug);
  const tNav = await getTranslations('Navigation');

  if (!issue) {
    notFound();
  }

  // Get translations from MDX (single source of truth)
  const issueTranslations = getIssueTranslations(locale as Locale);
  const translation = issueTranslations[issue.id];

  // Get the flipbook URL for the current locale
  const flipbookUrl = issue.flipbook[locale as 'en' | 'pt'] || issue.flipbook.en;

  // Generate JSON-LD schema for SEO
  const baseUrl = siteConfig.url;
  const breadcrumbItems = [
    { name: tNav('home'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}` },
    { name: tNav('issues'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}/issues` },
    { name: translation.title, url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}/issues/${issue.slug}` },
    { name: tNav('read'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}/read/${issue.slug}` },
  ];

  const schemas = [
    generateReadIssueSchema(issue, translation, locale),
    generateBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <div className="flipbook-reader">
      {/* JSON-LD Structured Data */}
      <JsonLd data={schemas} />

      {/* Header with close button and issue indicator */}
      <header className="flipbook-reader__header">
        {/* Brand and issue info - from MDX content */}
        <div className="flex items-center gap-4">
          <Link href="/" className="font-headline text-xl text-white tracking-wider hover:text-white/80 transition-colors">
            BLUE MIND
          </Link>
          <span className="text-white/30 hidden sm:inline">|</span>
          <div className="hidden sm:block font-ui text-white/70 text-sm">
            {translation.title} · {translation.subtitle}
          </div>
        </div>

        {/* ESC hint - center */}
        <div className="text-white/40 text-xs font-ui hidden md:block absolute left-1/2 -translate-x-1/2">
          Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">ESC</kbd> to close
        </div>

        {/* Close button */}
        <Link
          href={`/issues/${slug}`}
          className="p-2 bg-white/10 hover:bg-white/20 text-white transition-colors rounded"
          aria-label="Close reader"
        >
          <IconX className="h-5 w-5" />
        </Link>
      </header>

      {/* Flipbook content area */}
      <div className="flipbook-reader__content">
        <iframe
          src={flipbookUrl}
          title={`Blue Mind Magazine Issue ${issue.issueNumber}`}
          className="w-full h-full"
          allow="clipboard-write; autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
