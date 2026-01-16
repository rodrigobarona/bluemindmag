import { SiteLayout } from '@/components/site-layout';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteLayout>{children}</SiteLayout>;
}

