import { ContentReadabilityAnalyzer } from "@/components/content-readability-analyzer";

export default function ReadabilityPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Content Readability Analyzer
        </h1>
        <p className="text-muted-foreground mb-8">
          Analyze your content's readability using various metrics and get
          suggestions for improvement. This tool helps ensure your content is
          accessible and easy to understand for your target audience.
        </p>
        <ContentReadabilityAnalyzer />
      </div>
    </div>
  );
}
