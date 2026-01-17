import { notFound } from 'next/navigation';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getIssueBySlug } from '@/content/data/issues';
import { IconX } from '@tabler/icons-react';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);

  if (!issue) {
    return { title: 'Issue Not Found' };
  }

  return {
    title: `Read Issue ${issue.issueNumber}`,
    description: `Read Blue Mind Magazine Issue ${issue.issueNumber} in our digital flipbook reader.`,
  };
}

export default async function ReadIssuePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const issue = getIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  // Get the flipbook URL for the current locale
  const flipbookUrl = issue.flipbook[locale as 'en' | 'pt'] || issue.flipbook.en;

  return (
    <div className="flipbook-reader">
      {/* Close button - returns to issue page */}
      <Link
        href={`/issues/${slug}`}
        className="fixed top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close reader"
      >
        <IconX className="h-6 w-6" />
      </Link>

      {/* Issue indicator */}
      <div className="fixed top-4 left-4 z-50 font-ui text-white/60 text-sm">
        Issue {issue.issueNumber}
      </div>

      {/* Fullscreen flipbook iframe */}
      <iframe
        src={flipbookUrl}
        title={`Blue Mind Magazine Issue ${issue.issueNumber}`}
        className="w-full h-full"
        allow="clipboard-write; autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

