// ============================================
// GOOGLE ANALYTICS 4 - EVENT TRACKING UTILITIES
// Centralized module for all GA4 event tracking
// ============================================

import { sendGAEvent } from "@next/third-parties/google";

// ============================================
// GLOBAL TYPE DECLARATIONS
// ============================================

// Extend Window interface to include gtag function
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface IssueEventParams {
  issue_id: string;
  issue_number: number;
  issue_title: string;
  locale: string;
}

export interface NewsletterEventParams {
  source: "hero" | "footer" | "page" | "inline";
  locale: string;
}

export interface ContactEventParams {
  locale: string;
}

export interface BookChatEventParams {
  locale: string;
}

export interface ReadingSessionParams {
  issue_id: string;
  issue_number: number;
}

// ============================================
// ISSUE TRACKING EVENTS
// ============================================

/**
 * Track when a user views an issue detail page
 * Fired on mount of the issue detail page
 */
export function trackViewIssueDetail(params: IssueEventParams): void {
  if (!isAnalyticsAvailable()) return;
  sendGAEvent("event", "view_issue_detail", {
    issue_id: params.issue_id,
    issue_number: params.issue_number,
    issue_title: params.issue_title,
    locale: params.locale,
  });
}

/**
 * Track when a user clicks the "Read Issue" CTA
 * This is a KEY EVENT (conversion) - Primary KPI
 */
export function trackStartReading(params: IssueEventParams): void {
  if (!isAnalyticsAvailable()) return;
  sendGAEvent("event", "start_reading", {
    issue_id: params.issue_id,
    issue_number: params.issue_number,
    issue_title: params.issue_title,
    locale: params.locale,
  });
}

/**
 * Track when the flipbook iframe successfully loads
 * Confirms the reader actually opened
 */
export function trackReadingSessionStart(params: ReadingSessionParams): void {
  if (!isAnalyticsAvailable()) return;
  sendGAEvent("event", "reading_session_start", {
    issue_id: params.issue_id,
    issue_number: params.issue_number,
  });
}

// ============================================
// FORM TRACKING EVENTS
// ============================================

/**
 * Track successful newsletter signup
 * This is a KEY EVENT (conversion) - Secondary KPI
 */
export function trackNewsletterSignup(params: NewsletterEventParams): void {
  if (!isAnalyticsAvailable()) return;
  sendGAEvent("event", "newsletter_signup", {
    source: params.source,
    locale: params.locale,
  });
}

/**
 * Track successful contact form submission
 * This is a KEY EVENT (conversion) - Tertiary KPI
 */
export function trackContactFormSubmit(params: ContactEventParams): void {
  if (!isAnalyticsAvailable()) return;
  sendGAEvent("event", "contact_form_submit", {
    locale: params.locale,
  });
}

// ============================================
// ENGAGEMENT TRACKING EVENTS
// ============================================

/**
 * Track when a user clicks the "Book a Chat" CTA
 * This is a KEY EVENT (conversion) - Tertiary KPI for lead generation
 */
export function trackBookChatClick(params: BookChatEventParams): void {
  if (!isAnalyticsAvailable()) return;
  sendGAEvent("event", "book_chat_click", {
    locale: params.locale,
  });
}

// ============================================
// OUTBOUND LINK TRACKING
// ============================================

export interface OutboundLinkParams {
  url: string;
  link_text?: string;
  link_type: "sponsor" | "social" | "external";
}

/**
 * Track when a user clicks an external/outbound link
 * Useful for tracking sponsor clicks, social links, and external references
 */
export function trackOutboundClick(params: OutboundLinkParams): void {
  if (!isAnalyticsAvailable()) return;
  sendGAEvent("event", "click", {
    link_url: params.url,
    link_text: params.link_text,
    link_type: params.link_type,
    outbound: true,
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if analytics is available (client-side only)
 * Useful for conditional tracking in components
 */
export function isAnalyticsAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}
