import type { IssueTranslation } from '../../types/content';

// ============================================
// ENGLISH ISSUE TRANSLATIONS
// ============================================

export const issueTranslations: Record<string, IssueTranslation> = {
  'issue-0': {
    title: 'Issue 0',
    subtitle: 'January 2026',
    description:
      'Our inaugural issue exploring where surf and science meet. Featuring groundbreaking research, inspiring stories from surfers and scientists, and insights into the therapeutic power of the ocean.',
    highlights: {
      'editors-note': {
        title: "Editor's Note",
        author: 'Pedro Seixas, PT, PhD',
        excerpt:
          'Surfing has always been more than a sport. It is a connection to nature, a form of therapy, and a lifestyle that shapes who we are. Welcome to Blue Mind Magazine.',
      },
      'meet-the-scientist': {
        title: 'Meet the Scientist',
        author: 'Blue Mind Team',
        excerpt:
          'Discover the researchers pushing the boundaries of surf science and ocean health. Their work is changing how we understand the relationship between humans and the sea.',
      },
      'students-peak': {
        title: "Student's Peak",
        author: 'Blue Mind Team',
        excerpt:
          'The next generation of surf scientists share their research and passion for combining academic rigor with wave riding.',
      },
      'surf-science-explained': {
        title: 'Surf Science Explained',
        author: 'Blue Mind Team',
        excerpt:
          'Breaking down complex scientific concepts into accessible insights that every surfer can apply to improve their health and performance.',
      },
      'meet-the-surfer': {
        title: 'Meet the Surfer',
        author: 'Blue Mind Team',
        excerpt:
          "Personal stories from the surfing community about how the ocean has transformed their lives, health, and perspective.",
      },
    },
  },
};

// Helper function
export function getIssueTranslation(
  issueId: string
): IssueTranslation | undefined {
  return issueTranslations[issueId];
}

