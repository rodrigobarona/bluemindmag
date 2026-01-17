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
  const [heroImage, quoteImage, ctaImage] = await Promise.all([
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
    <SiteLayout>
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
                  {/* Issue number as giant background text */}
                  <div className="absolute -top-16 -left-8 text-display-number text-foreground/5 pointer-events-none select-none hidden lg:block">
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
                    className="font-ui text-xs font-medium uppercase tracking-[0.3em] mb-4 block"
                    style={{ color: currentIssue.accentColor }}
                  >
                    {locale === 'pt' ? 'Edição Atual' : 'Current Issue'}
                  </span>

                  <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6">
                    {issueTranslations[currentIssue.id].title}
                  </h2>

                  <p className="tagline text-muted-foreground mb-8">
                    {issueTranslations[currentIssue.id].subtitle}
                  </p>

                  <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl">
                    {issueTranslations[currentIssue.id].description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/read/${currentIssue.slug}`}
                      className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-ui text-sm font-medium transition-slow hover:bg-brand"
                    >
                      <BookOpen className="w-5 h-5" />
                      {locale === 'pt' ? 'Ler Edição' : 'Read Issue'}
                    </Link>

                    <Link
                      href={`/issues/${currentIssue.slug}`}
                      className="inline-flex items-center gap-2 border border-border px-8 py-4 font-ui text-sm font-medium transition-slow hover:border-foreground"
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

      {/* Section 3: Editorial Sections - Horizontal scroll on mobile */}
      {currentIssue && currentIssue.highlights.length > 0 && (
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container-editorial mb-12">
            <ScrollReveal>
              <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {locale === 'pt' ? 'Nesta Edição' : 'In This Issue'}
              </span>
              <h2 className="font-headline text-3xl md:text-4xl">
                {locale === 'pt' ? 'Destaques' : 'Featured'}
              </h2>
            </ScrollReveal>
          </div>

          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden">
            <HorizontalScroll className="container-editorial">
              {currentIssue.highlights.map((highlight) => {
                const highlightTranslation =
                  issueTranslations[currentIssue.id].highlights[highlight.id];
                if (!highlightTranslation) return null;

                // Use Pexels image if local doesn't exist, otherwise use local
                const pexelsImage = sectionImages.get(highlight.id);
                const imageSrc = highlight.image || pexelsImage?.srcMedium || '/images/hero/ocean-aerial.jpg';

                return (
                  <HorizontalScrollItem key={highlight.id}>
                    <Link
                      href={`/issues/${currentIssue.slug}#features`}
                      className="group block relative h-[350px] overflow-hidden bg-card"
                    >
                      <Image
                        src={imageSrc}
                        alt={highlightTranslation.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <span
                          className="font-ui text-xs uppercase tracking-widest mb-2 block"
                          style={{ color: currentIssue.accentColor }}
                        >
                          {locale === 'pt' ? 'Página' : 'Page'} {highlight.page}
                        </span>
                        <h3 className="font-headline text-xl">
                          {highlightTranslation.title}
                        </h3>
                      </div>
                    </Link>
                  </HorizontalScrollItem>
                );
              })}
            </HorizontalScroll>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:block container-editorial">
            <StaggerList
              staggerDelay={0.1}
              direction="up"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentIssue.highlights.slice(0, 3).map((highlight) => {
                const highlightTranslation =
                  issueTranslations[currentIssue.id].highlights[highlight.id];
                if (!highlightTranslation) return null;

                // Use Pexels image if local doesn't exist, otherwise use local
                const pexelsImage = sectionImages.get(highlight.id);
                const imageSrc = highlight.image || pexelsImage?.srcLarge || '/images/hero/ocean-aerial.jpg';

                return (
                  <Link
                    key={highlight.id}
                    href={`/issues/${currentIssue.slug}#features`}
                    className="group block relative h-[400px] overflow-hidden bg-card"
                  >
                    <Image
                      src={imageSrc}
                      alt={highlightTranslation.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <span
                        className="font-ui text-xs uppercase tracking-widest mb-3 block opacity-70"
                        style={{ color: currentIssue.accentColor }}
                      >
                        {locale === 'pt' ? 'Página' : 'Page'} {highlight.page}
                      </span>
                      <h3 className="font-headline text-2xl mb-2 group-hover:text-brand transition-colors">
                        {highlightTranslation.title}
                      </h3>
                      <p className="font-body text-white/70 text-sm line-clamp-2">
                        {highlightTranslation.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </StaggerList>
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

      {/* Section 6: Newsletter CTA - With Background Image */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Background image from Pexels */}
        {ctaImage && (
          <>
            <Image
              src={ctaImage.srcLarge || ctaImage.src}
              alt={ctaImage.alt}
              fill
              className="object-cover"
              sizes="100vw"
              quality={80}
            />
            <div className="absolute inset-0 bg-black/60" />
            
            {/* Photo credit */}
            {ctaImage.photographer && (
              <div className="absolute bottom-4 right-4 font-ui text-xs text-white/30 z-10">
                Photo:{' '}
                {ctaImage.photographerUrl ? (
                  <a
                    href={ctaImage.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/50 transition-colors"
                  >
                    {ctaImage.photographer}
                  </a>
                ) : (
                  ctaImage.photographer
                )}
                {' / Pexels'}
              </div>
            )}
          </>
        )}
        
        {/* Fallback gradient if no image */}
        {!ctaImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-warm/10 via-secondary to-brand/5" />
        )}
        
        <div className="container-narrow relative z-10">
          <ScrollReveal className="text-center">
            <span className={`font-ui text-xs font-medium uppercase tracking-[0.3em] mb-4 block ${ctaImage ? 'text-white/60' : 'text-muted-foreground'}`}>
              {locale === 'pt' ? 'Newsletter' : 'Newsletter'}
            </span>
            
            <h2 className={`font-headline text-4xl md:text-5xl lg:text-6xl mb-6 ${ctaImage ? 'text-white' : ''}`}>
              {locale === 'pt' ? 'Fique no Lineup' : 'Stay in the Lineup'}
            </h2>
            
            <p className={`tagline mb-10 max-w-lg mx-auto ${ctaImage ? 'text-white/80' : 'text-muted-foreground'}`}>
              {locale === 'pt'
                ? 'Receba cada nova edição diretamente na sua caixa de entrada.'
                : 'Get each new issue delivered directly to your inbox.'}
            </p>

            <Link
              href="/newsletter"
              className={`inline-flex items-center gap-3 px-10 py-5 font-ui text-sm font-medium transition-slow ${
                ctaImage 
                  ? 'bg-white text-black hover:bg-brand hover:text-white' 
                  : 'bg-foreground text-background hover:bg-brand'
              }`}
            >
              {locale === 'pt' ? 'Subscrever' : 'Subscribe'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 7: About Teaser */}
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
