import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ReadIssueButton } from "@/components/read-issue-button";
import { IssueCard } from "@/components/issue-card";
import { getIssueBySlug, getAllIssues } from "@/content/data/issues";
import { getSponsorsByIds } from "@/content/data/sponsors";
import { issueTranslations as enIssueTranslations } from "@/content/i18n/en/issues";
import { issueTranslations as ptIssueTranslations } from "@/content/i18n/pt/issues";

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
    return {
      title: "Issue Not Found",
    };
  }

  const issueTranslations =
    locale === "pt" ? ptIssueTranslations : enIssueTranslations;
  const translation = issueTranslations[issue.id];

  return {
    title: `${translation.title} - ${translation.subtitle}`,
    description: translation.description,
    openGraph: {
      title: `${translation.title} | Blue Mind Magazine`,
      description: translation.description,
      type: "article",
      publishedTime: issue.date,
    },
  };
}

export default async function IssueDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const issue = getIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  const t = await getTranslations("Issues");
  const tCommon = await getTranslations("Common");
  const issueTranslations =
    locale === "pt" ? ptIssueTranslations : enIssueTranslations;
  const translation = issueTranslations[issue.id];
  const sponsors = getSponsorsByIds(issue.sponsors);

  // Get other issues for "More Issues" section
  const allIssues = getAllIssues();
  const otherIssues = allIssues.filter((i) => i.id !== issue.id).slice(0, 3);

  return (
    <SiteLayout>
      {/* Hero Section - Clean and minimal */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Cover Image */}
            <div className="relative flex justify-center lg:sticky lg:top-24">
              <div className="relative w-full max-w-sm">
                {/* Cover */}
                <div className="aspect-magazine-cover relative overflow-hidden shadow-cover">
                  <Image
                    src={issue.cover}
                    alt={`${translation.title} cover`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Current issue badge */}
                {issue.isCurrent && (
                  <div
                    className="absolute -top-3 -right-3 px-4 py-1.5 font-ui text-xs font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: issue.accentColor,
                      color: "#ffffff",
                    }}
                  >
                    {t("current")}
                  </div>
                )}
              </div>
            </div>

            {/* Issue Info */}
            <div className="lg:py-8">
              <p
                className="font-ui text-sm font-medium uppercase tracking-widest mb-4"
                style={{ color: issue.accentColor }}
              >
                {translation.subtitle}
              </p>

              <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl mb-6">
                {translation.title}
              </h1>

              <p className="font-body text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                {translation.description}
              </p>

              {/* Primary Action - Read Issue */}
              <ReadIssueButton
                issueSlug={issue.slug}
                label={t("readIssue")}
              />

              {/* Sections */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="font-ui text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                  {t("sections")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {issue.sections.map((section) => (
                    <span
                      key={section}
                      className="px-3 py-1.5 font-ui text-sm bg-muted"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Highlights Section - Clean vertical flow */}
      <section id="features" className="border-t border-border">
        {/* Section Header */}
        <div className="container-editorial py-12">
          <h2 className="font-headline text-3xl md:text-4xl">{t("features")}</h2>
        </div>

        {/* Feature Cards - Clean layout without gradient overlays */}
        <div className="container-editorial pb-16">
          <div className="space-y-16">
            {issue.highlights.map((highlight, index) => {
              const highlightTranslation = translation.highlights[highlight.id];
              if (!highlightTranslation) return null;

              const isEven = index % 2 === 0;

              return (
                <article
                  key={highlight.id}
                  className={`grid md:grid-cols-2 gap-8 items-center ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Image */}
                  <div className={`${isEven ? "" : "md:order-2"}`}>
                    <div className="aspect-4/3 relative overflow-hidden shadow-editorial">
                      <Image
                        src={highlight.image}
                        alt={highlightTranslation.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${isEven ? "" : "md:order-1"}`}>
                    {/* Page Number */}
                    <p
                      className="font-ui text-sm font-medium uppercase tracking-widest mb-3"
                      style={{ color: issue.accentColor }}
                    >
                      {t("page")} {highlight.page}
                    </p>

                    {/* Title */}
                    <h3 className="font-headline text-2xl md:text-3xl lg:text-4xl mb-4">
                      {highlightTranslation.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="font-body text-muted-foreground text-base md:text-lg mb-4 leading-relaxed">
                      {highlightTranslation.excerpt}
                    </p>

                    {/* Author */}
                    <p className="font-accent italic text-muted-foreground text-sm">
                      {t("by")} {highlightTranslation.author}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Read CTA - centered */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container-editorial">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-4xl mb-6">
              {locale === "pt" ? "Pronto para ler?" : "Ready to read?"}
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              {locale === "pt"
                ? "Abra a edição completa no nosso visualizador de flipbook imersivo."
                : "Open the full issue in our immersive flipbook viewer."}
            </p>
            <ReadIssueButton
              issueSlug={issue.slug}
              label={t("readIssue")}
            />
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      {sponsors.length > 0 && (
        <section className="py-12 border-t border-border">
          <div className="container-editorial">
            <div className="text-center">
              <p className="font-ui text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                {t("supportedBy")}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {sponsors.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-50 hover:opacity-100 transition-base grayscale hover:grayscale-0"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={120}
                      height={48}
                      className="h-10 w-auto object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* More Issues */}
      {otherIssues.length > 0 && (
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container-editorial">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-headline text-2xl md:text-3xl">
                {locale === "pt" ? "Mais Edições" : "More Issues"}
              </h2>
              <Link
                href="/issues"
                className="font-ui text-sm font-medium text-muted-foreground hover:text-brand transition-base flex items-center gap-1"
              >
                {tCommon("viewAll")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {otherIssues.map((otherIssue) => (
                <IssueCard
                  key={otherIssue.id}
                  issue={otherIssue}
                  translation={issueTranslations[otherIssue.id]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
