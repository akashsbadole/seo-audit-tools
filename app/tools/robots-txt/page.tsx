import { RobotsTxtGenerator } from "@/components/robots-txt-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RobotsTxtPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Robots.txt Generator</CardTitle>
          <CardDescription>
            Create and customize robots.txt files to control search engine crawling behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What is Robots.txt?</h3>
            <p className="text-muted-foreground">
              A robots.txt file is a text file that tells search engine crawlers which pages or files they can or can't request from your site. 
              It's one of the main methods to communicate with web crawlers and helps optimize your site's crawl budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Components</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>User-agent:</strong> Specifies which crawler the rules apply to</li>
                <li><strong>Allow:</strong> Explicitly allows access to specific paths</li>
                <li><strong>Disallow:</strong> Blocks access to specific paths</li>
                <li><strong>Sitemap:</strong> Points to your XML sitemap location</li>
                <li><strong>Crawl-delay:</strong> Sets delay between crawler requests</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Crawl Budget:</strong> Optimize crawler resource usage</li>
                <li><strong>Privacy:</strong> Protect sensitive content</li>
                <li><strong>SEO:</strong> Guide search engines to important pages</li>
                <li><strong>Server Load:</strong> Control crawling rate</li>
                <li><strong>Index Quality:</strong> Prevent low-value content indexing</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Place robots.txt in the root directory</li>
                <li>Use specific user-agents when possible</li>
                <li>Test changes before implementation</li>
                <li>Include sitemap location</li>
                <li>Don't rely on robots.txt for security</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Directives</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`# Allow all crawlers
User-agent: *
Allow: /

# Block specific crawler
User-agent: BadBot
Disallow: /

# Block admin area
User-agent: *
Disallow: /admin/

# Allow specific file
User-agent: *
Allow: /terms.pdf

# Add sitemap location
Sitemap: https://example.com/sitemap.xml

# Set crawl delay
User-agent: *
Crawl-delay: 10`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Issues to Avoid</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Blocking CSS and JavaScript files</li>
                <li>Using incorrect file location</li>
                <li>Syntax errors in directives</li>
                <li>Conflicting rules</li>
                <li>Over-restrictive crawling rules</li>
                <li>Missing validation after changes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Robots.txt Generator Tool */}
      <RobotsTxtGenerator />
    </div>
  );
}
