import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Check user's usage limits
    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isPremium: true, usageLimit: true }
    });

    if (!userDetails?.isPremium) {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const currentUsage = await prisma.usageTracking.count({
        where: {
          userId: user.id,
          feature: 'meta-analyzer',
          createdAt: { gte: monthStart }
        }
      });

      if (currentUsage >= 10) {
        return NextResponse.json({ 
          error: 'Monthly limit reached. Upgrade to Premium for unlimited access.' 
        }, { status: 429 });
      }
    }

    // Track usage for free users
    if (!userDetails?.isPremium) {
      await prisma.usageTracking.create({
        data: {
          feature: 'meta-analyzer',
          userId: user.id
        }
      });
    }

    // Analyze meta tags
    const analysis = await analyzeMetaTags(url);

    // Save analysis results
    const savedAnalysis = await prisma.metaTagAnalysis.create({
      data: {
        url,
        title: analysis.title,
        description: analysis.description,
        keywords: analysis.keywords,
        h1: analysis.h1,
        h2: analysis.h2,
        metaTags: analysis.metaTags,
        ogTags: analysis.ogTags,
        twitterTags: analysis.twitterTags,
        canonical: analysis.canonical,
        robots: analysis.robots,
        viewport: analysis.viewport,
        charset: analysis.charset,
        language: analysis.language,
        favicon: analysis.favicon,
        issues: analysis.issues,
        recommendations: analysis.recommendations,
        score: analysis.score,
        userId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      analysis: savedAnalysis 
    });

  } catch (error) {
    console.error('Meta tag analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze meta tags' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;

    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('id');

    if (analysisId) {
      // Get specific analysis
      const analysis = await prisma.metaTagAnalysis.findFirst({
        where: {
          id: analysisId,
          userId: user.id
        }
      });

      if (!analysis) {
        return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
      }

      return NextResponse.json(analysis);
    } else {
      // Get all analyses for user
      const analyses = await prisma.metaTagAnalysis.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      });

      return NextResponse.json(analyses);
    }

  } catch (error) {
    console.error('Get meta tag analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meta tag analysis' },
      { status: 500 }
    );
  }
}

// Function to analyze meta tags
async function analyzeMetaTags(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MetaTagAnalyzer/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    if (!title) {
      issues.push('Missing title tag');
      score -= 20;
    } else if (title.length < 30) {
      issues.push('Title too short (recommended: 30-60 characters)');
      score -= 10;
    } else if (title.length > 60) {
      issues.push('Title too long (recommended: 30-60 characters)');
      score -= 10;
    }

    // Extract description
    const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : '';
    
    if (!description) {
      issues.push('Missing meta description');
      score -= 15;
    } else if (description.length < 120) {
      issues.push('Description too short (recommended: 120-160 characters)');
      score -= 8;
    } else if (description.length > 160) {
      issues.push('Description too long (recommended: 120-160 characters)');
      score -= 8;
    }

    // Extract keywords
    const keywordsMatch = html.match(/<meta[^>]*name=["\']keywords["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    const keywords = keywordsMatch ? keywordsMatch[1].trim() : '';

    // Extract H1 tags
    const h1Matches = html.match(/<h1[^>]*>([^<]*)<\/h1>/gi);
    const h1 = h1Matches ? h1Matches.map(match => match.replace(/<[^>]*>/g, '').trim()) : [];

    if (h1.length === 0) {
      issues.push('Missing H1 tag');
      score -= 15;
    } else if (h1.length > 1) {
      issues.push('Multiple H1 tags (should have only one)');
      score -= 10;
    }

    // Extract H2 tags
    const h2Matches = html.match(/<h2[^>]*>([^<]*)<\/h2>/gi);
    const h2 = h2Matches ? h2Matches.map(match => match.replace(/<[^>]*>/g, '').trim()) : [];

    // Extract other meta tags
    const metaTagMatches = html.match(/<meta[^>]*>/gi);
    const metaTags = metaTagMatches || [];

    // Extract Open Graph tags
    const ogTagMatches = html.match(/<meta[^>]*property=["\']og:[^"\']*["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/gi);
    const ogTags = ogTagMatches ? ogTagMatches.map(tag => ({
      property: tag.match(/property=["\']([^"\']*)["\']/i)?.[1] || '',
      content: tag.match(/content=["\']([^"\']*)["\']/i)?.[1] || ''
    })) : [];

    if (!ogTags.find(tag => tag.property === 'og:title')) {
      issues.push('Missing Open Graph title');
      score -= 5;
    }

    if (!ogTags.find(tag => tag.property === 'og:description')) {
      issues.push('Missing Open Graph description');
      score -= 5;
    }

    if (!ogTags.find(tag => tag.property === 'og:image')) {
      issues.push('Missing Open Graph image');
      score -= 5;
    }

    // Extract Twitter Card tags
    const twitterTagMatches = html.match(/<meta[^>]*name=["\']twitter:[^"\']*["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/gi);
    const twitterTags = twitterTagMatches ? twitterTagMatches.map(tag => ({
      name: tag.match(/name=["\']([^"\']*)["\']/i)?.[1] || '',
      content: tag.match(/content=["\']([^"\']*)["\']/i)?.[1] || ''
    })) : [];

    // Extract canonical URL
    const canonicalMatch = html.match(/<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\'][^>]*>/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : '';

    if (!canonical) {
      recommendations.push('Add canonical URL to prevent duplicate content issues');
      score -= 5;
    }

    // Extract robots meta tag
    const robotsMatch = html.match(/<meta[^>]*name=["\']robots["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    const robots = robotsMatch ? robotsMatch[1] : '';

    // Extract viewport meta tag
    const viewportMatch = html.match(/<meta[^>]*name=["\']viewport["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    const viewport = viewportMatch ? viewportMatch[1] : '';

    if (!viewport) {
      issues.push('Missing viewport meta tag (important for mobile)');
      score -= 10;
    }

    // Extract charset
    const charsetMatch = html.match(/<meta[^>]*charset=["\']([^"\']*)["\'][^>]*>/i);
    const charset = charsetMatch ? charsetMatch[1] : '';

    // Extract language
    const langMatch = html.match(/<html[^>]*lang=["\']([^"\']*)["\'][^>]*>/i);
    const language = langMatch ? langMatch[1] : '';

    // Extract favicon
    const faviconMatch = html.match(/<link[^>]*rel=["\'](?:shortcut )?icon["\'][^>]*href=["\']([^"\']*)["\'][^>]*>/i);
    const favicon = faviconMatch ? faviconMatch[1] : '';

    // Generate recommendations
    if (!keywords) {
      recommendations.push('Add meta keywords tag (5-10 relevant keywords)');
    }

    if (h2.length === 0) {
      recommendations.push('Add H2 tags to structure content hierarchy');
    }

    if (!ogTags.find(tag => tag.property === 'og:type')) {
      recommendations.push('Add Open Graph type (website, article, etc.)');
    }

    if (!twitterTags.find(tag => tag.name === 'twitter:card')) {
      recommendations.push('Add Twitter Card for better social sharing');
    }

    return {
      title,
      description,
      keywords,
      h1,
      h2,
      metaTags,
      ogTags,
      twitterTags,
      canonical,
      robots,
      viewport,
      charset,
      language,
      favicon,
      issues,
      recommendations,
      score: Math.max(0, score)
    };

  } catch (error) {
    console.error('Error analyzing meta tags:', error);
    return {
      title: '',
      description: '',
      keywords: '',
      h1: [],
      h2: [],
      metaTags: [],
      ogTags: [],
      twitterTags: [],
      canonical: '',
      robots: '',
      viewport: '',
      charset: '',
      language: '',
      favicon: '',
      issues: ['Failed to analyze URL'],
      recommendations: ['Check if URL is accessible and valid'],
      score: 0
    };
  }
}