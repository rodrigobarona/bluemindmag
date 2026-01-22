import { NextRequest, NextResponse } from 'next/server';
import { checkBotId } from 'botid/server';

// Beehiiv API Configuration
const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

// Helper function to safely check for bots with fail-open approach
async function isMaliciousBot(): Promise<boolean> {
  console.log('[Newsletter] Step 1: Starting BotID verification...');
  
  try {
    const verification = await checkBotId({
      developmentOptions: {
        bypass: 'HUMAN',
      },
    });

    console.log('[Newsletter] Step 2: BotID verification completed:', {
      isBot: verification.isBot,
      isHuman: verification.isHuman,
      isVerifiedBot: verification.isVerifiedBot,
      bypassed: verification.bypassed,
    });

    // Only block if it's a bot AND not a verified good bot (like search engines)
    if (verification.isBot && !verification.isVerifiedBot) {
      console.log('[Newsletter] Step 2b: Request identified as malicious bot - BLOCKING');
      return true;
    }

    console.log('[Newsletter] Step 2c: Request passed BotID check');
    return false;
  } catch (error) {
    // If BotID verification fails, log the error but allow the request through
    console.error('[Newsletter] Step 2 ERROR: BotID verification failed (allowing request):', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  console.log('[Newsletter] ========== NEW REQUEST ==========');
  console.log('[Newsletter] Timestamp:', new Date().toISOString());
  
  try {
    // Check for malicious bots (fail-open: errors allow request through)
    if (await isMaliciousBot()) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    console.log('[Newsletter] Step 3: Parsing request body...');
    const body = await request.json();
    const { email } = body;
    console.log('[Newsletter] Step 3b: Email received:', email);

    // Validate email
    if (!email || !email.includes('@')) {
      console.log('[Newsletter] Step 4 ERROR: Invalid email format');
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }
    console.log('[Newsletter] Step 4: Email validation passed');

    // Check for required environment variables
    console.log('[Newsletter] Step 5: Checking environment variables...');
    console.log('[Newsletter] Step 5a: BEEHIIV_API_KEY exists:', !!BEEHIIV_API_KEY);
    console.log('[Newsletter] Step 5b: BEEHIIV_PUBLICATION_ID exists:', !!BEEHIIV_PUBLICATION_ID);
    
    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      console.error('[Newsletter] Step 5 ERROR: Missing Beehiiv configuration');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Log environment variable info for debugging
    console.log('[Newsletter] Step 6: Beehiiv config details:', {
      apiKeyLength: BEEHIIV_API_KEY.length,
      apiKeyPrefix: BEEHIIV_API_KEY.substring(0, 8) + '...',
      apiKeySuffix: '...' + BEEHIIV_API_KEY.substring(BEEHIIV_API_KEY.length - 4),
      apiKeyHasWhitespace: BEEHIIV_API_KEY !== BEEHIIV_API_KEY.trim(),
      publicationId: BEEHIIV_PUBLICATION_ID,
      publicationIdHasWhitespace: BEEHIIV_PUBLICATION_ID !== BEEHIIV_PUBLICATION_ID.trim(),
    });

    // Build the request
    const beehiivUrl = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID.trim()}/subscriptions`;
    const beehiivBody = {
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: 'website',
      utm_medium: 'organic',
      utm_campaign: 'bluemindmag',
    };

    console.log('[Newsletter] Step 7: Making Beehiiv API request...');
    console.log('[Newsletter] Step 7a: URL:', beehiivUrl);
    console.log('[Newsletter] Step 7b: Body:', JSON.stringify(beehiivBody));

    // Subscribe to Beehiiv
    const response = await fetch(beehiivUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BEEHIIV_API_KEY.trim()}`,
      },
      body: JSON.stringify(beehiivBody),
    });

    console.log('[Newsletter] Step 8: Beehiiv response received');
    console.log('[Newsletter] Step 8a: Status:', response.status);
    console.log('[Newsletter] Step 8b: StatusText:', response.statusText);
    console.log('[Newsletter] Step 8c: OK:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Newsletter] Step 8 ERROR: Beehiiv API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: JSON.stringify(errorData),
      });
      
      // Handle specific error cases
      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }
      
      if (response.status === 401) {
        console.error('[Newsletter] Step 8d ERROR: API KEY IS INVALID - Check Vercel env vars');
        return NextResponse.json(
          { error: 'Newsletter service authentication failed' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Newsletter] Step 9: SUCCESS! Subscription data:', JSON.stringify(data));

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      status: data.data?.status || 'active',
    });
  } catch (error) {
    console.error('[Newsletter] UNEXPECTED ERROR:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

