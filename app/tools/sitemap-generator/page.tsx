import { Metadata } from "next";
import { SitemapGenerator } from "@/components/tools/sitemap-generator";

export const metadata: Metadata = {
  title: "XML Sitemap Generator - Premium SEO Tool",
  description: "Generate comprehensive XML sitemaps for search engines. Crawls your website and creates sitemap.xml and sitemap index files with image support.",
  keywords: ["XML sitemap", "sitemap generator", "SEO tool", "search engine optimization", "website crawling"],
};

export default function SitemapGeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <SitemapGenerator />
    </div>
  );
}