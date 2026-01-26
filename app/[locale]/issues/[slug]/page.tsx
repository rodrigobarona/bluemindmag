import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { IssueCard } from "@/components/issue-card";
import {
  IssueDetailHero,
  IssueDetailFeatures,
  IssueDetailCTA,
  MoreIssuesAnimated,
} from "@/components/issue-detail-animated";
import { JsonLd } from "@/components/json-ld";
import { getIssueBySlug, getAllIssues, getIssueTranslations } from "@/content/data/issues";
import type { Locale } from "@/content/types/content";
import { getCtaImage } from "@/lib/pexels";
import { siteConfig } from "@/content/data/navigation";
import { getCanonicalUrl } from "@/lib/utils";
import {
  generateIssueSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

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

  // Get translations from MDX (single source of truth)
  const issueTranslations = getIssueTranslations(locale as Locale);
  const translation = issueTranslations[issue.id];
  const canonicalUrl = getCanonicalUrl();
  const pageUrl = `${canonicalUrl}${locale === 'pt' ? '/pt' : ''}/issues/${slug}`;

  // Build OG image URL with issue-specific parameters
  // Use description as subtitle (tagline), and formatted subtitle as date display
  const ogParams = new URLSearchParams({
    title: translation.title,
    subtitle: translation.description, // Use description as the tagline
    type: 'issue',
    cover: issue.cover,
    accentColor: issue.accentColor,
    issueNumber: String(issue.issueNumber),
    date: translation.subtitle, // Use subtitle (e.g., "January 2026") as the formatted date
  });
  const ogImageUrl = `${canonicalUrl}/api/og?${ogParams.toString()}`;

  return {
    title: `${translation.title} - ${translation.subtitle}`,
    description: translation.description,
    openGraph: {
      title: `${translation.title} | Blue Mind Magazine`,
      description: translation.description,
      url: pageUrl,
      siteName: 'Blue Mind Magazine',
      locale: locale === 'en' ? 'en_US' : 'pt_PT',
      type: "article",
      publishedTime: issue.date,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: translation.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${translation.title} | Blue Mind Magazine`,
      description: translation.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: translation.title,
        },
      ],
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
  const tNav = await getTranslations("Navigation");
  const tCommon = await getTranslations("Common");
  
  // Get translations from MDX (single source of truth)
  const issueTranslations = getIssueTranslations(locale as Locale);
  const translation = issueTranslations[issue.id];

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
    previewIssue: t("previewIssue"),
    inThisIssue: t("inThisIssue"),
    fullIssue: t("fullIssue"),
    startReading: t("startReading"),
    exploreMore: t("exploreMore"),
  };

  // Generate JSON-LD schemas for SEO
  const baseUrl = siteConfig.url;
  const breadcrumbItems = [
    { name: tNav("home"), url: `${baseUrl}${locale === "pt" ? "/pt" : ""}` },
    { name: tNav("issues"), url: `${baseUrl}${locale === "pt" ? "/pt" : ""}/issues` },
    { name: translation.title, url: `${baseUrl}${locale === "pt" ? "/pt" : ""}/issues/${issue.slug}` },
  ];

  const schemas = [
    generateIssueSchema(issue, translation, locale),
    generateBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <SiteLayout newsletterImage={newsletterImage}>
      {/* JSON-LD Structured Data */}
      <JsonLd data={schemas} />

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

      {/* Animated More Issues Section */}
      {otherIssues.length > 0 && (
        <MoreIssuesAnimated
          issues={otherIssues}
          issueTranslations={issueTranslations}
          locale={locale}
          labels={{
            moreIssues: t("moreIssues"),
            viewAll: tCommon("viewAll"),
          }}
          IssueCard={IssueCard}
        />
      )}
    </SiteLayout>
  );
}
