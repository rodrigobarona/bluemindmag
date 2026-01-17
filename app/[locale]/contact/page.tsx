import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconArrowRight,
  IconWaveSine,
  IconCalendar,
  IconCoffee,
} from "@tabler/icons-react";
import { SiteLayout } from "@/components/site-layout";
import { ContactForm } from "@/components/contact-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { socialLinks, siteConfig } from "@/content/data/navigation";
import { getTeamMemberById } from "@/content/data/team";
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
  const editor = getTeamMemberById("pedro-seixas");

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
              {locale === "pt" ? "Vamos Conversar" : "Let's Talk"}
            </span>
            <h1
              className={`font-headline text-5xl md:text-7xl lg:text-8xl mb-6 ${heroImage ? "text-white" : ""}`}
              style={
                heroImage
                  ? { textShadow: "0 2px 8px rgba(0,0,0,0.3)" }
                  : undefined
              }
            >
              {locale === "pt" ? "Olá!" : "Say Hello"}
            </h1>
            <p
              className={`font-body text-xl leading-relaxed ${heroImage ? "text-white/80" : "text-muted-foreground"}`}
              style={
                heroImage
                  ? { textShadow: "0 1px 3px rgba(0,0,0,0.2)" }
                  : undefined
              }
            >
              {locale === "pt"
                ? "A Blue Mind Magazine é um projeto de paixão. Se tens uma história para contar, uma ideia para partilhar, ou simplesmente queres dizer olá — adoraria ouvir-te."
                : "Blue Mind Magazine is a passion project. If you have a story to tell, an idea to share, or just want to say hi — I'd love to hear from you."}
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
                <h2 className="font-headline text-3xl md:text-4xl mb-4">
                  {locale === "pt"
                    ? "Envia-me uma mensagem"
                    : "Drop me a message"}
                </h2>
                <p className="text-muted-foreground max-w-lg leading-relaxed">
                  {locale === "pt"
                    ? "Seja uma pergunta, sugestão, proposta de colaboração, ou apenas para partilhar a tua última sessão de surf — respondo a todas as mensagens pessoalmente."
                    : "Whether it's a question, suggestion, collaboration idea, or just to share your latest surf session — I personally read and reply to every message."}
                </p>
              </div>

              {/* Form */}
              <ContactForm />
            </div>

            {/* Sidebar - Personal Touch */}
            <div className="lg:col-span-5">
              {/* Personal Note from Pedro - Always visible at top */}
              <div className="relative pb-8 mb-8 border-b border-border">
                <div className="flex items-start gap-4 mb-6">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                      {editor?.image ? (
                        <Image
                          src={editor.image}
                          alt="Pedro Seixas"
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-headline text-xl">
                          PS
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-1">Pedro Seixas</p>
                    <p className="text-sm text-muted-foreground">
                      {locale === "pt"
                        ? "Editor & Fundador"
                        : "Editor & Founder"}
                    </p>
                  </div>
                </div>

                <div className="pl-0">
                  <IconWaveSine className="h-8 w-8 text-brand/30 mb-3" />
                  <p className="font-accent italic text-muted-foreground leading-relaxed text-lg">
                    {locale === "pt"
                      ? '"A Blue Mind nasceu da paixão pelo surf e pela ciência. Cada mensagem que recebo é uma oportunidade de conectar com alguém que partilha esta visão. Não hesites em escrever!"'
                      : '"Blue Mind was born from a passion for surf and science. Every message I receive is a chance to connect with someone who shares this vision. Don\'t hesitate to reach out!"'}
                  </p>
                </div>
              </div>

              {/* Actions - Sticky section */}
              <div className="space-y-8">
                {/* Book a Chat */}
                <div>
                  <h3 className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-5">
                    {locale === "pt" ? "Preferes conversar?" : "Prefer to chat?"}
                  </h3>

                  <a
                    href="https://cal.com/pedroseixas/15min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-5 bg-muted/50 rounded-xl hover:bg-brand/10 border border-transparent hover:border-brand/20 transition-all"
                  >
                    <div className="p-3 bg-brand/10 rounded-full group-hover:bg-brand/20 transition-colors">
                      <IconCoffee className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <p className="font-medium text-lg group-hover:text-brand transition-colors">
                        {locale === "pt" ? "Marca um café virtual" : "Book a virtual coffee"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === "pt" ? "15 min • Grátis" : "15 min • Free"}
                      </p>
                    </div>
                    <IconCalendar className="h-5 w-5 text-muted-foreground ml-auto group-hover:text-brand transition-colors" />
                  </a>

                  <p className="text-sm text-muted-foreground mt-4">
                    {locale === "pt"
                      ? "Para conversas rápidas, colaborações ou só para trocar ideias sobre surf e ciência."
                      : "For quick chats, collaborations, or just to talk surf and science."}
                  </p>
                </div>

                {/* Connect on Social */}
                <div className="pt-8 border-t border-border">
                  <h3 className="font-ui text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-5">
                    {locale === "pt" ? "Acompanha nas redes" : "Follow along"}
                  </h3>

                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-muted/50 rounded-full hover:bg-brand hover:text-white transition-all"
                        aria-label={social.label}
                      >
                        {getSocialIcon(social.platform)}
                      </a>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground mt-4">
                    {locale === "pt"
                      ? "Partilho bastidores, novidades e boas ondas"
                      : "Behind the scenes, updates, and good vibes"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Want to Contribute - Full width section */}
      <section className="py-16 md:py-20 bg-brand/5 border-t border-brand/10">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <span className="font-ui text-xs font-medium uppercase tracking-[0.3em] text-brand mb-4 block">
              {locale === "pt" ? "Colabora Connosco" : "Contribute"}
            </span>
            <h2 className="font-headline text-3xl md:text-4xl mb-4">
              {locale === "pt"
                ? "Queres escrever para a revista?"
                : "Want to write for the magazine?"}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              {locale === "pt"
                ? "Se és investigador, surfista, ou apenas apaixonado pelo oceano com uma história para contar — envia-me as tuas ideias! Estou sempre à procura de novas vozes e perspetivas."
                : "If you're a researcher, surfer, or just ocean-passionate with a story to tell — send me your ideas! I'm always looking for new voices and perspectives."}
            </p>
            <Link
              href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(locale === "pt" ? "Proposta de Artigo para Blue Mind" : "Article Pitch for Blue Mind")}`}
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-ui text-sm font-medium transition-slow hover:bg-brand"
            >
              {locale === "pt" ? "Enviar proposta" : "Pitch an idea"}
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
