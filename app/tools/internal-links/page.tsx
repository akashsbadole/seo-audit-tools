import { InternalLinkingAnalyzer } from "@/components/internal-linking-analyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InternalLinksPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Internal Links Analyzer</CardTitle>
          <CardDescription>
            Analyze and optimize your website's internal linking structure for better SEO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What are Internal Links?</h3>
            <p className="text-muted-foreground">
              Internal links are hyperlinks that point from one page to another within the same website. 
              They help establish site architecture, distribute page authority, and guide users through your content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Types of Internal Links</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Navigational:</strong> Menu and footer links</li>
                <li><strong>Contextual:</strong> In-content relevant links</li>
                <li><strong>Structural:</strong> Breadcrumbs, categories</li>
                <li><strong>Related Content:</strong> Similar articles, products</li>
                <li><strong>Utility:</strong> Terms, privacy policy links</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">SEO Benefits</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Link Equity:</strong> Distributes page authority</li>
                <li><strong>Crawlability:</strong> Helps search engine indexing</li>
                <li><strong>User Experience:</strong> Improves navigation</li>
                <li><strong>Page Value:</strong> Indicates important content</li>
                <li><strong>Bounce Rate:</strong> Reduces user exits</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Use descriptive anchor text for internal links</li>
                <li>Create a logical site hierarchy</li>
                <li>Link to relevant, high-value content</li>
                <li>Maintain a reasonable number of links per page</li>
                <li>Regularly audit internal link structure</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Example Structure</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- Navigation Links -->
<nav>
  <a href="/">Home</a>
  <a href="/products">Products</a>
  <a href="/blog">Blog</a>
</nav>

<!-- Contextual Links -->
<p>Check out our <a href="/products/leather-bags">premium leather bags</a>.</p>

<!-- Breadcrumb Navigation -->
<div class="breadcrumbs">
  <a href="/">Home</a> >
  <a href="/products">Products</a> >
  <span>Leather Bags</span>
</div>

<!-- Related Content -->
<div class="related">
  <h3>Related Articles</h3>
  <a href="/blog/leather-care">Leather Care Guide</a>
  <a href="/blog/bag-styles">Popular Bag Styles</a>
</div>`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Issues to Address</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Orphaned pages without internal links</li>
                <li>Excessive links on a single page</li>
                <li>Poor anchor text optimization</li>
                <li>Broken internal links</li>
                <li>Inconsistent navigation structure</li>
                <li>Deep page levels (more than 3-4 clicks)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internal Links Analyzer Tool */}
      <InternalLinkingAnalyzer />
    </div>
  );
}
