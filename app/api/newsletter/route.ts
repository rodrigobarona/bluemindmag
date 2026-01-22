import { NextRequest, NextResponse } from 'next/server';
import { checkBotId } from 'botid/server';

// Beehiiv API Configuration
const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

// Helper function to safely check for bots with fail-open approach
async function isMaliciousBot(): Promise<boolean> {
  try {
    const verification = await checkBotId({
      developmentOptions: {
        bypass: 'HUMAN',
      },
    });

    // Log verification result for debugging (remove in production if too noisy)
    console.log('[BotID Newsletter] Verification result:', {
      isBot: verification.isBot,
      isHuman: verification.isHuman,
      isVerifiedBot: verification.isVerifiedBot,
      bypassed: verification.bypassed,
    });

    // Only block if it's a bot AND not a verified good bot (like search engines)
    // This prevents blocking legitimate crawlers while still blocking malicious bots
    if (verification.isBot && !verification.isVerifiedBot) {
      return true;
    }

    return false;
  } catch (error) {
    // If BotID verification fails, log the error but allow the request through
    // This is a "fail-open" approach - better to let some bots through than block real users
    console.error('[BotID Newsletter] Verification error (allowing request):', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for malicious bots (fail-open: errors allow request through)
    if (await isMaliciousBot()) {
      console.log('[Newsletter] Blocked bot request');
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check for required environment variables
    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      console.error('Missing Beehiiv configuration');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Subscribe to Beehiiv
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: 'website',
          utm_medium: 'organic',
          utm_campaign: 'bluemindmag',
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Beehiiv API error:', errorData);
      
      // Handle specific error cases
      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      status: data.data?.status || 'active',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

