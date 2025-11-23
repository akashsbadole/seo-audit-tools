import { CompetitorAnalysis } from "@/components/web-scraping/competitor-analysis";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitor Analysis Tool | SEO Audit Platform",
  description: "Analyze your website against competitors to identify SEO opportunities and improve your search engine rankings",
};

export default function CompetitorAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Competitor Analysis</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get deep insights into your competitors' SEO strategies and identify opportunities to outrank them
          </p>
        </div>
        <CompetitorAnalysis />
      </div>
    </div>
  );
}