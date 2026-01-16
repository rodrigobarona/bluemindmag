import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Legal.privacy' });

  return {
    title: t('title'),
    description: 'Privacy policy for Blue Mind Magazine',
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Legal.privacy');
  const lastUpdated = 'January 2026';

  return (
    <article className="py-20 md:py-32">
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
            <h2 className="headline text-2xl mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Blue Mind Magazine (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our
              website bluemindmag.com.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect information about you in a variety of ways:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Personal Data:</strong> Name, email address, and any
                other information you provide when contacting us or subscribing
                to our newsletter.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our website, including pages visited, time spent, and
                referral sources.
              </li>
              <li>
                <strong>Cookies:</strong> Small data files stored on your device
                to enhance your browsing experience.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Send you our newsletter (if subscribed)</li>
              <li>Respond to your inquiries and messages</li>
              <li>Improve our website and content</li>
              <li>Analyze usage patterns and trends</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Newsletter (Beehiiv)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our newsletter is managed through Beehiiv. When you subscribe, your
              email address is stored and processed by Beehiiv according to their
              privacy policy. You can unsubscribe at any time by clicking the
              unsubscribe link in any newsletter email.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Beehiiv:</strong> Newsletter management and email delivery
              </li>
              <li>
                <strong>Publuu:</strong> Digital flipbook hosting for our magazine
              </li>
              <li>
                <strong>Resend:</strong> Contact form email delivery
              </li>
              <li>
                <strong>Vercel:</strong> Website hosting and analytics
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Your Rights (GDPR)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you are a resident of the European Economic Area (EEA), you have
              certain data protection rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>The right to access your personal data</li>
              <li>The right to rectification of inaccurate data</li>
              <li>The right to erasure (&quot;right to be forgotten&quot;)</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="headline text-2xl mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact
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

