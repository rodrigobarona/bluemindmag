import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/json-ld';
import { generateLegalPageSchema } from '@/lib/schema';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Legal.terms' });

  const title = t('title');
  const description = locale === 'pt'
    ? 'Termos de uso da Blue Mind Magazine'
    : 'Terms of use for Blue Mind Magazine';

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

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Legal.terms');
  const lastUpdated = 'January 2026';

  // Generate JSON-LD schema for SEO
  const termsSchema = generateLegalPageSchema(locale, 'terms', t('title'), '2026-01-01');

  return (
    <article className="py-20 md:py-32">
      {/* JSON-LD Structured Data */}
      <JsonLd data={termsSchema} />
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
            <h2 className="headline text-2xl mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Blue Mind Magazine&apos;s website
              (bluemindmag.com), you accept and agree to be bound by these Terms
              of Use. If you do not agree to these terms, please do not use our
              website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All content on this website, including but not limited to text,
              graphics, images, articles, and the Blue Mind Magazine brand, is
              the property of Blue Mind Magazine and Surfisio, and is protected
              by copyright and other intellectual property laws.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You may not reproduce, distribute, modify, or republish any content
              from this website without prior written permission from Blue Mind
              Magazine.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When using our website or services, you agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                Use the website for any unlawful purpose or in violation of any
                laws
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the website
              </li>
              <li>
                Interfere with or disrupt the website or servers
              </li>
              <li>
                Submit false or misleading information through our contact forms
              </li>
              <li>
                Use automated systems to access the website without permission
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Magazine Content</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The content in Blue Mind Magazine is provided for educational and
              informational purposes only. While we strive for accuracy:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                The information should not be considered medical advice
              </li>
              <li>
                Always consult with qualified professionals for health-related
                decisions
              </li>
              <li>
                Scientific information may be subject to updates and revisions
              </li>
              <li>
                Individual experiences described may not represent typical
                results
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may contain links to third-party websites. We are not
              responsible for the content, privacy policies, or practices of any
              third-party sites. We encourage you to review the terms and privacy
              policies of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              This website is provided &quot;as is&quot; without warranties of any kind,
              either express or implied. We do not warrant that the website will
              be uninterrupted, error-free, or free of viruses or other harmful
              components.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Blue Mind Magazine and Surfisio shall not be liable for any direct,
              indirect, incidental, consequential, or punitive damages arising
              from your use of or inability to use this website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms of Use at any time.
              Changes will be effective immediately upon posting to the website.
              Your continued use of the website after any changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Use shall be governed by and construed in accordance
              with the laws of Portugal, without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Use, please contact
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

