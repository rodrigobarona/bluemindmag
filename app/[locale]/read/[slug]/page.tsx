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

