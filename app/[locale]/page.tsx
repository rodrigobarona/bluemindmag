import { setRequestLocale } from 'next-intl/server';
import { ComponentExample } from '@/components/component-example';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <ComponentExample />;
}

