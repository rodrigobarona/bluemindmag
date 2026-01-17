import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: Revalidate Pexels Images Cache
 *
 * This endpoint allows on-demand revalidation of the Pexels image cache.
 * Useful when you want to refresh images without waiting for the cache TTL.
 *
 * Works with Next.js 16 "use cache" directive - revalidates the cached pools
 * so new random selections will pull from fresh image pools.
 *
 * Usage:
 * POST /api/revalidate-images
 * Headers: x-revalidate-secret: YOUR_SECRET
 *
 * Optional body:
 * { "tag": "pexels" } - Revalidate all Pexels images (default)
 * { "tag": "pexels-pool-hero" } - Revalidate hero image pool only
 * { "tag": "pexels-pool-cta" } - Revalidate CTA image pool only
 * { "tag": "pexels-section-pool-meet-the-scientist" } - Revalidate specific section
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the secret token
    const secret = request.headers.get("x-revalidate-secret");
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.warn("REVALIDATE_SECRET environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    // Parse the request body for optional tag specification
    let tag = "pexels"; // Default tag revalidates all Pexels images

    try {
      const body = await request.json();
      if (body.tag && typeof body.tag === "string") {
        // Allow pexels tags and pool-specific tags
        if (body.tag.startsWith("pexels")) {
          tag = body.tag;
        }
      }
    } catch {
      // No body or invalid JSON - use default tag
    }

    // Revalidate the cache tag - invalidates all "use cache" entries with this tag
    // Second argument is the cacheLife profile for stale-while-revalidate behavior
    revalidateTag(tag, "days");

    return NextResponse.json({
      revalidated: true,
      tag,
      timestamp: new Date().toISOString(),
      message: `Successfully revalidated cache for tag: ${tag}`,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate cache" },
      { status: 500 }
    );
  }
}

/**
 * GET handler for health check and usage info
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/revalidate-images",
    method: "POST",
    description: "Revalidate Pexels image cache on demand (Next.js 16 'use cache' compatible)",
    requiredHeaders: {
      "x-revalidate-secret": "Your REVALIDATE_SECRET environment variable",
    },
    optionalBody: {
      tag: "Tag to revalidate (default: 'pexels' for all)",
    },
    availableTags: {
      "pexels": "All Pexels image pools",
      "pexels-pool-hero": "Hero images only",
      "pexels-pool-quote": "Quote backgrounds only",
      "pexels-pool-science": "Science/underwater images only",
      "pexels-pool-surfer": "Surfer lifestyle images only",
      "pexels-pool-portugal": "Portugal/cliff images only",
      "pexels-pool-cta": "CTA/newsletter backgrounds only",
      "pexels-pool-contact": "Contact page images only",
    },
  });
}
