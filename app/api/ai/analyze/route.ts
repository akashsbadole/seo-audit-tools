import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface AIAnalysisRequest {
  url: string;
  analysisType: 'seo' | 'content' | 'keywords';
  options?: {
    depth?: number;
    includeCompetitors?: boolean;
    language?: string;
  };
}

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

    const body: AIAnalysisRequest = await request.json();
    const { url, analysisType = 'seo' } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const analysisResult = {
      score: 75 + Math.floor(Math.random() * 20),
      recommendations: [
        "Optimize meta titles for better click-through rates",
        "Improve page load speed by compressing images",
        "Add structured data markup for rich snippets",
        "Create more internal links between related pages"
      ],
      insights: [
        "Your content has good keyword density",
        "Mobile responsiveness needs improvement",
        "Page authority could be improved with more backlinks"
      ],
      competitorGaps: [
        "Competitors have more comprehensive content",
        "Missing FAQ schema that competitors use"
      ],
      contentOpportunities: [
        "Create comparison pages for high-intent keywords",
        "Develop a resource center for industry guides"
      ],
      technicalIssues: [
        "Some pages have slow server response times",
        "Missing alt text on 12 images"
      ]
    };

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      analysisId: `ai_analysis_${Date.now()}`
    });

  } catch (error) {
    console.error('AI Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze with AI' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user?.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const analyses = [
      { id: "1", analysisType: "seo", url: "https://example.com", createdAt: new Date().toISOString() },
      { id: "2", analysisType: "content", url: "https://example.com/blog", createdAt: new Date().toISOString() },
    ];

    return NextResponse.json({ analyses });

  } catch (error) {
    console.error('AI Analysis fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI analyses' },
      { status: 500 }
    );
  }
}
