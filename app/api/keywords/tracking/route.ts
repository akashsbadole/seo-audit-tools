import { NextResponse } from "next/server";

const mockKeywords = [
  { id: "1", keyword: "seo tools", position: 5, previousPosition: 8, searchVolume: 12000, difficulty: 65 },
  { id: "2", keyword: "keyword research", position: 12, previousPosition: 15, searchVolume: 8500, difficulty: 70 },
  { id: "3", keyword: "backlink checker", position: 3, previousPosition: 3, searchVolume: 5200, difficulty: 55 },
];

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const metrics = {
      totalKeywords: mockKeywords.length,
      averagePosition: mockKeywords.reduce((acc, kw) => acc + kw.position, 0) / mockKeywords.length,
      keywordsInTop10: mockKeywords.filter(kw => kw.position <= 10).length,
      keywordsImproved: mockKeywords.filter(kw => kw.position < kw.previousPosition).length,
      keywordsDeclined: mockKeywords.filter(kw => kw.position > kw.previousPosition).length,
    };

    const trendingKeywords = mockKeywords
      .filter(kw => Math.abs(kw.position - kw.previousPosition) >= 3)
      .sort((a, b) => Math.abs(b.position - b.previousPosition) - Math.abs(a.position - a.previousPosition))
      .slice(0, 5);

    return NextResponse.json({
      keywords: mockKeywords,
      metrics,
      trendingKeywords,
    });
  } catch (error) {
    console.error("[KEYWORDS_TRACKING_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
