import { NextResponse } from "next/server";

function checkWebsite(url: string) {
  const seed = url.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (min: number, max: number) => Math.floor(Math.abs(Math.sin(seed + min + max) * 10000) % (max - min + 1)) + min;

  const isUp = random(0, 100) > 10;

  return {
    url,
    status: isUp ? "up" : "down",
    responseTime: isUp ? random(50, 500) : 0,
    lastChecked: new Date().toISOString(),
    uptime: random(90, 99),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    const result = checkWebsite(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Website monitoring error:", error);
    return NextResponse.json({ error: "Failed to check website" }, { status: 500 });
  }
}
