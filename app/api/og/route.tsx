import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getCanonicalUrl } from "@/lib/utils";

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

// Fallback images mapping by page type (6 images per category for random variety!)
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

// Get random image from category
function getRandomImage(category: keyof typeof FALLBACK_IMAGES): string {
  const images = FALLBACK_IMAGES[category];
  if (!images || images.length === 0) {
    // #region agent log
    console.warn('[OG-DEBUG] No images for category, using fallback:', { category });
    // #endregion
    return FALLBACK_IMAGES.home[0]; // Fallback to first home image
  }
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];
  // #region agent log
  console.log('[OG-DEBUG] Random image selected:', { category, index: randomIndex, path: selectedImage });
  // #endregion
  return selectedImage;
}

// ============================================
// FONT LOADING - Google Fonts Pattern
// Following Vercel's recommended approach for loading fonts
// ============================================

async function loadGoogleFont(font: string, text: string) {
  // #region agent log
  console.log('[OG-DEBUG] Loading font:', { font, textLength: text.length, timestamp: Date.now() });
  // #endregion
  
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  
  try {
    const cssResponse = await fetch(url);
    // #region agent log
    console.log('[OG-DEBUG] Font CSS fetch:', { font, status: cssResponse.status, ok: cssResponse.ok });
    // #endregion
    
    const css = await cssResponse.text();
    const resource = css.match(
      /src: url\((.+)\) format\('(opentype|truetype)'\)/,
    );

    if (resource) {
      // #region agent log
      console.log('[OG-DEBUG] Font TTF URL found:', { font, url: resource[1].substring(0, 80) });
      // #endregion
      
      const response = await fetch(resource[1]);
      if (response.status == 200) {
        const buffer = await response.arrayBuffer();
        // #region agent log
        console.log('[OG-DEBUG] Font loaded successfully:', { font, size: buffer.byteLength });
        // #endregion
        return buffer;
      }
    }

    throw new Error("failed to load font data");
  } catch (error) {
    // #region agent log
    console.error('[OG-DEBUG] Font loading failed:', { font, error: error instanceof Error ? error.message : 'unknown' });
    // #endregion
    throw error;
  }
}

export async function GET(request: NextRequest) {
  // #region agent log
  console.log('[OG-DEBUG] === OG Image Request Started ===', { 
    timestamp: Date.now(),
    url: request.url,
    userAgent: request.headers.get('user-agent')?.substring(0, 100)
  });
  // #endregion
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get("title") || "Blue Mind Magazine";
    const subtitle =
      searchParams.get("subtitle") || "Where surf and science meet";
    const type = searchParams.get("type") || "default";
    const cover = searchParams.get("cover");
    const accentColorParam = searchParams.get("accentColor");
    const issueNumber = searchParams.get("issueNumber");
    const date = searchParams.get("date");

    // #region agent log
    console.log('[OG-DEBUG] Request params:', { title, subtitle, type, cover, issueNumber, date });
    // #endregion

    // Use canonical URL for OG images so social media crawlers can always access them
    const baseUrl = getCanonicalUrl();
    const logoUrl = `${baseUrl}/images/logo-white.png`;
    const accentColor = accentColorParam || BRAND_BLUE;
    
    // #region agent log
    console.log('[OG-DEBUG] Using base URL:', { baseUrl });
    // #endregion

    // Truncate text if too long
    const displayTitle =
      title.length > 45 ? title.substring(0, 42) + "..." : title;
    const displaySubtitle =
      subtitle.length > 55 ? subtitle.substring(0, 52) + "..." : subtitle;

    // Load fonts dynamically based on the text being rendered
    // This is more efficient than loading all fonts upfront
    // Using the EXACT same fonts as in layout.tsx:
    // - League Gothic for headlines (--font-headline)
    // - DM Sans for UI/labels (--font-ui)
    // - Cormorant Garamond for taglines (--font-accent)
    const allText = `${displayTitle}${displaySubtitle}BLUE MIND`;

    // #region agent log
    console.log('[OG-DEBUG] Starting font loads...', { textLength: allText.length });
    // #endregion

    const [leagueGothicData, dmSansData, dmSansBoldData, cormorantData] =
      await Promise.all([
        loadGoogleFont("League+Gothic", allText),
        loadGoogleFont("DM+Sans", allText),
        loadGoogleFont("DM+Sans:wght@700", allText),
        loadGoogleFont("Cormorant+Garamond:ital@1", allText), // Italic for taglines
      ]);

    // #region agent log
    console.log('[OG-DEBUG] All fonts loaded:', { 
      leagueGothic: leagueGothicData.byteLength,
      dmSans: dmSansData.byteLength,
      dmSansBold: dmSansBoldData.byteLength,
      cormorant: cormorantData.byteLength
    });
    // #endregion

    const fonts = [
      {
        name: "League Gothic",
        data: leagueGothicData,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "DM Sans",
        data: dmSansData,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "DM Sans",
        data: dmSansBoldData,
        weight: 700 as const,
        style: "normal" as const,
      },
      {
        name: "Cormorant Garamond",
        data: cormorantData,
        weight: 400 as const,
        style: "italic" as const,
      },
    ];

    // ============================================
    // ISSUE / READ TEMPLATE - Magazine Cover Hero
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
          {/* Decorative circles on RIGHT to support the cover */}
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

          {/* Large issue number on RIGHT behind cover */}
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
            {/* Top: BIG Logo */}
            <div style={{ display: "flex" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                height={90}
                alt=""
                style={{
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Bottom: Text content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Issue metadata line */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 24,
                }}
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
                  {date
                    ? date.toUpperCase()
                    : type === "read"
                      ? "READ NOW"
                      : "BLUE MIND MAGAZINE"}
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

              {/* Subtitle/Description */}
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

          {/* Right side - Magazine cover with breathing room */}
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
                style={{
                  objectFit: "cover",
                }}
              />
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
      const backgroundUrl = `${baseUrl}${getRandomImage("home")}`;
      
      // #region agent log
      console.log('[OG-DEBUG] Creating home template ImageResponse:', { 
        backgroundUrl, 
        displayTitle, 
        displaySubtitle,
        usingCanonicalUrl: true 
      });
      // #endregion

      const imageResponse = new ImageResponse(
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

          {/* Dark overlay for text readability - DARKER for better contrast */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.75) 100%)",
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
            {/* Surf Science label - MUCH BIGGER to balance headline */}
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 12,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 36,
                display: "flex",
                textTransform: "uppercase",
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              }}
            >
              SURF SCIENCE MAGAZINE
            </div>

            {/* BLUE MIND masthead - MASSIVE with TIGHT letter spacing like hero */}
            <div
              style={{
                fontFamily: "League Gothic",
                fontSize: 240,
                fontWeight: 400,
                color: "white",
                lineHeight: 0.85,
                marginBottom: 44,
                display: "flex",
                textShadow:
                  "0 6px 50px rgba(0,0,0,0.9), 0 3px 30px rgba(0,0,0,0.7)",
                letterSpacing: -4,
                textTransform: "uppercase",
              }}
            >
              BLUE MIND
            </div>

            {/* Tagline in quotes - MUCH BIGGER for better balance */}
            <div
              style={{
                fontFamily: "Cormorant Garamond",
                fontSize: 46,
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.95)",
                marginBottom: 0,
                display: "flex",
                textShadow: "0 4px 30px rgba(0,0,0,0.8)",
                maxWidth: 800,
                textAlign: "center",
                letterSpacing: "0.03em",
              }}
            >
              &ldquo;{displaySubtitle}&rdquo;
            </div>
          </div>

          {/* Footer with domain - minimal */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 60px",
              position: "relative",
            }}
          >
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 20,
                color: "rgba(255,255,255,0.7)",
                display: "flex",
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
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
      
      // #region agent log
      console.log('[OG-DEBUG] Home template ImageResponse created, returning');
      // #endregion
      
      return imageResponse;
    }

    // ============================================
    // TEMPLATE WITH LOCAL FALLBACK BACKGROUND IMAGE
    // ============================================
    // Use local fallback images for non-issue pages (legal pages excluded)
    if (type !== "legal") {
      const categoryKey = (type === "default" ? "home" : type) as keyof typeof FALLBACK_IMAGES;
      const fallbackImage = getRandomImage(categoryKey);
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
                  textShadow:
                    "0 6px 50px rgba(0,0,0,0.7), 0 2px 20px rgba(0,0,0,0.5)",
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

              {/* Accent line - Clean white */}
              <div
                style={{
                  width: 150,
                  height: 6,
                  backgroundColor: "rgba(255,255,255,0.9)",
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
        
        // #region agent log
        console.log('[OG-DEBUG] Old generic template (should not reach) ImageResponse created');
        // #endregion
        
        return oldGenericResponse;
      }

      // ============================================
      // STANDARD TEMPLATE - For other pages
      // ============================================
      
      // #region agent log
      console.log('[OG-DEBUG] Creating generic template ImageResponse:', { type, backgroundUrl });
      // #endregion

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

          {/* Dark overlay for text readability - DARKER for better contrast */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.75) 100%)",
              display: "flex",
            }}
          />

          {/* No header - cleaner like homepage */}

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
            {/* Magazine label - MUCH BIGGER to balance headline */}
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 12,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 36,
                display: "flex",
                textTransform: "uppercase",
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              }}
            >
              SURF SCIENCE MAGAZINE
            </div>

            {/* Title - MASSIVE with TIGHT letter spacing like hero */}
            <div
              style={{
                fontFamily: "League Gothic",
                fontSize: 240,
                fontWeight: 400,
                color: "white",
                lineHeight: 0.85,
                marginBottom: 44,
                display: "flex",
                textShadow:
                  "0 6px 50px rgba(0,0,0,0.9), 0 3px 30px rgba(0,0,0,0.7)",
                letterSpacing: -4,
                textTransform: "uppercase",
              }}
            >
              {displayTitle}
            </div>

            {/* Subtitle - MUCH BIGGER with italic font */}
            <div
              style={{
                fontFamily: "Cormorant Garamond",
                fontSize: 46,
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.95)",
                marginBottom: 0,
                display: "flex",
                textShadow: "0 4px 30px rgba(0,0,0,0.8)",
                maxWidth: 800,
                textAlign: "center",
                letterSpacing: "0.03em",
              }}
            >
              &ldquo;{displaySubtitle}&rdquo;
            </div>
          </div>

          {/* Footer - More visible */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 60px",
              position: "relative",
            }}
          >
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: 20,
                color: "rgba(255,255,255,0.7)",
                display: "flex",
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
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
    
    // #region agent log
    console.log('[OG-DEBUG] Creating legal template ImageResponse');
    // #endregion
    
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
    // #region agent log
    console.error('[OG-DEBUG] === OG Image Generation ERROR ===', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: Date.now()
    });
    // #endregion

    // Return a simple fallback image on error
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0097B2",
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
      {
        width: 1200,
        height: 630,
      },
    );
  }
}
