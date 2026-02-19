import { NextResponse } from "next/server";

interface KeywordResult {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: "low" | "medium" | "high";
  trend: number[];
  relatedKeywords: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    cpc: number;
    competition: number;
    trend: number[];
  }>;
  questions: string[];
  serpFeatures: string[];
  opportunities: Array<{ keyword: string; reason: string; opportunity: number }>;
}

function generateKeywordData(keyword: string): KeywordResult {
  const seed = keyword.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (min: number, max: number) => Math.floor(Math.abs(Math.sin(seed + min + max) * 10000) % (max - min + 1)) + min;
  
  const searchVolume = random(100, 100000);
  const difficulty = random(10, 90);
  
  const relatedKeywords = [
    `${keyword} online`,
    `${keyword} free`,
    `${keyword} best`,
    `${keyword} tools`,
    `${keyword} services`,
    `best ${keyword}`,
    `${keyword} software`,
    `${keyword} guide`,
    `how to ${keyword}`,
    `${keyword} tips`,
  ].map(kw => ({
    keyword: kw,
    searchVolume: random(100, searchVolume),
    difficulty: random(10, 85),
    cpc: parseFloat((Math.random() * 10).toFixed(2)),
    competition: Math.random(),
    trend: Array.from({ length: 12 }, () => random(50, 150)),
  }));

  const questions = [
    `What is ${keyword}?`,
    `How does ${keyword} work?`,
    `Why is ${keyword} important?`,
    `When should I use ${keyword}?`,
    `How to improve ${keyword}?`,
    `What are the best ${keyword} tools?`,
    `How much does ${keyword} cost?`,
    `Is ${keyword} worth it?`,
  ];

  const serpFeatures = [
    "Featured Snippet",
    "People Also Ask",
    "Knowledge Panel",
    "Image Pack",
    "Video Results",
    "Related Searches",
    "Site Links",
  ].filter(() => Math.random() > 0.3);

  const opportunities = [
    { keyword: `${keyword} for beginners`, reason: "Low competition, good search volume", opportunity: random(60, 95) },
    { keyword: `${keyword} tutorial`, reason: "Educational intent, high CTR potential", opportunity: random(50, 85) },
    { keyword: `free ${keyword} tools`, reason: "High search volume, low competition", opportunity: random(55, 90) },
    { keyword: `${keyword} vs alternatives`, reason: "Comparison intent, conversion opportunity", opportunity: random(45, 80) },
  ];

  return {
    keyword,
    searchVolume,
    difficulty,
    cpc: parseFloat((Math.random() * 15).toFixed(2)),
    competition: difficulty < 33 ? "low" : difficulty < 66 ? "medium" : "high",
    trend: Array.from({ length: 12 }, () => random(50, 150)),
    relatedKeywords,
    questions,
    serpFeatures,
    opportunities,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword, country = "us" } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 1200));

    const result = generateKeywordData(keyword.trim().toLowerCase());

    return NextResponse.json(result);
  } catch (error) {
    console.error("Keyword research error:", error);
    return NextResponse.json(
      { error: "Failed to research keyword" },
      { status: 500 }
    );
  }
}
