import { SiteLayout } from '@/components/site-layout';
import { getCtaImage } from '@/lib/pexels';

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newsletterImage = await getCtaImage();
  
  return <SiteLayout newsletterImage={newsletterImage}>{children}</SiteLayout>;
}

