import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconArrowRight,
  IconWaveSine,
} from "@tabler/icons-react";
import { SiteLayout } from "@/components/site-layout";
import { ContactForm } from "@/components/contact-form";
import { CalcomDialog } from "@/components/calcom-dialog";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { socialLinks, siteConfig } from "@/content/data/navigation";
import { getTeamMemberById } from "@/content/data/team";
import { getImageForSlot } from "@/lib/pexels";
import { generateBlurPlaceholder } from "@/lib/image-utils";
import { generateContactPageSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { getContactPageContent } from "@/lib/mdx";
import type { Locale } from "@/content/types/content";
import { getCanonicalUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = getContactPageContent(locale as Locale);

  const title = content?.title || "Contact";
  const description = content?.description || "";
  const heroLabel = content?.hero.label || "";

  const canonicalUrl = getCanonicalUrl();
  const pageUrl = `${canonicalUrl}${locale === 'pt' ? '/pt' : ''}/contact`;

  const ogImageUrl = `${canonicalUrl}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(heroLabel)}&type=contact`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Blue Mind Magazine`,
      description,
      url: pageUrl,
      siteName: 'Blue Mind Magazine',
      locale: locale === 'en' ? 'en_US' : 'pt_PT',
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Blue Mind Magazine`,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("Navigation");
  const content = getContactPageContent(locale as Locale);
  const editor = getTeamMemberById("pedro-seixas");

  // Fallback if content is not found
  if (!content) {
    throw new Error(`Contact page content not found for locale: ${locale}`);
  }

  // Fetch Pexels images using slot-based system (no repeats across pages)
  const [newsletterImage, heroImage] = await Promise.all([
    getImageForSlot('contact:newsletter'),
    getImageForSlot('contact:hero'),
  ]);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <IconBrandInstagram className="h-5 w-5" />;
      case "linkedin":
        return <IconBrandLinkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Generate JSON-LD schema for SEO
  const baseUrl = siteConfig.url;
  const breadcrumbItems = [
    { name: tNav('home'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}` },
    { name: tNav('contact'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}/contact` },
  ];
  
  const schemas = [
    generateContactPageSchema(locale),
    generateBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <SiteLayout newsletterImage={newsletterImage}>
      {/* JSON-LD Structured Data */}
      <JsonLd data={schemas} />

      {/* Hero Section - With background image */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background image */}
        {heroImage && (
          <>
            <Image
              src={heroImage.srcLarge || heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              placeholder={heroImage.blurDataURL || heroImage.avgColor ? 'blur' : 'empty'}
              blurDataURL={heroImage.blurDataURL || (heroImage.avgColor ? generateBlurPlaceholder(heroImage.avgColor) : undefined)}
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

            {/* Photo credit */}
            {heroImage.photographer && (
              <div className="absolute bottom-4 right-4 font-ui text-xs text-white/30 z-10">
                Photo:{" "}
                {heroImage.photographerUrl ? (
                  <a
                    href={heroImage.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/50 transition-colors"
                  >
                    {heroImage.photographer}
                  </a>
                ) : (
                  heroImage.photographer
                )}
                {" / Pexels"}
              </div>
            )}
          </>
        )}

        {/* Fallback gradient */}
        {!heroImage && <div className="absolute inset-0 bg-secondary" />}

        <div className="container-editorial relative z-10">
          <ScrollReveal className="max-w-3xl">
            <span
              className={`font-ui text-xs font-medium uppercase tracking-[0.3em] mb-4 block ${heroImage ? "text-white/70" : "text-brand"}`}
              style={
                heroImage
                  ? { textShadow: "0 1px 3px rgba(0,0,0,0.3)" }
                  : undefined
              }
            >
              {content.hero.label}
            </span>
            <h1
              className={`font-headline text-5xl md:text-7xl lg:text-8xl mb-6 text-balance ${heroImage ? "text-white" : ""}`}
              style={
                heroImage
                  ? { textShadow: "0 2px 8px rgba(0,0,0,0.3)" }
                  : undefined
              }
            >
              {content.hero.greeting}
            </h1>
            <p
              className={`font-body text-xl leading-relaxed text-balance ${heroImage ? "text-white/80" : "text-muted-foreground"}`}
              style={
                heroImage
                  ? { textShadow: "0 1px 3px rgba(0,0,0,0.2)" }
                  : undefined
              }
            >
              {content.hero.tagline}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Contact Form Section */}
            <div className="lg:col-span-7">
              {/* Form Header */}
              <div className="mb-10">
                <h2 className="font-headline text-3xl md:text-4xl mb-4 text-balance">
                  {content.ways.email.label}
                </h2>
                <p className="text-muted-foreground max-w-lg leading-relaxed text-balance">
                  {content.ways.email.description}
                </p>
              </div>

              {/* Form */}
              <ContactForm />
            </div>

            {/* Sidebar - Personal Touch */}
            <aside className="lg:col-span-5">
              {/* Personal Note from Pedro - Always visible at top */}
              <div className="relative pb-8 mb-8 border-b border-border">
                <div className="flex items-start gap-4 mb-6">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                      {editor?.image ? (
                        <Image
                          src={editor.image}
                          alt="Pedro Seixas"
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-headline text-xl">
                          PS
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-1">Pedro Seixas</p>
                    <p className="text-sm text-muted-foreground">
                      {content.founder.role}
                    </p>
                  </div>
                </div>

                <div className="pl-0">
                  <IconWaveSine className="h-8 w-8 text-brand/30 mb-3" />
                  <p className="font-accent italic text-muted-foreground leading-relaxed text-lg text-balance">
                    &ldquo;{content.founder.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Actions - Sticky section */}
              <div className="space-y-8">
                {/* Book a Chat */}
                <div>
                  <h3 className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-5">
                    {content.chat.label}
                  </h3>

                  <CalcomDialog
                    calcomUrl={content.links.calcom}
                    triggerLabel={content.chat.book}
                    triggerSubLabel={content.chat.duration}
                  />

                  <p className="text-sm text-muted-foreground mt-4">
                    {content.social.description}
                  </p>
                </div>

                {/* Connect on Social - Using address for semantic contact info */}
                <address className="pt-8 border-t border-border not-italic">
                  <h3 className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-5">
                    {content.social.follow}
                  </h3>

                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-muted/50 rounded-full hover:bg-brand hover:text-white transition-all"
                        aria-label={social.label}
                      >
                        {getSocialIcon(social.platform)}
                      </a>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground mt-4">
                    {content.social.followDescription}
                  </p>
                </address>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Want to Contribute - Full width section */}
      <section className="py-16 md:py-20 bg-brand/5 border-t border-brand/10">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-4 block">
              {content.contribute.title}
            </span>
            <h2 className="font-headline text-3xl md:text-4xl mb-4 text-balance">
              {content.contribute.description}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg text-balance">
              {content.contribute.guidelines}
            </p>
            <Link
              href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(content.contribute.emailSubject)}`}
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-ui text-sm font-medium transition-slow hover:bg-brand"
            >
              {content.contribute.cta}
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
