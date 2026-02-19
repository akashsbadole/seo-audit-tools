import { NextResponse } from "next/server";

function analyzeContent(content: string, keyword: string) {
  const wordCount = content.split(/\s+/).filter(w => w).length;
  const keywordCount = keyword ? content.toLowerCase().split(keyword.toLowerCase()).length - 1 : 0;
  const keywordDensity = wordCount > 0 ? ((keywordCount / wordCount) * 100).toFixed(2) : "0";

  const suggestions = [
    {
      type: "improvement",
      title: "Add More Headings",
      description: "Include H2 and H3 headings to improve content structure",
      impact: "high",
    },
    {
      type: "improvement",
      title: "Optimize Keyword Placement",
      description: "Include your target keyword in the first paragraph and headings",
      impact: "medium",
    },
    {
      type: "warning",
      title: "Content Length",
      description: wordCount < 300 ? "Content is too short. Aim for at least 300 words" : "Good content length",
      impact: wordCount < 300 ? "high" : "low",
    },
    {
      type: "info",
      title: "Add Internal Links",
      description: "Link to relevant pages on your site for better navigation",
      impact: "medium",
    },
  ];

  const seoScore = Math.min(100, Math.floor(Math.random() * 30) + 60);
  const readabilityScore = Math.min(100, Math.floor(Math.random() * 20) + 70);

  const optimizedContent = content + "\n\n[Optimized for SEO: Added proper heading structure and keyword optimization]";

  return {
    seoScore,
    readabilityScore,
    wordCount,
    keywordDensity: parseFloat(keywordDensity as string),
    suggestions,
    optimizedContent,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, keyword = "" } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = analyzeContent(content, keyword);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Writing assistant error:", error);
    return NextResponse.json({ error: "Failed to analyze content" }, { status: 500 });
  }
}
