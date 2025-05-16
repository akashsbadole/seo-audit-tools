import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Competitor } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all competitors with their metrics
    const competitors = await prisma.competitor.findMany({
      where: { userId: dbUser.id },
      orderBy: { lastUpdated: "desc" },
    });

    // Calculate competitor analysis metrics
    const metrics = {
      totalCompetitors: competitors.length,
      averageDomainAuthority: competitors.reduce((acc: number, comp: Competitor) => acc + comp.domainAuthority, 0) / competitors.length || 0,
      totalBacklinks: competitors.reduce((acc: number, comp: Competitor) => acc + comp.backlinks, 0),
      totalOrganicKeywords: competitors.reduce((acc: number, comp: Competitor) => acc + comp.organicKeywords, 0),
      totalOrganicTraffic: competitors.reduce((acc: number, comp: Competitor) => acc + comp.organicTraffic, 0),
    };

    // Get top performing competitors
    const topCompetitors = competitors
      .sort((a: Competitor, b: Competitor) => b.domainAuthority - a.domainAuthority)
      .slice(0, 5);

    // Get competitors with significant changes
    const significantChanges = competitors
      .filter((comp: Competitor) => {
        const lastUpdate = new Date(comp.lastUpdated);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return lastUpdate >= oneWeekAgo;
      })
      .sort((a: Competitor, b: Competitor) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, 5);

    return NextResponse.json({
      competitors,
      metrics,
      topCompetitors,
      significantChanges,
    });
  } catch (error) {
    console.error("[COMPETITORS_ANALYSIS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 