import { ContentAnalyzer } from "@/components/ai-tools/content-analyzer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Content Analyzer | SEO Audit Platform",
  description: "Analyze your content quality with AI-powered insights and recommendations",
};

export default function AIContentAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Content Analyzer</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get AI-powered insights into your content quality, engagement, and optimization opportunities
          </p>
        </div>
        <ContentAnalyzer />
      </div>
    </div>
  );
}