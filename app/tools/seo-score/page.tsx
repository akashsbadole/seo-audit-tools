import { SEOScoreCalculator } from "@/components/seo-score-calculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SEOScorePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Score Calculator</CardTitle>
          <CardDescription>
            Analyze your website's SEO performance and get actionable recommendations for improvement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What is an SEO Score?</h3>
            <p className="text-muted-foreground">
              An SEO score is a comprehensive metric that evaluates your website's search engine optimization across multiple factors. 
              It helps identify strengths and weaknesses in your SEO strategy and provides actionable insights for improvement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Scoring Categories</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Technical SEO:</strong> Site structure and performance</li>
                <li><strong>Content Quality:</strong> Relevance and optimization</li>
                <li><strong>User Experience:</strong> Mobile and accessibility</li>
                <li><strong>Performance:</strong> Loading speed and Core Web Vitals</li>
                <li><strong>Authority:</strong> Backlinks and trust signals</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Page Speed:</strong> Loading and interaction times</li>
                <li><strong>Mobile-Friendliness:</strong> Responsive design</li>
                <li><strong>On-Page SEO:</strong> Meta tags and content</li>
                <li><strong>Security:</strong> HTTPS and safety measures</li>
                <li><strong>Crawlability:</strong> Search engine access</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Regularly monitor your SEO score</li>
                <li>Focus on critical issues first</li>
                <li>Implement recommended fixes</li>
                <li>Track score changes over time</li>
                <li>Compare with competitors</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Score Interpretation</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`Score Range   Rating        Action Required
90 - 100     Excellent    Maintain and monitor
80 - 89      Good         Minor improvements needed
70 - 79      Fair         Several issues to address
60 - 69      Poor         Significant work required
Below 60     Critical     Immediate attention needed

Key Factors Weighted:
- Technical SEO:     25%
- Content Quality:   20%
- User Experience:   20%
- Performance:       15%
- Authority:         20%`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Issues to Address</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Missing or duplicate meta tags</li>
                <li>Slow page load times</li>
                <li>Poor mobile optimization</li>
                <li>Broken links and 404 errors</li>
                <li>Thin or duplicate content</li>
                <li>Missing image alt text</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Score Calculator Tool */}
      <SEOScoreCalculator />
    </div>
  );
}
