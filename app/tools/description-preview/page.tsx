import { DescriptionTagPreview } from "@/components/description-tag-preview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DescriptionPreviewPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Meta Description Preview</CardTitle>
          <CardDescription>
            Create and preview engaging meta descriptions for better click-through rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What is a Meta Description?</h3>
            <p className="text-muted-foreground">
              A meta description is an HTML attribute that provides a brief summary of a web page. 
              It appears under the title in search engine results pages (SERPs) and influences click-through rates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Components</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Length:</strong> 150-160 characters optimal</li>
                <li><strong>Keywords:</strong> Natural inclusion of target terms</li>
                <li><strong>Call-to-Action:</strong> Compelling action phrases</li>
                <li><strong>Uniqueness:</strong> Different for each page</li>
                <li><strong>Relevance:</strong> Matches page content</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">SERP Display Factors</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Device Type:</strong> Mobile vs desktop display</li>
                <li><strong>Pixel Width:</strong> Character truncation points</li>
                <li><strong>Rich Snippets:</strong> Enhanced SERP features</li>
                <li><strong>Query Matching:</strong> Bold matching terms</li>
                <li><strong>Dynamic Generation:</strong> Google's modifications</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Keep descriptions between 150-160 characters</li>
                <li>Include primary keywords naturally</li>
                <li>Write unique descriptions for each page</li>
                <li>Use action-oriented language</li>
                <li>Match search intent and page content</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Example Descriptions</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- Good Example -->
<meta name="description" content="Discover our handcrafted leather bags, made with premium Italian leather. Shop our collection of stylish, durable bags with free shipping on orders over $100.">

<!-- Bad Example -->
<meta name="description" content="Welcome to our website. We sell bags. Buy now.">

<!-- Product Page Example -->
<meta name="description" content="Save 30% on the Classic Leather Tote - genuine Italian leather, multiple colors, free shipping. Perfect for work or travel. Order now with our 60-day guarantee.">

<!-- Blog Post Example -->
<meta name="description" content="Learn 10 essential tips for choosing the perfect leather bag. Expert advice on materials, construction, style, and maintenance. Updated for 2024.">`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Mistakes to Avoid</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Duplicate descriptions across pages</li>
                <li>Keyword stuffing and unnatural language</li>
                <li>Overly generic or vague descriptions</li>
                <li>Missing call-to-action elements</li>
                <li>Irrelevant content that misleads users</li>
                <li>Truncated or cut-off descriptions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description Preview Tool */}
      <DescriptionTagPreview />
    </div>
  );
}
