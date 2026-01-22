import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkBotId } from 'botid/server';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email configuration from environment variables (required)
const EMAIL_FROM = process.env.RESEND_FROM_EMAIL;
const EMAIL_TO = process.env.RESEND_TO_EMAIL;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Escape HTML to prevent injection attacks
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Helper function to safely check for bots with fail-open approach
async function isMaliciousBot(): Promise<boolean> {
  try {
    const verification = await checkBotId({
      developmentOptions: {
        bypass: 'HUMAN',
      },
    });

    // Log verification result for debugging (remove in production if too noisy)
    console.log('[BotID Contact] Verification result:', {
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
    console.error('[BotID Contact] Verification error (allowing request):', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for malicious bots (fail-open: errors allow request through)
    if (await isMaliciousBot()) {
      console.log('[Contact] Blocked bot request');
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if Resend and email addresses are configured
    if (!resend || !EMAIL_FROM || !EMAIL_TO) {
      console.error('Email service not fully configured:', {
        hasResend: !!resend,
        hasFromEmail: !!EMAIL_FROM,
        hasToEmail: !!EMAIL_TO,
      });
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Escape user input to prevent HTML injection
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [EMAIL_TO],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      text: `New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the Blue Mind Magazine contact form.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0097B2; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Blue Mind Magazine</h1>
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td style="padding: 32px 40px 24px;">
              <h2 style="margin: 0; color: #1a1a1a; font-size: 20px; font-weight: 600;">New Contact Form Submission</h2>
            </td>
          </tr>
          
          <!-- Contact Details -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-radius: 6px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e9ecef;">
                    <span style="color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Name</span><br>
                    <span style="color: #1a1a1a; font-size: 15px; font-weight: 500;">${safeName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e9ecef;">
                    <span style="color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span><br>
                    <a href="mailto:${safeEmail}" style="color: #0097B2; font-size: 15px; font-weight: 500; text-decoration: none;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <span style="color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</span><br>
                    <span style="color: #1a1a1a; font-size: 15px; font-weight: 500;">${safeSubject}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <h3 style="margin: 0 0 12px; color: #1a1a1a; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
              <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px;">
                <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 40px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 13px; text-align: center;">
                This message was sent from the Blue Mind Magazine contact form.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully', id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

