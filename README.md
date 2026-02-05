# Blue Mind Magazine 🌊

> **Where Surf and Science Meet** — From surfers, to surfers.

Blue Mind Magazine is a bilingual (English/Portuguese) digital surf science magazine that bridges the gap between scientific research and the surfing community. The website showcases magazine issues with an embedded flipbook reader, featuring dynamic ocean photography from Pexels API.

**Live Website:** [bluemindmag.com](https://bluemindmag.com)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [External Services](#external-services)
- [API Endpoints](#api-endpoints)
- [Content Management](#content-management)
- [Internationalization (i18n)](#internationalization-i18n)
- [Image Caching System](#image-caching-system)
- [Deployment](#deployment)

---

## Overview

Blue Mind Magazine is a Next.js 16 application that serves as the digital home for a surf science publication. The magazine explores the intersection of ocean sports, human health, and scientific research.

### Key Stakeholders

| Role               | Name/Organization                    | Description                                              |
| ------------------ | ------------------------------------ | -------------------------------------------------------- |
| **Chief Editor**   | Pedro Seixas, PT, PhD                | Scientific Coordinator at Surfing Medicine International |
| **Publisher**      | Surfisio                             | Specialized physiotherapy and sports performance company |
| **Main Supporter** | Surfing Medicine International (SMI) | Non-profit organization for surfing medicine science     |

---

## Tech Stack

### Core Framework

- **Next.js 16.1.2** — React framework with App Router
- **React 19.2.3** — UI library
- **TypeScript 5** — Type safety
- **Tailwind CSS 4** — Utility-first styling

### Key Dependencies

| Package                | Version  | Purpose                             |
| ---------------------- | -------- | ----------------------------------- |
| `next-intl`            | ^4.7.0   | Internationalization (EN/PT)        |
| `next-themes`          | ^0.4.6   | Dark/light mode theming             |
| `motion`               | ^12.26.2 | Animations and transitions          |
| `embla-carousel-react` | ^8.6.0   | Sponsor carousel                    |
| `resend`               | ^6.7.0   | Transactional emails (contact form) |
| `@vercel/og`           | ^0.8.6   | Dynamic OG image generation         |
| `@c15t/nextjs`         | ^1.8.2   | Cookie consent management           |
| `@mdx-js/react`        | ^3.1.1   | MDX content support                 |

### Typography System

The magazine uses a carefully curated editorial font stack:

- **Headlines:** League Gothic (condensed bold)
- **Body:** Source Serif 4 (editorial serif)
- **UI/Labels:** DM Sans (modern sans-serif)
- **Accent/Quotes:** Cormorant Garamond (elegant italic)

---

## Features

### 🌐 Bilingual Support

- Full English and Portuguese translations
- URL-based locale routing (`/` for EN, `/pt` for PT)
- Cookie-based language preference persistence

### 📖 Digital Magazine Reader

- Embedded Publuu flipbook viewer
- Locale-specific flipbook versions
- Fullscreen reading experience with keyboard navigation

### 🖼️ Dynamic Ocean Photography

- Integration with Pexels API for fresh imagery
- Pool-based caching system (15 images per category)
- Random selection on each page visit for variety
- Automatic blur placeholders for instant loading feedback

### 📧 Newsletter Integration

- Beehiiv newsletter subscription
- Welcome emails and UTM tracking
- Form validation and error handling

### 📬 Contact Form

- Powered by Resend email service
- HTML-formatted notification emails
- Form validation with error states

### 🍪 Privacy Compliance

- GDPR-compliant cookie consent
- Essential, Analytics, and Marketing cookie categories
- Customizable consent preferences

### 🔍 SEO Optimized

- Dynamic sitemap generation
- Structured metadata with Open Graph
- Alternate language tags (hreflang)
- Dynamic OG image generation

---

## Project Structure

```
bluemindmag/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Locale-based routing
│   │   ├── (legal)/              # Legal pages group
│   │   │   ├── cookies/          # Cookie policy
│   │   │   ├── privacy/          # Privacy policy
│   │   │   └── terms/            # Terms of use
│   │   ├── about/                # About page
│   │   ├── contact/              # Contact form page
│   │   ├── issues/               # Magazine issues
│   │   │   └── [slug]/           # Individual issue detail
│   │   ├── newsletter/           # Newsletter signup page
│   │   ├── read/                 # Flipbook reader
│   │   │   └── [slug]/           # Issue reader
│   │   ├── layout.tsx            # Root layout with fonts
│   │   └── page.tsx              # Homepage
│   ├── api/                      # API Routes
│   │   ├── contact/              # Contact form submission
│   │   ├── newsletter/           # Beehiiv subscription
│   │   ├── og/                   # Dynamic OG images
│   │   └── revalidate-images/    # Cache invalidation
│   ├── globals.css               # Global styles
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # Robots.txt
├── components/                   # React components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   ├── animations/               # Animation utilities
│   ├── hero-immersive.tsx        # Hero section
│   ├── issue-card.tsx            # Issue display cards
│   ├── flipbook-viewer.tsx       # Magazine reader
│   ├── newsletter-form.tsx       # Newsletter subscription
│   ├── contact-form.tsx          # Contact form
│   └── ...                       # Other components
├── content/                      # Content data layer
│   ├── data/                     # Structured data
│   │   ├── issues.ts             # Magazine issues
│   │   ├── team.ts               # Team members
│   │   ├── sponsors.ts           # Sponsor data
│   │   └── navigation.ts         # Site navigation
│   ├── i18n/                     # Translations
│   │   ├── en/                   # English translations
│   │   └── pt/                   # Portuguese translations
│   ├── issues/                   # MDX issue content
│   └── types/                    # Content type definitions
├── i18n/                         # Internationalization config
│   ├── routing.ts                # Locale routing setup
│   ├── navigation.ts             # Navigation helpers
│   └── request.ts                # Server-side i18n
├── lib/                          # Utility libraries
│   ├── pexels.ts                 # Pexels API + caching
│   ├── image-utils.ts            # Image processing
│   ├── mdx.ts                    # MDX utilities
│   ├── schema.ts                 # JSON-LD schemas
│   └── utils.ts                  # General utilities
├── messages/                     # Translation files
│   ├── en.json                   # English strings
│   └── pt.json                   # Portuguese strings
├── public/                       # Static assets
│   └── images/                   # Images
│       ├── hero/                 # Hero/fallback images
│       ├── issues/               # Issue covers
│       ├── sponsors/             # Sponsor logos
│       └── team/                 # Team photos
├── proxy.ts                      # Next-intl middleware
├── next.config.ts                # Next.js configuration
└── package.json                  # Dependencies
```

---

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# ===========================================
# REQUIRED: External Services
# ===========================================

# Pexels API - Dynamic ocean photography
# Get your API key at: https://www.pexels.com/api/
PEXELS_API_KEY=your_pexels_api_key

# Resend - Contact form emails
# Get your API key at: https://resend.com/
RESEND_API_KEY=your_resend_api_key

# Beehiiv - Newsletter subscriptions
# Get credentials from your Beehiiv dashboard
BEEHIIV_API_KEY=your_beehiiv_api_key
BEEHIIV_PUBLICATION_ID=your_publication_id

# ===========================================
# OPTIONAL: Analytics & Cache Management
# ===========================================

# Google Analytics 4 - Website analytics
# Get your Measurement ID from: https://analytics.google.com/
# Format: G-XXXXXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Secret for manual cache revalidation API
REVALIDATE_SECRET=your_random_secret_string
```

| Variable                        | Required | Description                                            |
| ------------------------------- | -------- | ------------------------------------------------------ |
| `PEXELS_API_KEY`                | Yes      | API key for Pexels image fetching                      |
| `RESEND_API_KEY`                | Yes      | API key for Resend email service                       |
| `BEEHIIV_API_KEY`               | Yes      | API key for Beehiiv newsletter                         |
| `BEEHIIV_PUBLICATION_ID`        | Yes      | Beehiiv publication identifier                         |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No       | Google Analytics 4 Measurement ID (e.g., G-XXXXXXXXXX) |
| `REVALIDATE_SECRET`             | No       | Secret for cache invalidation API                      |

---

## Getting Started

### Prerequisites

- Node.js 20+ or Bun 1.0+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/bluemindmag.git
cd bluemindmag

# Install dependencies
bun install
# or: npm install / yarn install / pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
bun dev
# or: npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

---

## External Services

### 1. Pexels API 📸

**Purpose:** Dynamic ocean and surf photography

**Documentation:** [pexels.com/api](https://www.pexels.com/api/)

**Usage in App:**

- Hero images, backgrounds, and atmospheric photography
- Images are fetched in pools of 15 per category
- Random selection on each page render for fresh feel
- 7 image categories: hero, quote, science, surfer, portugal, cta, contact

**Rate Limits:** 200 requests/hour, 20,000 requests/month (free tier)

---

### 2. Beehiiv 📬

**Purpose:** Newsletter subscription management

**Documentation:** [developers.beehiiv.com](https://developers.beehiiv.com/)

**Usage in App:**

- Newsletter signup form (`/newsletter`, footer)
- Automatic welcome emails
- UTM tracking for signups

**Features Used:**

- Subscription API
- Reactivation of existing subscribers
- Welcome email automation

---

### 3. Resend ✉️

**Purpose:** Transactional emails for contact form

**Documentation:** [resend.com/docs](https://resend.com/docs)

**Usage in App:**

- Contact form submissions (`/contact`)
- HTML-formatted notification emails to `info@bluemindmag.com`

---

### 4. Publuu 📖

**Purpose:** Digital flipbook hosting

**Documentation:** [publuu.com](https://publuu.com/)

**Usage in App:**

- Embedded magazine reader at `/read/[slug]`
- Separate flipbooks per language (EN/PT)
- Iframe-based integration

---

### 5. Google Analytics 4 📊

**Purpose:** Website analytics and user behavior tracking

**Documentation:** [developers.google.com/analytics](https://developers.google.com/analytics/devguides/collection/ga4)

**Setup:**

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com/)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add it to your environment variables as `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**Tracked Events:**
| Event | Trigger | Purpose |
|-------|---------|---------|
| `view_issue_detail` | Visit issue detail page | Track issue discovery |
| `start_reading` | Click "Read Issue" CTA | Primary conversion |
| `reading_session_start` | Flipbook loads | Confirm reader opened |
| `newsletter_signup` | Successful subscription | Secondary conversion |
| `contact_form_submit` | Contact form success | Engagement metric |
| `book_chat_click` | Click "Book a Chat" | Lead generation |

**Core Web Vitals Monitoring:**

The website automatically tracks Core Web Vitals and sends them to GA4:

| Metric | Name                      | Description         | Good Threshold |
| ------ | ------------------------- | ------------------- | -------------- |
| LCP    | Largest Contentful Paint  | Loading performance | ≤ 2.5s         |
| INP    | Interaction to Next Paint | Interactivity       | ≤ 200ms        |
| CLS    | Cumulative Layout Shift   | Visual stability    | ≤ 0.1          |
| FCP    | First Contentful Paint    | Initial render      | ≤ 1.8s         |
| TTFB   | Time to First Byte        | Server response     | ≤ 800ms        |

Each metric includes:

- `value` — The delta value (for summing across reports)
- `metric_id` — Unique ID for deduplication
- `metric_value` — Final metric value
- `metric_rating` — Performance rating (`good`, `needs-improvement`, or `poor`)

**GA4 Admin Setup:**
After deploying, configure these in GA4 Admin:

1. **Custom Dimensions** (Admin > Custom definitions > Create custom dimension):

   - `issue_id` (Scope: Event)
   - `issue_number` (Scope: Event)
   - `issue_title` (Scope: Event)
   - `locale` (Scope: Event)
   - `source` (Scope: Event)
   - `metric_id` (Scope: Event) — Web Vitals deduplication
   - `metric_value` (Scope: Event) — Web Vitals final value
   - `metric_rating` (Scope: Event) — Web Vitals performance rating

2. **Key Events** (Admin > Events > Mark as key event):
   - `start_reading` — Primary KPI
   - `newsletter_signup` — Secondary KPI
   - `book_chat_click` — Tertiary KPI
   - `contact_form_submit` — Tertiary KPI

**Privacy Compliance:**
Google Analytics only loads when users grant "measurement" consent via the cookie banner. This is managed through the c15t consent system.

---

### 6. Vercel (Deployment) 🚀

**Purpose:** Hosting and serverless infrastructure

**Features Used:**

- Automatic deployments from Git
- Edge network for fast global delivery
- Serverless functions for API routes
- Distributed cache for `"use cache"` directive

---

## API Endpoints

### POST `/api/newsletter`

Subscribe an email to the Beehiiv newsletter.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Successfully subscribed!",
  "status": "active"
}
```

---

### POST `/api/contact`

Submit the contact form (sends email via Resend).

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Partnership Inquiry",
  "message": "I'd like to discuss..."
}
```

**Response (Success):**

```json
{
  "message": "Email sent successfully",
  "id": "resend_email_id"
}
```

---

### POST `/api/revalidate-images`

Manually invalidate the Pexels image cache.

**Headers:**

```
x-revalidate-secret: YOUR_REVALIDATE_SECRET
```

**Request (Optional body):**

```json
{
  "tag": "pexels"
}
```

**Available Tags:**
| Tag | Description |
|-----|-------------|
| `pexels` | All Pexels image pools (default) |
| `pexels-pool-hero` | Hero images only |
| `pexels-pool-quote` | Quote backgrounds only |
| `pexels-pool-science` | Science/underwater images |
| `pexels-pool-surfer` | Surfer lifestyle images |
| `pexels-pool-portugal` | Portugal/cliff images |
| `pexels-pool-cta` | CTA/newsletter backgrounds |
| `pexels-pool-contact` | Contact page images |

**Response:**

```json
{
  "revalidated": true,
  "tag": "pexels",
  "timestamp": "2026-01-17T12:00:00.000Z",
  "message": "Successfully revalidated cache for tag: pexels"
}
```

**Usage Example (curl):**

```bash
curl -X POST https://bluemindmag.com/api/revalidate-images \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: YOUR_SECRET" \
  -d '{"tag": "pexels-pool-hero"}'
```

---

### GET `/api/revalidate-images`

Health check and API documentation.

**Response:**

```json
{
  "status": "ok",
  "endpoint": "/api/revalidate-images",
  "method": "POST",
  "description": "Revalidate Pexels image cache on demand",
  "requiredHeaders": {
    "x-revalidate-secret": "Your REVALIDATE_SECRET"
  },
  "availableTags": { ... }
}
```

---

### GET `/api/og`

Generate dynamic Open Graph images.

**Query Parameters:**

- `title` — The title text
- `subtitle` — Optional subtitle

**Example:**

```
/api/og?title=Issue%200&subtitle=January%202026
```

---

## Content Management

### Adding a New Issue

1. **Add issue data** in `content/data/issues.ts`:

```typescript
{
  id: "issue-1",
  slug: "issue-1-march-2026",
  issueNumber: 1,
  date: "2026-03-01",
  accentColor: "#FF6B35",  // Issue theme color
  cover: "/images/issues/issue-1/cover.png",
  flipbook: {
    en: "https://publuu.com/flip-book/xxx/yyy/page/1?embed",
    pt: "https://publuu.com/flip-book/xxx/zzz/page/1?embed",
  },
  sponsors: ["sponsor-id-1", "sponsor-id-2"],
  highlights: [
    { id: "highlight-id", page: 4, image: "/images/issues/issue-1/highlight.jpg" }
  ],
  sections: ["Section 1", "Section 2"],
  isCurrent: true,  // Set to true for current issue
}
```

2. **Add translations** in `content/i18n/en/issues.ts` and `content/i18n/pt/issues.ts`

3. **Upload assets** to `public/images/issues/issue-1/`

### Adding Team Members

Edit `content/data/team.ts`:

```typescript
{
  id: "member-id",
  role: "editor" | "publisher" | "contributor",
  image: "/images/team/member.jpg",
  social: {
    linkedin: "https://linkedin.com/in/...",
    instagram: "https://instagram.com/...",
    website: "https://..."
  }
}
```

### Adding Sponsors

Edit `content/data/sponsors.ts`:

```typescript
{
  id: "sponsor-id",
  name: "Sponsor Name",
  logo: "/images/sponsors/logo.svg",
  url: "https://sponsor-website.com",
  tier: "main" | "supporting"
}
```

---

## Internationalization (i18n)

### Supported Locales

- **English (en)** — Default, served at `/`
- **Portuguese (pt)** — Served at `/pt`

### How It Works

1. **Middleware** (`proxy.ts`) handles locale detection and routing
2. **Cookie persistence** saves user's language preference for 1 year
3. **Translations** are loaded from `messages/*.json`
4. **Content translations** are separate in `content/i18n/*`

### Adding Translations

1. Add strings to `messages/en.json` and `messages/pt.json`:

```json
{
  "MyPage": {
    "title": "My Page Title",
    "description": "Page description here"
  }
}
```

2. Use in components:

```tsx
import { getTranslations } from "next-intl/server";

export default async function MyPage() {
  const t = await getTranslations("MyPage");

  return <h1>{t("title")}</h1>;
}
```

### Language Switching

Users can switch languages via:

- Footer language selector
- Direct URL navigation (`/pt/about`)

The selected language is persisted in a `NEXT_LOCALE` cookie.

---

## Image Caching System

The application uses Next.js 16's `"use cache"` directive for serverless-compatible image caching.

### How It Works

1. **Pool Fetching:** Each image category fetches 15 images from Pexels
2. **Cache Storage:** Pools are cached for 24 hours (1 day TTL) using Vercel's distributed cache
3. **Random Selection:** Each page render randomly selects from the cached pool
4. **Fresh Feel:** Visitors see different images on each visit while minimizing API calls

### Image Categories

| Category   | Usage                           | Query Examples                  |
| ---------- | ------------------------------- | ------------------------------- |
| `hero`     | Homepage, issue pages           | Ocean waves, surfer silhouettes |
| `quote`    | Pull quote backgrounds          | Mist, fog, calm nature          |
| `science`  | About page, scientific sections | Coral reefs, marine life        |
| `surfer`   | Lifestyle sections              | Beach lifestyle, surfboards     |
| `portugal` | Atlantic coast imagery          | Cliffs, rocky coastlines        |
| `cta`      | Newsletter/CTA backgrounds      | Dark, moody ocean               |
| `contact`  | Contact page                    | Warm sunset tones               |

### Cache Invalidation

To refresh images before the 24h TTL expires:

```bash
# Invalidate all image pools
curl -X POST https://bluemindmag.com/api/revalidate-images \
  -H "x-revalidate-secret: YOUR_SECRET"

# Invalidate specific category
curl -X POST https://bluemindmag.com/api/revalidate-images \
  -H "x-revalidate-secret: YOUR_SECRET" \
  -d '{"tag": "pexels-pool-hero"}'
```

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to `main`

### Manual Deployment

```bash
# Build the application
bun run build

# The .next folder contains the production build
# Deploy to your hosting provider
```

### Vercel Configuration

The app uses these Vercel-specific features:

- `cacheComponents: true` — Enables `"use cache"` directive
- Dynamic OG image generation
- Serverless API routes
- Edge middleware for i18n routing

---

## License

All rights reserved © Blue Mind Magazine

---

## Support

For technical issues or questions:

- **Email:** info@bluemindmag.com
- **Website:** [bluemindmag.com](https://bluemindmag.com)
