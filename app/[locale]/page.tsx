import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SiteLayout } from '@/components/site-layout';
import { HeroImmersive } from '@/components/hero-immersive';
import { ScrollReveal } from '@/components/scroll-reveal';
import { StaggerList } from '@/components/stagger-list';
import { PullQuoteImage } from '@/components/pull-quote';
import { IssueCardFeatured, IssueCardMini } from '@/components/issue-card';
import { HorizontalScroll, HorizontalScrollItem } from '@/components/horizontal-scroll';
import { getHeroImage, getQuoteImage, getCtaImage, getSectionImages } from '@/lib/pexels';
import { getAllIssues, getCurrentIssue } from '@/content/data/issues';
import { issueTranslations as enIssueTranslations } from '@/content/i18n/en/issues';
import { issueTranslations as ptIssueTranslations } from '@/content/i18n/pt/issues';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const tCommon = await getTranslations('Common');
  const issues = getAllIssues();
  const currentIssue = getCurrentIssue();

  // Fetch dynamic Pexels images
  const [heroImage, quoteImage, newsletterImage] = await Promise.all([
    getHeroImage(),
    getQuoteImage(),
    getCtaImage(),
  ]);

  // Get section images for highlights
  const highlightIds = currentIssue?.highlights.map(h => h.id) || [];
  const sectionImages = await getSectionImages(highlightIds);

  // Get translations based on locale
  const issueTranslations =
    locale === 'pt' ? ptIssueTranslations : enIssueTranslations;

  // Get past issues (excluding current)
  const pastIssues = issues.filter((issue) => !issue.isCurrent);

  return (
    <SiteLayout newsletterImage={newsletterImage}>
      {/* Section 1: Immersive Hero - Full viewport */}
      <HeroImmersive
        heroImage={heroImage}
        tagline={t('hero.tagline')}
        issueNumber={currentIssue?.issueNumber?.toString() || '0'}
        issueDate={
          currentIssue
            ? new Date(currentIssue.date).toLocaleDateString(
                locale === 'pt' ? 'pt-PT' : 'en-US',
                { month: 'long', year: 'numeric' }
              )
            : 'January 2026'
        }
        issueSlug={currentIssue?.slug}
        issueCover={currentIssue?.cover}
        issueTitle={currentIssue ? issueTranslations[currentIssue.id]?.title : undefined}
      />

      {/* Section 2: Current Issue Feature - Asymmetric layout */}
                {currentIssue && (
        <section className="py-24 md:py-32 lg:py-40">
          <div className="container-editorial">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Cover - Takes more space, floats */}
              <ScrollReveal
                direction="left"
                delay={0.1}
                className="lg:col-span-5"
              >
                <div className="relative">
                  {/* Issue number as giant background text - using accent color */}
                  <div
                    className="absolute -top-16 -left-8 text-display-number pointer-events-none select-none hidden lg:block opacity-[0.08]"
                    style={{ color: currentIssue.accentColor }}
                  >
                    {currentIssue.issueNumber.toString().padStart(2, '0')}
                  </div>

                  <IssueCardFeatured
                    issue={currentIssue}
                    translation={issueTranslations[currentIssue.id]}
                    priority
                  />
                </div>
              </ScrollReveal>

              {/* Content - Asymmetric offset */}
              <ScrollReveal
                direction="right"
                delay={0.2}
                className="lg:col-span-7 lg:pl-8"
              >
                <div className="lg:py-8">
                  <span
                    className="font-ui text-xs font-medium uppercase tracking-[0.3em] mb-3 block"
                    style={{ color: currentIssue.accentColor }}
                  >
                    {issueTranslations[currentIssue.id].subtitle}
                  </span>

                  <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8">
                    {issueTranslations[currentIssue.id].title}
                  </h2>

                  <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl">
                    {issueTranslations[currentIssue.id].description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/read/${currentIssue.slug}`}
                      className="group inline-flex items-center gap-3 text-white px-8 py-4 font-ui text-sm font-medium transition-slow hover:brightness-110"
                      style={{ backgroundColor: currentIssue.accentColor }}
                    >
                      <BookOpen className="w-5 h-5" />
                      {locale === 'pt' ? 'Ler Edição' : 'Read Issue'}
                    </Link>

                    <Link
                      href={`/issues/${currentIssue.slug}`}
                      className="inline-flex items-center gap-2 border border-border px-8 py-4 font-ui text-sm font-medium transition-slow issue-secondary-cta"
                      style={{ '--hover-color': currentIssue.accentColor } as React.CSSProperties}
                    >
                      {locale === 'pt' ? 'Ver Detalhes' : 'View Details'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
          </div>
        </div>
      </section>
      )}

      {/* Section 3: Quick Contents - Compact cards with thumbnails */}
      {currentIssue && currentIssue.highlights.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container-editorial">
            {/* Inline header */}
            <ScrollReveal className="flex items-center justify-between mb-6">
              <span className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {locale === 'pt' ? 'Nesta Edição' : 'In This Issue'}
              </span>
              <Link
                href={`/issues/${currentIssue.slug}#features`}
                className="font-ui text-xs font-medium transition-colors hover:opacity-70 flex items-center gap-1"
                style={{ color: currentIssue.accentColor }}
              >
                {locale === 'pt' ? 'Ver Todos' : 'View All'}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </ScrollReveal>

            {/* Horizontal scroll on mobile */}
            <div className="md:hidden">
              <HorizontalScroll>
                {currentIssue.highlights.slice(0, 5).map((highlight) => {
                  const highlightTranslation =
                    issueTranslations[currentIssue.id].highlights[highlight.id];
                  if (!highlightTranslation) return null;

                  const pexelsImage = sectionImages.get(highlight.id);
                  const imageSrc = highlight.image || pexelsImage?.srcMedium || '/images/hero/ocean-aerial.jpg';

                  return (
                    <HorizontalScrollItem key={highlight.id} className="w-[260px]">
                      <Link
                        href={`/issues/${currentIssue.slug}#features`}
                        className="group block overflow-hidden"
                      >
                        <div className="aspect-[16/10] relative overflow-hidden">
                          <Image
                            src={imageSrc}
                            alt={highlightTranslation.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="260px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          {/* Content inside */}
                          <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <span 
                              className="font-headline text-2xl text-white/90 mb-1"
                            >
                              {highlight.page}
                            </span>
                            <h3 className="font-headline text-sm text-white leading-tight line-clamp-2">
                              {highlightTranslation.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </HorizontalScrollItem>
                  );
                })}
              </HorizontalScroll>
            </div>

            {/* Desktop: Grid with content inside - landscape cards */}
            <div className="hidden md:grid grid-cols-5 gap-4">
              {currentIssue.highlights.slice(0, 5).map((highlight) => {
                const highlightTranslation =
                  issueTranslations[currentIssue.id].highlights[highlight.id];
                if (!highlightTranslation) return null;

                const pexelsImage = sectionImages.get(highlight.id);
                const imageSrc = highlight.image || pexelsImage?.srcMedium || '/images/hero/ocean-aerial.jpg';

                return (
                  <Link
                    key={highlight.id}
                    href={`/issues/${currentIssue.slug}#features`}
                    className="group block overflow-hidden"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={highlightTranslation.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1200px) 20vw, 240px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      {/* Content inside */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-end">
                        <span 
                          className="font-headline text-2xl lg:text-3xl mb-1"
                          style={{ color: currentIssue.accentColor }}
                        >
                          {highlight.page}
                        </span>
                        <h3 className="font-headline text-sm text-white leading-tight line-clamp-2">
                          {highlightTranslation.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Pull Quote with Beautiful Image */}
      <PullQuoteImage
        quote={
          locale === 'pt'
            ? 'O surf sempre foi mais do que um desporto. É uma forma de nos compreendermos através do ritmo do oceano.'
            : 'Surfing has always been more than a sport. It\'s a way of understanding ourselves through the rhythm of the ocean.'
        }
        attribution={locale === 'pt' ? 'Pedro Seixas, Editor' : 'Pedro Seixas, Editor'}
        image={quoteImage}
      />

      {/* Section 5: Past Issues Archive */}
      {pastIssues.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container-editorial">
            <ScrollReveal className="flex items-end justify-between mb-16">
              <div>
                <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                  {locale === 'pt' ? 'Arquivo' : 'Archive'}
                </span>
                <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl">
                  {t('archive.title')}
                </h2>
              </div>
              <Link
                href="/issues"
                className="hidden md:flex font-ui text-sm font-medium text-muted-foreground hover:text-brand transition-base items-center gap-2"
              >
                {tCommon('viewAll')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>

            <StaggerList
              staggerDelay={0.08}
              direction="up"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
            >
              {pastIssues.slice(0, 5).map((issue) => (
                <IssueCardMini
                  key={issue.id}
                  issue={issue}
                  translation={issueTranslations[issue.id]}
                />
              ))}
            </StaggerList>

            {/* Mobile view all link */}
            <div className="mt-12 text-center md:hidden">
              <Link
                href="/issues"
                className="font-ui text-sm font-medium text-muted-foreground hover:text-brand transition-base inline-flex items-center gap-2"
              >
                {tCommon('viewAll')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section 6: About Teaser */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-narrow">
          <ScrollReveal className="text-center">
            <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-4 block">
              {locale === 'pt' ? 'A Nossa História' : 'Our Story'}
            </span>
            
            <h2 className="font-headline text-3xl md:text-4xl mb-8">
              {t('about.title')}
            </h2>
            
            <p className="font-body text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              {t('about.description')}
            </p>
            
            <Link
              href="/about"
              className="font-ui inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand transition-base"
            >
              {tCommon('learnMore')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </SiteLayout>
  );
}
