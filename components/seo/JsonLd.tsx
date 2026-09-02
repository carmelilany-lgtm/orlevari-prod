import { jsonLdScriptHtml } from "@/lib/seo/json-ld";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptHtml(data) }}
    />
  );
}
