import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  // Note: cacheComponents (PPR) is disabled due to incompatibility with edge runtime
  // The OG image generator requires edge runtime for performance

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
    // Cache optimized images for 30 days
    minimumCacheTTL: 2592000,
    // Optimized device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    qualities: [75, 80, 85, 90],
  },

  // Security headers for production hardening
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Rewrite c15t consent API requests to hosted backend
  async rewrites() {
    return [
      {
        source: "/api/c15t/:path*",
        destination: "https://bluemind-europe-website.c15t.dev/:path*",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withBotId(withNextIntl(nextConfig));
