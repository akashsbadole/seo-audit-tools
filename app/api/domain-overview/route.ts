import { NextResponse } from "next/server";

interface DomainOverviewResult {
  domain: string;
  authority: {
    domainAuthority: number;
    pageAuthority: number;
    spamScore: number;
  };
  traffic: {
    organicKeywords: number;
    organicTraffic: number;
    paidKeywords: number;
    paidTraffic: number;
  };
  backlinks: {
    totalBacklinks: number;
    referringDomains: number;
    newBacklinks: number;
    lostBacklinks: number;
  };
  technical: {
    ssl: boolean;
    mobile: boolean;
    speed: number;
    indexPages: number;
  };
  topKeywords: Array<{ keyword: string; position: number; volume: number; url: string }>;
  topPages: Array<{ url: string; traffic: number; keywords: number }>;
  competitors: Array<{ domain: string; authority: number; keywords: number }>;
}

function generateMockData(domain: string): DomainOverviewResult {
  const seed = domain.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (min: number, max: number) => Math.floor((Math.sin(seed + min) * 10000) % (max - min + 1)) + min;
  
  const authority = random(15, 75);
  const organicKeywords = random(100, 50000);
  
  return {
    domain,
    authority: {
      domainAuthority: authority,
      pageAuthority: random(15, 70),
      spamScore: random(1, 8),
    },
    traffic: {
      organicKeywords,
      organicTraffic: Math.floor(organicKeywords * random(0.5, 3)),
      paidKeywords: random(0, 500),
      paidTraffic: random(0, 5000),
    },
    backlinks: {
      totalBacklinks: random(100, 50000),
      referringDomains: random(10, 2000),
      newBacklinks: random(5, 200),
      lostBacklinks: random(2, 100),
    },
    technical: {
      ssl: domain.startsWith('https') || true,
      mobile: random(60, 100) > 50,
      speed: random(45, 95),
      indexPages: random(10, 5000),
    },
    topKeywords: [
      { keyword: `${domain.split('.')[0]} services`, position: random(1, 20), volume: random(1000, 50000), url: `/${domain.split('.')[0]}-services` },
      { keyword: `${domain.split('.')[0]} online`, position: random(1, 20), volume: random(500, 30000), url: `/` },
      { keyword: `best ${domain.split('.')[0]}`, position: random(1, 20), volume: random(2000, 80000), url: `/best` },
      { keyword: `${domain.split('.')[0]} review`, position: random(1, 20), volume: random(500, 20000), url: `/reviews` },
      { keyword: `${domain.split('.')[0]} pricing`, position: random(1, 20), volume: random(300, 15000), url: `/pricing` },
    ],
    topPages: [
      { url: '/', traffic: random(5000, 50000), keywords: random(50, 500) },
      { url: '/blog', traffic: random(1000, 20000), keywords: random(20, 200) },
      { url: '/products', traffic: random(2000, 30000), keywords: random(30, 300) },
      { url: '/about', traffic: random(500, 5000), keywords: random(5, 50) },
      { url: '/contact', traffic: random(200, 2000), keywords: random(2, 20) },
    ],
    competitors: [
      { domain: `competitor1.com`, authority: random(20, 80), keywords: random(1000, 100000) },
      { domain: `competitor2.com`, authority: random(20, 80), keywords: random(1000, 100000) },
      { domain: `competitor3.com`, authority: random(20, 80), keywords: random(1000, 100000) },
      { domain: `competitor4.com`, authority: random(20, 80), keywords: random(1000, 100000) },
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
    
    // Generate analysis data
    const result = generateMockData(cleanDomain);
    
    // Add small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Domain overview error:", error);
    return NextResponse.json(
      { error: "Failed to analyze domain" },
      { status: 500 }
    );
  }
}
