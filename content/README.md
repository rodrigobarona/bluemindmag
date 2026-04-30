# 📚 Content Guide

This guide explains how to update the Blue Mind Magazine website content. **You don't need to be a developer** to make most changes - just edit text files!

---

## 🎯 Quick Start

**Most common tasks:**

- **Change text on pages** → Edit `.mdx` files in [`pages/`](./pages/)
- **Update magazine issues** → Edit `.mdx` files in [`issues/`](./issues/)
- **Add/edit sponsors** → Edit [`sponsors/sponsors.mdx`](./sponsors/sponsors.mdx)
- **Update images** → Add files to [`/public/images/`](../public/images/) folder

---

## 📝 What is MDX?

**MDX files** (`.mdx`) are simple text files where you write content. They have two parts:

```yaml
---
# PART 1: Settings (between the --- lines)
# This is called "frontmatter"
title: "Page Title"
description: "Page description"
---
# PART 2: Content (below the second ---)
This is where you write paragraphs, headings, etc.
```

**You can edit these files with any text editor** (VS Code, Notepad, etc.)

---

## 🌍 Languages: Portuguese First!

The website supports **Portuguese (PT)** and **English (EN)**.

### Golden Rule

> **Always edit Portuguese files first, then update English.**

Portuguese is the "master" language. When you change something:

1. ✅ Edit the PT file first
2. ✅ Then translate and update the EN file
3. ❌ Never edit only the EN file

---

## 📁 Folder Structure

```
content/
├── issues/          ← Magazine issues
│   ├── pt/          ← Portuguese (edit first!)
│   └── en/          ← English
├── pages/           ← Website pages (About, Contact, etc.)
│   ├── pt/          ← Portuguese (edit first!)
│   └── en/          ← English
├── sponsors/        ← Sponsor logos and info
├── site/            ← Quick reference for links
├── data/            ← Config files (requires code knowledge)
└── types/           ← Technical definitions (don't edit)
```

**Quick links:** [`issues/`](./issues/) | [`pages/`](./pages/) | [`sponsors/`](./sponsors/) | [`site/`](./site/) | [`data/`](./data/)

---

## 📖 Magazine Issues

Each magazine issue has its own file with all the articles and information.

### Where are they?

| Language      | File                                                                         | Action                                          |
| ------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| 🇵🇹 Portuguese | [`issues/pt/issue-1-abril-2026.mdx`](./issues/pt/issue-1-abril-2026.mdx)   | [✏️ Edit](./issues/pt/issue-1-abril-2026.mdx)   |
| 🇬🇧 English    | [`issues/en/issue-1-april-2026.mdx`](./issues/en/issue-1-april-2026.mdx)   | [✏️ Edit](./issues/en/issue-1-april-2026.mdx)   |
| 🇵🇹 Portuguese | [`issues/pt/issue-0-janeiro-2026.mdx`](./issues/pt/issue-0-janeiro-2026.mdx) | [✏️ Edit](./issues/pt/issue-0-janeiro-2026.mdx) |
| 🇬🇧 English    | [`issues/en/issue-0-january-2026.mdx`](./issues/en/issue-0-january-2026.mdx) | [✏️ Edit](./issues/en/issue-0-january-2026.mdx) |

### What can you change?

| Field         | What it does          | Example                  |
| ------------- | --------------------- | ------------------------ |
| `title`       | Issue title           | "Issue 0"                |
| `subtitle`    | Month/year            | "January 2026"           |
| `description` | Short summary         | "Our first issue..."     |
| `flipbookUrl` | Link to Publuu reader | "https://publuu.com/..." |
| `highlights`  | List of articles      | See below                |

### Article structure

Each article in `highlights` has:

```yaml
highlights:
  - id: "editors-note" # Unique ID (don't change)
    page: 3 # Page number in magazine
    image: "/images/issues/..." # Thumbnail image path
    title: "Editor's Note" # Section label (e.g., "Meet the Scientist")
    headline: "Welcome to..." # Article headline (main title shown)
    author: "Pedro Seixas" # Author name
    excerpt: "Short teaser..." # Brief description
```

> **💡 Title vs Headline:** The `title` is a short label (like "Editor's Note"), while `headline` is the actual article title displayed prominently.

---

## 📄 Website Pages

Each page on the website has its own content file.

### Available pages

| Page           | 🇵🇹 Portuguese                                    | 🇬🇧 English                                       |
| -------------- | ------------------------------------------------ | ------------------------------------------------ |
| Home           | [✏️ `home.mdx`](./pages/pt/home.mdx)             | [✏️ `home.mdx`](./pages/en/home.mdx)             |
| About          | [✏️ `about.mdx`](./pages/pt/about.mdx)           | [✏️ `about.mdx`](./pages/en/about.mdx)           |
| Contact        | [✏️ `contact.mdx`](./pages/pt/contact.mdx)       | [✏️ `contact.mdx`](./pages/en/contact.mdx)       |
| Newsletter     | [✏️ `newsletter.mdx`](./pages/pt/newsletter.mdx) | [✏️ `newsletter.mdx`](./pages/en/newsletter.mdx) |
| Privacy Policy | [✏️ `privacy.mdx`](./pages/pt/privacy.mdx)       | [✏️ `privacy.mdx`](./pages/en/privacy.mdx)       |
| Terms of Use   | [✏️ `terms.mdx`](./pages/pt/terms.mdx)           | [✏️ `terms.mdx`](./pages/en/terms.mdx)           |
| Cookie Policy  | [✏️ `cookies.mdx`](./pages/pt/cookies.mdx)       | [✏️ `cookies.mdx`](./pages/en/cookies.mdx)       |

### Example: Changing the home page tagline

1. Open [`pages/pt/home.mdx`](./pages/pt/home.mdx)
2. Find the `hero` section:
   ```yaml
   hero:
     tagline: "De surfistas, para surfistas"
   ```
3. Change the text
4. Open [`pages/en/home.mdx`](./pages/en/home.mdx)
5. Update the English version:
   ```yaml
   hero:
     tagline: "From surfers, to surfers"
   ```

---

## 🤝 Sponsors

Sponsors appear in the website footer.

### Where to edit

[✏️ **Edit sponsors.mdx**](./sponsors/sponsors.mdx)

### How to add a new sponsor

1. **Add the logo image** to [`/public/images/sponsors/`](../public/images/sponsors/)
   - Use SVG or PNG format (SVG preferred, PNG with transparent background)
   - **Use the naming convention: `name_WIDTHxHEIGHT.ext`**
     - Example: `ferox-surfboards_476x113.svg` (original dimensions 476×113)
     - This ensures all logos display proportionally in the carousel
   - To find dimensions: open the image, note its width×height in pixels

2. **Add entry to [`sponsors.mdx`](./sponsors/sponsors.mdx):**

```yaml
sponsors:
  - id: "new-sponsor" # Unique ID (lowercase, hyphens)
    name: "New Sponsor Name" # Display name
    logo: "/images/sponsors/new-sponsor_400x120.svg" # Use _WxH naming convention!
    alt: "New Sponsor logo" # Description for accessibility
    url: "https://newsponsor.com" # Website link
    tier: "supporting" # main, supporting, or community
```

> **💡 Why the naming convention?** The carousel automatically parses `_WxH` from filenames to calculate proportional sizing. All logos appear balanced regardless of their original dimensions.

### Sponsor tiers

- `main` - Primary sponsors (shown larger)
- `supporting` - Regular sponsors
- `community` - Community partners

---

## 🔗 Links

External links are stored in different places depending on what they're for.

### Quick reference

| I want to change...            | Where to edit                                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Cal.com booking link           | [✏️ `pages/pt/contact.mdx`](./pages/pt/contact.mdx) AND [✏️ `pages/en/contact.mdx`](./pages/en/contact.mdx) → find `links.calcom` |
| SMI (Surfing Medicine) link    | [✏️ `pages/pt/about.mdx`](./pages/pt/about.mdx) AND [✏️ `pages/en/about.mdx`](./pages/en/about.mdx) → find `supporters.smi.url`   |
| Instagram/LinkedIn (Blue Mind) | [✏️ `data/navigation.ts`](./data/navigation.ts) → find `socialLinks`                                                              |
| Team social links              | [✏️ `data/team.ts`](./data/team.ts) → find `social`                                                                               |
| Sponsor website links          | [✏️ `sponsors/sponsors.mdx`](./sponsors/sponsors.mdx) → find `url`                                                                |

### Example: Changing the Cal.com booking link

1. Open [`pages/pt/contact.mdx`](./pages/pt/contact.mdx)
2. Find at the bottom:
   ```yaml
   links:
     calcom: "https://cal.com/pedroseixas/15min"
   ```
3. Change the URL
4. **Important:** Also update [`pages/en/contact.mdx`](./pages/en/contact.mdx) with the same URL

---

## 🖼️ Images

### Where images are stored

All images go in the [`/public/images/`](../public/images/) folder:

```
public/images/
├── issues/           ← Magazine covers and article images
│   └── issue-0/
│       ├── cover.png
│       └── article-image.jpg
├── sponsors/         ← Sponsor logos
│   └── sponsor-logo.png
├── team/             ← Team member photos
│   └── pedro-seixas.png
└── hero/             ← Background images
```

**Quick links:** [`issues/`](../public/images/issues/) | [`sponsors/`](../public/images/sponsors/) | [`team/`](../public/images/team/)

### How to add images

#### For magazine issues

1. Create a folder: `/public/images/issues/issue-X/`
2. Add images there
3. Reference in the MDX file:
   ```yaml
   cover: "/images/issues/issue-X/cover.png"
   ```

#### For sponsors

1. Add logo to [`/public/images/sponsors/`](../public/images/sponsors/)
2. Reference in [`sponsors.mdx`](./sponsors/sponsors.mdx):
   ```yaml
   logo: "/images/sponsors/sponsor-logo.png"
   ```

### Image best practices

- **Logos**: PNG format, transparent background, max 400x150px
- **Photos**: JPG format, optimized for web (use [TinyPNG](https://tinypng.com))
- **Covers**: PNG format, portrait orientation, 800x1100px recommended
- **Naming**: Use lowercase letters and hyphens (`my-image-name.png`)

### Automatic Background Images (Pexels)

Some images are loaded automatically from **Pexels** (a free photo service). These rotate every hour for variety.

**You don't need to add these manually** - they're fetched automatically based on search tags.

#### Which images are automatic?

| Page       | Section           | Image Style          |
| ---------- | ----------------- | -------------------- |
| Home       | Hero background   | Dramatic ocean/surf  |
| Home       | Quote section     | Calm, peaceful ocean |
| Home       | Newsletter        | Turquoise ocean      |
| About      | Hero background   | Portuguese cliffs    |
| About      | Quote section     | Calm ocean           |
| About      | Surfer section    | Surfer lifestyle     |
| Contact    | Hero background   | Warm sunset          |
| Newsletter | Hero background   | Beach/ocean          |
| All pages  | Newsletter footer | Blue ocean           |

#### How to change Pexels search tags

If you want different style images, edit [`lib/pexels.ts`](../lib/pexels.ts):

1. **Find the category** you want to change (around line 29-104):

   ```typescript
   // Hero images - Dramatic, cinematic ocean/surf
   const HERO_QUERIES = [
     "ocean waves aerial view",
     "surfer silhouette sunset",
     "underwater ocean blue",
     // Add or change search terms here
   ];
   ```

2. **Available categories:**
   - `HERO_QUERIES` - Main hero backgrounds (dramatic)
   - `QUOTE_QUERIES` - Quote sections (calm, peaceful)
   - `SCIENCE_QUERIES` - Science sections (underwater, marine)
   - `SURFER_QUERIES` - Surfer lifestyle
   - `PORTUGAL_QUERIES` - Atlantic cliffs, dramatic coast
   - `CTA_QUERIES` - Newsletter sections (turquoise, blue)
   - `CONTACT_QUERIES` - Contact page (warm, sunset)

3. **Slot assignments** (which category goes where) are in `IMAGE_SLOTS` (around line 128):
   ```typescript
   const IMAGE_SLOTS = {
     "home:hero": { category: "hero", index: 0 },
     "about:hero": { category: "portugal", index: 0 },
     "contact:hero": { category: "contact", index: 0 },
     // Change category to use different image style
   };
   ```

#### How to test Pexels images

1. **Start development server:**

   ```bash
   npm run dev
   ```

2. **Visit pages to see images:**
   - Home: `http://localhost:3000`
   - About: `http://localhost:3000/about`
   - Contact: `http://localhost:3000/contact`

3. **Force image refresh:**
   - Images rotate every hour automatically
   - To see different images immediately, wait 1 hour or restart the dev server

4. **Check if Pexels is working:**
   - If you see fallback images (local `/images/fallback/` files), Pexels API might not be configured
   - Check that `PEXELS_API_KEY` is set in `.env.local`

5. **Test specific search queries:**
   - Add a temporary query to test: `'your test search term'`
   - Restart dev server
   - Check if images match what you want

#### Troubleshooting Pexels

**Images not loading:**

- Check `.env.local` has `PEXELS_API_KEY=your_key`
- Get a free API key at [pexels.com/api](https://www.pexels.com/api/)

**Wrong style of images:**

- Edit the search queries in [`lib/pexels.ts`](../lib/pexels.ts)
- Use descriptive terms: `'ocean waves aerial view'` not just `'ocean'`

**Same image showing everywhere:**

- Each page slot uses different queries/indexes
- Check `IMAGE_SLOTS` configuration

---

## ✅ Common Tasks Checklist

### Update page text

- [ ] Edit Portuguese file in [`pages/pt/`](./pages/pt/)
- [ ] Edit English file in [`pages/en/`](./pages/en/)
- [ ] Test locally or wait for deployment

### Add new magazine issue

- [ ] Create folder `/public/images/issues/issue-X/`
- [ ] Add cover image and article images
- [ ] Create file in [`issues/pt/`](./issues/pt/)
- [ ] Create file in [`issues/en/`](./issues/en/)
- [ ] Set `isCurrent: true` on new issue, `isCurrent: false` on old current issue

### Add new sponsor

- [ ] Add logo to [`/public/images/sponsors/`](../public/images/sponsors/) using `name_WxH.ext` naming
- [ ] Add entry to [`sponsors/sponsors.mdx`](./sponsors/sponsors.mdx)

### Update external link

- [ ] Find the file using the Links table above
- [ ] Update the URL
- [ ] If it's in pages, update BOTH Portuguese and English files

---

## 🔄 After Making Changes

### In development (localhost)

Changes appear automatically when you save the file.

### For production

1. Commit your changes to Git
2. Push to the main branch
3. The site will automatically rebuild and deploy

### Need to test first?

Run this command to build and check for errors:

```bash
npm run build
```

---

## ❓ Glossary

| Term            | Meaning                                                              |
| --------------- | -------------------------------------------------------------------- |
| **MDX**         | A text file format for content (like a Word doc, but simpler)        |
| **Frontmatter** | The settings section at the top of an MDX file (between `---` lines) |
| **Locale**      | A language version (PT = Portuguese, EN = English)                   |
| **Slug**        | The URL-friendly name (e.g., `issue-0-january-2026`)                 |
| **Path**        | The location of a file (e.g., `/public/images/logo.png`)             |
| **Tier**        | Sponsor level (main, supporting, community)                          |

---

## 🆘 Need Help?

### Common issues

**"My changes aren't showing"**

- Did you edit BOTH Portuguese and English files?
- Did you save the file?
- Try refreshing with Ctrl+Shift+R (or Cmd+Shift+R on Mac)

**"The build is failing"**

- Check for typos in the YAML (frontmatter)
- Make sure all quotes are closed
- Check that image paths are correct

**"Image not appearing"**

- Is the file in `/public/images/`?
- Is the path in the MDX correct?
- Does the filename match exactly (including uppercase/lowercase)?

### Getting support

Contact the development team if you're stuck!

---

## 📂 All Content Files

### Pages (edit these for website text)

| File                                                      | Description                  |
| --------------------------------------------------------- | ---------------------------- |
| [✏️ `pages/pt/home.mdx`](./pages/pt/home.mdx)             | Home page (Portuguese)       |
| [✏️ `pages/en/home.mdx`](./pages/en/home.mdx)             | Home page (English)          |
| [✏️ `pages/pt/about.mdx`](./pages/pt/about.mdx)           | About page (Portuguese)      |
| [✏️ `pages/en/about.mdx`](./pages/en/about.mdx)           | About page (English)         |
| [✏️ `pages/pt/contact.mdx`](./pages/pt/contact.mdx)       | Contact page (Portuguese)    |
| [✏️ `pages/en/contact.mdx`](./pages/en/contact.mdx)       | Contact page (English)       |
| [✏️ `pages/pt/newsletter.mdx`](./pages/pt/newsletter.mdx) | Newsletter page (Portuguese) |
| [✏️ `pages/en/newsletter.mdx`](./pages/en/newsletter.mdx) | Newsletter page (English)    |
| [✏️ `pages/pt/privacy.mdx`](./pages/pt/privacy.mdx)       | Privacy Policy (Portuguese)  |
| [✏️ `pages/en/privacy.mdx`](./pages/en/privacy.mdx)       | Privacy Policy (English)     |
| [✏️ `pages/pt/terms.mdx`](./pages/pt/terms.mdx)           | Terms of Use (Portuguese)    |
| [✏️ `pages/en/terms.mdx`](./pages/en/terms.mdx)           | Terms of Use (English)       |
| [✏️ `pages/pt/cookies.mdx`](./pages/pt/cookies.mdx)       | Cookie Policy (Portuguese)   |
| [✏️ `pages/en/cookies.mdx`](./pages/en/cookies.mdx)       | Cookie Policy (English)      |

### Other content

| File                                                  | Description                     |
| ----------------------------------------------------- | ------------------------------- |
| [✏️ `sponsors/sponsors.mdx`](./sponsors/sponsors.mdx) | Sponsor logos and info          |
| [✏️ `data/navigation.ts`](./data/navigation.ts)       | Social links & external URLs    |
| [✏️ `data/team.ts`](./data/team.ts)                   | Team member info & social links |
