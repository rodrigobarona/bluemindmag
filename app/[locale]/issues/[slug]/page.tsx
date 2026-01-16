import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
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
  const flipbookUrl = locale === "pt" ? issue.flipbook.pt : issue.flipbook.en;

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
            <div className="relative flex justify-center lg:sticky lg:top-32">
              <div className="relative w-full max-w-sm">
                {/* Cover */}
                <div className="aspect-magazine-cover relative overflow-hidden rounded shadow-editorial-lg">
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
                    className="absolute -top-3 -right-3 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg"
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
                className="text-sm font-medium uppercase tracking-widest mb-4"
                style={{ color: issue.accentColor }}
              >
                {translation.subtitle}
              </p>

              <h1 className="headline text-5xl md:text-6xl lg:text-7xl mb-6">
                {translation.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                {translation.description}
              </p>

              {/* Primary Action - Read Issue */}
              <ReadIssueButton
                flipbookUrl={flipbookUrl}
                issueTitle={translation.title}
                label={t("readIssue")}
              />

              {/* Sections */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                  {t("sections")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {issue.sections.map((section) => (
                    <span
                      key={section}
                      className="px-3 py-1.5 text-sm bg-muted rounded-full"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scroll indicator */}
              <div className="hidden lg:flex items-center gap-2 mt-16 text-muted-foreground">
                <ArrowDown className="w-4 h-4" />
                <span className="text-sm">{t("features")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Highlights Section - Surfer's Journal Style */}
      <section id="features" className="border-t border-border">
        {/* Section Header */}
        <div className="container-editorial py-8 md:py-12">
          <h2 className="headline text-3xl md:text-4xl">{t("features")}</h2>
        </div>

        {/* Full-width Feature Cards */}
        <div className="space-y-0">
          {issue.highlights.map((highlight) => {
            const highlightTranslation = translation.highlights[highlight.id];
            if (!highlightTranslation) return null;

            return (
              <article
                key={highlight.id}
                className="group relative w-full overflow-hidden"
              >
                {/* Full-width Image Container */}
                <div className="relative aspect-[2/1] md:aspect-[21/9] w-full">
                  <Image
                    src={highlight.image}
                    alt={highlightTranslation.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="100vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full p-6 md:p-10 lg:p-16">
                      <div className="max-w-4xl">
                        {/* Page Number */}
                        <p
                          className="text-sm font-medium uppercase tracking-widest mb-3"
                          style={{ color: issue.accentColor }}
                        >
                          {t("page")} {highlight.page}
                        </p>

                        {/* Title */}
                        <h3 className="headline text-2xl md:text-4xl lg:text-5xl text-white mb-4">
                          {highlightTranslation.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-white/80 text-base md:text-lg max-w-2xl mb-3 leading-relaxed">
                          {highlightTranslation.excerpt}
                        </p>

                        {/* Author */}
                        <p className="text-white/60 text-sm italic">
                          {t("by")} {highlightTranslation.author}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Read CTA - centered */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container-editorial">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="headline text-3xl md:text-4xl mb-6">
              {locale === "pt" ? "Pronto para ler?" : "Ready to read?"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {locale === "pt"
                ? "Abra a edição completa no nosso visualizador de flipbook imersivo."
                : "Open the full issue in our immersive flipbook viewer."}
            </p>
            <ReadIssueButton
              flipbookUrl={flipbookUrl}
              issueTitle={translation.title}
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
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                {t("supportedBy")}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {sponsors.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-50 hover:opacity-100 transition-fast grayscale hover:grayscale-0"
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
              <h2 className="headline text-2xl md:text-3xl">
                {locale === "pt" ? "Mais Edições" : "More Issues"}
              </h2>
              <Link
                href="/issues"
                className="text-sm font-medium text-muted-foreground hover:text-brand transition-fast flex items-center gap-1"
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
