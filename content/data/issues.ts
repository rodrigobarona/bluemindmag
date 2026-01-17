import type { Issue } from "../types/content";

// ============================================
// BLUE MIND MAGAZINE - ISSUES DATA
// ============================================

export const issues: Issue[] = [
  {
    id: "issue-0",
    slug: "issue-0-january-2026",
    issueNumber: 0,
    date: "2026-01-01",
    accentColor: "#0097B2", // Dark Turquoise
    cover: "/images/issues/issue-0/cover.png",
    flipbook: {
      en: "https://publuu.com/flip-book/1032681/2310890/page/1?embed",
      pt: "https://publuu.com/flip-book/1032681/2310467/page/1?embed",
    },
    sponsors: [
      "surfing-medicine-international",
      "ocean-wellness",
      "blue-wave-foundation",
      "surf-science-labs",
      "coastal-research",
      "wave-therapy",
      "marine-health",
      "surf-academy",
      "ocean-mind",
      "blue-therapy",
      "wave-riders",
      "surf-wellness",
    ],
    highlights: [
      {
        id: "editors-note",
        page: 4,
        image: "/images/issues/issue-0/editors-note.jpg",
      },
      {
        id: "meet-the-scientist",
        page: 12,
        image: "/images/issues/issue-0/meet-scientist.jpg",
      },
      {
        id: "students-peak",
        page: 20,
        image: "/images/issues/issue-0/students-peak.jpg",
      },
      {
        id: "surf-science-explained",
        page: 28,
        image: "/images/issues/issue-0/surf-science.jpg",
      },
      {
        id: "meet-the-surfer",
        page: 36,
        image: "/images/issues/issue-0/meet-surfer.jpg",
      },
    ],
    sections: [
      "Meet the Scientist",
      "Student's Peak",
      "Surf Science Explained",
      "Meet the Surfer",
      "Tips & Tricks",
      "Community Projects",
      "Surfing Medicine International",
    ],
    isCurrent: true,
  },
];

// Helper functions
export function getIssueBySlug(slug: string): Issue | undefined {
  return issues.find((issue) => issue.slug === slug);
}

export function getIssueById(id: string): Issue | undefined {
  return issues.find((issue) => issue.id === id);
}

export function getCurrentIssue(): Issue | undefined {
  return issues.find((issue) => issue.isCurrent);
}

export function getAllIssues(): Issue[] {
  return [...issues].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getIssueCount(): number {
  return issues.length;
}
