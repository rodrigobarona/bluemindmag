import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { JsonLd } from '@/components/json-ld';
import { generateLegalPageSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { siteConfig } from '@/content/data/navigation';
import { getLegalPageContent } from '@/lib/mdx';
import type { Locale } from '@/content/types/content';
import ReactMarkdown from 'react-markdown';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageContent = getLegalPageContent('privacy', locale as Locale);

  const title = pageContent?.frontmatter.title || 'Privacy Policy';
  const description = pageContent?.frontmatter.description || '';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Blue Mind Magazine`,
      description,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations('Navigation');
  const tLegal = await getTranslations('Legal.privacy');
  const pageContent = getLegalPageContent('privacy', locale as Locale);

  if (!pageContent) {
    throw new Error(`Privacy page content not found for locale: ${locale}`);
  }

  const { frontmatter, content } = pageContent;

  // Generate JSON-LD schema for SEO
  const baseUrl = siteConfig.url;
  const breadcrumbItems = [
    { name: tNav('home'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}` },
    { name: frontmatter.title, url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}/privacy` },
  ];

  const schemas = [
    generateLegalPageSchema(locale, 'privacy', frontmatter.title, '2026-01-01'),
    generateBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <article className="py-20 md:py-32">
      {/* JSON-LD Structured Data */}
      <JsonLd data={schemas} />
      <div className="container-narrow">
        {/* Header */}
        <header className="mb-12">
          <h1 className="headline text-4xl md:text-5xl mb-4">{frontmatter.title}</h1>
          <p className="text-muted-foreground">
            {tLegal('lastUpdated')}: {frontmatter.lastUpdated}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:font-normal prose-h2:text-2xl prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-brand prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/"
            className="text-brand hover:underline inline-flex items-center gap-2"
          >
            ← {locale === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </article>
  );
}

