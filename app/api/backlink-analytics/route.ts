import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface BacklinkAnalyticsRequest {
  domain: string;
  includeCompetitors?: boolean;
  competitorDomains?: string[];
  maxBacklinks?: number;
}

interface BacklinkAnalyticsResult {
  domain: string;
  totalBacklinks: number;
  newBacklinks: number;
  lostBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
  spamScore: number;
  competitors?: Array<{
    totalBacklinks: number;
    referringDomains: number;
    domainAuthority: number;
  }>;
  topReferringDomains: Array<{
    domain: string;
    backlinks: number;
    authority: number;
    anchorTexts: Array<{
      text: string;
      count: number;
      type: "branded" | "keyword" | "generic";
    }>;
    linkTypeDistribution: {
      dofollow: number;
      nofollow: number;
      text: number;
      image: number;
      redirect: number;
    };
    authorityDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    geographicDistribution: Array<{
      country: string;
      count: number;
      percentage: number;
    }>;
    trends: {
      newLinks: Array<{ date: string; count: number }>;
      lostLinks: Array<{ date: string; count: number }>;
      authorityGrowth: Array<{ date: string; authority: number }>;
    };
    topPages: Array<{
      url: string;
      title: string;
      backlinks: number;
      referringDomains: number;
    }>;
    recommendations: string[];
    score: {
      overall: number;
      authority: number;
      diversity: number;
      quality: number;
      growth: number;
    };
  }>;
  anchorTexts: Array<{
    text: string;
    count: number;
    type: "branded" | "keyword" | "generic";
  }>;
  linkTypeDistribution: {
    dofollow: number;
    nofollow: number;
    text: number;
    image: number;
    redirect: number;
  };
  authorityDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  geographicDistribution: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  trends: {
    newLinks: Array<{ date: string; count: number }>;
    lostLinks: Array<{ date: string; count: number }>;
    authorityGrowth: Array<{ date: string; authority: number }>;
  };
  topPages: Array<{
    url: string;
    title: string;
    backlinks: number;
    referringDomains: number;
  }>;
  recommendations: string[];
  score: {
    overall: number;
    authority: number;
    diversity: number;
    quality: number;
    growth: number;
  };
}

async function analyzeBacklinks(
  domain: string
): Promise<BacklinkAnalyticsResult> {
  try {
    // Use Puppeteer to scrape backlink data from various sources
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Mock backlink analysis - in production, you'd use APIs like Ahrefs, Moz, Majestic
    const mockData = await generateMockBacklinkData(domain);

    await browser.close();
    return mockData;
  } catch (error) {
    console.error("Error analyzing backlinks:", error);
    throw new Error("Failed to analyze backlinks");
  }
}

async function generateMockBacklinkData(
  domain: string
): Promise<BacklinkAnalyticsResult> {
  // Generate realistic mock data based on domain characteristics
  const baseAuthority = Math.floor(Math.random() * 50) + 20;
  const totalBacklinks = Math.floor(Math.random() * 10000) + 100;
  const referringDomains = Math.floor(Math.random() * 1000) + 50;

  // Generate top referring domains
  const topReferringDomains = Array.from({ length: 10 }, (_, i) => ({
    domain: `referring-domain-${i + 1}.com`,
    backlinks: Math.floor(Math.random() * 100) + 1,
    authority: Math.floor(Math.random() * 80) + 20,
    anchorTexts: [
      {
        text: domain,
        count: Math.floor(Math.random() * 10) + 1,
        type: "branded" as const,
      },
      {
        text: "click here",
        count: Math.floor(Math.random() * 5) + 1,
        type: "generic" as const,
      },
      {
        text: "seo services",
        count: Math.floor(Math.random() * 8) + 1,
        type: "keyword" as const,
      },
    ],
    linkTypeDistribution: {
      dofollow: Math.floor(Math.random() * 80) + 10,
      nofollow: Math.floor(Math.random() * 20) + 1,
      text: Math.floor(Math.random() * 70) + 10,
      image: Math.floor(Math.random() * 20) + 1,
      redirect: Math.floor(Math.random() * 10) + 1,
    },
    authorityDistribution: [
      {
        range: "0-20",
        count: Math.floor(Math.random() * 5) + 1,
        percentage: 20,
      },
      {
        range: "21-40",
        count: Math.floor(Math.random() * 3) + 1,
        percentage: 30,
      },
      {
        range: "41-60",
        count: Math.floor(Math.random() * 2) + 1,
        percentage: 40,
      },
      {
        range: "61+",
        count: Math.floor(Math.random() * 2) + 1,
        percentage: 10,
      },
    ],
    geographicDistribution: [
      {
        country: "United States",
        count: Math.floor(Math.random() * 5) + 1,
        percentage: 40,
      },
      {
        country: "United Kingdom",
        count: Math.floor(Math.random() * 3) + 1,
        percentage: 20,
      },
      {
        country: "Others",
        count: Math.floor(Math.random() * 2) + 1,
        percentage: 40,
      },
    ],
    trends: {
      newLinks: Array.from({ length: 3 }, (_, j) => ({
        date: new Date(2024, j, 1).toISOString().split("T")[0],
        count: Math.floor(Math.random() * 10) + 1,
      })),
      lostLinks: Array.from({ length: 3 }, (_, j) => ({
        date: new Date(2024, j, 1).toISOString().split("T")[0],
        count: Math.floor(Math.random() * 5) + 1,
      })),
      authorityGrowth: Array.from({ length: 3 }, (_, j) => ({
        date: new Date(2024, j, 1).toISOString().split("T")[0],
        authority: Math.floor(Math.random() * 20) + 30,
      })),
    },
    topPages: Array.from({ length: 3 }, (_, j) => ({
      url: `https://${domain}/page-${j + 1}`,
      title: `Page ${j + 1}`,
      backlinks: Math.floor(Math.random() * 20) + 5,
      referringDomains: Math.floor(Math.random() * 10) + 2,
    })),
    recommendations: [
      "Focus on building more high-quality backlinks",
      "Diversify your anchor text portfolio",
      "Target higher-authority domains",
    ],
    score: {
      overall: Math.floor(Math.random() * 30) + 60,
      authority: Math.floor(Math.random() * 20) + 10,
      diversity: Math.floor(Math.random() * 20) + 10,
      quality: Math.floor(Math.random() * 20) + 10,
      growth: Math.floor(Math.random() * 20) + 10,
    },
  }));

  // Generate anchor text distribution
  const anchorTexts = [
    {
      text: domain,
      count: Math.floor(totalBacklinks * 0.3),
      type: "branded" as const,
    },
    {
      text: "click here",
      count: Math.floor(totalBacklinks * 0.1),
      type: "generic" as const,
    },
    {
      text: "seo services",
      count: Math.floor(totalBacklinks * 0.2),
      type: "keyword" as const,
    },
    {
      text: "learn more",
      count: Math.floor(totalBacklinks * 0.1),
      type: "generic" as const,
    },
    {
      text: "website",
      count: Math.floor(totalBacklinks * 0.15),
      type: "generic" as const,
    },
    {
      text: "visit site",
      count: Math.floor(totalBacklinks * 0.05),
      type: "generic" as const,
    },
  ];

  // Generate link type distribution
  const linkTypeDistribution = {
    dofollow: Math.floor(totalBacklinks * 0.85),
    nofollow: Math.floor(totalBacklinks * 0.15),
    text: Math.floor(totalBacklinks * 0.7),
    image: Math.floor(totalBacklinks * 0.2),
    redirect: Math.floor(totalBacklinks * 0.1),
  };

  // Generate authority distribution
  const authorityDistribution = [
    {
      range: "0-20",
      count: Math.floor(referringDomains * 0.4),
      percentage: 40,
    },
    {
      range: "21-40",
      count: Math.floor(referringDomains * 0.3),
      percentage: 30,
    },
    {
      range: "41-60",
      count: Math.floor(referringDomains * 0.2),
      percentage: 20,
    },
    {
      range: "61-80",
      count: Math.floor(referringDomains * 0.08),
      percentage: 8,
    },
    { range: "81+", count: Math.floor(referringDomains * 0.02), percentage: 2 },
  ];

  // Generate geographic distribution
  const geographicDistribution = [
    {
      country: "United States",
      count: Math.floor(referringDomains * 0.4),
      percentage: 40,
    },
    {
      country: "United Kingdom",
      count: Math.floor(referringDomains * 0.15),
      percentage: 15,
    },
    {
      country: "Germany",
      count: Math.floor(referringDomains * 0.1),
      percentage: 10,
    },
    {
      country: "Canada",
      count: Math.floor(referringDomains * 0.08),
      percentage: 8,
    },
    {
      country: "Australia",
      count: Math.floor(referringDomains * 0.07),
      percentage: 7,
    },
    {
      country: "Others",
      count: Math.floor(referringDomains * 0.2),
      percentage: 20,
    },
  ];

  // Generate trends
  const trends = {
    newLinks: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i, 1).toISOString().split("T")[0],
      count: Math.floor(Math.random() * 50) + 5,
    })),
    lostLinks: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i, 1).toISOString().split("T")[0],
      count: Math.floor(Math.random() * 20) + 2,
    })),
    authorityGrowth: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i, 1).toISOString().split("T")[0],
      authority: baseAuthority + Math.floor(Math.random() * 10) - 5,
    })),
  };

  // Generate top pages
  const topPages = Array.from({ length: 10 }, (_, i) => ({
    url: `https://${domain}/page-${i + 1}`,
    title: `Page ${i + 1} - ${["Services", "About", "Blog", "Contact", "Products", "FAQ", "Portfolio", "Testimonials", "Resources", "News"][i]}`,
    backlinks: Math.floor(Math.random() * 100) + 10,
    referringDomains: Math.floor(Math.random() * 20) + 5,
  }));

  const newBacklinks = Math.floor(Math.random() * 50) + 5;
  const lostBacklinks = Math.floor(Math.random() * 20) + 2;
  const spamScore = Math.random() * 5;

  return {
    domain,
    totalBacklinks,
    newBacklinks,
    lostBacklinks,
    referringDomains,
    domainAuthority: baseAuthority,
    spamScore,
    topReferringDomains,
    anchorTexts,
    linkTypeDistribution,
    authorityDistribution,
    geographicDistribution,
    trends,
    topPages,
    recommendations: generateBacklinkRecommendations({
      totalBacklinks,
      referringDomains,
      domainAuthority: baseAuthority,
      spamScore,
      linkTypeDistribution,
    }),
    score: calculateBacklinkScore({
      totalBacklinks,
      referringDomains,
      domainAuthority: baseAuthority,
      spamScore,
      linkTypeDistribution,
    }),
  };
}

function generateBacklinkRecommendations(metrics: {
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
  spamScore: number;
  linkTypeDistribution: any;
}): string[] {
  const recommendations: string[] = [];

  // Quantity recommendations
  if (metrics.totalBacklinks < 50) {
    recommendations.push(
      "You have very few backlinks. Focus on building more high-quality links from relevant websites."
    );
  } else if (metrics.totalBacklinks < 200) {
    recommendations.push(
      "Your backlink profile is developing. Continue building links consistently and focus on quality over quantity."
    );
  } else if (metrics.totalBacklinks > 10000) {
    recommendations.push(
      "You have an excellent number of backlinks. Focus on maintaining quality and relevance."
    );
  }

  // Diversity recommendations
  if (metrics.referringDomains < 20) {
    recommendations.push(
      "Your backlinks come from very few domains. Diversify your link sources to improve authority."
    );
  } else if (metrics.referringDomains < 50) {
    recommendations.push(
      "Good domain diversity. Continue building links from different, relevant domains."
    );
  }

  // Authority recommendations
  if (metrics.domainAuthority < 30) {
    recommendations.push(
      "Your domain authority is low. Focus on getting links from higher-authority websites."
    );
  } else if (metrics.domainAuthority < 50) {
    recommendations.push(
      "Moderate domain authority. Target links from websites with DA 40+ for better results."
    );
  }

  // Link type recommendations
  const nofollowRatio =
    metrics.linkTypeDistribution.nofollow / metrics.totalBacklinks;
  if (nofollowRatio > 0.3) {
    recommendations.push(
      "High ratio of nofollow links. Focus on getting more dofollow links for better SEO value."
    );
  }

  // Spam score recommendations
  if (metrics.spamScore > 7) {
    recommendations.push(
      "High spam score detected. Review and disavow toxic backlinks immediately."
    );
  } else if (metrics.spamScore > 5) {
    recommendations.push(
      "Moderate spam score. Audit your backlink profile and remove suspicious links."
    );
  }

  // General recommendations
  recommendations.push(
    "Regularly monitor your backlink profile for new and lost links."
  );
  recommendations.push(
    "Focus on relevance over quantity when building new backlinks."
  );
  recommendations.push(
    "Create valuable content that naturally attracts quality backlinks."
  );

  return recommendations;
}

function calculateBacklinkScore(metrics: {
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
  spamScore: number;
  linkTypeDistribution: any;
}): BacklinkAnalyticsResult["score"] {
  // Quantity score (0-25)
  const quantityScore = Math.min(
    25,
    Math.log10(metrics.totalBacklinks + 1) * 5
  );

  // Diversity score (0-25)
  const diversityScore = Math.min(
    25,
    Math.log10(metrics.referringDomains + 1) * 8
  );

  // Authority score (0-25)
  const authorityScore = Math.min(25, metrics.domainAuthority * 0.25);

  // Quality score (0-25)
  const dofollowRatio =
    metrics.linkTypeDistribution.dofollow / metrics.totalBacklinks;
  const qualityScore = Math.min(25, dofollowRatio * 25 - metrics.spamScore * 2);

  // Growth score (mock based on recent trends)
  const growthScore = Math.floor(Math.random() * 15) + 10;

  // Overall score
  const overall = Math.round(
    (quantityScore +
      diversityScore +
      authorityScore +
      qualityScore +
      growthScore) /
      5
  );

  return {
    overall,
    authority: authorityScore,
    diversity: diversityScore,
    quality: qualityScore,
    growth: growthScore,
  };
}

async function getCompetitorBacklinks(domain: string): Promise<{
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
}> {
  // Mock competitor backlink data
  return {
    totalBacklinks: Math.floor(Math.random() * 15000) + 500,
    referringDomains: Math.floor(Math.random() * 1200) + 100,
    domainAuthority: Math.floor(Math.random() * 60) + 25,
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

    const body: BacklinkAnalyticsRequest = await request.json();
    const {
      domain,
      includeCompetitors = false,
      competitorDomains = [],
      maxBacklinks = 100,
    } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
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

    // Perform backlink analysis
    const result = await analyzeBacklinks(domain);

    // Add competitor analysis if requested
    if (includeCompetitors && competitorDomains.length > 0) {
      const competitorData = await Promise.all(
        competitorDomains.slice(0, 5).map(async (compDomain) => {
          const compData = await getCompetitorBacklinks(compDomain);
          return {
            domain: compDomain,
            ...compData,
          };
        })
      );

      // Add comparison to result
      (result as any).competitors = competitorData;
    }

    // Save to database
    const backlinkAnalysis = await prisma.backlinkAnalysis.create({
      data: {
        userId: user.id,
        domain,
        referringDomains: result.referringDomains,
        domainAuthority: result.domainAuthority,
        spamScore: result.spamScore,
        newBacklinks: result.newBacklinks,
        lostBacklinks: result.lostBacklinks,
      },
    });

    // Save individual backlinks (sample)
    const sampleBacklinks = result.topReferringDomains.slice(0, maxBacklinks);
    for (const referringDomain of sampleBacklinks) {
      await prisma.backlink.create({
        data: {
          backlinkAnalysisId: backlinkAnalysis.id,
          sourceDomain: referringDomain.domain,
          sourceUrl: `https://${referringDomain.domain}`,
          targetUrl: `https://${domain}`,
          anchorText: "Sample anchor text",
          linkType: "TEXT",
          isDofollow: true,
          domainAuthority: referringDomain.authority,
          spamScore: Math.random() * 3,
        },
      });
    }

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

    return NextResponse.json(result);
  } catch (error) {
    console.error("Backlink analytics error:", error);
    return NextResponse.json(
      { error: "Failed to analyze backlinks" },
      { status: 500 }
    );
  }
}
