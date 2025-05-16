import { SitemapGenerator } from "@/components/sitemap-generator";

export default function SitemapPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Sitemap Generator</h1>
        <p className="text-muted-foreground mb-8">
          Generate an XML sitemap to help search engines discover and index your
          website content.
        </p>
        <SitemapGenerator />
      </div>
    </div>
  );
}
