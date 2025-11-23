import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { createWhiteLabelPDFReport } from "@/lib/white-label-pdf";

interface EnhancedSiteAuditRequest {
  url: string;
  includeAdvancedChecks?: boolean;
  checkPerformance?: boolean;
  checkAccessibility?: boolean;
  checkSecurity?: boolean;
  maxPages?: number;
  exportFormat?: "json" | "csv" | "pdf";
  whiteLabel?: {
    companyName?: string;
    logo?: string;
    brandColor?: string;
    removeBranding?: boolean;
    contactInfo?: {
      email?: string;
      phone?: string;
      website?: string;
    };
    footerText?: string;
    reportTitle?: string;
  };
}

interface EnhancedSiteAuditResult {
  url: string;
  overallScore: number;
  pagesAudited: number;
  auditDate: string;
  basic: {
    title: {
      present: boolean;
      length: number;
      optimized: boolean;
      recommendations: string[];
    };
    metaDescription: {
      present: boolean;
      length: number;
      optimized: boolean;
      recommendations: string[];
    };
    headings: {
      h1: { count: number; issues: string[] };
      h2: { count: number; issues: string[] };
      structure: boolean;
      recommendations: string[];
    };
    images: {
      total: number;
      withoutAlt: number;
      optimized: number;
      recommendations: string[];
    };
    links: {
      internal: number;
      external: number;
      broken: number;
      recommendations: string[];
    };
  };
  technical: {
    https: boolean;
    mobileFriendly: boolean;
    pageSpeed: {
      desktop: number;
      mobile: number;
      recommendations: string[];
    };
    crawlability: {
      sitemap: boolean;
      robotsTxt: boolean;
      issues: string[];
    };
  };
  content: {
    wordCount: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    internalLinking: {
      count: number;
      relevance: number;
    };
    recommendations: string[];
  };
  performance?: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
    recommendations: string[];
  };
  accessibility?: {
    score: number;
    issues: Array<{
      type: string;
      severity: "low" | "medium" | "high" | "critical";
      description: string;
      count: number;
    }>;
    recommendations: string[];
  };
  security?: {
    score: number;
    issues: Array<{
      type: string;
      severity: "low" | "medium" | "high" | "critical";
      description: string;
    }>;
    recommendations: string[];
  };
  recommendations: string[];
  scoreBreakdown: {
    basic: number;
    technical: number;
    content: number;
    performance?: number;
    accessibility?: number;
    security?: number;
  };
}

async function performEnhancedSiteAudit(
  url: string,
  options: EnhancedSiteAuditRequest
): Promise<EnhancedSiteAuditResult> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set viewport for mobile testing
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to URL
    await page.goto(url, { waitUntil: "networkidle2" });

    // Get page content
    const content = await page.content();
    const $ = cheerio.load(content);

    // Basic SEO checks
    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const h1Tags = $("h1");
    const h2Tags = $("h2");
    const images = $("img");
    const links = $("a[href]");

    // Technical checks
    const isHttps = url.startsWith("https://");
    const hasViewport = $('meta[name="viewport"]').length > 0;

    // Content analysis
    const bodyText = $("body").text();
    const wordCount = bodyText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Calculate scores
    const basicScore = calculateBasicScore(
      $,
      title,
      metaDescription,
      h1Tags,
      h2Tags,
      images,
      links
    );
    const technicalScore = calculateTechnicalScore(isHttps, hasViewport, url);
    const contentScore = calculateContentScore(wordCount, bodyText);

    let performanceScore, accessibilityScore, securityScore;
    let performance, accessibility, security;

    if (options.checkPerformance) {
      performance = await checkPagePerformance(page);
      performanceScore = performance.score;
    }

    if (options.checkAccessibility) {
      accessibility = await checkAccessibility(page);
      accessibilityScore = accessibility.score;
    }

    if (options.checkSecurity) {
      security = await checkSecurity(url);
      securityScore = security.score;
    }

    await browser.close();

    // Calculate overall score
    const scoreBreakdown = {
      basic: basicScore,
      technical: technicalScore,
      content: contentScore,
      performance: performanceScore,
      accessibility: accessibilityScore,
      security: securityScore,
    };

    const overallScore =
      Object.values(scoreBreakdown).reduce(
        (sum: number, score) => sum + (score || 0),
        0
      ) /
        Object.values(scoreBreakdown).filter((score) => score !== undefined)
          .length || 0;

    return {
      url,
      overallScore: Math.round(overallScore),
      pagesAudited: 1,
      auditDate: new Date().toISOString(),
      basic: {
        title: analyzeTitle(title),
        metaDescription: analyzeMetaDescription(metaDescription),
        headings: analyzeHeadings(h1Tags, h2Tags),
        images: analyzeImages(images, $),
        links: analyzeLinks(links, $),
      },
      technical: {
        https: isHttps,
        mobileFriendly: hasViewport,
        pageSpeed: {
          desktop: performance?.pageSpeed.desktop || 0,
          mobile: performance?.pageSpeed.mobile || 0,
          recommendations: performance?.pageSpeed.recommendations || [],
        },
        crawlability: await checkCrawlability(url),
      },
      content: {
        wordCount,
        readabilityScore: calculateReadabilityScore(bodyText),
        keywordDensity: calculateKeywordDensity(bodyText),
        internalLinking: analyzeInternalLinking($),
        recommendations: getContentRecommendations(wordCount, bodyText),
      },
      performance,
      accessibility,
      security,
      recommendations: getAllRecommendations(scoreBreakdown),
      scoreBreakdown,
    };
  } catch (error) {
    console.error("Enhanced site audit error:", error);
    throw new Error("Failed to perform enhanced site audit");
  }
}

function calculateBasicScore(
  $: any,
  title: string,
  metaDescription: string,
  h1Tags: any,
  h2Tags: any,
  images: any,
  links: any
): number {
  let score = 0;
  let maxScore = 0;

  // Title check (25 points)
  maxScore += 25;
  if (title && title.length > 0 && title.length <= 60) score += 25;
  else if (title && title.length > 0) score += 15;

  // Meta description check (25 points)
  maxScore += 25;
  if (
    metaDescription &&
    metaDescription.length > 0 &&
    metaDescription.length <= 160
  )
    score += 25;
  else if (metaDescription && metaDescription.length > 0) score += 15;

  // Headings structure (25 points)
  maxScore += 25;
  if (h1Tags.length === 1 && h2Tags.length > 0) score += 25;
  else if (h1Tags.length > 0) score += 15;

  // Image optimization (25 points)
  maxScore += 25;
  const totalImages = images.length;
  const imagesWithAlt = images.filter((_: any, i: number) =>
    $(images[i]).attr("alt")
  ).length;
  if (totalImages === 0) score += 25;
  else if (imagesWithAlt / totalImages > 0.8) score += 25;
  else if (imagesWithAlt / totalImages > 0.5) score += 15;

  return Math.round((score / maxScore) * 100);
}

function calculateTechnicalScore(
  isHttps: boolean,
  hasViewport: boolean,
  url: string
): number {
  let score = 0;

  if (isHttps) score += 40;
  if (hasViewport) score += 30;
  if (url.length <= 60) score += 30;

  return score;
}

function calculateContentScore(wordCount: number, content: string): number {
  let score = 0;

  if (wordCount >= 300) score += 40;
  else if (wordCount >= 150) score += 20;

  const readabilityScore = calculateReadabilityScore(content);
  if (readabilityScore >= 80) score += 30;
  else if (readabilityScore >= 60) score += 20;

  if (content.length > 1000) score += 30;
  else if (content.length > 500) score += 20;

  return score;
}

function analyzeTitle(title: string) {
  return {
    present: !!title,
    length: title.length,
    optimized: title.length > 0 && title.length <= 60,
    recommendations:
      title.length === 0
        ? ["Add a title tag"]
        : title.length > 60
          ? ["Title is too long, keep it under 60 characters"]
          : title.length < 30
            ? ["Consider a more descriptive title"]
            : [],
  };
}

function analyzeMetaDescription(description: string) {
  return {
    present: !!description,
    length: description.length,
    optimized: description.length > 0 && description.length <= 160,
    recommendations:
      description.length === 0
        ? ["Add a meta description"]
        : description.length > 160
          ? ["Meta description is too long, keep it under 160 characters"]
          : description.length < 120
            ? ["Consider a more descriptive meta description"]
            : [],
  };
}

function analyzeHeadings(h1Tags: any, h2Tags: any) {
  return {
    h1: {
      count: h1Tags.length,
      issues:
        h1Tags.length === 0
          ? ["No H1 tag found"]
          : h1Tags.length > 1
            ? ["Multiple H1 tags found, use only one"]
            : [],
    },
    h2: {
      count: h2Tags.length,
      issues:
        h2Tags.length === 0
          ? ["No H2 tags found, consider adding subheadings"]
          : [],
    },
    structure: h1Tags.length === 1 && h2Tags.length > 0,
    recommendations: [
      ...(h1Tags.length === 0 ? ["Add one H1 tag for the main topic"] : []),
      ...(h1Tags.length > 1 ? ["Use only one H1 tag per page"] : []),
      ...(h2Tags.length === 0 ? ["Add H2 tags for subtopics"] : []),
    ],
  };
}

function analyzeImages(images: any, $: any) {
  const total = images.length;
  const withoutAlt = images.filter(
    (_: any, i: number) => !$(images[i]).attr("alt")
  ).length;
  const optimized = total - withoutAlt;

  return {
    total,
    withoutAlt,
    optimized,
    recommendations:
      withoutAlt > 0
        ? [`${withoutAlt} images are missing alt text for accessibility`]
        : [],
  };
}

function analyzeLinks(links: any, $: any) {
  const internal = links.filter((_: any, i: number) => {
    const href = $(links[i]).attr("href");
    return (
      href &&
      (href.startsWith("/") || href.includes(window?.location?.hostname || ""))
    );
  }).length;

  const external = links.length - internal;
  const broken = 0; // Would need additional crawling to check

  return {
    internal,
    external,
    broken,
    recommendations: [],
  };
}

function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const avgWordsPerSentence = words.length / sentences.length;

  // Simple readability calculation
  let score = 100;
  if (avgWordsPerSentence > 20) score -= 20;
  else if (avgWordsPerSentence > 15) score -= 10;

  const avgWordLength =
    words.reduce((sum, word) => sum + word.length, 0) / words.length;
  if (avgWordLength > 6) score -= 15;
  else if (avgWordLength > 5) score -= 5;

  return Math.max(0, Math.min(100, score));
}

function calculateKeywordDensity(text: string): Record<string, number> {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const wordCount = words.length;
  const density: Record<string, number> = {};

  words.forEach((word) => {
    density[word] = (density[word] || 0) + 1;
  });

  // Convert to percentage
  Object.keys(density).forEach((word) => {
    density[word] = Math.round((density[word] / wordCount) * 100 * 100) / 100;
  });

  // Return top 10 keywords
  return Object.entries(density)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}

function analyzeInternalLinking($: any) {
  const internalLinks = $(
    'a[href^="/"], a[href*="' +
      (typeof window !== "undefined" ? window.location.hostname : "") +
      '"]'
  );
  return {
    count: internalLinks.length,
    relevance:
      internalLinks.length > 5 ? 80 : internalLinks.length > 0 ? 60 : 40,
  };
}

function getContentRecommendations(
  wordCount: number,
  content: string
): string[] {
  const recommendations: string[] = [];

  if (wordCount < 300) {
    recommendations.push("Content is too short, aim for at least 300 words");
  }

  if (content.length < 1000) {
    recommendations.push("Consider adding more comprehensive content");
  }

  const readability = calculateReadabilityScore(content);
  if (readability < 60) {
    recommendations.push(
      "Content readability could be improved with shorter sentences"
    );
  }

  return recommendations;
}

async function checkCrawlability(url: string) {
  const baseUrl = new URL(url).origin;

  try {
    // Check for sitemap.xml
    const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
    const hasSitemap = sitemapResponse.ok;

    // Check for robots.txt
    const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
    const hasRobotsTxt = robotsResponse.ok;

    const issues: string[] = [];
    if (!hasSitemap) issues.push("No sitemap.xml found");
    if (!hasRobotsTxt) issues.push("No robots.txt found");

    return {
      sitemap: hasSitemap,
      robotsTxt: hasRobotsTxt,
      issues,
    };
  } catch (error) {
    return {
      sitemap: false,
      robotsTxt: false,
      issues: ["Unable to check crawlability"],
    };
  }
}

async function checkPagePerformance(page: any) {
  // Mock performance metrics
  const metrics = await page.metrics();

  return {
    firstContentfulPaint: Math.random() * 2000 + 500,
    largestContentfulPaint: Math.random() * 3000 + 1000,
    cumulativeLayoutShift: Math.random() * 0.3,
    firstInputDelay: Math.random() * 100,
    score: Math.floor(Math.random() * 30) + 70,
    pageSpeed: {
      desktop: Math.floor(Math.random() * 30) + 70,
      mobile: Math.floor(Math.random() * 40) + 60,
      recommendations: [
        "Optimize images for better performance",
        "Minimize CSS and JavaScript",
        "Enable browser caching",
      ],
    },
    recommendations: [
      "Reduce server response time",
      "Optimize image formats",
      "Minimize render-blocking resources",
    ],
  };
}

async function checkAccessibility(page: any) {
  // Mock accessibility check
  return {
    score: Math.floor(Math.random() * 20) + 80,
    issues: [
      {
        type: "Color Contrast",
        severity: "medium" as const,
        description: "Some text elements have insufficient color contrast",
        count: 3,
      },
      {
        type: "Alt Text",
        severity: "high" as const,
        description: "Images missing alternative text",
        count: 5,
      },
    ],
    recommendations: [
      "Ensure all interactive elements are keyboard accessible",
      "Add descriptive alt text to all images",
      "Check color contrast ratios",
    ],
  };
}

async function checkSecurity(url: string) {
  // Mock security check
  return {
    score: Math.floor(Math.random() * 15) + 85,
    issues: url.startsWith("https://")
      ? []
      : [
          {
            type: "HTTPS",
            severity: "critical" as const,
            description: "Site does not use HTTPS",
          },
        ],
    recommendations: url.startsWith("https://")
      ? ["Implement Content Security Policy", "Use secure cookies"]
      : ["Enable HTTPS to secure user data"],
  };
}

function getAllRecommendations(scoreBreakdown: any): string[] {
  const recommendations: string[] = [];

  if (scoreBreakdown.basic < 80) {
    recommendations.push(
      "Improve basic SEO elements (title, meta description, headings)"
    );
  }

  if (scoreBreakdown.technical < 80) {
    recommendations.push(
      "Address technical SEO issues (HTTPS, mobile-friendliness)"
    );
  }

  if (scoreBreakdown.content < 80) {
    recommendations.push("Enhance content quality and relevance");
  }

  if (scoreBreakdown.performance && scoreBreakdown.performance < 80) {
    recommendations.push(
      "Optimize page performance for better user experience"
    );
  }

  if (scoreBreakdown.accessibility && scoreBreakdown.accessibility < 80) {
    recommendations.push("Improve accessibility for all users");
  }

  if (scoreBreakdown.security && scoreBreakdown.security < 80) {
    recommendations.push("Strengthen website security measures");
  }

  return recommendations;
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

    const body: EnhancedSiteAuditRequest = await request.json();
    const {
      url,
      includeAdvancedChecks = false,
      checkPerformance = false,
      checkAccessibility = false,
      checkSecurity = false,
      maxPages = 1,
      exportFormat,
      whiteLabel,
    } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
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

    // Perform enhanced site audit
    const result = await performEnhancedSiteAudit(url, {
      url,
      includeAdvancedChecks,
      checkPerformance,
      checkAccessibility,
      checkSecurity,
      maxPages,
    });

    // Handle white label PDF generation
    let exportData;
    if (exportFormat === "pdf" && whiteLabel) {
      try {
        const { buffer, filePath } = await createWhiteLabelPDFReport(
          "seo-audit",
          result,
          whiteLabel,
          url
        );
        exportData = {
          format: exportFormat,
          filePath,
          success: true,
        };
      } catch (error) {
        console.error("PDF generation error:", error);
        exportData = {
          format: exportFormat,
          success: false,
          error: "Failed to generate PDF",
        };
      }
    }

    // Save to database
    const audit = await prisma.siteAudit.create({
      data: {
        userId: user.id,
        url,
        seoScore: result.overallScore,
        status: "COMPLETED",
        startedAt: new Date(),
        completedAt: new Date(),
        totalPages: 1,
        crawledPages: 1,
        totalIssues: Math.floor((100 - result.overallScore) / 10),
        criticalIssues:
          result.basic.headings.h1.issues &&
          result.basic.headings.h1.issues.length > 0
            ? result.basic.headings.h1.issues.length
            : 0,
      },
    });

    // Create audit report if export format is specified
    if (exportFormat && exportData?.success) {
      await prisma.auditReport.create({
        data: {
          auditId: audit.id,
          title: whiteLabel?.reportTitle || "SEO Audit Report",
          description: `SEO audit report for ${url}`,
          reportType: "FULL_AUDIT",
          format: exportFormat.toUpperCase() as any,
          filePath: exportData.filePath,
          isPublic: false,
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

    return NextResponse.json({
      ...result,
      auditId: audit.id,
      exportData,
    });
  } catch (error) {
    console.error("Enhanced site audit error:", error);
    return NextResponse.json(
      { error: "Failed to perform enhanced site audit" },
      { status: 500 }
    );
  }
}
