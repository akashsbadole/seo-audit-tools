import { CanonicalURLChecker } from "@/components/canonical-url-checker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CanonicalUrlPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Canonical URL Checker</CardTitle>
          <CardDescription>
            Analyze and optimize canonical URLs to prevent duplicate content issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What are Canonical URLs?</h3>
            <p className="text-muted-foreground">
              A canonical URL is the preferred version of a web page when similar or duplicate content exists at multiple URLs. 
              It helps search engines understand which version of a page should be indexed and ranked in search results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Common URL Variations</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Protocol:</strong> http:// vs https://</li>
                <li><strong>WWW:</strong> www vs non-www</li>
                <li><strong>Parameters:</strong> URL with query strings</li>
                <li><strong>Case:</strong> Upper vs lowercase URLs</li>
                <li><strong>Trailing Slash:</strong> With or without /</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Implementation Methods</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>HTML Tag:</strong> rel="canonical" link element</li>
                <li><strong>HTTP Header:</strong> Link header response</li>
                <li><strong>Sitemap:</strong> Canonical URL declaration</li>
                <li><strong>301 Redirects:</strong> Permanent redirections</li>
                <li><strong>Meta Robots:</strong> noindex for duplicates</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Use absolute URLs in canonical tags</li>
                <li>Implement consistent URL structure across your site</li>
                <li>Avoid canonical chains and loops</li>
                <li>Self-reference canonical URLs on unique pages</li>
                <li>Regularly audit canonical implementation</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Example Implementation</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- HTML Canonical Tag -->
<link rel="canonical" href="https://example.com/product" />

<!-- HTTP Header -->
Link: <https://example.com/product>; rel="canonical"

<!-- Common URL Variations -->
https://example.com/product
https://www.example.com/product
http://example.com/product
https://example.com/product/
https://example.com/Product
https://example.com/product?color=blue`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Issues to Avoid</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Multiple canonical URLs on one page</li>
                <li>Canonical URLs pointing to 404 pages</li>
                <li>Canonical chains or loops</li>
                <li>Incorrect cross-domain canonicals</li>
                <li>Inconsistent canonical implementation</li>
                <li>Missing self-referential canonicals</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canonical URL Checker Tool */}
      <CanonicalURLChecker />
    </div>
  );
}
