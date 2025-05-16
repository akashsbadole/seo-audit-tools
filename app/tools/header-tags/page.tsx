import { HeaderTagChecker } from "@/components/header-tag-checker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function HeaderTagsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Header Tags Checker</CardTitle>
          <CardDescription>
            Analyze and optimize your HTML heading structure for better SEO and accessibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What are Header Tags?</h3>
            <p className="text-muted-foreground">
              Header tags (H1-H6) are HTML elements used to define headings and subheadings in your content. 
              They create a hierarchical structure that helps both users and search engines understand your content organization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Header Tag Hierarchy</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>H1:</strong> Main title of the page (use only once)</li>
                <li><strong>H2:</strong> Major sections of content</li>
                <li><strong>H3:</strong> Subsections within H2 sections</li>
                <li><strong>H4:</strong> Points within H3 subsections</li>
                <li><strong>H5-H6:</strong> Further subdivisions if needed</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">SEO Benefits</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Content Structure:</strong> Clear organization for search engines</li>
                <li><strong>Keyword Relevance:</strong> Important for topic targeting</li>
                <li><strong>User Experience:</strong> Improves content readability</li>
                <li><strong>Featured Snippets:</strong> Better chances of selection</li>
                <li><strong>Accessibility:</strong> Helps screen readers navigate</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Use only one H1 tag per page</li>
                <li>Maintain proper heading hierarchy (don't skip levels)</li>
                <li>Include relevant keywords naturally in headings</li>
                <li>Keep headings concise and descriptive</li>
                <li>Ensure headings accurately reflect content sections</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Example Structure</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<h1>Main Page Title</h1>
  <h2>Major Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Major Section 2</h2>
    <h3>Subsection 2.1</h3>
      <h4>Detailed Point 2.1.1</h4>
      <h4>Detailed Point 2.1.2</h4>
    <h3>Subsection 2.2</h3>`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Issues to Avoid</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Multiple H1 tags on a single page</li>
                <li>Skipping heading levels (e.g., H2 to H4)</li>
                <li>Using headings for styling purposes only</li>
                <li>Empty heading tags</li>
                <li>Overly long heading text</li>
                <li>Inconsistent heading structure across pages</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header Tags Checker Tool */}
      <HeaderTagChecker />
    </div>
  );
}
