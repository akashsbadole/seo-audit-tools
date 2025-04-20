import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function SEOMetaTags() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>SEO Meta Tags Analysis</CardTitle>
        <CardDescription>
          Generated SEO meta tags can improve your website's ranking and visibility in search results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">What are SEO Meta Tags?</h3>
            <p className="text-muted-foreground">
              Meta tags are snippets of text that provide search engines with information about a webpage's content. 
              They're embedded in the HTML code of a webpage and help search engines understand the page's structure, 
              content, and relevance to specific search queries.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Types of Meta Tags</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Title Tag:</strong> A brief title that appears in search engine results pages (SERPs) and browser tabs.
              </li>
              <li>
                <strong>Meta Description:</strong> A short summary of the webpage's content that appears in SERPs.
              </li>
              <li>
                <strong>Keyword Tag:</strong> A list of relevant keywords that describe the webpage's content.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">How Generated SEO Meta Tags Work</h3>
            <p className="text-muted-foreground">
              Our AI-powered tools analyze your website's content, structure, and target audience to generate optimized meta tags. 
              These tools use natural language processing (NLP) and machine learning algorithms to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>Analyze Content: Identify key themes, topics, and phrases in your content.</li>
              <li>Identify Target Audience: Determine the search queries and keywords your target audience uses.</li>
              <li>Generate Meta Tags: Create optimized title tags, meta descriptions, and keyword tags based on the analysis.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Benefits of Generated SEO Meta Tags</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Improved Search Engine Rankings: Optimized meta tags help search engines understand your content, increasing the chances of higher rankings.</li>
              <li>Increased Click-Through Rates (CTRs): Well-crafted title tags and meta descriptions entice users to click on your webpage in SERPs.</li>
              <li>Enhanced Content Visibility: AI-generated meta tags ensure your content is accurately represented in search results, improving visibility and credibility.</li>
              <li>Time-Saving: AI-powered tools automate the process of creating meta tags, saving you time and effort.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Best Practices for Generated SEO Meta Tags</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Use Relevant Keywords: Ensure the AI-generated meta tags include relevant keywords and phrases from your content.</li>
              <li>Keep it Concise: Title tags should be under 60 characters, and meta descriptions should be under 160 characters.</li>
              <li>Make it Compelling: Craft title tags and meta descriptions that entice users to click on your webpage.</li>
              <li>Monitor and Adjust: Regularly review and adjust AI-generated meta tags to ensure they're accurate and effective.</li>
            </ul>
          </section>
        </div>
      </CardContent>
    </Card>
  )
} 