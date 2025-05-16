import { SitemapGenerator } from "@/components/sitemap-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SitemapPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Sitemap Generator</CardTitle>
          <CardDescription>
            Create XML sitemaps to help search engines discover and index your website content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What is a Sitemap?</h3>
            <p className="text-muted-foreground">
              A sitemap is an XML file that lists all important URLs on your website, helping search engines understand your site structure 
              and ensuring all your content gets discovered and indexed. It can include additional information about each URL, such as last 
              modification date, update frequency, and relative priority.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Elements</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>URL Location:</strong> The page's full URL</li>
                <li><strong>Last Modified:</strong> When the page was last updated</li>
                <li><strong>Change Frequency:</strong> How often the page changes</li>
                <li><strong>Priority:</strong> Relative importance (0.0 to 1.0)</li>
                <li><strong>Image/Video:</strong> Media information (optional)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Faster Indexing:</strong> Quick content discovery</li>
                <li><strong>Better Crawling:</strong> Efficient resource usage</li>
                <li><strong>Complete Coverage:</strong> No missed pages</li>
                <li><strong>Media Discovery:</strong> Image/video indexing</li>
                <li><strong>Update Signals:</strong> Content freshness indicators</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Keep sitemaps under 50MB and 50,000 URLs</li>
                <li>Use sitemap index for larger sites</li>
                <li>Include only canonical URLs</li>
                <li>Update sitemaps regularly</li>
                <li>Submit sitemaps to search engines</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Sitemap Structure</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-03-20</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Issues to Avoid</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Including non-canonical URLs</li>
                <li>Missing XML namespace declarations</li>
                <li>Invalid URL encoding</li>
                <li>Incorrect date formats</li>
                <li>Unrealistic change frequencies</li>
                <li>Inconsistent priority values</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sitemap Generator Tool */}
      <SitemapGenerator />
    </div>
  );
}
