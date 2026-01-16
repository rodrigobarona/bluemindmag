import Link from "next/link";
import { useTranslations } from "next-intl";
import { Instagram, Linkedin } from "lucide-react";
import {
  footerNavLinks,
  socialLinks,
  siteConfig,
} from "@/content/data/navigation";

export function Footer() {
  const t = useTranslations("Navigation");
  const tFooter = useTranslations("Footer");

  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="border-t border-border">
      {/* Newsletter CTA Section */}
      <div className="bg-muted/50">
        <div className="container-editorial py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="headline text-2xl md:text-3xl mb-4">
              {tFooter("newsletter.title")}
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              {tFooter("newsletter.description")}
            </p>
            <Link
              href="/newsletter"
              className="inline-flex bg-foreground text-background px-8 py-3 text-sm font-medium transition-fast hover:bg-brand"
            >
              {tFooter("newsletter.cta")}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-editorial py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="headline text-xl tracking-widest">
                BLUE MIND
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              {siteConfig.tagline}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-brand transition-fast"
                  aria-label={social.label}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs font-semibold mb-4 uppercase tracking-wide text-muted-foreground">
              {tFooter("navigation")}
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-foreground hover:text-brand transition-fast"
              >
                {t("home")}
              </Link>
              <Link
                href="/issues"
                className="text-sm text-foreground hover:text-brand transition-fast"
              >
                {t("issues")}
              </Link>
              <Link
                href="/about"
                className="text-sm text-foreground hover:text-brand transition-fast"
              >
                {t("about")}
              </Link>
              <Link
                href="/contact"
                className="text-sm text-foreground hover:text-brand transition-fast"
              >
                {t("contact")}
              </Link>
            </nav>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-xs font-semibold mb-4 uppercase tracking-wide text-muted-foreground">
              {tFooter("legal")}
            </h4>
            <nav className="flex flex-col gap-3">
              {footerNavLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-sm text-foreground hover:text-brand transition-fast"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            © {currentYear} {siteConfig.name}. {tFooter("rights")}
          </p>
          <p>
            {tFooter("publishedBy")}{" "}
            <a
              href="https://surfisio.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-brand transition-fast"
            >
              Surfisio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
