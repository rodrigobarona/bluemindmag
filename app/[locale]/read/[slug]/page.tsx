import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getIssueBySlug, getAllIssues } from '@/content/data/issues';
import { issueTranslations as enIssueTranslations } from '@/content/i18n/en/issues';
import { issueTranslations as ptIssueTranslations } from '@/content/i18n/pt/issues';
import { IconX } from '@tabler/icons-react';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/content/data/navigation';
import { generateReadIssueSchema } from '@/lib/schema';

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
    return { title: 'Issue Not Found' };
  }

  const issueTranslations =
    locale === 'pt' ? ptIssueTranslations : enIssueTranslations;
  const translation = issueTranslations[issue.id];
  const baseUrl = siteConfig.url;

  const title = locale === 'pt' 
    ? `Ler Edição ${issue.issueNumber} - ${translation.title}`
    : `Read Issue ${issue.issueNumber} - ${translation.title}`;
  const description = locale === 'pt'
    ? `Leia a Blue Mind Magazine Edição ${issue.issueNumber} no nosso leitor digital.`
    : `Read Blue Mind Magazine Issue ${issue.issueNumber} in our digital flipbook reader.`;

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
          url: `${baseUrl}/api/og?title=${encodeURIComponent(translation.title)}&subtitle=${encodeURIComponent(locale === 'pt' ? 'Ler Agora' : 'Read Now')}&type=read`,
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

  if (!issue) {
    notFound();
  }

  // Get translations for the issue
  const issueTranslations =
    locale === 'pt' ? ptIssueTranslations : enIssueTranslations;
  const translation = issueTranslations[issue.id];

  // Get the flipbook URL for the current locale
  const flipbookUrl = issue.flipbook[locale as 'en' | 'pt'] || issue.flipbook.en;

  // Generate JSON-LD schema for SEO
  const readSchema = generateReadIssueSchema(issue, translation, locale);

  return (
    <div className="flipbook-reader">
      {/* JSON-LD Structured Data */}
      <JsonLd data={readSchema} />

      {/* Header with close button and issue indicator */}
      <header className="flipbook-reader__header">
        <div className="font-ui text-white/60 text-sm">
          Issue {issue.issueNumber}
        </div>

        <div className="text-white/40 text-xs font-ui hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">ESC</kbd> to close
        </div>

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

