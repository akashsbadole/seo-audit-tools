import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function getUserFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
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

    const body = await request.json();
    const { targetUrl, competitorUrls = [] } = body;

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Target URL is required' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const targetData = {
      url: targetUrl,
      title: "Example Website",
      description: "A sample website for demonstration",
      keywords: ["seo", "marketing", "tools"],
      headings: { h1: 1, h2: 5, h3: 8 },
      links: { internal: 25, external: 12 },
      images: 15,
      loadTime: 1500,
      wordCount: 1200
    };

    const competitorData = competitorUrls.slice(0, 5).map((url: string, i: number) => ({
      url,
      title: `Competitor ${i + 1}`,
      description: "Competitor website description",
      keywords: ["seo", "marketing"],
      headings: { h1: 1, h2: 4, h3: 6 },
      links: { internal: 20, external: 10 },
      images: 12,
      loadTime: 1800,
      wordCount: 1000
    }));

    return NextResponse.json({
      success: true,
      analysisId: `analysis_${Date.now()}`,
      target: targetData,
      competitors: competitorData,
      comparison: {
        targetScore: 78,
        competitorScores: competitorData.map(() => 72),
        recommendations: [
          "Improve meta description length",
          "Add more internal links",
          "Optimize page load speed"
        ]
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
