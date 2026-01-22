import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getBaseUrl } from "@/lib/utils";

// Force edge runtime for OG image generation
export const runtime = "edge";

// ============================================
// BLUE MIND MAGAZINE - OG IMAGE GENERATOR
// Brand colors and design system
// ============================================

// Brand colors from globals.css
const BRAND_BLUE = "#0097B2";
const WARM_GOLDEN = "#D4A574";
const DARK_BG = "#1a1a1a";

// Fallback images mapping by page type (local assets)
const FALLBACK_IMAGES: Record<string, string> = {
  home: "/images/fallback/ocean-aerial.jpg",
  about: "/images/fallback/ocean-aerial.jpg",
  contact: "/images/fallback/beach-golden-hour.jpg",
  newsletter: "/images/fallback/underwater-blue.jpg",
  issues: "/images/fallback/surfer-sunset.jpg",
  default: "/images/fallback/ocean-aerial.jpg",
};

// Load fonts once at module level (best practice for Satori performance)
// This caches the font data and prevents repeated parsing
const leagueGothicPromise = fetch(
  new URL("../../../public/fonts/LeagueGothic-Regular.woff", import.meta.url)
).then((res) => res.arrayBuffer());

const dmSansRegularPromise = fetch(
  new URL("../../../public/fonts/DMSans-Regular.woff", import.meta.url)
).then((res) => res.arrayBuffer());

const dmSansBoldPromise = fetch(
  new URL("../../../public/fonts/DMSans-Bold.woff", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request: NextRequest) {
  // Await font data
  const [leagueGothicData, dmSansRegularData, dmSansBoldData] =
    await Promise.all([
      leagueGothicPromise,
      dmSansRegularPromise,
      dmSansBoldPromise,
    ]);

  // Font configuration for ImageResponse (declared as global-like for performance)
  const fonts = [
    {
      name: "League Gothic",
      data: leagueGothicData,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "DM Sans",
      data: dmSansRegularData,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "DM Sans",
      data: dmSansBoldData,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];

  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get("title") || "Blue Mind Magazine";
    const subtitle =
      searchParams.get("subtitle") || "Where surf and science meet";
    const type = searchParams.get("type") || "default";
    const cover = searchParams.get("cover");
    const accentColorParam = searchParams.get("accentColor");
    const issueNumber = searchParams.get("issueNumber");

    const baseUrl = getBaseUrl();
    const logoUrl = `${baseUrl}/images/logo-white.png`; // Use white logo for better visibility

    // Use custom accent color if provided
    const accentColor = accentColorParam || BRAND_BLUE;

    // Truncate text if too long
    const displayTitle =
      title.length > 45 ? title.substring(0, 42) + "..." : title;
    const displaySubtitle =
      subtitle.length > 55 ? subtitle.substring(0, 52) + "..." : subtitle;

    // ============================================
    // ISSUE / READ TEMPLATE - Magazine Cover Style
    // ============================================
    if ((type === "issue" || type === "read") && cover) {
      return new ImageResponse(
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            backgroundImage: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
            position: "relative",
          }}
        >
          {/* Decorative circles for depth */}
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: 200,
              backgroundColor: "white",
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -80,
              left: -80,
              width: 300,
              height: 300,
              borderRadius: 150,
              backgroundColor: "white",
              opacity: 0.08,
            }}
          />

          {/* Large issue number - decorative background */}
          {issueNumber && (
            <div
              style={{
                position: "absolute",
                right: 60,
                bottom: 80,
                fontSize: 400,
                fontWeight: 900,
                color: "rgba(255,255,255,0.1)",
                lineHeight: 0.8,
                letterSpacing: -20,
                display: "flex",
              }}
            >
              {issueNumber.padStart(2, "0")}
            </div>
          )}

          {/* Magazine cover with shadow and rotation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 60,
              width: 340,
            }}
          >
            <div
              style={{
                display: "flex",
                transform: "rotate(-3deg)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${baseUrl}${cover}`}
                width={240}
                height={339}
                alt=""
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Content area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              padding: "60px 60px 60px 20px",
            }}
          >
            {/* Type label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 3,
                  backgroundColor: "rgba(255,255,255,0.6)",
                  marginRight: 16,
                  display: "flex",
                }}
              />
              <div
                style={{
                  fontFamily: "DM Sans",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: "rgba(255,255,255,0.8)",
                  display: "flex",
                }}
              >
                {type === "read" ? "READ NOW" : "BLUE MIND MAGAZINE"}
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontFamily: "League Gothic",
                fontSize: displayTitle.length > 20 ? 48 : 56,
                fontWeight: 400,
                color: "white",
                lineHeight: 1.1,
                marginBottom: 16,
                display: "flex",
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                textTransform: "uppercase",
              }}
            >
              {displayTitle}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 24,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 32,
                display: "flex",
              }}
            >
              {displaySubtitle}
            </div>

            {/* Bottom info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <div
                style={{
                  fontFamily: "DM Sans",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                }}
              >
                bluemindmag.com
              </div>
            </div>
          </div>
        </div>,
        {
          width: 1200,
          height: 630,
          fonts,
        },
      );
    }

    // ============================================
    // HOMEPAGE SPECIAL TEMPLATE - Matches hero design
    // ============================================
    if (type === "default" || type === "home") {
      const backgroundUrl = `${baseUrl}${FALLBACK_IMAGES.home}`;

      return new ImageResponse(
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundUrl}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Dark overlay for text readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
              display: "flex",
            }}
          />

          {/* Main content - centered like hero */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              position: "relative",
              padding: "0 80px",
            }}
          >
            {/* Surf Science label */}
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: 8,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 24,
                display: "flex",
                textTransform: "uppercase",
              }}
            >
              SURF SCIENCE
            </div>

            {/* BLUE MIND masthead - Large */}
            <div
              style={{
                fontFamily: "League Gothic",
                fontSize: 120,
                fontWeight: 400,
                color: "white",
                lineHeight: 1,
                marginBottom: 32,
                display: "flex",
                textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                letterSpacing: 8,
                textTransform: "uppercase",
              }}
            >
              BLUE MIND
            </div>

            {/* Tagline in quotes */}
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 28,
                fontWeight: 400,
                color: "rgba(255,255,255,0.9)",
                marginBottom: 48,
                display: "flex",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                fontStyle: "italic",
                maxWidth: 600,
                textAlign: "center",
              }}
            >
              &ldquo;{displaySubtitle}&rdquo;
            </div>

            {/* Accent line with brand gradient */}
            <div
              style={{
                width: 120,
                height: 5,
                backgroundImage: `linear-gradient(90deg, ${BRAND_BLUE}, ${WARM_GOLDEN})`,
                borderRadius: 3,
                display: "flex",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* Footer with domain */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 60px",
              position: "relative",
            }}
          >
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 16,
                color: "rgba(255,255,255,0.6)",
                display: "flex",
                textShadow: "0 1px 10px rgba(0,0,0,0.5)",
              }}
            >
              bluemindmag.com
            </div>
          </div>
        </div>,
        {
          width: 1200,
          height: 630,
          fonts,
        },
      );
    }

    // ============================================
    // TEMPLATE WITH LOCAL FALLBACK BACKGROUND IMAGE
    // ============================================
    // Use local fallback images for non-issue pages (legal pages excluded)
    if (type !== "legal") {
      const fallbackImage = FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
      const backgroundUrl = `${baseUrl}${fallbackImage}`;

      // Type label
      const getTypeLabel = () => {
        switch (type) {
          case "about":
            return "ABOUT US";
          case "newsletter":
            return "NEWSLETTER";
          case "contact":
            return "GET IN TOUCH";
          case "issues":
            return "MAGAZINE ARCHIVE";
          default:
            return "SURF SCIENCE";
        }
      };

      // Title font size based on length
      const titleFontSize =
        displayTitle.length > 25 ? 56 : displayTitle.length > 15 ? 68 : 80;

      // ============================================
      // NEWSLETTER SPECIAL TEMPLATE - Centered design
      // ============================================
      if (type === "newsletter") {
        return new ImageResponse(
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundUrl}
              alt=""
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Dark overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)",
                display: "flex",
              }}
            />

            {/* Top left logo and badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "40px 60px",
                position: "relative",
              }}
            >
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  height={60}
                  alt=""
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Type badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  padding: "10px 24px",
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: "DM Sans",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: "white",
                    display: "flex",
                  }}
                >
                  NEWSLETTER
                </div>
              </div>
            </div>

            {/* Main content - centered */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                padding: "0 80px",
                position: "relative",
              }}
            >
              {/* Optional: Magazine label */}
              <div
                style={{
                  fontFamily: "DM Sans",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: 4,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 24,
                  display: "flex",
                  textTransform: "uppercase",
                }}
              >
                SURF SCIENCE MAGAZINE
              </div>

              {/* Title - Bigger and more dramatic */}
              <div
                style={{
                  fontFamily: "League Gothic",
                  fontSize: 110,
                  fontWeight: 400,
                  color: "white",
                  lineHeight: 0.95,
                  marginBottom: 36,
                  display: "flex",
                  textShadow: "0 6px 50px rgba(0,0,0,0.7), 0 2px 20px rgba(0,0,0,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: 6,
                }}
              >
                {displayTitle}
              </div>

              {/* Subtitle - Larger and clearer */}
              <div
                style={{
                  fontFamily: "DM Sans",
                  fontSize: 36,
                  color: "rgba(255,255,255,0.95)",
                  marginBottom: 56,
                  display: "flex",
                  textShadow: "0 3px 30px rgba(0,0,0,0.6)",
                  fontWeight: 500,
                }}
              >
                {displaySubtitle}
              </div>

              {/* Accent line - Longer and thicker */}
              <div
                style={{
                  width: 150,
                  height: 6,
                  backgroundImage: `linear-gradient(90deg, ${BRAND_BLUE}, ${WARM_GOLDEN})`,
                  borderRadius: 3,
                  display: "flex",
                  boxShadow: "0 3px 15px rgba(0,0,0,0.4)",
                }}
              />
            </div>

            {/* Footer - More visible */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 60px",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "DM Sans",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                  display: "flex",
                  textShadow: "0 2px 15px rgba(0,0,0,0.6)",
                  fontWeight: 500,
                }}
              >
                bluemindmag.com
              </div>
            </div>
          </div>,
          {
            width: 1200,
            height: 630,
            fonts,
          },
        );
      }

      // ============================================
      // STANDARD TEMPLATE - For other pages
      // ============================================

      return new ImageResponse(
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Background image from local fallback */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundUrl}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Dark overlay for text readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)",
              display: "flex",
            }}
          />

          {/* Header with logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "40px 60px",
              position: "relative",
            }}
          >
            {/* Logo - Bigger */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                height={60}
                alt=""
                style={{
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Type badge - Bigger and white text */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
                padding: "10px 24px",
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  fontFamily: "DM Sans",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: "white",
                  display: "flex",
                }}
              >
                {getTypeLabel()}
              </div>
            </div>
          </div>

          {/* Main content - centered */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              padding: "0 80px",
              position: "relative",
            }}
          >
            {/* Magazine label - Consistent across all pages */}
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 4,
                color: "rgba(255,255,255,0.6)",
                marginBottom: 24,
                display: "flex",
                textTransform: "uppercase",
              }}
            >
              SURF SCIENCE MAGAZINE
            </div>

            {/* Title - Bigger */}
            <div
              style={{
                fontFamily: "League Gothic",
                fontSize: titleFontSize + 12,
                fontWeight: 400,
                color: "white",
                lineHeight: 0.95,
                marginBottom: 36,
                display: "flex",
                textShadow: "0 6px 50px rgba(0,0,0,0.7), 0 2px 20px rgba(0,0,0,0.5)",
                textTransform: "uppercase",
                letterSpacing: 6,
              }}
            >
              {displayTitle}
            </div>

            {/* Subtitle - Bigger */}
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 36,
                color: "rgba(255,255,255,0.95)",
                marginBottom: 56,
                display: "flex",
                textShadow: "0 3px 30px rgba(0,0,0,0.6)",
                fontWeight: 500,
              }}
            >
              {displaySubtitle}
            </div>

            {/* Accent line with brand gradient - Longer and thicker */}
            <div
              style={{
                width: 150,
                height: 6,
                backgroundImage: `linear-gradient(90deg, ${BRAND_BLUE}, ${WARM_GOLDEN})`,
                borderRadius: 3,
                display: "flex",
                boxShadow: "0 3px 15px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          {/* Footer - More visible */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 60px",
              position: "relative",
            }}
          >
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 18,
                color: "rgba(255,255,255,0.7)",
                display: "flex",
                textShadow: "0 2px 15px rgba(0,0,0,0.6)",
                fontWeight: 500,
              }}
            >
              bluemindmag.com
            </div>
          </div>
        </div>,
        {
          width: 1200,
          height: 630,
          fonts,
        },
      );
    }

    // ============================================
    // LEGAL PAGES TEMPLATE - Simple dark style (no image)
    // ============================================
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: DARK_BG,
          position: "relative",
        }}
      >
        {/* Decorative gradient overlay */}
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

        {/* Header with logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "40px 60px",
          }}
        >
          {/* Logo - Bigger */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              height={60}
              alt=""
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          {/* Type badge - Bigger and white text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: "10px 24px",
              borderRadius: 4,
            }}
          >
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 3,
                color: "white",
                display: "flex",
              }}
            >
              LEGAL
            </div>
          </div>
        </div>

        {/* Main content - centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "0 80px",
          }}
        >
          {/* Title - Bigger */}
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

          {/* Subtitle - Bigger */}
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

          {/* Accent line - Longer and thicker */}
          <div
            style={{
              width: 120,
              height: 5,
              backgroundImage: `linear-gradient(90deg, ${BRAND_BLUE}, ${WARM_GOLDEN})`,
              borderRadius: 2,
              display: "flex",
            }}
          />
        </div>

        {/* Footer - More visible */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px",
          }}
        >
          <div
            style={{
              fontFamily: "DM Sans",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              display: "flex",
              fontWeight: 500,
            }}
          >
            bluemindmag.com
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts,
      },
    );
  } catch (error) {
    console.error("OG Image generation error:", error);

    // Fallback - simple branded image
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: DARK_BG,
        }}
      >
        <div
          style={{
            fontFamily: "League Gothic",
            fontSize: 72,
            fontWeight: 400,
            color: BRAND_BLUE,
            marginBottom: 16,
            display: "flex",
            textTransform: "uppercase",
          }}
        >
          BLUE MIND
        </div>
        <div
          style={{
            fontFamily: "DM Sans",
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            display: "flex",
          }}
        >
          Surf Science Magazine
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts,
      },
    );
  }
}
