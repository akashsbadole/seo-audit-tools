import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface KeywordResearchRequest {
  keyword: string;
  location?: string;
  language?: string;
  includeRelated?: boolean;
  includeSuggestions?: boolean;
}

interface KeywordResearchResult {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;
  competition?: "LOW" | "MEDIUM" | "HIGH";
  trend?: Array<{ month: string; volume: number }>;
  relatedKeywords?: Array<{
    keyword: string;
    volume?: number;
    difficulty?: number;
    relevance: number;
  }>;
  suggestions?: Array<{
    keyword: string;
    type: "question" | "comparison" | "informational" | "transactional";
    volume?: number;
  }>;
  serpFeatures?: Array<{
    type: "featured_snippet" | "knowledge_panel" | "local_pack" | "video" | "images";
    present: boolean;
  position?: number;
  }>;
  opportunities?: Array<{
    keyword: string;
    opportunity: number;
    reason: string;
  }>;
  score: {
    overall: number;
    volume: number;
    difficulty: number;
    opportunity: number;
  };
}

async function getSearchSuggestions(keyword: string, location: string = "us"): Promise<string[]> {
  try {
    // Use Puppeteer to scrape Google search suggestions
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    try {
      // Navigate to Google search
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&gl=${location}&hl=en`;
      await page.goto(searchUrl, { waitUntil: "networkidle2" });

      // Get search suggestions from "People also ask" or "Related searches"
      const suggestions = await page.evaluate(() => {
        const suggestions: string[] = [];
        
        // Look for "People also ask" questions
        const relatedQuestions = document.querySelectorAll('div[role="heading"] + div div[role="button"]');
        relatedQuestions.forEach((el) => {
          const text = el.textContent?.trim();
          if (text && text.length > 5) {
            suggestions.push(text.replace(/\?/g, ""));
          }
        });

        // Look for related searches at the bottom
        const relatedSearches = document.querySelectorAll('a[role="button"][aria-label*="Search"]');
        relatedSearches.forEach((el) => {
          const text = el.textContent?.trim();
          if (text && text.length > 3) {
            suggestions.push(text);
          }
        });

        return suggestions.slice(0, 10);
      });

      await browser.close();
      return suggestions;
    } catch (error) {
      await browser.close();
      return [];
    }
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    return [];
  }
}

async function analyzeKeywordDifficulty(keyword: string): Promise<number> {
  try {
    // Search for the keyword and analyze competition
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
      await page.goto(searchUrl, { waitUntil: "networkidle2" });

      // Analyze SERP to determine difficulty
      const difficulty = await page.evaluate(() => {
        const results = document.querySelectorAll('div[data-g-c-id]');
        let totalAuthority = 0;
        let highAuthorityCount = 0;

        results.forEach((result) => {
          const domain = result.querySelector('cite')?.textContent;
          if (domain) {
            // Simple heuristic: domains from known high-authority sites increase difficulty
            const highAuthorityDomains = [
              'wikipedia.org', 'youtube.com', 'amazon.com', 'facebook.com',
              'linkedin.com', 'forbes.com', 'hbr.org', 'mckinsey.com'
            ];
            
            if (highAuthorityDomains.some(ha => domain.includes(ha))) {
              highAuthorityCount++;
              totalAuthority += 10;
            } else {
              totalAuthority += 5;
            }
          }
        });

        // Calculate difficulty score (0-100)
        const averageAuthority = results.length > 0 ? totalAuthority / results.length : 50;
        const difficultyScore = Math.min(100, averageAuthority + (highAuthorityCount * 5));
        
        return difficultyScore;
      });

      await browser.close();
      return difficulty;
    } catch (error) {
      await browser.close();
      return 50; // Default medium difficulty
    }
  } catch (error) {
    console.error("Error analyzing keyword difficulty:", error);
    return 50;
  }
}

async function getSearchVolume(keyword: string): Promise<number> {
  // Mock search volume - in production, you'd use Google Keyword Planner API or similar
  const baseVolumes: { [key: string]: number } = {
    "seo": 12000,
    "marketing": 8000,
    "content": 6000,
    "website": 4500,
    "digital": 3500,
    "online": 3000,
    "business": 2500,
    "search": 2000,
    "optimization": 1500,
  };

  // Generate mock volume based on keyword characteristics
  let volume = Math.floor(Math.random() * 1000) + 100;
  
  // Check if keyword contains high-volume terms
  const lowercaseKeyword = keyword.toLowerCase();
  Object.entries(baseVolumes).forEach(([term, vol]) => {
    if (lowercaseKeyword.includes(term)) {
      volume = Math.max(volume, vol);
    }
  });

  return volume;
}

function calculateCompetitionLevel(difficulty: number): "LOW" | "MEDIUM" | "HIGH" {
  if (difficulty < 30) return "LOW";
  if (difficulty < 70) return "MEDIUM";
  return "HIGH";
}

function generateRelatedKeywords(keyword: string, suggestions: string[]): Array<{
  keyword: string;
  volume?: number;
  difficulty?: number;
  relevance: number;
}> {
  const related = suggestions.map((suggestion, index) => ({
    keyword: suggestion,
    relevance: Math.max(0.1, 1 - (index * 0.1)), // Decreasing relevance
    volume: Math.floor(Math.random() * 1000) + 50,
    difficulty: Math.floor(Math.random() * 60) + 20,
  }));

  // Add some variations of the original keyword
  const variations = [
    `${keyword} guide`,
    `${keyword} tutorial`,
    `${keyword} best practices`,
    `how to ${keyword}`,
    `${keyword} tips`,
    `${keyword} examples`,
    `${keyword} tools`,
    `${keyword} services`,
  ];

  variations.forEach((variation) => {
    if (!related.find(r => r.keyword === variation)) {
      related.push({
        keyword: variation,
        relevance: 0.7,
        volume: Math.floor(Math.random() * 800) + 30,
        difficulty: Math.floor(Math.random() * 50) + 25,
      });
    }
  });

  return related
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10);
}

function generateKeywordSuggestions(keyword: string): Array<{
  keyword: string;
  type: "question" | "comparison" | "informational" | "transactional";
  volume?: number;
}> {
  const suggestions: Array<{
    keyword: string;
    type: "question" | "comparison" | "informational" | "transactional";
    volume?: number;
  }> = [];

  // Question-based suggestions
  suggestions.push(
    { keyword: `what is ${keyword}`, type: "question", volume: Math.floor(Math.random() * 500) + 20 },
    { keyword: `how to ${keyword}`, type: "question", volume: Math.floor(Math.random() * 600) + 30 },
    { keyword: `why ${keyword}`, type: "question", volume: Math.floor(Math.random() * 300) + 10 },
    { keyword: `${keyword} explained`, type: "informational", volume: Math.floor(Math.random() * 400) + 25 },
  );

  // Comparison suggestions
  suggestions.push(
    { keyword: `${keyword} vs alternatives`, type: "comparison", volume: Math.floor(Math.random() * 200) + 15 },
    { keyword: `best ${keyword} services`, type: "comparison", volume: Math.floor(Math.random() * 350) + 20 },
    { keyword: `${keyword} pricing`, type: "comparison", volume: Math.floor(Math.random() * 250) + 18 },
  );

  // Transactional suggestions
  suggestions.push(
    { keyword: `${keyword} services near me`, type: "transactional", volume: Math.floor(Math.random() * 300) + 12 },
    { keyword: `affordable ${keyword}`, type: "transactional", volume: Math.floor(Math.random() * 280) + 15 },
    { keyword: `${keyword} for hire`, type: "transactional", volume: Math.floor(Math.random() * 180) + 8 },
  );

  // Informational suggestions
  suggestions.push(
    { keyword: `${keyword} examples`, type: "informational", volume: Math.floor(Math.random() * 450) + 20 },
    { keyword: `${keyword} best practices`, type: "informational", volume: Math.floor(Math.random() * 320) + 18 },
    { keyword: `${keyword} strategies`, type: "informational", volume: Math.floor(Math.random() * 280) + 16 },
  );

  return suggestions.slice(0, 8);
}

function identifySerpFeatures(keyword: string): Array<{
  type: "featured_snippet" | "knowledge_panel" | "local_pack" | "video" | "images";
  present: boolean;
  position?: number;
}> {
  const features: Array<{
    type: "featured_snippet" | "knowledge_panel" | "local_pack" | "video" | "images";
    present: boolean;
    position?: number;
  }> = [];

  // Mock SERP feature detection based on keyword patterns
  const lowercaseKeyword = keyword.toLowerCase();

  // Featured snippet likely for question keywords
  if (lowercaseKeyword.includes('what') || lowercaseKeyword.includes('how') || lowercaseKeyword.includes('why')) {
    features.push({ type: "featured_snippet", present: true, position: 0 });
  }

  // Knowledge panel for branded terms
  if (lowercaseKeyword.includes('google') || lowercaseKeyword.includes('facebook') || lowercaseKeyword.includes('amazon')) {
    features.push({ type: "knowledge_panel", present: true });
  }

  // Local pack for location-based queries
  if (lowercaseKeyword.includes('near me') || lowercaseKeyword.includes('local')) {
    features.push({ type: "local_pack", present: true, position: 1 });
  }

  // Video results for tutorial/how-to content
  if (lowercaseKeyword.includes('tutorial') || lowercaseKeyword.includes('how to')) {
    features.push({ type: "video", present: true, position: 3 });
  }

  // Image results for visual queries
  if (lowercaseKeyword.includes('examples') || lowercaseKeyword.includes('design')) {
    features.push({ type: "images", present: true, position: 2 });
  }

  return features;
}

function generateOpportunities(related: Array<{ keyword: string; difficulty?: number; volume?: number }>): Array<{
  keyword: string;
  opportunity: number;
  reason: string;
}> {
  const opportunities = related.map(item => {
    const volume = item.volume || 0;
    const difficulty = item.difficulty || 50;
    
    // Calculate opportunity score (high volume, low difficulty = high opportunity)
    let opportunity = 0;
    let reason = "";

    if (difficulty < 30 && volume > 500) {
      opportunity = 90;
      reason = "Low competition with good search volume";
    } else if (difficulty < 40 && volume > 300) {
      opportunity = 75;
      reason = "Moderate competition with decent volume";
    } else if (difficulty < 50 && volume > 100) {
      opportunity = 60;
      reason = "Manageable competition with steady volume";
    } else if (volume > 1000 && difficulty < 60) {
      opportunity = 70;
      reason = "High volume opportunity";
    } else {
      opportunity = 40;
      reason = "Challenging keyword but potential rewards";
    }

    return {
      keyword: item.keyword,
      opportunity,
      reason,
    };
  });

  return opportunities
    .sort((a, b) => b.opportunity - a.opportunity)
    .slice(0, 5);
}

function calculateScore(volume: number, difficulty: number): {
  overall: number;
  volume: number;
  difficulty: number;
  opportunity: number;
} {
  // Normalize volume (0-100 scale, log scale)
  const volumeScore = Math.min(100, Math.log10(volume + 1) * 15);
  
  // Normalize difficulty (inverse - lower difficulty = higher score)
  const difficultyScore = Math.max(0, 100 - difficulty);
  
  // Opportunity score (combination of volume and difficulty)
  const opportunityScore = (volumeScore + difficultyScore) / 2;
  
  // Overall score
  const overall = Math.round((volumeScore + difficultyScore + opportunityScore) / 3);

  return {
    overall,
    volume: volumeScore,
    difficulty: difficultyScore,
    opportunity: opportunityScore,
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
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      if (!decoded?.userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body: KeywordResearchRequest = await request.json();
    const { 
      keyword, 
      location = "us", 
      language = "en",
      includeRelated = true,
      includeSuggestions = true 
    } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

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
      if (usage && usage.freeSearchesUsed >= 20) {
        return NextResponse.json(
          {
            error:
              "You have reached your monthly search limit. Upgrade to premium for unlimited access.",
          },
          { status: 429 }
        );
      }
    }

    // Perform keyword research
    const searchVolume = await getSearchVolume(keyword);
    const difficulty = await analyzeKeywordDifficulty(keyword);
    const competition = calculateCompetitionLevel(difficulty);
    const cpc = Math.max(0.1, Math.random() * 5); // Mock CPC

    // Generate additional data if requested
    let relatedKeywords: Array<{
      keyword: string;
      volume?: number;
      difficulty?: number;
      relevance: number;
    }> = [];
    
    let suggestions: Array<{
      keyword: string;
      type: "question" | "comparison" | "informational" | "transactional";
      volume?: number;
    }> = [];
    
    let serpFeatures: Array<{
      type: "featured_snippet" | "knowledge_panel" | "local_pack" | "video" | "images";
      present: boolean;
      position?: number;
    }> = [];
    
    let opportunities: Array<{
      keyword: string;
      opportunity: number;
      reason: string;
    }> = [];

    if (includeRelated) {
      const searchSuggestions = await getSearchSuggestions(keyword, location);
      relatedKeywords = generateRelatedKeywords(keyword, searchSuggestions);
    }

    if (includeSuggestions) {
      suggestions = generateKeywordSuggestions(keyword);
      serpFeatures = identifySerpFeatures(keyword);
      opportunities = generateOpportunities(relatedKeywords);
    }

    // Calculate scores
    const score = calculateScore(searchVolume, difficulty);

    const result: KeywordResearchResult = {
      keyword,
      searchVolume,
      difficulty,
      cpc,
      competition,
      trend: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('en', { month: 'short' }),
        volume: Math.max(10, Math.floor(searchVolume * (0.8 + Math.random() * 0.4)))
      })),
      relatedKeywords,
      suggestions,
      serpFeatures,
      opportunities,
      score,
    };

    // Save to database
    await prisma.keywordResearch.create({
      data: {
        userId: user.id,
        keyword,
        searchVolume,
        difficulty,
        cpc,
        competition,
        trend: result.trend,
        relatedKeywords,
        serpFeatures,
      },
    });

    // Update usage
    if (!user.isPremium) {
      await prisma.userUsage.upsert({
        where: { userId: user.id },
        update: { freeSearchesUsed: { increment: 1 } },
        create: {
          userId: user.id,
          freeSearchesUsed: 1,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Keyword research error:", error);
    return NextResponse.json(
      { error: "Failed to research keyword" },
      { status: 500 }
    );
  }
}
