'use client';

import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
  useConsentManager,
} from '@c15t/react';
import type { ReactNode } from 'react';

// Translations for English and Portuguese
const translations = {
  en: {
    common: {
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      customize: 'Customize',
      save: 'Save Preferences',
    },
    cookieBanner: {
      title: 'We Value Your Privacy',
      description: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
    },
    consentManagerDialog: {
      title: 'Cookie Preferences',
      description: 'Manage your cookie preferences below. You can enable or disable different types of cookies and save your preferences.',
    },
    consentTypes: {
      necessary: {
        title: 'Necessary',
        description: 'Essential cookies required for the website to function properly. These cannot be disabled.',
      },
      functionality: {
        title: 'Functionality',
        description: 'Cookies that enable enhanced functionality and personalization, such as remembering your language preference.',
      },
      measurement: {
        title: 'Analytics',
        description: 'Cookies that help us understand how visitors interact with our website by collecting anonymous information.',
      },
      marketing: {
        title: 'Marketing',
        description: 'Cookies used to deliver relevant advertisements and track ad campaign performance.',
      },
    },
    legalLinks: {
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePolicy: 'Cookie Policy',
    },
  },
  pt: {
    common: {
      acceptAll: 'Aceitar Todos',
      rejectAll: 'Rejeitar Todos',
      customize: 'Personalizar',
      save: 'Guardar Preferências',
    },
    cookieBanner: {
      title: 'Valorizamos a Sua Privacidade',
      description: 'Utilizamos cookies para melhorar a sua experiência de navegação, fornecer conteúdo personalizado e analisar o nosso tráfego. Ao clicar em "Aceitar Todos", consente a nossa utilização de cookies.',
    },
    consentManagerDialog: {
      title: 'Preferências de Cookies',
      description: 'Gerencie as suas preferências de cookies abaixo. Pode ativar ou desativar diferentes tipos de cookies e guardar as suas preferências.',
    },
    consentTypes: {
      necessary: {
        title: 'Necessários',
        description: 'Cookies essenciais para o funcionamento adequado do website. Estes não podem ser desativados.',
      },
      functionality: {
        title: 'Funcionalidade',
        description: 'Cookies que permitem funcionalidades avançadas e personalização, como lembrar a sua preferência de idioma.',
      },
      measurement: {
        title: 'Analíticos',
        description: 'Cookies que nos ajudam a compreender como os visitantes interagem com o nosso website, recolhendo informações anónimas.',
      },
      marketing: {
        title: 'Marketing',
        description: 'Cookies utilizados para apresentar anúncios relevantes e acompanhar o desempenho das campanhas publicitárias.',
      },
    },
    legalLinks: {
      privacyPolicy: 'Política de Privacidade',
      termsOfService: 'Termos de Serviço',
      cookiePolicy: 'Política de Cookies',
    },
  },
};

// Brand-consistent theme following Blue Mind Magazine design system
// Sharp edges (radius: 0), ocean teal accent, editorial typography
const brandTheme = {
  // ============================================
  // COOKIE BANNER - Bottom notification bar
  // ============================================
  'banner.root': 'fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-card border-t border-border shadow-lg',
  'banner.card': 'max-w-4xl mx-auto',
  'banner.header': 'mb-4',
  'banner.title': 'font-headline text-xl md:text-2xl text-foreground tracking-wide uppercase',
  'banner.description': 'font-body text-sm md:text-base text-muted-foreground leading-relaxed mt-2',
  'banner.footer': 'flex flex-col sm:flex-row gap-3 mt-4',
  'banner.footer.reject-button': 'px-6 py-3 font-ui text-sm font-medium uppercase tracking-wider border border-foreground/20 text-foreground bg-transparent hover:bg-foreground/5 transition-all duration-300 cursor-pointer',
  'banner.footer.customize-button': 'px-6 py-3 font-ui text-sm font-medium uppercase tracking-wider border border-foreground/20 text-foreground bg-transparent hover:bg-foreground/5 transition-all duration-300 cursor-pointer',
  'banner.footer.accept-button': 'px-6 py-3 font-ui text-sm font-medium uppercase tracking-wider bg-brand text-brand-foreground hover:brightness-110 transition-all duration-300 cursor-pointer',
  
  // ============================================
  // CONSENT DIALOG - Full preferences modal
  // ============================================
  'dialog': 'font-sans',
  'dialog.root': 'fixed inset-0 z-[100] flex items-center justify-center p-4',
  'dialog.overlay': 'fixed inset-0 bg-black/60 backdrop-blur-sm',
  'dialog.header': 'border-b border-border p-6',
  'dialog.title': 'font-headline text-2xl md:text-3xl text-foreground tracking-wide uppercase',
  'dialog.description': 'font-body text-sm md:text-base text-muted-foreground leading-relaxed mt-2',
  'dialog.content': 'p-6 max-h-[60vh] overflow-y-auto bg-card',
  'dialog.footer': 'border-t border-border p-6 flex flex-col sm:flex-row gap-3 bg-card',
  
  // ============================================
  // WIDGET - Inside dialog content
  // ============================================
  'widget.root': 'space-y-4',
  'widget.branding': 'hidden',
  'widget.footer': 'flex flex-col sm:flex-row gap-3 pt-4',
  'widget.footer.sub-group': 'flex gap-3',
  'widget.footer.reject-button': 'px-6 py-3 font-ui text-sm font-medium uppercase tracking-wider border border-foreground/20 text-foreground bg-transparent hover:bg-foreground/5 transition-all duration-300 cursor-pointer',
  'widget.footer.accept-button': 'px-6 py-3 font-ui text-sm font-medium uppercase tracking-wider bg-brand text-brand-foreground hover:brightness-110 transition-all duration-300 cursor-pointer',
  'widget.footer.customize-button': 'px-6 py-3 font-ui text-sm font-medium uppercase tracking-wider border border-foreground/20 text-foreground bg-transparent hover:bg-foreground/5 transition-all duration-300 cursor-pointer',
  'widget.footer.save-button': 'px-6 py-3 font-ui text-sm font-medium uppercase tracking-wider bg-brand text-brand-foreground hover:brightness-110 transition-all duration-300 cursor-pointer',
  
  // ============================================
  // ACCORDION - Consent type items
  // ============================================
  'widget.accordion': 'space-y-2',
  'widget.accordion.item': 'border border-border bg-background/50 overflow-hidden',
  'widget.accordion.trigger': 'w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer',
  'widget.accordion.trigger-inner': 'flex items-center gap-3 text-left',
  'widget.accordion.icon': 'text-muted-foreground',
  'widget.accordion.arrow.open': 'rotate-180 transition-transform',
  'widget.accordion.arrow.close': 'transition-transform',
  'widget.accordion.content': 'overflow-hidden',
  'widget.accordion.content-inner': 'px-4 pb-4 font-body text-sm text-muted-foreground leading-relaxed',
  
  // ============================================
  // SWITCH - Toggle controls
  // ============================================
  'widget.switch': 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  'widget.switch.track': 'absolute inset-0 transition-colors data-[state=checked]:bg-brand/20 data-[state=checked]:border-brand',
  'widget.switch.thumb': 'pointer-events-none block h-5 w-5 bg-muted-foreground shadow-lg transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-brand data-[state=unchecked]:translate-x-0',
};

interface ConsentManagerProps {
  children: ReactNode;
  locale?: string;
}

function ConsentManagerContent({ children }: { children: ReactNode }) {
  const { isPrivacyDialogOpen } = useConsentManager();
  
  return (
    <>
      {children}
      <CookieBanner noStyle theme={brandTheme} />
      <ConsentManagerDialog noStyle theme={brandTheme} open={isPrivacyDialogOpen} />
    </>
  );
}

export default function ConsentManager({ children, locale = 'en' }: ConsentManagerProps) {
  // Determine the language to use (fallback to 'en' if not supported)
  const lang = locale === 'pt' ? 'pt' : 'en';

  return (
    <ConsentManagerProvider
      options={{
        mode: 'c15t',
        backendURL: '/api/c15t',
        consentCategories: ['necessary', 'functionality', 'measurement', 'marketing'],
        // Always show banner regardless of geolocation (for testing/development)
        // Set to false in production to only show to GDPR regions
        ignoreGeoLocation: true,
        translations: {
          defaultLanguage: lang,
          translations: {
            [lang]: translations[lang],
          },
        },
      }}
    >
      <ConsentManagerContent>{children}</ConsentManagerContent>
    </ConsentManagerProvider>
  );
}

