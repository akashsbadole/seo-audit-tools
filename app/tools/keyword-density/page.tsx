import { KeywordDensityAnalyzer } from "@/components/keyword-density-analyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function KeywordDensityPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Density Analyzer</CardTitle>
          <CardDescription>
            Analyze and optimize your content's keyword usage for better SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What is Keyword Density?</h3>
            <p className="text-muted-foreground">
              Keyword density refers to the percentage of times a keyword appears in your content compared to the total number of words. 
              It's an important SEO metric that helps ensure your content is properly optimized without being over-optimized (keyword stuffing).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Concepts</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Keyword Density:</strong> (Number of keyword occurrences / Total words) × 100</li>
                <li><strong>Primary Keywords:</strong> Main focus terms of your content</li>
                <li><strong>Secondary Keywords:</strong> Supporting and related terms</li>
                <li><strong>LSI Keywords:</strong> Semantically related terms</li>
                <li><strong>Long-tail Keywords:</strong> More specific keyword phrases</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Important Factors</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Content Length:</strong> Affects optimal keyword density</li>
                <li><strong>Content Type:</strong> Different content types need different densities</li>
                <li><strong>Keyword Placement:</strong> Strategic placement in key areas</li>
                <li><strong>Natural Usage:</strong> Keywords should flow naturally</li>
                <li><strong>Context:</strong> Keywords should be relevant to content</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Maintain a keyword density between 1-3% for primary keywords</li>
                <li>Use variations of your keywords naturally throughout the content</li>
                <li>Include keywords in important HTML elements (title, headings, meta description)</li>
                <li>Avoid keyword stuffing which can lead to penalties</li>
                <li>Focus on creating valuable, reader-friendly content</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Optimal Placement Areas</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Title tag and meta description</li>
                <li>First 100-150 words of content</li>
                <li>H1, H2, and H3 headings</li>
                <li>Image alt text (when relevant)</li>
                <li>URL structure</li>
                <li>Naturally throughout body content</li>
                <li>Conclusion or summary sections</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Density Analyzer Tool */}
      <KeywordDensityAnalyzer />
    </div>
  );
}
