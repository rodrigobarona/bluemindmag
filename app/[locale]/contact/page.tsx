import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import {
  IconMail,
  IconBrandInstagram,
  IconBrandLinkedin,
} from '@tabler/icons-react';
import { SiteLayout } from '@/components/site-layout';
import { ContactForm } from '@/components/contact-form';
import { socialLinks, siteConfig } from '@/content/data/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Contact');

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <IconBrandInstagram className="h-5 w-5" />;
      case 'linkedin':
        return <IconBrandLinkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };

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

      {/* Contact Content */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="lg:pl-8">
              <div className="sticky top-24 space-y-8">
                {/* Email */}
                <div className="p-6 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brand/10 rounded-full">
                      <IconMail className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-brand hover:underline"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('info.response')}
                  </p>
                </div>

                {/* Social Links */}
                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-background border border-border rounded-full hover:bg-foreground/5 hover:border-brand transition-colors"
                        aria-label={social.label}
                      >
                        {getSocialIcon(social.platform)}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="p-6 bg-brand/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Want to contribute?</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;re always looking for researchers, writers, and
                    surfers who want to share their stories. Send us a message
                    with your ideas!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

