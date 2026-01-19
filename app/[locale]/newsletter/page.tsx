import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  IconMail,
  IconWaveSine,
  IconSparkles,
  IconEye,
  IconUsers,
  IconClock,
} from "@tabler/icons-react";
import { SiteLayout } from "@/components/site-layout";
import { NewsletterForm } from "@/components/newsletter-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { getImageForSlot } from "@/lib/pexels";
import { generateBlurPlaceholder } from "@/lib/image-utils";
import { getTeamMemberById } from "@/content/data/team";
import { generateNewsletterPageSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/content/data/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Newsletter" });

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Blue Mind Magazine`,
      description,
      type: "website",
      images: [`/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(t("freeNewsletter"))}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Blue Mind Magazine`,
      description,
    },
  };
}

export default async function NewsletterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Newsletter");
  const tNav = await getTranslations("Navigation");
  const tCommon = await getTranslations("Common");
  const editor = getTeamMemberById("pedro-seixas");

  // Fetch Pexels images using slot-based system (no repeats across pages)
  const [newsletterImage, heroImage] = await Promise.all([
    getImageForSlot('newsletter:newsletter'),
    getImageForSlot('newsletter:hero'),
  ]);

  // Generate JSON-LD schema for SEO
  const title = t("title");
  const description = t("subtitle");
  
  const baseUrl = siteConfig.url;
  const breadcrumbItems = [
    { name: tNav('home'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}` },
    { name: tNav('newsletter'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}/newsletter` },
  ];

  const schemas = [
    generateNewsletterPageSchema(locale, title, description),
    generateBreadcrumbSchema(breadcrumbItems),
  ];

  const features = [
    {
      icon: IconSparkles,
      title: t("benefits.newIssues.title"),
      description: t("benefits.newIssues.description"),
    },
    {
      icon: IconEye,
      title: t("benefits.exclusive.title"),
      description: t("benefits.exclusive.description"),
    },
    {
      icon: IconUsers,
      title: t("benefits.community.title"),
      description: t("benefits.community.description"),
    },
    {
      icon: IconClock,
      title: t("benefits.earlyAccess.title"),
      description: t("benefits.earlyAccess.description"),
    },
  ];

  return (
    <SiteLayout newsletterImage={newsletterImage}>
      {/* JSON-LD Structured Data */}
      <JsonLd data={schemas} />

      {/* Hero Section - With background image */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

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
        {!heroImage && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, var(--brand) 0%, var(--background) 70%)",
              opacity: 0.15,
            }}
          />
        )}

        <div className="container-editorial relative z-10">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-ui text-sm font-medium mb-8 ${
                heroImage
                  ? "bg-white/10 backdrop-blur-sm text-white border border-white/20"
                  : "bg-brand/10 text-brand"
              }`}
            >
              <IconMail className="h-4 w-4" />
              {t("freeNewsletter")}
            </div>

            <h1
              className={`font-headline text-5xl md:text-7xl lg:text-8xl mb-6 ${heroImage ? "text-white" : ""}`}
              style={
                heroImage
                  ? { textShadow: "0 2px 8px rgba(0,0,0,0.3)" }
                  : undefined
              }
            >
              {t("title")}
            </h1>

            <p
              className={`font-accent text-xl md:text-2xl italic mb-4 ${heroImage ? "text-white/90" : "text-muted-foreground"}`}
              style={
                heroImage
                  ? { textShadow: "0 1px 4px rgba(0,0,0,0.2)" }
                  : undefined
              }
            >
              {t("subtitle")}
            </p>

            <p
              className={`text-lg max-w-xl mx-auto mb-10 ${heroImage ? "text-white/70" : "text-muted-foreground"}`}
              style={
                heroImage
                  ? { textShadow: "0 1px 3px rgba(0,0,0,0.2)" }
                  : undefined
              }
            >
              {t("description")}
            </p>

            {/* Newsletter Form */}
            <div className="max-w-md mx-auto">
              <NewsletterForm variant="hero" />
            </div>

            <p
              className={`text-sm mt-6 ${heroImage ? "text-white/50" : "text-muted-foreground"}`}
            >
              {t("privacyNote")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Personal Note from Pedro */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Avatar */}
                <div className="shrink-0 mx-auto md:mx-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                    {editor?.image ? (
                      <Image
                        src={editor.image}
                        alt="Pedro Seixas"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-headline text-2xl">
                        PS
                      </div>
                    )}
                  </div>
                </div>

                {/* Quote */}
                <div className="text-center md:text-left">
                  <IconWaveSine className="h-10 w-10 text-brand/30 mb-4 mx-auto md:mx-0" />
                  <p className="font-accent italic text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6">
                    {t("description")}
                  </p>
                  <div>
                    <p className="font-medium text-lg">Pedro Seixas</p>
                    <p className="text-sm text-muted-foreground">
                      {t("founder.role")}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container-editorial">
          <ScrollReveal className="text-center mb-16">
            <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-4 block">
              {t("whatYouGet")}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl">
              {t("features.title")}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="group p-8 bg-muted/30 border border-border hover:border-brand/30 hover:bg-brand/5 transition-all duration-300">
                  <div className="p-3 bg-brand/10 rounded-xl w-fit mb-5 group-hover:bg-brand/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="font-headline text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section className="py-16 bg-foreground text-background">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
            <ScrollReveal delay={0}>
              <div>
                <p className="font-headline text-4xl md:text-5xl mb-2">100%</p>
                <p className="text-background/60 text-sm uppercase tracking-wider">
                  {tCommon("free")}
                </p>
              </div>
            </ScrollReveal>
            <div className="hidden md:block w-px h-16 bg-background/20" />
            <ScrollReveal delay={0.1}>
              <div>
                <p className="font-headline text-4xl md:text-5xl mb-2">2x</p>
                <p className="text-background/60 text-sm uppercase tracking-wider">
                  {tCommon("perMonth")}
                </p>
              </div>
            </ScrollReveal>
            <div className="hidden md:block w-px h-16 bg-background/20" />
            <ScrollReveal delay={0.2}>
              <div>
                <p className="font-headline text-4xl md:text-5xl mb-2">0</p>
                <p className="text-background/60 text-sm uppercase tracking-wider">
                  {tCommon("spam")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Cross-sell to Magazine */}
      <section className="py-20 md:py-28 bg-brand/5 border-t border-brand/10">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-4 block">
                {t("notSure.title")}
              </span>
              <h2 className="font-headline text-4xl md:text-5xl mb-6">
                {t("readFirst.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
                {t("notSure.description")}
              </p>

              <Link
                href="/issues"
                className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-ui text-sm font-medium transition-slow hover:bg-brand"
              >
                {t("notSure.cta")}
                <span>→</span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
