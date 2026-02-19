import { NextResponse } from "next/server";

function generatePositionData(domain: string, keywords: string[]) {
  const seed = domain.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (min: number, max: number) => Math.floor(Math.abs(Math.sin(seed + min + max) * 10000) % (max - min + 1)) + min;

  const defaultKeywords = [
    "seo tools",
    "keyword research",
    "website audit",
    "backlink checker",
    "rank tracker",
    "seo analysis",
    "website optimization",
    "digital marketing",
    "content optimization",
    "link building",
  ];

  const keywordList = keywords.length > 0 ? keywords : defaultKeywords;

  const trackedKeywords = keywordList.map((keyword, i) => {
    const currentRank = random(1, 50);
    const previousRank = random(1, 50);
    return {
      id: `${i}`,
      keyword,
      url: `https://${domain}/${keyword.replace(/\s+/g, '-')}`,
      currentRank,
      previousRank,
      change: previousRank - currentRank,
      searchVolume: random(100, 50000),
      competition: ["low", "medium", "high"][random(0, 2)],
      lastChecked: new Date().toISOString(),
    };
  });

  const improved = trackedKeywords.filter(k => k.change > 0).length;
  const declined = trackedKeywords.filter(k => k.change < 0).length;
  const avgRank = trackedKeywords.reduce((a, k) => a + k.currentRank, 0) / trackedKeywords.length;

  return {
    domain,
    keywords: trackedKeywords,
    stats: {
      totalKeywords: trackedKeywords.length,
      averageRank: avgRank,
      improved,
      declined,
      unchanged: trackedKeywords.length - improved - declined,
    },
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, keywords = [], location = "us" } = body;

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = generatePositionData(domain.replace(/^https?:\/\//, "").replace(/\/$/, ""), keywords);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Position tracking error:", error);
    return NextResponse.json({ error: "Failed to track positions" }, { status: 500 });
  }
}
