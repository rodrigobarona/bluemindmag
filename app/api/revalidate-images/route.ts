import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: Revalidate Pexels Images Cache
 *
 * This endpoint allows on-demand revalidation of the Pexels image cache.
 * Useful when you want to refresh images without waiting for the 24-hour TTL.
 *
 * Usage:
 * POST /api/revalidate-images
 * Headers: x-revalidate-secret: YOUR_SECRET
 *
 * Optional body:
 * { "tag": "pexels" } - Revalidate all Pexels images (default)
 * { "tag": "pexels-slot" } - Revalidate slot-based images only
 * { "tag": "pexels-section" } - Revalidate section images only
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
        // Only allow specific tags
        const allowedTags = ["pexels", "pexels-slot", "pexels-section"];
        if (allowedTags.includes(body.tag)) {
          tag = body.tag;
        }
      }
    } catch {
      // No body or invalid JSON - use default tag
    }

    // Revalidate the cache tag with 'max' profile for stale-while-revalidate semantics
    revalidateTag(tag, "max");

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
 * GET handler for health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/revalidate-images",
    method: "POST",
    description: "Revalidate Pexels image cache on demand",
    requiredHeaders: {
      "x-revalidate-secret": "Your REVALIDATE_SECRET environment variable",
    },
    optionalBody: {
      tag: "pexels | pexels-slot | pexels-section",
    },
  });
}
