import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface DomainOverviewRequest {
  domain: string;
  includeCompetitors?: boolean;
  competitorDomains?: string[];
}

interface DomainOverviewResult {
  domain: {
    name: string;
    age: number;
    registrationDate?: string;
    expiryDate?: string;
    registrar?: string;
    nameservers: string[];
  };
  authority: {
    domainAuthority?: number;
    pageAuthority?: number;
    spamScore?: number;
  };
  traffic: {
    organicKeywords?: number;
    organicTraffic?: number;
    paidKeywords?: number;
    paidTraffic?: number;
    trafficTrend?: Array<{ month: string; traffic: number }>;
  };
  backlinks: {
    totalBacklinks?: number;
    referringDomains?: number;
    newBacklinks?: number;
    lostBacklinks?: number;
    topReferringDomains?: Array<{
      domain: string;
      backlinks: number;
      authority?: number;
    }>;
  };
  content: {
    totalPages?: number;
    indexedPages?: number;
    topPages?: Array<{
      url: string;
      title: string;
      traffic?: number;
      keywords?: number;
    }>;
    contentQuality?: {
      averageWordCount: number;
      readabilityScore: number;
      hasStructuredData: boolean;
    };
  };
  technical: {
    httpsEnabled: boolean;
    hasSitemap: boolean;
    hasRobotsTxt: boolean;
    pageSpeed: {
      desktop?: number;
      mobile?: number;
    };
    mobileFriendly: boolean;
    coreWebVitals?: {
      lcp: string;
      fid: string;
      cls: string;
    };
  };
  competitors?: Array<{
    domain: string;
    overlapScore: number;
    commonKeywords: number;
    authorityDiff: number;
  }>;
  recommendations: string[];
  score: {
    overall: number;
    authority: number;
    content: number;
    technical: number;
    backlinks: number;
  };
}

async function getDomainAge(domain: string): Promise<{
  age: number;
  registrationDate?: string;
  expiryDate?: string;
  registrar?: string;
  nameservers: string[];
}> {
  try {
    // Simplified domain age check - in production, you'd use a proper WHOIS API
    // For now, we'll use DNS resolution as a basic check and mock the rest
    const dns = require("dns").promises;
    await dns.resolve4(domain);

    // Mock data for demonstration
    const mockAge = Math.floor(Math.random() * 20) + 1; // 1-20 years
    const createdDate = new Date();
    createdDate.setFullYear(createdDate.getFullYear() - mockAge);

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    return {
      age: mockAge,
      registrationDate: createdDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      registrar: "Mock Registrar",
      nameservers: ["ns1.example.com", "ns2.example.com"],
    };
  } catch (error) {
    return { age: 0, nameservers: [] };
  }
}

async function analyzeWebsiteContent(url: string): Promise<{
  totalWords: number;
  readabilityScore: number;
  hasStructuredData: boolean;
  title: string;
  description: string;
  headings: { h1: number; h2: number; h3: number };
}> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    const content = await page.content();
    const $ = cheerio.load(content);

    const title = $("title").text() || "";
    const description = $('meta[name="description"]').attr("content") || "";
    const textContent = $("body").text();

    // Count words
    const words = textContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const totalWords = words.length;

    // Calculate readability (simplified Flesch-Kincaid)
    const sentences = textContent
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    const syllables = words.reduce(
      (count, word) => count + countSyllables(word),
      0
    );

    let readabilityScore = 0;
    if (sentences.length > 0 && words.length > 0) {
      readabilityScore =
        206.835 -
        1.015 * (words.length / sentences.length) -
        84.6 * (syllables / words.length);
      readabilityScore = Math.max(0, Math.min(100, readabilityScore));
    }

    // Check for structured data
    const hasStructuredData =
      $('script[type="application/ld+json"]').length > 0;

    // Count headings
    const headings = {
      h1: $("h1").length,
      h2: $("h2").length,
      h3: $("h3").length,
    };

    return {
      totalWords,
      readabilityScore,
      hasStructuredData,
      title,
      description,
      headings,
    };
  } finally {
    await browser.close();
  }
}

async function checkTechnicalSeo(url: string): Promise<{
  httpsEnabled: boolean;
  hasSitemap: boolean;
  hasRobotsTxt: boolean;
  pageSpeed: { desktop?: number; mobile?: number };
  mobileFriendly: boolean;
}> {
  const baseUrl = new URL(url);
  const domain = baseUrl.origin;

  // Check HTTPS
  const httpsEnabled = url.startsWith("https://");

  // Check sitemap
  let hasSitemap = false;
  try {
    const sitemapResponse = await fetch(`${domain}/sitemap.xml`);
    hasSitemap = sitemapResponse.ok;
  } catch (error) {
    hasSitemap = false;
  }

  // Check robots.txt
  let hasRobotsTxt = false;
  try {
    const robotsResponse = await fetch(`${domain}/robots.txt`);
    hasRobotsTxt = robotsResponse.ok;
  } catch (error) {
    hasRobotsTxt = false;
  }

  // Mobile friendly check (simplified)
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    // Set mobile viewport
    await page.setViewport({
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true,
    });
    await page.goto(url, { waitUntil: "networkidle2" });

    // Check if page loads properly on mobile
    const mobileFriendly = await page.evaluate(() => {
      const viewport = document.querySelector('meta[name="viewport"]');
      return !!(
        viewport &&
        viewport.getAttribute("content")?.includes("width=device-width")
      );
    });

    return {
      httpsEnabled,
      hasSitemap,
      hasRobotsTxt,
      pageSpeed: { desktop: 85, mobile: 80 }, // Placeholder values
      mobileFriendly,
    };
  } finally {
    await browser.close();
  }
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");

  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

function calculateScore(metrics: any): DomainOverviewResult["score"] {
  let authority = 50;
  let content = 50;
  let technical = 50;
  let backlinks = 50;

  // Authority scoring
  if (metrics.authority.domainAuthority) {
    authority = Math.min(100, metrics.authority.domainAuthority);
  }

  // Content scoring
  if (metrics.content.contentQuality) {
    const quality = metrics.content.contentQuality;
    content = Math.min(
      100,
      (quality.averageWordCount > 500 ? 30 : 15) +
        (quality.readabilityScore > 60 ? 30 : 15) +
        (quality.hasStructuredData ? 20 : 10) +
        10
    );
  }

  // Technical scoring
  const tech = metrics.technical;
  technical = Math.min(
    100,
    (tech.httpsEnabled ? 25 : 0) +
      (tech.hasSitemap ? 25 : 0) +
      (tech.hasRobotsTxt ? 25 : 0) +
      (tech.mobileFriendly ? 25 : 0)
  );

  // Backlinks scoring
  if (metrics.backlinks.referringDomains) {
    backlinks = Math.min(
      100,
      Math.log10(metrics.backlinks.referringDomains + 1) * 20
    );
  }

  const overall = Math.round((authority + content + technical + backlinks) / 4);

  return {
    overall,
    authority,
    content,
    technical,
    backlinks,
  };
}

function generateRecommendations(metrics: any): string[] {
  const recommendations: string[] = [];

  // Domain age recommendations
  if (metrics.domain.age < 1) {
    recommendations.push(
      "Domain is very new. Focus on building authority through quality content and backlinks."
    );
  }

  // Technical recommendations
  if (!metrics.technical.httpsEnabled) {
    recommendations.push(
      "Enable HTTPS to improve security and search rankings."
    );
  }
  if (!metrics.technical.hasSitemap) {
    recommendations.push(
      "Create and submit an XML sitemap to help search engines index your site."
    );
  }
  if (!metrics.technical.hasRobotsTxt) {
    recommendations.push(
      "Add a robots.txt file to guide search engine crawlers."
    );
  }
  if (!metrics.technical.mobileFriendly) {
    recommendations.push(
      "Optimize your site for mobile devices to improve user experience and rankings."
    );
  }

  // Content recommendations
  if (metrics.content.contentQuality) {
    const quality = metrics.content.contentQuality;
    if (quality.averageWordCount < 300) {
      recommendations.push(
        "Increase content length to provide more comprehensive information."
      );
    }
    if (quality.readabilityScore < 60) {
      recommendations.push(
        "Improve content readability by using shorter sentences and simpler language."
      );
    }
    if (!quality.hasStructuredData) {
      recommendations.push(
        "Add structured data markup to enhance search result appearance."
      );
    }
  }

  // Backlink recommendations
  if (metrics.backlinks.referringDomains < 10) {
    recommendations.push(
      "Build more high-quality backlinks from relevant websites to improve domain authority."
    );
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
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      if (!decoded?.userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body: DomainOverviewRequest = await request.json();
    const { domain, includeCompetitors = false, competitorDomains = [] } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Clean domain format
    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const url = `https://${cleanDomain}`;

    // Check user limits
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
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

    // Perform domain analysis
    const domainInfo = await getDomainAge(cleanDomain);
    const contentAnalysis = await analyzeWebsiteContent(url);
    const technicalSeo = await checkTechnicalSeo(url);

    // Mock data for authority, traffic, and backlinks (in real implementation, these would come from APIs)
    const result: DomainOverviewResult = {
      domain: {
        name: cleanDomain,
        age: domainInfo.age,
        registrationDate: domainInfo.registrationDate,
        expiryDate: domainInfo.expiryDate,
        registrar: domainInfo.registrar,
        nameservers: domainInfo.nameservers,
      },
      authority: {
        domainAuthority: Math.floor(Math.random() * 100),
        pageAuthority: Math.floor(Math.random() * 100),
        spamScore: Math.random() * 10,
      },
      traffic: {
        organicKeywords: Math.floor(Math.random() * 10000),
        organicTraffic: Math.floor(Math.random() * 50000),
        paidKeywords: Math.floor(Math.random() * 1000),
        paidTraffic: Math.floor(Math.random() * 5000),
      },
      backlinks: {
        totalBacklinks: Math.floor(Math.random() * 10000),
        referringDomains: Math.floor(Math.random() * 1000),
        newBacklinks: Math.floor(Math.random() * 100),
        lostBacklinks: Math.floor(Math.random() * 50),
      },
      content: {
        totalPages: Math.floor(Math.random() * 500),
        indexedPages: Math.floor(Math.random() * 400),
        topPages: [
          {
            url: `${url}/`,
            title: contentAnalysis.title,
            traffic: Math.floor(Math.random() * 10000),
            keywords: Math.floor(Math.random() * 100),
          },
        ],
        contentQuality: {
          averageWordCount: contentAnalysis.totalWords,
          readabilityScore: contentAnalysis.readabilityScore,
          hasStructuredData: contentAnalysis.hasStructuredData,
        },
      },
      technical: technicalSeo,
      recommendations: [],
      score: {
        overall: 0,
        authority: 0,
        content: 0,
        technical: 0,
        backlinks: 0,
      },
    };

    // Calculate scores and generate recommendations
    result.score = calculateScore(result);
    result.recommendations = generateRecommendations(result);

    // Add competitor analysis if requested
    if (includeCompetitors && competitorDomains.length > 0) {
      result.competitors = competitorDomains.map((compDomain) => ({
        domain: compDomain,
        overlapScore: Math.random() * 100,
        commonKeywords: Math.floor(Math.random() * 1000),
        authorityDiff: Math.floor(Math.random() * 40) - 20,
      }));
    }

    // Save to database
    await prisma.domainOverview.create({
      data: {
        userId: user.id,
        domain: cleanDomain,
        domainAge: domainInfo.age,
        domainAuthority: result.authority.domainAuthority,
        pageAuthority: result.authority.pageAuthority,
        spamScore: result.authority.spamScore,
        backlinkCount: result.backlinks.totalBacklinks,
        referringDomains: result.backlinks.referringDomains,
        organicKeywords: result.traffic.organicKeywords,
        organicTraffic: result.traffic.organicTraffic,
        paidKeywords: result.traffic.paidKeywords,
        paidTraffic: result.traffic.paidTraffic,
        topPages: result.content.topPages,
        topKeywords: [], // Would be populated in real implementation
        competitorData: result.competitors,
        technicalSeo: result.technical,
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

    return NextResponse.json(result);
  } catch (error) {
    console.error("Domain overview error:", error);
    return NextResponse.json(
      { error: "Failed to analyze domain" },
      { status: 500 }
    );
  }
}
