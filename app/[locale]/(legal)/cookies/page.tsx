import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { JsonLd } from '@/components/json-ld';
import { generateLegalPageSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { siteConfig } from '@/content/data/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Legal.cookies' });

  const title = t('title');
  const description = locale === 'pt'
    ? 'Política de cookies da Blue Mind Magazine'
    : 'Cookie policy for Blue Mind Magazine';

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

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Legal.cookies');
  const lastUpdated = 'January 2026';

  // Generate JSON-LD schema for SEO
  const baseUrl = siteConfig.url;
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}` },
    { name: t('title'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}/cookies` },
  ];

  const schemas = [
    generateLegalPageSchema(locale, 'cookies', t('title'), '2026-01-01'),
    generateBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <article className="py-20 md:py-32">
      {/* JSON-LD Structured Data */}
      <JsonLd data={schemas} />
      <div className="container-narrow">
        {/* Header */}
        <header className="mb-12">
          <h1 className="headline text-4xl md:text-5xl mb-4">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('lastUpdated')}: {lastUpdated}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are stored on your computer or
              mobile device when you visit a website. They are widely used to
              make websites work more efficiently and provide information to the
              owners of the site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Blue Mind Magazine uses cookies for the following purposes:
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold mb-2">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies are necessary for the website to function and
                  cannot be switched off. They include cookies for remembering
                  your language preference and cookie consent choices.
                </p>
              </div>
              
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies help us understand how visitors interact with our
                  website by collecting and reporting information anonymously.
                  This helps us improve our content and user experience.
                </p>
              </div>
              
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold mb-2">Marketing Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies may be set by our advertising partners to build a
                  profile of your interests and show you relevant content on
                  other sites.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use services from the following third parties that may set
              cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Publuu:</strong> For our digital flipbook magazine viewer
              </li>
              <li>
                <strong>Beehiiv:</strong> For our newsletter subscription forms
              </li>
              <li>
                <strong>Vercel Analytics:</strong> For anonymous usage statistics
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can manage your cookie preferences at any time by clicking the
              cookie settings button in the footer of our website, or by
              adjusting your browser settings.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Most web browsers allow you to control cookies through their
              settings preferences. However, if you limit the ability of websites
              to set cookies, you may worsen your overall user experience, since
              it will no longer be personalized to you.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Cookie Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Session cookies are deleted when you close your browser. Persistent
              cookies remain on your device for a set period or until you delete
              them. Our essential cookies typically last for 1 year, while
              analytics cookies are retained for up to 2 years.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify
              you of any changes by posting the new Cookie Policy on this page
              and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about our use of cookies, please contact
              us at:{' '}
              <a
                href="mailto:info@bluemindmag.com"
                className="text-brand hover:underline"
              >
                info@bluemindmag.com
              </a>
            </p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/"
            className="text-brand hover:underline inline-flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </article>
  );
}

