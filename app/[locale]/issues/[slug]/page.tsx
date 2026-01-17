import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ReadIssueButton } from "@/components/read-issue-button";
import { IssueCard } from "@/components/issue-card";
import { IssueCoverTilt } from "@/components/issue-cover-tilt";
import { getIssueBySlug, getAllIssues } from "@/content/data/issues";
import { getSponsorsByIds } from "@/content/data/sponsors";
import { issueTranslations as enIssueTranslations } from "@/content/i18n/en/issues";
import { issueTranslations as ptIssueTranslations } from "@/content/i18n/pt/issues";
import { getCtaImage } from "@/lib/pexels";

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

  // Fetch newsletter image for footer
  const newsletterImage = await getCtaImage();

  return (
    <SiteLayout newsletterImage={newsletterImage}>
      {/* Hero Section - With accent color background */}
      <section
        className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${issue.accentColor}25 0%, ${issue.accentColor}18 50%, ${issue.accentColor}08 100%)`,
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-60 blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 120% 100% at 15% 20%, ${issue.accentColor}40 0%, transparent 50%)`,
          }}
        />

        <div className="container-editorial relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Cover Image with 3D Tilt Effect */}
            <div className="relative flex justify-center lg:sticky lg:top-24 pt-8 pb-12">
              <IssueCoverTilt
                cover={issue.cover}
                title={translation.title}
                slug={issue.slug}
                accentColor={issue.accentColor}
                isCurrent={issue.isCurrent}
                currentLabel={t("current")}
              />
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
              <div className="flex flex-wrap items-center gap-6">
                <ReadIssueButton
                  issueSlug={issue.slug}
                  label={t("readIssue")}
                />
                <a
                  href="#features"
                  className="font-ui text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: issue.accentColor }}
                >
                  {locale === "pt" ? "Ver Conteúdo" : "Preview Issue"} ↓
                </a>
              </div>

              {/* Sections - styled with accent color */}
              <div className="mt-12 pt-8 border-t border-border/50">
                <p
                  className="font-ui text-xs font-medium uppercase tracking-wider mb-4"
                  style={{ color: issue.accentColor }}
                >
                  {t("sections")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {issue.sections.map((section) => (
                    <span
                      key={section}
                      className="px-3 py-1.5 font-ui text-sm border"
                      style={{
                        borderColor: `${issue.accentColor}40`,
                        backgroundColor: `${issue.accentColor}10`,
                      }}
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

      {/* Features/Highlights Section - Magazine editorial style */}
      <section id="features" className="py-20 md:py-28 border-t border-border">
        <div className="container-editorial">
          {/* Section Header */}
          <div className="mb-16 md:mb-20">
            <span
              className="font-ui text-xs font-medium uppercase tracking-[0.3em] mb-4 block"
              style={{ color: issue.accentColor }}
            >
              {locale === "pt" ? "Nesta Edição" : "In This Issue"}
            </span>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl">
              {t("features")}
            </h2>
          </div>

          {/* Feature Cards - Editorial magazine layout */}
          <div className="space-y-24 md:space-y-32">
            {issue.highlights.map((highlight, index) => {
              const highlightTranslation = translation.highlights[highlight.id];
              if (!highlightTranslation) return null;

              const isFirst = index === 0;
              const isEven = index % 2 === 0;

              // First article: Hero style full-width
              if (isFirst) {
                return (
                  <article key={highlight.id} className="group">
                    {/* Large hero image */}
                    <div className="relative mb-8 md:mb-12">
                      <div className="aspect-[21/9] md:aspect-[2.5/1] relative overflow-hidden">
                        <Image
                          src={highlight.image}
                          alt={highlightTranslation.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="100vw"
                        />
                        {/* Gradient overlay */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to top, ${issue.accentColor}90 0%, transparent 50%)`,
                          }}
                        />
                        {/* Page number badge */}
                        <div
                          className="absolute top-6 left-6 px-4 py-2 font-ui text-sm font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: issue.accentColor,
                            color: "#ffffff",
                          }}
                        >
                          {t("page")} {highlight.page}
                        </div>
                        {/* Title on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
                          <h3 className="font-headline text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-4">
                            {highlightTranslation.title}
                          </h3>
                          <p className="font-accent italic text-white/80 text-lg">
                            {t("by")} {highlightTranslation.author}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Excerpt below */}
                    <div className="max-w-3xl">
                      <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {highlightTranslation.excerpt}
                      </p>
                    </div>
                  </article>
                );
              }

              // Other articles: Side-by-side with large images
              return (
                <article
                  key={highlight.id}
                  className="group grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  {/* Image - larger, with hover effect */}
                  <div
                    className={`lg:col-span-7 ${isEven ? "" : "lg:order-2"}`}
                  >
                    <div className="relative overflow-hidden">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={highlight.image}
                          alt={highlightTranslation.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                      </div>
                      {/* Accent color frame on hover */}
                      <div
                        className="absolute inset-0 border-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ borderColor: issue.accentColor }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`lg:col-span-5 ${isEven ? "" : "lg:order-1"}`}
                  >
                    {/* Page Number with accent line */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="w-12 h-0.5"
                        style={{ backgroundColor: issue.accentColor }}
                      />
                      <p
                        className="font-ui text-sm font-medium uppercase tracking-widest"
                        style={{ color: issue.accentColor }}
                      >
                        {t("page")} {highlight.page}
                      </p>
                    </div>

                    {/* Title */}
                    <h3 className="font-headline text-2xl md:text-3xl lg:text-4xl mb-6 group-hover:text-foreground/80 transition-colors">
                      {highlightTranslation.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="font-body text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                      {highlightTranslation.excerpt}
                    </p>

                    {/* Author */}
                    <p className="font-accent italic text-muted-foreground">
                      {t("by")} {highlightTranslation.author}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Read CTA - Full-width accent banner with overflowing cover */}
      <section
        className="py-16 md:py-20 relative"
        style={{
          background: `linear-gradient(135deg, ${issue.accentColor} 0%, ${issue.accentColor}dd 100%)`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "#ffffff" }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl"
            style={{ background: "#ffffff" }}
          />
        </div>

        <div className="container-editorial relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="text-center lg:text-left">
              <span className="inline-block font-ui text-xs font-semibold uppercase tracking-[0.3em] text-white/70 mb-4">
                {locale === "pt" ? "Edição Completa" : "Full Issue"}
              </span>
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                {locale === "pt" ? "Comece a Ler" : "Start Reading"}
              </h2>
              <p className="font-body text-lg text-white/80 mb-10 max-w-md mx-auto lg:mx-0">
                {locale === "pt"
                  ? "Mergulhe na experiência completa desta edição. Artigos, entrevistas e muito mais esperam por si."
                  : "Dive into the complete experience of this issue. Articles, interviews, and more await you."}
              </p>
              <Link
                href={`/read/${issue.slug}`}
                className="inline-flex items-center gap-3 bg-white text-foreground px-8 py-4 font-ui text-sm font-medium transition-all hover:bg-white/90 hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                {t("readIssue")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Issue cover - overflowing at top with supporting number */}
            <div className="hidden lg:flex justify-center items-center relative">
              {/* Large issue number - peeking from behind cover */}
              <span
                className="absolute top-1/2 left-1/2 translate-x-16 xl:translate-x-24 -translate-y-1/3 font-headline text-[12rem] xl:text-[16rem] leading-none text-white/20 select-none pointer-events-none"
                style={{ letterSpacing: "-0.05em" }}
              >
                {String(issue.issueNumber).padStart(2, "0")}
              </span>

              {/* Floating cover */}
              <div className="relative -mt-24 transform rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
                <div className="absolute inset-0 bg-black/30 translate-x-6 translate-y-6 blur-2xl" />
                <div className="relative w-64 xl:w-80 shadow-2xl">
                  <div className="aspect-magazine-cover relative bg-muted overflow-hidden">
                    <Image
                      src={issue.cover}
                      alt={translation.title}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                </div>
              </div>
            </div>
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
