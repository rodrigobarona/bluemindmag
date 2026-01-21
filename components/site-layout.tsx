import { Header } from './header';
import { Footer } from './footer';
import type { ImageResult } from '@/lib/pexels';
import type { Sponsor } from '@/content/types/content';
import { getAllSponsors } from '@/content/data/sponsors';

interface SiteLayoutProps {
  children: React.ReactNode;
  newsletterImage?: ImageResult | null;
}

export function SiteLayout({ children, newsletterImage }: SiteLayoutProps) {
  // Fetch sponsors on the server side
  const sponsors: Sponsor[] = getAllSponsors();
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip Navigation Link - Accessibility (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer newsletterImage={newsletterImage} sponsors={sponsors} />
    </div>
  );
}
