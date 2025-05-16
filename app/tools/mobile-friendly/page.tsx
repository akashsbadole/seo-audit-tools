import { MobileFriendlinessTester } from "@/components/mobile-friendliness-tester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MobileFriendlyPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Tool Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile-Friendly Tester</CardTitle>
          <CardDescription>
            Test and optimize your website's mobile experience for better search rankings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What is Mobile-Friendliness?</h3>
            <p className="text-muted-foreground">
              Mobile-friendliness refers to how well your website performs on mobile devices. With Google's mobile-first indexing, 
              having a mobile-optimized website is crucial for SEO success and user experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Factors</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Responsive Design:</strong> Adapts to screen sizes</li>
                <li><strong>Touch Elements:</strong> Properly sized buttons</li>
                <li><strong>Font Size:</strong> Readable without zooming</li>
                <li><strong>Content Width:</strong> No horizontal scrolling</li>
                <li><strong>Loading Speed:</strong> Fast mobile performance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">SEO Impact</h3>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
                <li><strong>Rankings:</strong> Mobile-first indexing priority</li>
                <li><strong>User Signals:</strong> Engagement metrics</li>
                <li><strong>Conversion Rate:</strong> Mobile user experience</li>
                <li><strong>Bounce Rate:</strong> Mobile accessibility</li>
                <li><strong>Local SEO:</strong> Mobile search visibility</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Best Practices:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Use responsive design principles</li>
                <li>Optimize images for mobile devices</li>
                <li>Ensure touch targets are at least 48x48 pixels</li>
                <li>Keep mobile page load times under 3 seconds</li>
                <li>Test on multiple devices and browsers</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-2">Responsive Design Examples</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- Responsive Viewport Meta Tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Responsive Image -->
<img srcset="small.jpg 300w,
             medium.jpg 600w,
             large.jpg 900w"
     sizes="(max-width: 320px) 280px,
            (max-width: 640px) 580px,
            880px"
     src="large.jpg" alt="Responsive image">

<!-- Responsive CSS Media Queries -->
@media screen and (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 15px;
  }
  .nav-menu {
    display: none;
  }
  .mobile-menu {
    display: block;
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Common Mobile Issues</h3>
            <div className="bg-muted p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-2">
                <li>Text too small to read on mobile</li>
                <li>Clickable elements too close together</li>
                <li>Content wider than screen</li>
                <li>Unplayable content (e.g., Flash)</li>
                <li>Slow loading times on mobile networks</li>
                <li>Intrusive interstitials blocking content</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Friendly Tester Tool */}
      <MobileFriendlinessTester />
    </div>
  );
}
