// ============================================
// GOOGLE ANALYTICS 4 - EVENT TRACKING UTILITIES
// Centralized module for all GA4 event tracking
// ============================================

import { sendGAEvent } from "@next/third-parties/google";

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
  sendGAEvent("event", "book_chat_click", {
    locale: params.locale,
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
