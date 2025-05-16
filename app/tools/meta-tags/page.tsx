import { MetaTagsGenerator } from "@/components/meta-tags-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MetaTagGeneratorPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Meta Tags Generator</CardTitle>
          <CardDescription>
            Create optimized meta tags for better search engine visibility and social media sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What are Meta Tags?</h3>
            <p className="text-muted-foreground">
              Meta tags are snippets of text that describe a page's content. They don't appear on the page itself, but in the page's source code. 
              Meta tags are crucial for SEO as they help search engines understand your content and how to display it in search results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Meta Tags</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Title Tag:</strong> The main title of your page (50-60 characters)</li>
                <li><strong>Meta Description:</strong> A brief summary of your page (150-160 characters)</li>
                <li><strong>Meta Keywords:</strong> Important keywords related to your content</li>
                <li><strong>Robots Meta:</strong> Instructions for search engine crawlers</li>
                <li><strong>Viewport Meta:</strong> Controls mobile responsiveness</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Social Media Meta Tags</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Open Graph Tags:</strong> Control how content appears on Facebook</li>
                <li><strong>Twitter Cards:</strong> Control how content appears on Twitter</li>
                <li><strong>Pinterest Rich Pins:</strong> Enhanced pins with extra information</li>
                <li><strong>LinkedIn Tags:</strong> Control professional network sharing</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Keep titles between 50-60 characters to prevent truncation in search results</li>
                <li>Write compelling meta descriptions between 150-160 characters</li>
                <li>Use unique meta tags for each page</li>
                <li>Include relevant keywords naturally in both title and description</li>
                <li>Test your meta tags in social media preview tools</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Example Meta Tags</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- Essential Meta Tags -->
<title>Your Page Title - Brand Name</title>
<meta name="description" content="A compelling description of your page content.">
<meta name="keywords" content="relevant, keywords, here">

<!-- Open Graph Meta Tags -->
<meta property="og:title" content="Title Here">
<meta property="og:description" content="Description Here">
<meta property="og:image" content="image.jpg">

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Title Here">
<meta name="twitter:description" content="Description Here">`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Meta Tags Generator Tool */}
      <MetaTagsGenerator />
    </div>
  );
}
