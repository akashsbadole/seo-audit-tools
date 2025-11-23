import { Metadata } from "next";
import { MetaTagAnalyzer } from "@/components/tools/meta-tag-analyzer";

export const metadata: Metadata = {
  title: "Meta Tag Analyzer - Premium SEO Tool",
  description: "Analyze page titles, meta descriptions, headers (H1-H6), and other SEO elements. Get comprehensive recommendations for better search engine optimization.",
  keywords: ["meta tags", "SEO analyzer", "title analyzer", "description analyzer", "header tags", "SEO tool"],
};

export default function MetaAnalyzerPage() {
  return (
    <div className="container mx-auto py-8">
      <MetaTagAnalyzer />
    </div>
  );
}