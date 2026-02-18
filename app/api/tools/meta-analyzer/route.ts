import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const analysis = await analyzeMetaTags(url);

    return NextResponse.json({ 
      success: true, 
      analysis
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
  return NextResponse.json([]);
}

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

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
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

    return {
      url,
      title,
      description,
      score: Math.max(0, score),
      issues,
      recommendations
    };

  } catch (error) {
    console.error('Error analyzing meta tags:', error);
    return {
      url,
      title: '',
      description: '',
      score: 0,
      issues: ['Failed to analyze URL'],
      recommendations: ['Check if URL is accessible and valid']
    };
  }
}
