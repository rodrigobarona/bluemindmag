import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// Brand colors
const BRAND_COLOR = '#0097B2';
const WARM_COLOR = '#D4A574';

// Base URL for assets
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://bluemindmag.com';
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title') || 'Blue Mind Magazine';
  const subtitle = searchParams.get('subtitle') || 'Where surf and science meet';
  const type = searchParams.get('type') || 'default';
  const cover = searchParams.get('cover'); // Issue cover path
  const accentColorParam = searchParams.get('accentColor'); // Custom accent color
  const issueNumber = searchParams.get('issueNumber'); // Issue number for badge

  const baseUrl = getBaseUrl();

  // Use custom accent color if provided, otherwise use defaults
  const accentColor = accentColorParam || (type === 'issue' || type === 'read' ? BRAND_COLOR : BRAND_COLOR);

  // Truncate text if too long
  const displayTitle = title.length > 50 ? title.substring(0, 47) + '...' : title;
  const displaySubtitle = subtitle.length > 60 ? subtitle.substring(0, 57) + '...' : subtitle;

  // Render different templates based on type
  if ((type === 'issue' || type === 'read') && cover) {
    // Issue/Read template with cover - inspired by IssueDetailCTA
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
            position: 'relative',
          }}
        >
          {/* Decorative blur circle - top right */}
          <div
            style={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 350,
              height: 350,
              borderRadius: '50%',
              background: 'white',
              opacity: 0.1,
            }}
          />

          {/* Decorative blur circle - bottom left */}
          <div
            style={{
              position: 'absolute',
              bottom: -60,
              left: -60,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'white',
              opacity: 0.08,
            }}
          />

          {/* Large issue number - decorative background */}
          {issueNumber && (
            <div
              style={{
                position: 'absolute',
                right: 40,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 320,
                fontWeight: 900,
                color: 'rgba(255,255,255,0.12)',
                lineHeight: 1,
                letterSpacing: '-0.05em',
                display: 'flex',
              }}
            >
              {issueNumber.padStart(2, '0')}
            </div>
          )}

          {/* Magazine cover - left side with rotation and shadow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '40px 0 40px 60px',
            }}
          >
            <div
              style={{
                transform: 'rotate(3deg)',
                display: 'flex',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${baseUrl}${cover}`}
                width={220}
                height={311}
                alt=""
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

          {/* Content - right side */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '40px 60px 40px 40px',
              flex: 1,
            }}
          >
            {/* Label */}
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: 16,
                display: 'flex',
              }}
            >
              {type === 'read' ? 'Read Now' : 'Blue Mind Magazine'}
            </span>

            {/* Title */}
            <div
              style={{
                fontSize: displayTitle.length > 25 ? 44 : 52,
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: 12,
                display: 'flex',
              }}
            >
              {displayTitle}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 22,
                color: 'rgba(255,255,255,0.8)',
                fontStyle: 'italic',
                marginBottom: 24,
                display: 'flex',
              }}
            >
              {displaySubtitle}
            </div>

            {/* Accent line */}
            <div
              style={{
                width: 60,
                height: 3,
                backgroundColor: 'rgba(255,255,255,0.4)',
                borderRadius: 2,
                marginBottom: 'auto',
                display: 'flex',
              }}
            />

            {/* Domain */}
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
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Default template for other page types
  const getBackgroundStyle = () => {
    switch (type) {
      case 'about':
        return {
          background: `linear-gradient(135deg, ${BRAND_COLOR}15 0%, #000000 50%, ${WARM_COLOR}10 100%)`,
        };
      case 'newsletter':
        return {
          background: `linear-gradient(180deg, #000000 0%, ${BRAND_COLOR}20 100%)`,
        };
      case 'contact':
        return {
          background: `linear-gradient(135deg, ${WARM_COLOR}15 0%, #000000 50%, ${BRAND_COLOR}10 100%)`,
        };
      case 'issues':
        return {
          background: `linear-gradient(135deg, ${BRAND_COLOR}20 0%, #000000 60%, ${BRAND_COLOR}10 100%)`,
        };
      case 'legal':
        return {
          background: '#0a0a0a',
        };
      default:
        return {
          background: `linear-gradient(135deg, #000000 0%, ${BRAND_COLOR}15 50%, #000000 100%)`,
        };
    }
  };

  const backgroundStyle = getBackgroundStyle();

  // Adjust font size based on title length
  const titleFontSize = displayTitle.length > 30 ? 52 : displayTitle.length > 20 ? 62 : 72;

  // Get page-specific icon/label
  const getTypeLabel = () => {
    switch (type) {
      case 'about':
        return 'About Us';
      case 'newsletter':
        return 'Newsletter';
      case 'contact':
        return 'Get in Touch';
      case 'issues':
        return 'Magazine Archive';
      case 'legal':
        return 'Legal';
      default:
        return 'Surf Science';
    }
  };

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
          ...backgroundStyle,
          position: 'relative',
        }}
      >
        {/* Decorative circle - top right */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: BRAND_COLOR,
            opacity: 0.08,
          }}
        />

        {/* Decorative circle - bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: WARM_COLOR,
            opacity: 0.06,
          }}
        />

        {/* Header with branding */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Brand circle */}
          <div
            style={{
              width: 44,
              height: 44,
              backgroundColor: BRAND_COLOR,
              borderRadius: '50%',
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            BM
          </div>
          <div
            style={{
              fontSize: 14,
              color: '#ffffff50',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Blue Mind Magazine
          </div>
        </div>

        {/* Type label - top right */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            fontSize: 12,
            color: BRAND_COLOR,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
            display: 'flex',
          }}
        >
          {getTypeLabel()}
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 100px',
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.02em',
              marginBottom: 20,
              lineHeight: 1.1,
              maxWidth: '100%',
              display: 'flex',
            }}
          >
            {displayTitle}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              color: type === 'legal' ? '#ffffff60' : BRAND_COLOR,
              fontStyle: 'italic',
              marginBottom: 32,
              display: 'flex',
            }}
          >
            {displaySubtitle}
          </div>

          {/* Accent line */}
          <div
            style={{
              width: 80,
              height: 4,
              backgroundColor: BRAND_COLOR,
              borderRadius: 2,
              display: 'flex',
            }}
          />
        </div>

        {/* Footer with domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: '#ffffff40',
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
}
