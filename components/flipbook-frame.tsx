'use client';

import { Frame } from '@c15t/react';
import { BookOpen } from 'lucide-react';

interface FlipbookFrameProps {
  src: string;
  title: string;
  issueNumber: number;
  locale: string;
}

// Custom placeholder component matching brand guidelines
function FlipbookPlaceholder({ 
  title, 
  issueNumber,
  locale 
}: { 
  title: string; 
  issueNumber: number;
  locale: string;
}) {
  const text = {
    en: {
      title: 'Cookie Consent Required',
      description: 'To view the interactive magazine, please accept functionality cookies.',
      button: 'Accept & View Magazine',
    },
    pt: {
      title: 'Consentimento de Cookies Necessário',
      description: 'Para ver a revista interativa, por favor aceite os cookies de funcionalidade.',
      button: 'Aceitar & Ver Revista',
    },
  };

  const t = locale === 'pt' ? text.pt : text.en;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-card/95 backdrop-blur-sm p-8 text-center">
      {/* Icon */}
      <div className="w-20 h-20 mb-6 flex items-center justify-center bg-brand/10 border border-brand/20">
        <BookOpen className="w-10 h-10 text-brand" />
      </div>

      {/* Issue info */}
      <div className="font-ui text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
        Issue {String(issueNumber).padStart(2, '0')}
      </div>

      {/* Title */}
      <h2 className="font-headline text-2xl md:text-3xl text-foreground mb-4 tracking-wide uppercase">
        {t.title}
      </h2>

      {/* Description */}
      <p className="font-body text-muted-foreground mb-8 max-w-md leading-relaxed">
        {t.description}
      </p>

      {/* The Frame.Button will handle opening the consent dialog */}
      <Frame.Button
        category="functionality"
        className="px-8 py-4 font-ui text-sm font-medium uppercase tracking-wider bg-brand text-brand-foreground hover:brightness-110 transition-all duration-300"
      >
        {t.button}
      </Frame.Button>

      {/* Magazine title below */}
      <div className="mt-8 pt-6 border-t border-border/50">
        <p className="font-accent text-sm italic text-muted-foreground">
          {title}
        </p>
      </div>
    </div>
  );
}

export function FlipbookFrame({ src, title, issueNumber, locale }: FlipbookFrameProps) {
  return (
    <Frame
      category="functionality"
      placeholder={
        <FlipbookPlaceholder 
          title={title} 
          issueNumber={issueNumber} 
          locale={locale} 
        />
      }
      noStyle
      className="w-full h-full"
    >
      <iframe
        src={src}
        title={`Blue Mind Magazine Issue ${issueNumber}`}
        className="w-full h-full"
        allow="clipboard-write; autoplay; fullscreen"
        allowFullScreen
      />
    </Frame>
  );
}

