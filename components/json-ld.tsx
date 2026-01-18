interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders JSON-LD structured data as a script tag.
 * Sanitizes output to prevent XSS attacks by escaping < characters.
 * @see https://nextjs.org/docs/app/guides/json-ld
 */
export function JsonLd({ data }: JsonLdProps) {
  // Sanitize JSON output to prevent XSS attacks
  // Replace < with unicode escape to prevent script injection
  const sanitizedJson = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: sanitizedJson,
      }}
    />
  );
}

