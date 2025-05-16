import { KeywordDensityAnalyzer } from "@/components/keyword-density-analyzer";

export default function KeywordDensityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Keyword Density Analyzer</h1>
      <KeywordDensityAnalyzer />
    </div>
  );
}
