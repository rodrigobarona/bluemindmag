import { SiteLayout } from '@/components/site-layout';
import { getImageForSlot } from '@/lib/pexels';

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use slot-based system for consistent images
  const newsletterImage = await getImageForSlot('legal:newsletter');
  
  return <SiteLayout newsletterImage={newsletterImage}>{children}</SiteLayout>;
}

