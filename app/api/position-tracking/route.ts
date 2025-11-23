import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface PositionTrackingRequest {
  keywords: string[];
  targetUrl?: string;
  searchEngine?: "google" | "bing" | "yahoo";
  location?: string;
  device?: "desktop" | "mobile" | "tablet";
  timeframe?: "today" | "week" | "month" | "quarter" | "year";
  competitors?: string[];
}

interface PositionData {
  keyword: string;
  currentPosition: number;
  previousPosition: number;
  url: string;
  title: string;
  description: string;
  searchEngine: string;
  location: string;
  device: string;
  lastChecked: string;
  trend: "up" | "down" | "stable";
  serpFeatures: {
    hasFeaturedSnippet: boolean;
    hasLocalPack: boolean;
    hasVideo: boolean;
    hasImages: boolean;
    adCount: number;
  };
}

interface PositionTrackingResult {
  keywords: string[];
  searchEngine: string;
  device: string;
  timeframe: string;
  results: PositionData[];
  summary: {
    totalKeywords: number;
    averagePosition: number;
    top3Positions: number;
    improvements: number;
    declines: number;
  };
  competitorAnalysis: {
    competitors: string[];
    overlappingKeywords: string[];
    opportunityKeywords: string[];
  };
  recommendations: string[];
  lastUpdated: string;
}

async function checkPositionTracking(
  request: PositionTrackingRequest
): Promise<PositionTrackingResult> {
  const {
    keywords,
    targetUrl,
    searchEngine = "google",
    location = "US",
    device = "desktop",
    timeframe = "week",
    competitors = [],
  } = request;

  // Mock position checking for each keyword
  const results: PositionData[] = await Promise.all(
    keywords.map(async (keyword) => {
      // Simulate API call to position tracking service
      const position = Math.floor(Math.random() * 100) + 1;
      const previousPosition = Math.floor(Math.random() * 100) + 1;
      const hasFeaturedSnippet = Math.random() > 0.7;
      const hasLocalPack = Math.random() > 0.8;
      const hasVideo = Math.random() > 0.6;
      const hasImages = Math.random() > 0.5;

      return {
        keyword,
        currentPosition: position,
        previousPosition,
        url:
          targetUrl ||
          `https://example.com/${keyword.toLowerCase().replace(/\s+/g, "-")}`,
        title: `${keyword} - Complete Guide`,
        description: `Learn everything about ${keyword} with our comprehensive guide and expert tips.`,
        searchEngine,
        location,
        device,
        lastChecked: new Date().toISOString(),
        trend:
          position < previousPosition
            ? "up"
            : position > previousPosition
              ? "down"
              : "stable",
        serpFeatures: {
          hasFeaturedSnippet,
          hasLocalPack,
          hasVideo,
          hasImages,
          adCount: Math.floor(Math.random() * 5),
        },
      };
    })
  );

  // Calculate summary statistics
  const totalKeywords = results.length;
  const averagePosition = Math.round(
    results.reduce((sum, result) => sum + result.currentPosition, 0) /
      totalKeywords
  );
  const top3Positions = results.filter(
    (result) => result.currentPosition <= 3
  ).length;
  const improvements = results.filter((result) => result.trend === "up").length;
  const declines = results.filter((result) => result.trend === "down").length;

  // Competitor analysis
  const competitorAnalysis = {
    competitors,
    overlappingKeywords: keywords.filter(
      (keyword, index) => index < Math.ceil(keywords.length / 2)
    ),
    opportunityKeywords: keywords.filter(
      (keyword, index) => index >= Math.floor(keywords.length / 2)
    ),
  };

  // Generate recommendations
  const recommendations = [
    "Focus on keywords with positions 1-3 for maximum visibility",
    "Monitor featured snippets and optimize content to capture them",
    "Track local pack performance if you serve specific geographic areas",
    "Analyze competitor movements and adjust strategy accordingly",
    "Optimize page titles and meta descriptions for better CTR",
    "Consider mobile vs desktop performance differences",
    "Use rank tracking to measure SEO campaign effectiveness",
  ];

  return {
    keywords,
    searchEngine,
    device,
    timeframe,
    results,
    summary: {
      totalKeywords,
      averagePosition,
      top3Positions,
      improvements,
      declines,
    },
    competitorAnalysis,
    recommendations,
    lastUpdated: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const JWT_SECRET =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded?.userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body: PositionTrackingRequest = await request.json();
    const {
      keywords,
      targetUrl,
      searchEngine,
      location,
      device,
      timeframe,
      competitors,
    } = body;

    if (!keywords || keywords.length === 0) {
      return NextResponse.json(
        { error: "Keywords are required" },
        { status: 400 }
      );
    }

    // Check user limits
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isPremium) {
      const usage = await prisma.userUsage.findUnique({
        where: { userId: user.id },
      });
      if (usage && usage.freeReportsUsed >= 10) {
        return NextResponse.json(
          {
            error:
              "You have reached your monthly limit. Upgrade to premium for unlimited access.",
          },
          { status: 429 }
        );
      }
    }

    // Perform position tracking
    const result = await checkPositionTracking({
      keywords,
      targetUrl,
      searchEngine,
      location,
      device,
      timeframe,
      competitors,
    });

    // Save to database
    const analysis = await prisma.sEOToolResult.create({
      data: {
        id: `position_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        toolType: "POSITION_TRACKING",
        url: targetUrl || "multiple-keywords",
        result: result as any,
        updatedAt: new Date(),
      },
    });

    // Update usage
    if (!user.isPremium) {
      await prisma.userUsage.upsert({
        where: { userId: user.id },
        update: { freeReportsUsed: { increment: 1 } },
        create: {
          userId: user.id,
          freeReportsUsed: 1,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      ...result,
      analysisId: analysis.id,
    });
  } catch (error) {
    console.error("Position tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track positions" },
      { status: 500 }
    );
  }
}
