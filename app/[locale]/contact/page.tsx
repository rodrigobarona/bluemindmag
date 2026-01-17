import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  IconMail,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconPencil,
  IconArrowRight,
} from "@tabler/icons-react";
import { SiteLayout } from "@/components/site-layout";
import { ContactForm } from "@/components/contact-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { socialLinks, siteConfig } from "@/content/data/navigation";
import { getCtaImage, getQuoteImage } from "@/lib/pexels";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");

  // Fetch Pexels images
  const [newsletterImage, heroImage] = await Promise.all([
    getCtaImage(),
    getQuoteImage(),
  ]);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <IconBrandInstagram className="h-5 w-5" />;
      case "linkedin":
        return <IconBrandLinkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };

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
                Photo:{" "}
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
                {" / Pexels"}
              </div>
            )}
          </>
        )}

        {/* Fallback gradient */}
        {!heroImage && <div className="absolute inset-0 bg-secondary" />}

        <div className="container-editorial relative z-10">
          <ScrollReveal className="max-w-3xl">
            <span
              className={`font-ui text-xs font-medium uppercase tracking-[0.3em] mb-4 block ${heroImage ? "text-white/70" : "text-brand"}`}
              style={
                heroImage
                  ? { textShadow: "0 1px 3px rgba(0,0,0,0.3)" }
                  : undefined
              }
            >
              {t("subtitle")}
            </span>
            <h1
              className={`font-headline text-5xl md:text-7xl lg:text-8xl mb-6 ${heroImage ? "text-white" : ""}`}
              style={
                heroImage
                  ? { textShadow: "0 2px 8px rgba(0,0,0,0.3)" }
                  : undefined
              }
            >
              {t("title")}
            </h1>
            <p
              className={`font-body text-xl leading-relaxed ${heroImage ? "text-white/80" : "text-muted-foreground"}`}
              style={
                heroImage
                  ? { textShadow: "0 1px 3px rgba(0,0,0,0.2)" }
                  : undefined
              }
            >
              {t("description")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Contact Form Section */}
            <div className="lg:col-span-7">
              {/* Form Header */}
              <div className="mb-10">
                <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-3 block">
                  {locale === "pt" ? "Envie uma mensagem" : "Send a Message"}
                </span>
                <h2 className="font-headline text-3xl md:text-4xl mb-4">
                  {locale === "pt"
                    ? "Adoramos ouvir de si"
                    : "We'd Love to Hear From You"}
                </h2>
                <p className="text-muted-foreground max-w-lg">
                  {locale === "pt"
                    ? "Tem uma pergunta, sugestão ou quer colaborar connosco? Preencha o formulário abaixo e entraremos em contacto em breve."
                    : "Have a question, suggestion, or want to collaborate with us? Fill out the form below and we'll get back to you soon."}
                </p>
              </div>

              {/* Form */}
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 space-y-10">
                {/* Direct Contact */}
                <div>
                  <h3 className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                    {locale === "pt" ? "Contacto direto" : "Direct Contact"}
                  </h3>

                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="group flex items-start gap-4 p-5 -mx-5 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="shrink-0 p-3 bg-brand/10 rounded-lg group-hover:bg-brand/20 transition-colors">
                      <IconMail className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <p className="font-medium mb-1 group-hover:text-brand transition-colors">
                        {siteConfig.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("info.response")}
                      </p>
                    </div>
                  </a>
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Social Links */}
                <div>
                  <h3 className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                    {locale === "pt" ? "Redes sociais" : "Social Media"}
                  </h3>

                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-muted/50 rounded-lg hover:bg-brand hover:text-white transition-all group"
                        aria-label={social.label}
                      >
                        {getSocialIcon(social.platform)}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Contribute CTA */}
                <div className="p-6 bg-brand/5 border border-brand/10 rounded-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 p-2 bg-brand/10 rounded-lg">
                      <IconPencil className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h3 className="font-headline text-xl mb-2">
                        {locale === "pt"
                          ? "Quer contribuir?"
                          : "Want to Contribute?"}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {locale === "pt"
                          ? "Estamos sempre à procura de investigadores, escritores e surfistas que queiram partilhar as suas histórias."
                          : "We're always looking for researchers, writers, and surfers who want to share their stories."}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(locale === "pt" ? "Proposta de Colaboração" : "Collaboration Proposal")}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
                  >
                    {locale === "pt" ? "Enviar proposta" : "Send a proposal"}
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Quick Response Note */}
                <p className="text-xs text-muted-foreground/70 text-center">
                  {locale === "pt"
                    ? "Normalmente respondemos dentro de 24-48 horas"
                    : "We typically respond within 24-48 hours"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
