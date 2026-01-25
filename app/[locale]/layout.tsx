import type { Metadata } from "next";

import { Suspense } from "react";
import {
  League_Gothic,
  Source_Serif_4,
  DM_Sans,
  Cormorant_Garamond,
} from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ConsentManager from "@/components/consent-manager";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { getBaseUrl, getCanonicalUrl } from "@/lib/utils";
import "../globals.css";

// Display/Headlines - Condensed bold for masthead and titles
const leagueGothic = League_Gothic({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
  weight: ["400"],
});

// Body text - Editorial serif for long-form content
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// UI/Labels - Clean modern sans for navigation and buttons
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Accent/Quotes - Elegant italic for taglines and pull quotes
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  // Use canonical URL for SEO (always production domain)
  const canonicalUrl = getCanonicalUrl();

  // OG image URL - always use canonical URL for stable social media sharing
  const ogImageUrl = `${canonicalUrl}/api/og?title=${encodeURIComponent("Blue Mind")}&subtitle=${encodeURIComponent(locale === "en" ? "From surfers, to surfers" : "De surfistas, para surfistas")}&type=home`;

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    metadataBase: new URL(canonicalUrl),
    alternates: {
      canonical: locale === "en" ? canonicalUrl : `${canonicalUrl}/pt`,
      languages: {
        en: canonicalUrl,
        pt: `${canonicalUrl}/pt`,
      },
      types: {
        "application/rss+xml": `${canonicalUrl}/feed.xml`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
      siteName: "Blue Mind Magazine",
      locale: locale === "en" ? "en_US" : "pt_PT",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Blue Mind Magazine - Surf Science Publication",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Blue Mind Magazine - Surf Science Publication",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/bluemind-avatar.png", type: "image/png", sizes: "839x839" },
      ],
      apple: [
        { url: "/bluemind-avatar.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
    },
    manifest: "/manifest.json",
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${leagueGothic.variable} ${sourceSerif.variable} ${dmSans.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* DNS prefetch for external resources - improves LCP */}
        <link rel="dns-prefetch" href="//images.pexels.com" />
        <link
          rel="preconnect"
          href="https://images.pexels.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
        <ThemeProvider>
          <NextIntlClientProvider>
            <Suspense fallback={null}>
              <ConsentManager locale={locale}>{children}</ConsentManager>
            </Suspense>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
