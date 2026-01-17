import { Header } from './header';
import { Footer } from './footer';
import type { ImageResult } from '@/lib/pexels';

interface SiteLayoutProps {
  children: React.ReactNode;
  newsletterImage?: ImageResult | null;
}

export function SiteLayout({ children, newsletterImage }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer newsletterImage={newsletterImage} />
    </div>
  );
}
