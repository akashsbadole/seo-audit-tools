import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const competitors = [
      { id: "1", domain: "competitor1.com", domainAuthority: 65, backlinks: 12500, organicKeywords: 3400, organicTraffic: 45000, lastUpdated: new Date().toISOString() },
      { id: "2", domain: "competitor2.com", domainAuthority: 58, backlinks: 8900, organicKeywords: 2100, organicTraffic: 32000, lastUpdated: new Date().toISOString() },
      { id: "3", domain: "competitor3.com", domainAuthority: 72, backlinks: 25000, organicKeywords: 5600, organicTraffic: 78000, lastUpdated: new Date().toISOString() },
    ];

    const metrics = {
      totalCompetitors: competitors.length,
      averageDomainAuthority: Math.round(competitors.reduce((acc, c) => acc + c.domainAuthority, 0) / competitors.length),
      totalBacklinks: competitors.reduce((acc, c) => acc + c.backlinks, 0),
      totalOrganicKeywords: competitors.reduce((acc, c) => acc + c.organicKeywords, 0),
      totalOrganicTraffic: competitors.reduce((acc, c) => acc + c.organicTraffic, 0),
    };

    const topCompetitors = [...competitors].sort((a, b) => b.domainAuthority - a.domainAuthority).slice(0, 5);

    return NextResponse.json({
      competitors,
      metrics,
      topCompetitors,
      significantChanges: competitors.slice(0, 3),
    });
  } catch (error) {
    console.error("[COMPETITORS_ANALYSIS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
