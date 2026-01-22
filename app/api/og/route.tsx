import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// ============================================
// BLUE MIND MAGAZINE - OG IMAGE GENERATOR
// Brand colors and design system
// ============================================

// Brand colors from globals.css
const BRAND_BLUE = '#0097B2';
const WARM_GOLDEN = '#D4A574';
const DARK_BG = '#1a1a1a';
const LIGHT_BG = '#faf8f5';

// Base URL for assets
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://bluemindmag.com';
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get('title') || 'Blue Mind Magazine';
    const subtitle = searchParams.get('subtitle') || 'Where surf and science meet';
    const type = searchParams.get('type') || 'default';
    const cover = searchParams.get('cover');
    const accentColorParam = searchParams.get('accentColor');
    const issueNumber = searchParams.get('issueNumber');

    const baseUrl = getBaseUrl();
    const logoUrl = `${baseUrl}/images/logo.png`;

    // Use custom accent color if provided
    const accentColor = accentColorParam || BRAND_BLUE;

    // Truncate text if too long
    const displayTitle = title.length > 45 ? title.substring(0, 42) + '...' : title;
    const displaySubtitle = subtitle.length > 55 ? subtitle.substring(0, 52) + '...' : subtitle;

    // ============================================
    // ISSUE / READ TEMPLATE - Magazine Cover Style
    // ============================================
    if ((type === 'issue' || type === 'read') && cover) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              backgroundImage: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
              position: 'relative',
            }}
          >
            {/* Decorative circles for depth */}
            <div
              style={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 400,
                height: 400,
                borderRadius: 200,
                backgroundColor: 'white',
                opacity: 0.1,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -80,
                left: -80,
                width: 300,
                height: 300,
                borderRadius: 150,
                backgroundColor: 'white',
                opacity: 0.08,
              }}
            />

            {/* Large issue number - decorative background */}
            {issueNumber && (
              <div
                style={{
                  position: 'absolute',
                  right: 60,
                  bottom: 80,
                  fontSize: 400,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.1)',
                  lineHeight: 0.8,
                  letterSpacing: -20,
                  display: 'flex',
                }}
              >
                {issueNumber.padStart(2, '0')}
              </div>
            )}

            {/* Magazine cover with shadow and rotation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 60,
                width: 340,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  transform: 'rotate(-3deg)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${baseUrl}${cover}`}
                  width={240}
                  height={339}
                  alt=""
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>

            {/* Content area */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px 60px 60px 20px',
              }}
            >
              {/* Type label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 3,
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    marginRight: 16,
                    display: 'flex',
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 4,
                    color: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                  }}
                >
                  {type === 'read' ? 'READ NOW' : 'BLUE MIND MAGAZINE'}
                </div>
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: displayTitle.length > 20 ? 48 : 56,
                  fontWeight: 700,
                  color: 'white',
                  lineHeight: 1.1,
                  marginBottom: 16,
                  display: 'flex',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                {displayTitle}
              </div>

              {/* Subtitle */}
              <div
                style={{
                  fontSize: 24,
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: 32,
                  display: 'flex',
                }}
              >
                {displaySubtitle}
              </div>

              {/* Bottom info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 'auto',
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.5)',
                    display: 'flex',
                  }}
                >
                  bluemindmag.com
                </div>
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // ============================================
    // DEFAULT TEMPLATE - Brand Style with Logo
    // ============================================
    
    // Background gradient based on page type
    const getBackground = () => {
      switch (type) {
        case 'about':
          return `linear-gradient(145deg, ${DARK_BG} 0%, #2a2a2a 50%, ${DARK_BG} 100%)`;
        case 'newsletter':
          return `linear-gradient(180deg, ${DARK_BG} 0%, #1f3a3f 100%)`;
        case 'contact':
          return `linear-gradient(135deg, #2d2520 0%, ${DARK_BG} 50%, #1a2428 100%)`;
        case 'issues':
          return `linear-gradient(135deg, #1a2a2d 0%, ${DARK_BG} 60%, #1a2a2d 100%)`;
        case 'legal':
          return DARK_BG;
        default:
          return `linear-gradient(145deg, ${DARK_BG} 0%, #1a2428 50%, ${DARK_BG} 100%)`;
      }
    };

    // Type label
    const getTypeLabel = () => {
      switch (type) {
        case 'about': return 'ABOUT US';
        case 'newsletter': return 'NEWSLETTER';
        case 'contact': return 'GET IN TOUCH';
        case 'issues': return 'MAGAZINE ARCHIVE';
        case 'legal': return 'LEGAL';
        default: return 'SURF SCIENCE';
      }
    };

    // Title font size based on length
    const titleFontSize = displayTitle.length > 25 ? 52 : displayTitle.length > 15 ? 64 : 72;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: getBackground(),
            position: 'relative',
          }}
        >
          {/* Decorative gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 600,
              height: 600,
              backgroundImage: `radial-gradient(circle at 100% 0%, ${BRAND_BLUE}20 0%, transparent 50%)`,
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 500,
              height: 500,
              backgroundImage: `radial-gradient(circle at 0% 100%, ${WARM_GOLDEN}15 0%, transparent 50%)`,
              display: 'flex',
            }}
          />

          {/* Header with logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '40px 60px',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                height={50}
                alt=""
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Type badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '8px 20px',
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: BRAND_BLUE,
                  display: 'flex',
                }}
              >
                {getTypeLabel()}
              </div>
            </div>
          </div>

          {/* Main content - centered */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              padding: '0 80px',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: titleFontSize,
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: 24,
                display: 'flex',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              }}
            >
              {displayTitle}
            </div>

            {/* Subtitle with brand color */}
            <div
              style={{
                fontSize: 28,
                color: type === 'legal' ? 'rgba(255,255,255,0.5)' : BRAND_BLUE,
                marginBottom: 40,
                display: 'flex',
              }}
            >
              {displaySubtitle}
            </div>

            {/* Accent line */}
            <div
              style={{
                width: 100,
                height: 4,
                backgroundImage: `linear-gradient(90deg, ${BRAND_BLUE}, ${WARM_GOLDEN})`,
                borderRadius: 2,
                display: 'flex',
              }}
            />
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 60px',
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.4)',
                display: 'flex',
              }}
            >
              bluemindmag.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    
    // Fallback - simple branded image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: DARK_BG,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: BRAND_BLUE,
              marginBottom: 16,
              display: 'flex',
            }}
          >
            BLUE MIND
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
            }}
          >
            Surf Science Magazine
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
