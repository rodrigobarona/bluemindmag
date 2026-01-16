import type {
  AboutSectionTranslation,
  TeamMemberTranslation,
} from '../../types/content';

// ============================================
// ENGLISH PAGE TRANSLATIONS
// ============================================

// About Page Sections
export const aboutSections: Record<string, AboutSectionTranslation> = {
  magazine: {
    title: 'About Blue Mind',
    description:
      'Blue Mind Magazine is where surf and science meet. We explore the fascinating intersection of ocean sports, human health, and scientific research. Our mission is to bring evidence-based insights to the surfing community while celebrating the transformative power of the sea.',
  },
  mission: {
    title: 'Our Mission',
    description:
      'To bridge the gap between scientific research and the surfing community, making complex studies accessible and actionable. We believe that understanding the science behind surfing enhances both performance and the deep connection surfers feel with the ocean.',
  },
};

// Team Members
export const teamTranslations: Record<string, TeamMemberTranslation> = {
  'pedro-seixas': {
    name: 'Pedro Seixas',
    title: 'Chief Editor & Founder',
    bio: 'Pedro Seixas holds a PhD in Human Kinetics and serves as the Scientific Coordinator at Surfing Medicine International (SMI). As a physiotherapist and passionate surfer, he founded Blue Mind Magazine to create a platform that unites his two greatest passions: science and surfing.',
  },
  surfisio: {
    name: 'Surfisio',
    title: 'Publisher',
    bio: 'Surfisio is a specialized physiotherapy and sports performance company dedicated to the surfing community. Founded in 2011, Surfisio operates under the philosophy "We Drop The Pain!" — providing injury prevention, treatment, and performance optimization for surfers at all levels.',
  },
};

// Supporter Descriptions
export const supporterTranslations: Record<
  string,
  { name: string; description: string }
> = {
  'surfing-medicine-international': {
    name: 'Surfing Medicine International',
    description:
      'SMI is a non-profit organization founded by medical doctors and surfers dedicated to the science of surfing medicine. They develop research, injury prevention programs, and educational platforms to make surfing safer and recognize surfers as key bystander rescuers.',
  },
};

// Page Meta
export const pageMeta = {
  about: {
    title: 'About',
    description:
      'Learn about Blue Mind Magazine, our mission, and the team behind the publication.',
  },
  contact: {
    title: 'Contact',
    description:
      'Get in touch with Blue Mind Magazine. We would love to hear from you.',
  },
  newsletter: {
    title: 'Newsletter',
    description:
      'Subscribe to the Blue Mind Magazine newsletter for the latest in surf science.',
  },
  issues: {
    title: 'Issues',
    description:
      'Browse all issues of Blue Mind Magazine. Where surf and science meet.',
  },
};

// Contact Page
export const contactContent = {
  title: 'Get in Touch',
  subtitle: "We'd love to hear from you",
  description:
    "Whether you have a question about our magazine, want to contribute an article, or are interested in partnership opportunities, we're here to help.",
  form: {
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    subject: 'Subject',
    subjectPlaceholder: 'How can we help?',
    message: 'Message',
    messagePlaceholder: 'Your message...',
    submit: 'Send Message',
    submitting: 'Sending...',
    success: 'Thank you! Your message has been sent.',
    error: 'Something went wrong. Please try again.',
  },
  info: {
    email: 'info@bluemindmag.com',
    response: "We typically respond within 48 hours.",
  },
};

// Newsletter Page
export const newsletterContent = {
  title: 'Stay in the Loop',
  subtitle: 'Where surf & science meet, delivered to your inbox',
  description:
    'Join our community of surfers, scientists, and ocean enthusiasts. Get exclusive content, early access to new issues, and insights from the world of surf science.',
  cta: 'Subscribe Now',
  features: [
    'New issue announcements',
    'Exclusive surf science insights',
    'Community stories and events',
    'Early access to content',
  ],
};

