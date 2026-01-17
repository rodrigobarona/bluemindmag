import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { IssueCard } from "@/components/issue-card";
import { SponsorsCarousel } from "@/components/sponsors-carousel";
import {
  IssueDetailHero,
  IssueDetailFeatures,
  IssueDetailCTA,
  MoreIssuesAnimated,
} from "@/components/issue-detail-animated";
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

  // Labels for animated components
  const labels = {
    readIssue: t("readIssue"),
    sections: t("sections"),
    features: t("features"),
    page: t("page"),
    by: t("by"),
    current: t("current"),
  };

  return (
    <SiteLayout newsletterImage={newsletterImage}>
      {/* Animated Hero Section */}
      <IssueDetailHero
        issue={issue}
        translation={translation}
        locale={locale}
        labels={labels}
      />

      {/* Animated Features Section */}
      <IssueDetailFeatures
        issue={issue}
        translation={translation}
        locale={locale}
        labels={labels}
      />

      {/* Animated CTA Section */}
      <IssueDetailCTA
        issue={issue}
        translation={translation}
        locale={locale}
        labels={labels}
      />

      {/* Sponsors Section - Carousel */}
      {sponsors.length > 0 && (
        <section className="py-16 md:py-20 border-t border-border overflow-hidden">
          <div className="container-editorial">
            <SponsorsCarousel
              sponsors={sponsors}
              title={locale === "pt" ? "Apoiado Por" : "Supported By"}
            />
          </div>
        </section>
      )}

      {/* Animated More Issues Section */}
      {otherIssues.length > 0 && (
        <MoreIssuesAnimated
          issues={otherIssues}
          issueTranslations={issueTranslations}
          locale={locale}
          labels={{
            moreIssues: locale === "pt" ? "Mais Edições" : "More Issues",
            viewAll: tCommon("viewAll"),
          }}
          IssueCard={IssueCard}
        />
      )}
    </SiteLayout>
  );
}
