import { InternalLinkingAnalyzer } from "@/components/internal-linking-analyzer";

export default function InternalLinksPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Internal Linking Analyzer</h1>
        <p className="text-gray-600">
          Analyze your website's internal linking structure and identify
          opportunities for improvement.
        </p>
      </div>
      <InternalLinkingAnalyzer />
    </div>
  );
}
