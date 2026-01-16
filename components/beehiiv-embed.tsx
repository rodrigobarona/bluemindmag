'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const BEEHIIV_FORM_ID = 'f71586bf-f255-4b0b-91dd-a373a29bbf92';
const BEEHIIV_SCRIPT_URL = 'https://subscribe-forms.beehiiv.com/embed.js';

interface BeehiivEmbedProps {
  className?: string;
}

// Full embed with iframe
export function BeehiivEmbed({ className }: BeehiivEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Beehiiv script if not already loaded
    if (!document.querySelector(`script[src="${BEEHIIV_SCRIPT_URL}"]`)) {
      const script = document.createElement('script');
      script.src = BEEHIIV_SCRIPT_URL;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <iframe
        src={`https://subscribe-forms.beehiiv.com/${BEEHIIV_FORM_ID}`}
        data-test-id="beehiiv-embed"
        frameBorder="0"
        scrolling="no"
        className="beehiiv-embed w-full"
        style={{
          margin: 0,
          borderRadius: 0,
          backgroundColor: 'transparent',
          maxWidth: '100%',
          minHeight: '280px',
        }}
        title="Subscribe to Blue Mind Magazine Newsletter"
      />
    </div>
  );
}

// Minimal inline form - just email input
export function BeehiivInline({ className }: BeehiivEmbedProps) {
  return (
    <div className={cn('w-full max-w-md', className)}>
      <iframe
        src={`https://subscribe-forms.beehiiv.com/${BEEHIIV_FORM_ID}?slim=true`}
        data-test-id="beehiiv-embed"
        frameBorder="0"
        scrolling="no"
        className="w-full"
        style={{
          height: '52px',
          margin: 0,
          backgroundColor: 'transparent',
        }}
        title="Subscribe to Blue Mind Magazine Newsletter"
      />
    </div>
  );
}

