import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { SiteLayout } from '@/components/site-layout';
import { IssueCard } from '@/components/issue-card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { StaggerList } from '@/components/stagger-list';
import { getAllIssues } from '@/content/data/issues';
import { issueTranslations as enIssueTranslations } from '@/content/i18n/en/issues';
import { issueTranslations as ptIssueTranslations } from '@/content/i18n/pt/issues';
import { getCtaImage, getHeroImage } from '@/lib/pexels';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Issues' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function IssuesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Issues');
  const issues = getAllIssues();
  
  // Fetch Pexels images
  const [newsletterImage, heroImage] = await Promise.all([
    getCtaImage(),
    getHeroImage(),
  ]);

  // Get translations based on locale
  const issueTranslations =
    locale === 'pt' ? ptIssueTranslations : enIssueTranslations;

  // Separate current issue from past issues
  const currentIssue = issues.find((issue) => issue.isCurrent);
  const pastIssues = issues.filter((issue) => !issue.isCurrent);

  return (
    <SiteLayout newsletterImage={newsletterImage}>
      {/* Hero Section - With background image */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background image */}
        {heroImage && (
          <>
            <Image
              src={heroImage.srcLarge || heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
            
            {/* Photo credit */}
            {heroImage.photographer && (
              <div className="absolute bottom-4 right-4 font-ui text-xs text-white/30 z-10">
                Photo:{' '}
                {heroImage.photographerUrl ? (
                  <a
                    href={heroImage.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/50 transition-colors"
                  >
                    {heroImage.photographer}
                  </a>
                ) : (
                  heroImage.photographer
                )}
                {' / Pexels'}
              </div>
            )}
          </>
        )}
        
        {/* Fallback gradient */}
        {!heroImage && <div className="absolute inset-0 bg-secondary" />}

        <div className="container-editorial relative z-10">
          <ScrollReveal className="max-w-3xl">
            <span 
              className={`font-ui text-xs font-medium uppercase tracking-[0.3em] mb-4 block ${heroImage ? 'text-white/70' : 'text-brand'}`}
              style={heroImage ? { textShadow: '0 1px 3px rgba(0,0,0,0.3)' } : undefined}
            >
              {t('subtitle')}
            </span>
            <h1 
              className={`font-headline text-5xl md:text-7xl lg:text-8xl mb-6 ${heroImage ? 'text-white' : ''}`}
              style={heroImage ? { textShadow: '0 2px 8px rgba(0,0,0,0.3)' } : undefined}
            >
              {t('title')}
            </h1>
            <p 
              className={`font-body text-xl leading-relaxed max-w-2xl ${heroImage ? 'text-white/80' : 'text-muted-foreground'}`}
              style={heroImage ? { textShadow: '0 1px 3px rgba(0,0,0,0.2)' } : undefined}
            >
              {t('description')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Current Issue Feature */}
      {currentIssue && (
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container-editorial">
            <ScrollReveal className="mb-12">
              <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {locale === 'pt' ? 'Edição Atual' : 'Current Issue'}
              </span>
              <h2 className="font-headline text-3xl md:text-4xl">
                {issueTranslations[currentIssue.id].title}
              </h2>
            </ScrollReveal>

            <div className="max-w-sm mx-auto md:max-w-md">
              <IssueCard
                issue={currentIssue}
                translation={issueTranslations[currentIssue.id]}
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Past Issues Grid */}
      {pastIssues.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-editorial">
            <ScrollReveal className="mb-16">
              <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {locale === 'pt' ? 'Edições Anteriores' : 'Past Issues'}
              </span>
              <h2 className="font-headline text-3xl md:text-4xl">
                {locale === 'pt' ? 'Arquivo' : 'Archive'}
              </h2>
            </ScrollReveal>

            <StaggerList
              staggerDelay={0.1}
              direction="up"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            >
              {pastIssues.map((issue, index) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  translation={issueTranslations[issue.id]}
                  priority={index < 3}
                />
              ))}
            </StaggerList>
          </div>
        </section>
      )}

      {/* All Issues (if no current/past separation) */}
      {!currentIssue && pastIssues.length === 0 && issues.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-editorial">
            <StaggerList
              staggerDelay={0.1}
              direction="up"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            >
              {issues.map((issue, index) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  translation={issueTranslations[issue.id]}
                  priority={index < 3}
                />
              ))}
            </StaggerList>
          </div>
        </section>
      )}

      {/* Empty state */}
      {issues.length === 0 && (
        <section className="py-32">
          <div className="container-editorial text-center">
            <p className="font-body text-muted-foreground text-xl">
              {locale === 'pt'
                ? 'Ainda não há edições disponíveis. Volte em breve!'
                : 'No issues available yet. Check back soon!'}
            </p>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
