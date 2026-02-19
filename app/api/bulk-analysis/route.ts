import { NextResponse } from "next/server";

function analyzeUrls(urls: string[]) {
  return urls.map(url => {
    const seed = url.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor(Math.abs(Math.sin(seed + min + max) * 10000) % (max - min + 1)) + min;

    return {
      url,
      status: "completed" as const,
      seoScore: random(40, 95),
      issues: random(0, 15),
      warnings: random(0, 10),
    };
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { urls, name } = body;

    if (!urls || urls.length === 0) {
      return NextResponse.json({ error: "URLs are required" }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = analyzeUrls(urls);

    return NextResponse.json({ results, name });
  } catch (error) {
    console.error("Bulk analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze URLs" }, { status: 500 });
  }
}
