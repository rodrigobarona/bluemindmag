import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// Force edge runtime for OG image generation
export const runtime = "edge";

// ============================================
// BLUE MIND MAGAZINE - OG IMAGE GENERATOR
// ============================================

// Brand colors
const BRAND_BLUE = "#0097B2";
const WARM_GOLDEN = "#D4A574";
const DARK_BG = "#1a1a1a";

// OG Image dimensions
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Badge label - consistent branding across all pages
const BADGE_LABEL = "FROM SURFER TO SURFER";

// Fallback images by page type
const FALLBACK_IMAGES: Record<string, string[]> = {
  home: [
    "/images/fallback/home-og-1.jpg",
    "/images/fallback/home-og-2.jpg",
    "/images/fallback/home-og-3.jpg",
    "/images/fallback/home-og-4.jpg",
    "/images/fallback/home-og-5.jpg",
    "/images/fallback/home-og-6.jpg",
  ],
  about: [
    "/images/fallback/about-og-1.jpg",
    "/images/fallback/about-og-2.jpg",
    "/images/fallback/about-og-3.jpg",
    "/images/fallback/about-og-4.jpg",
    "/images/fallback/about-og-5.jpg",
    "/images/fallback/about-og-6.jpg",
  ],
  contact: [
    "/images/fallback/contact-og-1.jpg",
    "/images/fallback/contact-og-2.jpg",
    "/images/fallback/contact-og-3.jpg",
    "/images/fallback/contact-og-4.jpg",
    "/images/fallback/contact-og-5.jpg",
    "/images/fallback/contact-og-6.jpg",
  ],
  newsletter: [
    "/images/fallback/newsletter-og-1.jpg",
    "/images/fallback/newsletter-og-2.jpg",
    "/images/fallback/newsletter-og-3.jpg",
    "/images/fallback/newsletter-og-4.jpg",
    "/images/fallback/newsletter-og-5.jpg",
    "/images/fallback/newsletter-og-6.jpg",
  ],
  issues: [
    "/images/fallback/issues-og-1.jpg",
    "/images/fallback/issues-og-2.jpg",
    "/images/fallback/issues-og-3.jpg",
    "/images/fallback/issues-og-4.jpg",
    "/images/fallback/issues-og-5.jpg",
    "/images/fallback/issues-og-6.jpg",
  ],
  legal: [
    "/images/fallback/legal-og-1.jpg",
    "/images/fallback/legal-og-2.jpg",
    "/images/fallback/legal-og-3.jpg",
    "/images/fallback/legal-og-4.jpg",
    "/images/fallback/legal-og-5.jpg",
    "/images/fallback/legal-og-6.jpg",
  ],
};

// ============================================
// SHARED STYLES
// ============================================

const styles = {
  container: {
    height: "100%",
    width: "100%",
    display: "flex" as const,
    flexDirection: "column" as const,
    position: "relative" as const,
  },

  backgroundImage: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },

  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)",
    display: "flex" as const,
  },

  header: {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: "40px 60px",
    position: "relative" as const,
  },

  content: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flex: 1,
    padding: "0 80px",
    position: "relative" as const,
  },

  footer: {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: "40px 60px",
    position: "relative" as const,
  },

  // Typography
  label: {
    fontFamily: "DM Sans",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 4,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 24,
    display: "flex" as const,
    textTransform: "uppercase" as const,
  },

  title: {
    fontFamily: "League Gothic",
    fontSize: 110,
    fontWeight: 400,
    color: "white",
    lineHeight: 0.95,
    marginBottom: 36,
    display: "flex" as const,
    textShadow: "0 6px 50px rgba(0,0,0,0.7), 0 2px 20px rgba(0,0,0,0.5)",
    textTransform: "uppercase" as const,
    letterSpacing: 6,
  },

  subtitle: {
    fontFamily: "DM Sans",
    fontSize: 36,
    color: "rgba(255,255,255,0.95)",
    marginBottom: 56,
    display: "flex" as const,
    textShadow: "0 3px 30px rgba(0,0,0,0.6)",
    fontWeight: 500,
  },

  accentLine: {
    width: 150,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 3,
    display: "flex" as const,
    boxShadow: "0 3px 15px rgba(0,0,0,0.4)",
  },

  footerText: {
    fontFamily: "DM Sans",
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    display: "flex" as const,
    textShadow: "0 2px 15px rgba(0,0,0,0.6)",
    fontWeight: 500,
  },

  badge: {
    display: "flex" as const,
    alignItems: "center" as const,
    padding: "10px 24px",
    borderRadius: 4,
  },

  badgeText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 3,
    color: "white",
    display: "flex" as const,
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getRandomImage(category: string): string {
  const images = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.home;
  return images[Math.floor(Math.random() * images.length)];
}

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;

  // Use older Safari User-Agent to force TTF format (Satori can't render woff2)
  const css = await (
    await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error(`Failed to load font: ${font}`);
}

async function loadFonts(text: string) {
  const [leagueGothic, dmSans, dmSansBold, cormorant] = await Promise.all([
    loadGoogleFont("League+Gothic", text),
    loadGoogleFont("DM+Sans", text),
    loadGoogleFont("DM+Sans:wght@700", text),
    loadGoogleFont("Cormorant+Garamond:ital@1", text),
  ]);

  return [
    {
      name: "League Gothic",
      data: leagueGothic,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "DM Sans",
      data: dmSans,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "DM Sans",
      data: dmSansBold,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Cormorant Garamond",
      data: cormorant,
      weight: 400 as const,
      style: "italic" as const,
    },
  ];
}

// ============================================
// SHARED COMPONENTS
// ============================================

function Background({ imageUrl }: { imageUrl: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="" style={styles.backgroundImage} />
      <div style={styles.overlay} />
    </>
  );
}

function Header({
  logoUrl,
  badge,
  badgeBgColor = "rgba(0,0,0,0.4)",
}: {
  logoUrl: string;
  badge: string;
  badgeBgColor?: string;
}) {
  return (
    <div style={styles.header}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          height={60}
          alt=""
          style={{ objectFit: "contain" }}
        />
      </div>
      <div style={{ ...styles.badge, backgroundColor: badgeBgColor }}>
        <div style={styles.badgeText}>{badge}</div>
      </div>
    </div>
  );
}

function Footer({ color = "rgba(255,255,255,0.7)" }: { color?: string }) {
  return (
    <div style={styles.footer}>
      <div style={{ ...styles.footerText, color }}>bluemindmag.com</div>
    </div>
  );
}

function AccentLine({ gradient = false }: { gradient?: boolean }) {
  const lineStyle = gradient
    ? {
        ...styles.accentLine,
        backgroundImage: `linear-gradient(90deg, ${BRAND_BLUE}, ${WARM_GOLDEN})`,
        backgroundColor: "transparent",
      }
    : styles.accentLine;
  return <div style={lineStyle} />;
}

// ============================================
// TEMPLATES
// ============================================

type FontsType = Awaited<ReturnType<typeof loadFonts>>;

interface BaseProps {
  displayTitle: string;
  displaySubtitle: string;
  logoUrl: string;
  fonts: FontsType;
}

// ─────────────────────────────────────────────
// STANDARD TEMPLATE - Used for most pages
// (home, about, contact, newsletter, issues)
// ─────────────────────────────────────────────

interface StandardTemplateProps extends BaseProps {
  backgroundUrl: string;
  badge: string;
}

function renderStandardTemplate({
  displayTitle,
  displaySubtitle,
  logoUrl,
  fonts,
  backgroundUrl,
  badge,
}: StandardTemplateProps) {
  return new ImageResponse(
    <div style={styles.container}>
      <Background imageUrl={backgroundUrl} />
      <Header logoUrl={logoUrl} badge={badge} />

      <div style={styles.content}>
        <div style={styles.label}>SURF SCIENCE MAGAZINE</div>
        <div style={styles.title}>{displayTitle}</div>
        <div style={styles.subtitle}>{displaySubtitle}</div>
        <AccentLine />
      </div>

      <Footer />
    </div>,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );
}

// ─────────────────────────────────────────────
// ISSUE TEMPLATE - Magazine cover layout
// ─────────────────────────────────────────────

interface IssueTemplateProps extends BaseProps {
  baseUrl: string;
  cover: string;
  accentColor: string;
  issueNumber?: string;
  date?: string;
  isReadMode: boolean;
}

function renderIssueTemplate({
  displayTitle,
  displaySubtitle,
  logoUrl,
  fonts,
  baseUrl,
  cover,
  accentColor,
  issueNumber,
  date,
  isReadMode,
}: IssueTemplateProps) {
  return new ImageResponse(
    <div
      style={{
        ...styles.container,
        flexDirection: "row",
        backgroundImage: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 450,
          height: 450,
          borderRadius: 225,
          backgroundColor: "white",
          opacity: 0.07,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: 80,
          width: 320,
          height: 320,
          borderRadius: 160,
          backgroundColor: "white",
          opacity: 0.05,
        }}
      />

      {/* Large issue number background */}
      {issueNumber && (
        <div
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 420,
            fontWeight: 900,
            color: "rgba(255,255,255,0.06)",
            lineHeight: 0.8,
            letterSpacing: -20,
            display: "flex",
          }}
        >
          {issueNumber.padStart(2, "0")}
        </div>
      )}

      {/* Left side - Text content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "50px 40px 50px 60px",
          width: "52%",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            height={90}
            alt=""
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Text content */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Metadata line */}
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
          >
            <div
              style={{
                width: 50,
                height: 4,
                backgroundColor: "rgba(255,255,255,0.7)",
                marginRight: 18,
                display: "flex",
              }}
            />
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 4,
                color: "rgba(255,255,255,0.9)",
                display: "flex",
              }}
            >
              {date?.toUpperCase() ||
                (isReadMode ? "READ NOW" : "BLUE MIND MAGAZINE")}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontFamily: "League Gothic",
              fontSize: displayTitle.length > 20 ? 64 : 72,
              fontWeight: 400,
              color: "white",
              lineHeight: 0.95,
              marginBottom: 16,
              display: "flex",
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {displayTitle}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontFamily: "DM Sans",
              fontSize: 30,
              color: "rgba(255,255,255,0.9)",
              marginBottom: 32,
              display: "flex",
              fontWeight: 500,
            }}
          >
            {displaySubtitle}
          </div>

          {/* Domain */}
          <div
            style={{
              fontFamily: "DM Sans",
              fontSize: 16,
              color: "rgba(255,255,255,0.6)",
              display: "flex",
              fontWeight: 500,
            }}
          >
            bluemindmag.com
          </div>
        </div>
      </div>

      {/* Right side - Magazine cover */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48%",
          position: "relative",
          padding: "0 60px 0 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            transform: "rotate(3deg)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${baseUrl}${cover}`}
            width={380}
            height={537}
            alt=""
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );
}

// ─────────────────────────────────────────────
// LEGAL TEMPLATE - Dark background, no image
// ─────────────────────────────────────────────

function renderLegalTemplate({
  displayTitle,
  displaySubtitle,
  logoUrl,
  fonts,
}: BaseProps) {
  return new ImageResponse(
    <div style={{ ...styles.container, backgroundColor: DARK_BG }}>
      {/* Decorative gradient overlays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 600,
          height: 600,
          backgroundImage: `radial-gradient(circle at 100% 0%, ${BRAND_BLUE}20 0%, transparent 50%)`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 500,
          height: 500,
          backgroundImage: `radial-gradient(circle at 0% 100%, ${WARM_GOLDEN}15 0%, transparent 50%)`,
          display: "flex",
        }}
      />

      <Header
        logoUrl={logoUrl}
        badge={BADGE_LABEL}
        badgeBgColor="rgba(255,255,255,0.1)"
      />

      <div style={styles.content}>
        <div
          style={{
            fontFamily: "League Gothic",
            fontSize: 76,
            fontWeight: 400,
            color: "white",
            lineHeight: 1,
            marginBottom: 28,
            display: "flex",
            textShadow: "0 4px 30px rgba(0,0,0,0.4)",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {displayTitle}
        </div>

        <div
          style={{
            fontFamily: "DM Sans",
            fontSize: 30,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 48,
            display: "flex",
            fontWeight: 500,
          }}
        >
          {displaySubtitle}
        </div>

        <AccentLine />
      </div>

      <Footer color="rgba(255,255,255,0.5)" />
    </div>,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );
}

// ─────────────────────────────────────────────
// ERROR FALLBACK
// ─────────────────────────────────────────────

function renderErrorFallback() {
  return new ImageResponse(
    <div
      style={{
        ...styles.container,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BRAND_BLUE,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "white",
          display: "flex",
        }}
      >
        BLUE MIND
      </div>
      <div
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.8)",
          display: "flex",
          marginTop: 16,
        }}
      >
        Surf Science Magazine
      </div>
    </div>,
    { width: OG_WIDTH, height: OG_HEIGHT },
  );
}

// ============================================
// MAIN HANDLER
// ============================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get("title") || "Blue Mind Magazine";
    const subtitle =
      searchParams.get("subtitle") || "Where surf and science meet";
    const type = searchParams.get("type") || "default";
    const cover = searchParams.get("cover");
    const accentColorParam = searchParams.get("accentColor");
    const issueNumber = searchParams.get("issueNumber") || undefined;
    const date = searchParams.get("date") || undefined;

    // Use request origin for local dev, canonical URL for production
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? request.nextUrl.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "https://bluemindmag.com";
    const logoUrl = `${baseUrl}/images/logo-white.png`;

    // Truncate text if too long
    const displayTitle =
      title.length > 45 ? title.substring(0, 42) + "..." : title;
    const displaySubtitle =
      subtitle.length > 55 ? subtitle.substring(0, 52) + "..." : subtitle;

    // Load fonts
    const fonts = await loadFonts(
      `${displayTitle}${displaySubtitle}BLUE MINDSURFSCIENCE MAGAZINE`,
    );

    const baseProps: BaseProps = {
      displayTitle,
      displaySubtitle,
      logoUrl,
      fonts,
    };

    // ─────────────────────────────────────────────
    // ROUTE TO TEMPLATE
    // ─────────────────────────────────────────────

    // Issue/Read - unique magazine cover layout
    if ((type === "issue" || type === "read") && cover) {
      return renderIssueTemplate({
        ...baseProps,
        baseUrl,
        cover,
        accentColor: accentColorParam || BRAND_BLUE,
        issueNumber,
        date,
        isReadMode: type === "read",
      });
    }

    // Legal - dark background, no image
    if (type === "legal") {
      return renderLegalTemplate(baseProps);
    }

    // Standard template for all other pages
    const category = type === "default" ? "home" : type;
    const backgroundUrl = `${baseUrl}${getRandomImage(category)}`;
    const badge = BADGE_LABEL;

    return renderStandardTemplate({
      ...baseProps,
      backgroundUrl,
      badge,
    });
  } catch (error) {
    console.error("[OG] Error generating image:", error);
    return renderErrorFallback();
  }
}
