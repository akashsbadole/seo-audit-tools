import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    // TODO: Validate token and get user ID
    // For now, we'll use a placeholder user ID
    const userId = "temp-user-id";

    const dbUser = await prisma.user.findFirst();

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all keywords with their history
    const keywords = await prisma.keyword.findMany({
      where: { userId: dbUser.id },
      orderBy: { lastUpdated: "desc" },
    });

    // Calculate keyword performance metrics
    const metrics = {
      totalKeywords: keywords.length,
      averagePosition: keywords.reduce((acc: number, kw: any) => acc + kw.position, 0) / keywords.length || 0,
      keywordsInTop10: keywords.filter((kw: any) => kw.position <= 10).length,
      keywordsImproved: keywords.filter((kw: any) => kw.position < kw.previousPosition).length,
      keywordsDeclined: keywords.filter((kw: any) => kw.position > kw.previousPosition).length,
    };

    // Get trending keywords (those with significant position changes)
    const trendingKeywords = keywords
      .filter((kw: any) => Math.abs(kw.position - kw.previousPosition) >= 3)
      .sort((a: any, b: any) =>
        Math.abs(b.position - b.previousPosition) - Math.abs(a.position - a.previousPosition))
      .slice(0, 5);

    return NextResponse.json({
      keywords,
      metrics,
      trendingKeywords,
    });
  } catch (error) {
    console.error("[KEYWORDS_TRACKING_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}