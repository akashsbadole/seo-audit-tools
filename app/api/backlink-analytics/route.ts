import { NextResponse } from "next/server";

function generateBacklinkData(domain: string) {
  const seed = domain.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (min: number, max: number) => Math.floor(Math.abs(Math.sin(seed + min + max) * 10000) % (max - min + 1)) + min;

  const totalBacklinks = random(500, 50000);
  const referringDomains = random(50, 2000);

  return {
    domain,
    totalBacklinks,
    referringDomains,
    newBacklinks: random(10, 500),
    lostBacklinks: random(5, 200),
    domainAuthority: random(15, 75),
    spamScore: random(1, 10),
    topReferringDomains: [
      { domain: "blog.example1.com", backlinks: random(50, 500), authority: random(30, 70) },
      { domain: "news.example2.com", backlinks: random(40, 400), authority: random(25, 65) },
      { domain: "resource.example3.com", backlinks: random(30, 300), authority: random(20, 60) },
      { domain: "directory.example4.com", backlinks: random(25, 250), authority: random(15, 55) },
      { domain: "forum.example5.com", backlinks: random(20, 200), authority: random(10, 50) },
    ],
    anchorTexts: [
      { text: domain, count: random(100, 1000), type: "Brand" },
      { text: "click here", count: random(50, 500), type: "Generic" },
      { text: "website", count: random(40, 400), type: "Generic" },
      { text: "learn more", count: random(30, 300), type: "Generic" },
      { text: `${domain.split('.')[0]} services`, count: random(20, 200), type: "Exact Match" },
    ],
    linkTypes: {
      dofollow: random(70, 90),
      nofollow: random(10, 30),
    },
    topPages: [
      { url: `https://${domain}/`, backlinks: random(100, 1000) },
      { url: `https://${domain}/blog`, backlinks: random(50, 500) },
      { url: `https://${domain}/products`, backlinks: random(40, 400) },
      { url: `https://${domain}/about`, backlinks: random(30, 300) },
      { url: `https://${domain}/contact`, backlinks: random(20, 200) },
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = generateBacklinkData(domain.replace(/^https?:\/\//, "").replace(/\/$/, ""));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Backlink analytics error:", error);
    return NextResponse.json({ error: "Failed to analyze backlinks" }, { status: 500 });
  }
}
