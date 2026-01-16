// ============================================
// C15T COOKIE CONSENT CONFIGURATION
// ============================================

export const c15tConfig = {
  // Cookie categories
  categories: {
    essential: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      enabled: false,
      readOnly: false,
    },
    marketing: {
      enabled: false,
      readOnly: false,
    },
  },

  // UI Configuration
  ui: {
    // Theme colors matching brand
    colors: {
      primary: '#0097B2',
      background: '#000000',
      text: '#ffffff',
      border: 'rgba(255, 255, 255, 0.1)',
    },
  },

  // Cookie settings
  cookie: {
    name: 'bluemind_consent',
    expiryDays: 365,
  },
};

// Cookie category descriptions for the consent banner
export const cookieCategories = [
  {
    id: 'essential',
    name: 'Essential',
    description:
      'These cookies are necessary for the website to function and cannot be switched off.',
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description:
      'These cookies help us understand how visitors interact with our website.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description:
      'These cookies may be used to show you relevant advertising on other websites.',
    required: false,
  },
];

