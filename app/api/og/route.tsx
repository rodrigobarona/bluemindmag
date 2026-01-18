import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// Brand colors
const BRAND_COLOR = '#0097B2';
const WARM_COLOR = '#D4A574';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title') || 'Blue Mind Magazine';
  const subtitle = searchParams.get('subtitle') || 'Where surf and science meet';
  const type = searchParams.get('type') || 'default';

  // Different styles based on page type
  const getBackgroundStyle = () => {
    switch (type) {
      case 'issue':
        return {
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(circle at 75% 25%, #0097B230 0%, transparent 40%), radial-gradient(circle at 25% 75%, #D4A57420 0%, transparent 40%)',
        };
      case 'read':
        return {
          backgroundColor: '#0a0a0a',
          backgroundImage:
            'linear-gradient(135deg, #0097B215 0%, transparent 50%), linear-gradient(315deg, #D4A57415 0%, transparent 50%)',
        };
      case 'about':
        return {
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(circle at 50% 0%, #0097B225 0%, transparent 50%)',
        };
      case 'newsletter':
        return {
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(ellipse at 50% 100%, #0097B220 0%, transparent 60%)',
        };
      default:
        return {
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #0097B220 0%, transparent 50%)',
        };
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'issue':
      case 'read':
        return WARM_COLOR;
      default:
        return BRAND_COLOR;
    }
  };

  const backgroundStyle = getBackgroundStyle();
  const accentColor = getAccentColor();

  // Truncate title if too long
  const displayTitle = title.length > 50 ? title.substring(0, 47) + '...' : title;
  const displaySubtitle = subtitle.length > 60 ? subtitle.substring(0, 57) + '...' : subtitle;

  // Adjust font size based on title length
  const titleFontSize = displayTitle.length > 30 ? 52 : displayTitle.length > 20 ? 62 : 72;

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
        {/* Decorative elements */}
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
          {/* Wave icon placeholder */}
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: accentColor,
              borderRadius: '50%',
              opacity: 0.8,
            }}
          />
          <div
            style={{
              fontSize: 14,
              color: '#ffffff60',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Blue Mind Magazine
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 80px',
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
            }}
          >
            {displayTitle}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              color: accentColor,
              fontStyle: 'italic',
              marginBottom: 32,
            }}
          >
            {displaySubtitle}
          </div>

          {/* Accent line */}
          <div
            style={{
              width: 80,
              height: 4,
              backgroundColor: accentColor,
              borderRadius: 2,
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
            }}
          >
            bluemindmag.com
          </div>
          {type && type !== 'default' && (
            <>
              <div
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: '#ffffff30',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  color: '#ffffff30',
                  textTransform: 'capitalize',
                }}
              >
                {type === 'read' ? 'Digital Reader' : type}
              </div>
            </>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
