import { BrokenLinkFinder } from "@/components/broken-link-finder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BrokenLinksPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Broken Links Checker</CardTitle>
          <CardDescription>
            Find and fix broken links to improve user experience and SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What are Broken Links?</h3>
            <p className="text-muted-foreground">
              Broken links are hyperlinks that no longer work, leading to "404 Not Found" errors or other HTTP error codes. 
              They can negatively impact user experience, SEO rankings, and your site's credibility.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Types of Broken Links</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Internal Links:</strong> Broken links within your website</li>
                <li><strong>External Links:</strong> Broken links to other websites</li>
                <li><strong>Image Links:</strong> Missing or broken image sources</li>
                <li><strong>Resource Links:</strong> Broken CSS, JS, or media files</li>
                <li><strong>Anchor Links:</strong> Invalid page section references</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Common Causes</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Page Deletion:</strong> Removed without redirection</li>
                <li><strong>URL Changes:</strong> Modified without updating links</li>
                <li><strong>Domain Changes:</strong> Website moves or expires</li>
                <li><strong>Typos:</strong> Incorrectly entered URLs</li>
                <li><strong>Server Issues:</strong> Temporary or permanent outages</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Regularly scan your website for broken links</li>
                <li>Set up proper 301 redirects for moved content</li>
                <li>Update or remove outdated external links</li>
                <li>Monitor your 404 error logs</li>
                <li>Create a custom 404 error page</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">HTTP Status Codes</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`// Common HTTP Error Codes
404 - Page Not Found
400 - Bad Request
401 - Unauthorized
403 - Forbidden
500 - Internal Server Error
502 - Bad Gateway
503 - Service Unavailable
504 - Gateway Timeout

// Redirect Status Codes
301 - Permanent Redirect
302 - Temporary Redirect
307 - Temporary Redirect (Strict)
308 - Permanent Redirect (Strict)`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Impact on SEO</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Reduced crawl efficiency for search engines</li>
                <li>Negative impact on user experience metrics</li>
                <li>Loss of link equity from broken backlinks</li>
                <li>Decreased trust and authority signals</li>
                <li>Higher bounce rates from error pages</li>
                <li>Wasted crawl budget on invalid URLs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Broken Links Checker Tool */}
      <BrokenLinkFinder />
    </div>
  );
}
