import { SEOScoreCalculator } from "@/components/seo-score-calculator";

export default function SEOScorePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">SEO Score Calculator</h1>
        <p className="text-muted-foreground mb-8">
          Get a comprehensive analysis of your website's SEO performance and
          identify areas for improvement.
        </p>
        <SEOScoreCalculator />
      </div>
    </div>
  );
}
