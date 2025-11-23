import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface ContentIdeasRequest {
  keyword: string;
  topic?: string;
  contentType?: "blog" | "article" | "social" | "video" | "infographic";
  targetAudience?: string;
  tone?: "professional" | "casual" | "friendly" | "formal" | "humorous";
  count?: number;
}

interface ContentIdea {
  title: string;
  description: string;
  contentType: string;
  targetKeywords: string[];
  estimatedReadTime: number;
  difficulty: "easy" | "medium" | "hard";
  engagementPotential: "low" | "medium" | "high";
}

interface ContentIdeasResult {
  keyword: string;
  ideas: ContentIdea[];
  relatedTopics: string[];
  contentGaps: string[];
  competitorAnalysis: {
    topPerforming: Array<{
      title: string;
      estimatedTraffic: number;
      difficulty: number;
    }>;
    contentAngles: string[];
  };
  recommendations: string[];
  seoScore: number;
}

async function generateContentIdeas(
  request: ContentIdeasRequest
): Promise<ContentIdeasResult> {
  const {
    keyword,
    topic,
    contentType = "blog",
    targetAudience,
    tone = "professional",
    count = 10,
  } = request;

  // Mock content idea generation based on keyword
  const contentAngles = [
    `Ultimate Guide to ${keyword}`,
    `${keyword}: Best Practices for ${new Date().getFullYear()}`,
    `Common ${keyword} Mistakes and How to Avoid Them`,
    `${keyword} for Beginners: Getting Started Guide`,
    `Advanced ${keyword} Techniques for Experts`,
    `${keyword} vs Competitors: Which is Better?`,
    `Top 10 ${keyword} Tools You Need`,
    `${keyword} Case Studies: Real-World Examples`,
    `Future of ${keyword}: Trends and Predictions`,
    `${keyword} Checklist: Complete Guide`,
  ];

  const ideas: ContentIdea[] = contentAngles
    .slice(0, count)
    .map((angle, index) => ({
      title: angle,
      description: `Comprehensive ${contentType} covering ${angle} with detailed insights and practical examples.`,
      contentType,
      targetKeywords: [
        keyword,
        `${keyword} guide`,
        `${keyword} tutorial`,
        `best ${keyword}`,
      ],
      estimatedReadTime: Math.floor(Math.random() * 10) + 5,
      difficulty: index < 3 ? "easy" : index < 7 ? "medium" : "hard",
      engagementPotential: index < 3 ? "high" : index < 7 ? "medium" : "low",
    }));

  // Generate related topics
  const relatedTopics = [
    `${keyword} optimization`,
    `${keyword} strategy`,
    `${keyword} analysis`,
    `${keyword} implementation`,
    `${keyword} tools`,
    `${keyword} best practices`,
    `${keyword} trends`,
    `${keyword} examples`,
  ].slice(0, 5);

  // Identify content gaps
  const contentGaps = [
    `${keyword} for specific industries`,
    `${keyword} case studies and success stories`,
    `${keyword} troubleshooting guide`,
    `${keyword} cost analysis`,
    `${keyword} ROI measurement`,
  ];

  // Mock competitor analysis
  const competitorAnalysis = {
    topPerforming: [
      {
        title: `Complete ${keyword} Guide`,
        estimatedTraffic: 5000,
        difficulty: 65,
      },
      {
        title: `${keyword} Tutorial for Beginners`,
        estimatedTraffic: 3500,
        difficulty: 45,
      },
      {
        title: `Advanced ${keyword} Strategies`,
        estimatedTraffic: 2800,
        difficulty: 75,
      },
    ],
    contentAngles: [
      `Beginner-friendly ${keyword} content`,
      `Data-driven ${keyword} insights`,
      `Practical ${keyword} examples`,
      `${keyword} myths debunked`,
    ],
  };

  // Generate recommendations
  const recommendations = [
    `Focus on long-tail keywords related to ${keyword}`,
    `Create pillar content around ${keyword} and cluster supporting articles`,
    `Include current statistics and data for ${keyword} content`,
    `Use engaging visuals and examples in ${keyword} content`,
    `Update ${keyword} content regularly to maintain freshness`,
    `Target different search intents for ${keyword} (informational, commercial, navigational)`,
    `Optimize for featured snippets when creating ${keyword} content`,
  ];

  // Calculate SEO score based on various factors
  const seoScore = Math.floor(
    Math.random() * 30 + 70 // Mock score between 70-100
  );

  return {
    keyword,
    ideas,
    relatedTopics,
    contentGaps,
    competitorAnalysis,
    recommendations,
    seoScore,
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

    const body: ContentIdeasRequest = await request.json();
    const { keyword, topic, contentType, targetAudience, tone, count } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
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

    // Generate content ideas
    const result = await generateContentIdeas({
      keyword,
      topic,
      contentType,
      targetAudience,
      tone,
      count: count || 10,
    });

    // Save to database
    const analysis = await prisma.sEOToolResult.create({
      data: {
        id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        toolType: "CONTENT_IDEAS",
        url: `keyword: ${keyword}`,
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
    console.error("Content ideas error:", error);
    return NextResponse.json(
      { error: "Failed to generate content ideas" },
      { status: 500 }
    );
  }
}
