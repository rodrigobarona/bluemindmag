import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title') || 'Blue Mind Magazine';
  const subtitle = searchParams.get('subtitle') || 'Where surf and science meet';

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
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #0097B220 0%, transparent 50%)',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            {title}
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              color: '#0097B2',
              fontStyle: 'italic',
            }}
          >
            {subtitle}
          </div>

          {/* Accent line */}
          <div
            style={{
              width: 100,
              height: 4,
              backgroundColor: '#0097B2',
              marginTop: 32,
              borderRadius: 2,
            }}
          />

          {/* Domain */}
          <div
            style={{
              fontSize: 18,
              color: '#666666',
              marginTop: 32,
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

