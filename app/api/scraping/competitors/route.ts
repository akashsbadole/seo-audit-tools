import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

interface ScrapingRequest {
  targetUrl: string;
  competitorUrls?: string[];
  analysisDepth?: number;
}

interface CompetitorData {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  headings: { h1: number; h2: number; h3: number };
  links: { internal: number; external: number };
  images: number;
  loadTime: number;
  wordCount: number;
}

async function scrapeWebsite(url: string): Promise<CompetitorData> {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const loadTime = Date.now() - startTime;

    const content = await page.content();
    const $ = cheerio.load(content);

    const title = $('title').text() || '';
    const description = $('meta[name="description"]').attr('content') || '';
    
    // Extract keywords from content
    const textContent = $('body').text();
    const words = textContent.toLowerCase().split(/\s+/);
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const keywords = words
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .reduce((acc: { [key: string]: number }, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);

    // Count headings
    const headings = {
      h1: $('h1').length,
      h2: $('h2').length,
      h3: $('h3').length
    };

    // Count links
    const links = {
      internal: 0,
      external: 0
    };

    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        if (href.startsWith('http') && !href.includes(url.split('/')[2])) {
          links.external++;
        } else {
          links.internal++;
        }
      }
    });

    // Count images
    const images = $('img').length;

    return {
      url,
      title,
      description,
      keywords,
      headings,
      links,
      images,
      loadTime,
      wordCount: words.length
    };
  } finally {
    await browser.close();
  }
}

function getUserFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user?.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: ScrapingRequest = await request.json();
    const { targetUrl, competitorUrls = [], analysisDepth = 1 } = body;

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Target URL is required' },
        { status: 400 }
      );
    }

    // Check user's usage limits
    const usageLimit = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { usage: true }
    });

    if (!usageLimit?.isPremium && (usageLimit?.usage?.freeReportsUsed || 0) >= 10) {
      return NextResponse.json(
        { error: 'You have reached your monthly limit. Upgrade to premium for unlimited access.' },
        { status: 429 }
      );
    }

    // Scrape target website
    const targetData = await scrapeWebsite(targetUrl);
    
    // Scrape competitors
    const competitorData: CompetitorData[] = [];
    for (const url of competitorUrls.slice(0, 5)) { // Limit to 5 competitors
      try {
        const data = await scrapeWebsite(url);
        competitorData.push(data);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
      }
    }

    // Save analysis to database
    const analysisId = `analysis_${Date.now()}`;
    await prisma.competitorAnalysis.create({
      data: {
        id: analysisId,
        primaryDomain: new URL(targetUrl).hostname,
        competitorDomain: competitorUrls.map(url => new URL(url).hostname),
        analysisData: {
          target: targetData,
          competitors: competitorData,
          comparison: {
            targetScore: calculateSEOScore(targetData),
            competitorScores: competitorData.map(c => calculateSEOScore(c)),
            recommendations: generateRecommendations(targetData, competitorData)
          }
        }
      }
    });

    // Update usage
    if (!usageLimit?.isPremium) {
      await prisma.userUsage.update({
        where: { userId: user.userId },
        data: { freeReportsUsed: { increment: 1 } }
      });
    }

    return NextResponse.json({
      success: true,
      analysisId,
      target: targetData,
      competitors: competitorData,
      comparison: {
        targetScore: calculateSEOScore(targetData),
        competitorScores: competitorData.map(c => calculateSEOScore(c)),
        recommendations: generateRecommendations(targetData, competitorData)
      }
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze websites' },
      { status: 500 }
    );
  }
}

function calculateSEOScore(data: CompetitorData): number {
  let score = 0;
  
  // Title optimization (20 points)
  if (data.title && data.title.length >= 30 && data.title.length <= 60) score += 20;
  else if (data.title && data.title.length > 0) score += 10;
  
  // Meta description (15 points)
  if (data.description && data.description.length >= 120 && data.description.length <= 160) score += 15;
  else if (data.description && data.description.length > 0) score += 8;
  
  // Heading structure (20 points)
  if (data.headings.h1 === 1) score += 10;
  if (data.headings.h2 > 0) score += 5;
  if (data.headings.h3 > 0) score += 5;
  
  // Content length (15 points)
  if (data.wordCount >= 300 && data.wordCount <= 2000) score += 15;
  else if (data.wordCount >= 100) score += 8;
  
  // Internal links (15 points)
  if (data.links.internal >= 5) score += 15;
  else if (data.links.internal >= 2) score += 8;
  
  // Images (10 points)
  if (data.images >= 3) score += 10;
  else if (data.images >= 1) score += 5;
  
  // Load time (5 points)
  if (data.loadTime <= 2000) score += 5;
  else if (data.loadTime <= 3000) score += 2;
  
  return Math.min(score, 100);
}

function generateRecommendations(target: CompetitorData, competitors: CompetitorData[]): string[] {
  const recommendations: string[] = [];
  
  const avgCompetitors = {
    titleLength: competitors.reduce((sum, c) => sum + c.title.length, 0) / competitors.length,
    descriptionLength: competitors.reduce((sum, c) => sum + c.description.length, 0) / competitors.length,
    keywordCount: competitors.reduce((sum, c) => sum + c.keywords.length, 0) / competitors.length,
    headingsCount: competitors.reduce((sum, c) => sum + c.headings.h1 + c.headings.h2 + c.headings.h3, 0) / competitors.length,
    linkCount: competitors.reduce((sum, c) => sum + c.links.internal, 0) / competitors.length,
    imageCount: competitors.reduce((sum, c) => sum + c.images, 0) / competitors.length,
    loadTime: competitors.reduce((sum, c) => sum + c.loadTime, 0) / competitors.length
  };

  // Title recommendations
  if (target.title.length < avgCompetitors.titleLength * 0.8) {
    recommendations.push("Consider extending your title to better match competitors");
  }
  
  // Description recommendations
  if (target.description.length < avgCompetitors.descriptionLength * 0.8) {
    recommendations.push("Your meta description could be more comprehensive");
  }
  
  // Keyword recommendations
  if (target.keywords.length < avgCompetitors.keywordCount * 0.8) {
    recommendations.push("Target more relevant keywords in your content");
  }
  
  // Content structure recommendations
  if (target.headings.h1 === 0) {
    recommendations.push("Add an H1 tag to improve content hierarchy");
  }
  
  if (target.headings.h2 < avgCompetitors.headingsCount * 0.5) {
    recommendations.push("Use more H2 tags to structure your content better");
  }
  
  // Internal linking recommendations
  if (target.links.internal < avgCompetitors.linkCount * 0.5) {
    recommendations.push("Increase internal linking to improve SEO and user navigation");
  }
  
  // Image recommendations
  if (target.images < avgCompetitors.imageCount * 0.5) {
    recommendations.push("Add more relevant images to enhance content engagement");
  }
  
  // Performance recommendations
  if (target.loadTime > avgCompetitors.loadTime * 1.2) {
    recommendations.push("Optimize page load speed for better user experience and SEO");
  }
  
  return recommendations;
}