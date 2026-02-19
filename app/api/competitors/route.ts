import { NextResponse } from "next/server";

function generateCompetitorData(domain: string, isMain: boolean = false): any {
  const seed = domain.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (min: number, max: number) => Math.floor(Math.abs(Math.sin(seed + min + max) * 10000) % (max - min + 1)) + min;
  
  return {
    domain,
    authority: random(15, 80),
    organicTraffic: random(1000, 500000),
    organicKeywords: random(100, 50000),
    backlinks: random(100, 50000),
    changes: {
      traffic: random(-20, 30),
      keywords: random(-10, 25),
    },
    topKeywords: [],
    gaps: [],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, competitors = [] } = body;

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const yourDomain = generateCompetitorData(domain, true);
    const competitorData = competitors.length > 0 
      ? competitors.map((c: string) => generateCompetitorData(c.replace(/^https?:\/\//, "").replace(/\/$/, "")))
      : [
          generateCompetitorData("competitor1.com"),
          generateCompetitorData("competitor2.com"),
          generateCompetitorData("competitor3.com"),
        ];

    const keywordGaps = [
      { keyword: "best seo tools", competitorsRank: 3, yourRank: null, volume: 12000 },
      { keyword: "seo software", competitorsRank: 5, yourRank: null, volume: 8500 },
      { keyword: "keyword research tool", competitorsRank: 2, yourRank: null, volume: 6500 },
      { keyword: "website audit", competitorsRank: 7, yourRank: null, volume: 4800 },
      { keyword: "backlink checker", competitorsRank: 4, yourRank: null, volume: 5200 },
    ];

    const sharedKeywords = [
      { keyword: "seo analysis", positions: { [domain]: 5, [competitorData[0]?.domain || "comp1.com"]: 3 }, volume: 3200 },
      { keyword: "website optimization", positions: { [domain]: 8, [competitorData[0]?.domain || "comp1.com"]: 12 }, volume: 2800 },
      { keyword: "digital marketing", positions: { [domain]: 15, [competitorData[0]?.domain || "comp1.com"]: 10 }, volume: 15000 },
    ];

    competitorData.forEach((c: any) => {
      sharedKeywords.forEach(kw => {
        kw.positions[c.domain] = Math.floor(Math.random() * 20) + 1;
      });
    });

    const opportunities = [
      { keyword: `${domain.split('.')[0]} services`, difficulty: 25, volume: 4500, reason: "Low competition, branded potential" },
      { keyword: `${domain.split('.')[0]} pricing`, difficulty: 18, volume: 2800, reason: "High purchase intent" },
      { keyword: `${domain.split('.')[0]} review`, difficulty: 32, volume: 3200, reason: "Growing search trend" },
      { keyword: `${domain.split('.')[0]} alternatives`, difficulty: 28, volume: 1900, reason: "Comparison opportunity" },
    ];

    return NextResponse.json({
      yourDomain,
      competitors: competitorData,
      keywordGaps,
      sharedKeywords,
      opportunities,
    });
  } catch (error) {
    console.error("Competitor analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze competitors" }, { status: 500 });
  }
}
