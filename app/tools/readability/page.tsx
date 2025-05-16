import { ContentReadabilityAnalyzer } from "@/components/content-readability-analyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ReadabilityPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Readability Analyzer</CardTitle>
          <CardDescription>
            Analyze and optimize your content's readability for better user engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What is Readability?</h3>
            <p className="text-muted-foreground">
              Readability measures how easy it is for people to read and understand your content. 
              Good readability improves user engagement, reduces bounce rates, and helps search engines better understand your content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Flesch Reading Ease:</strong> Score from 0-100</li>
                <li><strong>Grade Level:</strong> Education level required</li>
                <li><strong>Sentence Length:</strong> Words per sentence</li>
                <li><strong>Paragraph Length:</strong> Lines per paragraph</li>
                <li><strong>Word Complexity:</strong> Syllable count</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Impact on SEO</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>User Experience:</strong> Better engagement</li>
                <li><strong>Time on Page:</strong> Increased reading time</li>
                <li><strong>Bounce Rate:</strong> Reduced exits</li>
                <li><strong>Featured Snippets:</strong> Higher chances</li>
                <li><strong>Voice Search:</strong> Better optimization</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Aim for a Flesch Reading Ease score of 60-70</li>
                <li>Keep sentences under 20 words on average</li>
                <li>Use short paragraphs (2-3 sentences)</li>
                <li>Include subheadings every 300 words</li>
                <li>Use active voice and simple words</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Readability Formulas</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`// Flesch Reading Ease Score
206.835 - 1.015 × (total words ÷ total sentences) - 84.6 × (total syllables ÷ total words)

// Flesch-Kincaid Grade Level
0.39 × (total words ÷ total sentences) + 11.8 × (total syllables ÷ total words) - 15.59

// Gunning Fog Index
0.4 × [(words ÷ sentences) + 100 × (complex words ÷ words)]

// SMOG Index
1.0430 × √(number of polysyllables × (30 ÷ number of sentences)) + 3.1291

// Interpretation:
90-100: Very Easy
80-89: Easy
70-79: Fairly Easy
60-69: Standard
50-59: Fairly Difficult
30-49: Difficult
0-29: Very Difficult`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Issues to Fix</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Long, complex sentences</li>
                <li>Dense paragraphs without breaks</li>
                <li>Excessive jargon or technical terms</li>
                <li>Passive voice overuse</li>
                <li>Missing subheadings and structure</li>
                <li>Poor formatting and visual hierarchy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readability Analyzer Tool */}
      <ContentReadabilityAnalyzer />
    </div>
  );
}
