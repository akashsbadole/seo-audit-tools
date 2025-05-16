import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Keyword } from "@prisma/client";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

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
      averagePosition: keywords.reduce((acc: number, kw: Keyword) => acc + kw.position, 0) / keywords.length || 0,
      keywordsInTop10: keywords.filter((kw: Keyword) => kw.position <= 10).length,
      keywordsImproved: keywords.filter((kw: Keyword) => kw.position < kw.previousPosition).length,
      keywordsDeclined: keywords.filter((kw: Keyword) => kw.position > kw.previousPosition).length,
    };

    // Get trending keywords (those with significant position changes)
    const trendingKeywords = keywords
      .filter((kw: Keyword) => Math.abs(kw.position - kw.previousPosition) >= 3)
      .sort((a: Keyword, b: Keyword) => 
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