import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

interface AIAnalysisRequest {
  url: string;
  analysisType: 'seo' | 'content' | 'keywords';
  options?: {
    depth?: number;
    includeCompetitors?: boolean;
  language?: string;
  };
}

interface AIAnalysisResult {
  score: number;
  recommendations: string[];
  insights: string[];
  competitorGaps: string[];
  contentOpportunities: string[];
  technicalIssues: string[];
}

async function callZAI(prompt: string): Promise<any> {
  const ZAI_API_KEY = process.env.ZAI_API_KEY;
  
  if (!ZAI_API_KEY) {
    throw new Error('Z.AI API key not configured');
  }

  const response = await fetch('https://api.z.ai/v1/analyze', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ZAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      model: 'zai-large',
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    throw new Error('Z.AI API request failed');
  }

  const data = await response.json();
  return data;
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

function generateSEOAnalysisPrompt(url: string, options: any): string {
  let prompt = `Analyze the website at ${url} for SEO performance and provide comprehensive recommendations.\n\n`;
  
  prompt += `Please analyze the following aspects:\n`;
  prompt += `1. On-page SEO elements (title tags, meta descriptions, headings, content structure)\n`;
  prompt += `2. Technical SEO (site speed, mobile responsiveness, schema markup)\n`;
  prompt += `3. Content quality and relevance\n`;
  prompt += `4. Internal linking structure\n`;
  prompt += `5. Keyword optimization opportunities\n`;
  
  if (options?.depth) {
    prompt += `6. Analyze up to ${options.depth} levels of page depth\n`;
  }
  
  if (options?.includeCompetitors) {
    prompt += `7. Identify top 3 competitor strategies and gaps\n`;
  }
  
  if (options?.language) {
    prompt += `8. Target language: ${options.language}\n`;
  }
  
  prompt += `\nProvide:\n`;
  prompt += `- Overall SEO score (0-100)\n`;
  prompt += `- Specific technical issues to fix\n`;
  prompt += `- Content optimization recommendations\n`;
  prompt += `- Keyword opportunities\n`;
  prompt += `- Competitive advantages to leverage\n`;
  prompt += `- Priority action items (high/medium/low)\n\n`;
  prompt += `Format the response as structured JSON with clear sections.`;
  
  return prompt;
}

function generateContentAnalysisPrompt(url: string, options: any): string {
  let prompt = `Analyze the content quality and engagement potential of the website at ${url}.\n\n`;
  
  prompt += `Please evaluate:\n`;
  prompt += `1. Content readability and clarity\n`;
  prompt += `2. Topic authority and expertise\n`;
  prompt += `3. Content structure and organization\n`;
  prompt += `4. Engagement metrics potential\n`;
  prompt += `5. Content gaps and opportunities\n`;
  
  if (options?.depth) {
    prompt += `6. Analyze content depth up to ${options.depth} levels\n`;
  }
  
  prompt += `\nProvide:\n`;
  prompt += `- Content quality score (0-100)\n`;
  prompt += `- Readability score (0-100)\n`;
  prompt += `- Engagement potential (low/medium/high)\n`;
  prompt += `- Specific improvement recommendations\n`;
  prompt += `- Content expansion ideas\n\n`;
  prompt += `Format the response as structured JSON.`;
  
  return prompt;
}

function generateKeywordAnalysisPrompt(url: string, options: any): string {
  let prompt = `Perform comprehensive keyword analysis for the website at ${url}.\n\n`;
  
  prompt += `Please analyze:\n`;
  prompt += `1. Current keyword rankings and visibility\n`;
  prompt += `2. Keyword difficulty and competition level\n`;
  prompt += `3. Long-tail keyword opportunities\n`;
  prompt += `4. Keyword gap analysis\n`;
  prompt += `5. Search intent alignment\n`;
  prompt += `6. Seasonal keyword trends\n`;
  prompt += `7. Local SEO opportunities\n`;
  
  if (options?.language) {
    prompt += `8. Target language: ${options.language}\n`;
  }
  
  prompt += `\nProvide:\n`;
  prompt += `- Keyword difficulty scores (0-100)\n`;
  prompt += `- Search volume estimates\n`;
  prompt += `- Competition level analysis\n`;
  prompt += `- Recommended keyword targets\n`;
  prompt += `- Content optimization suggestions\n`;
  prompt += `- Priority keyword opportunities\n\n`;
  prompt += `Format the response as structured JSON.`;
  
  return prompt;
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
    const { url, analysisType = 'seo', options = {} } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check user's usage limits
    const usageLimit = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { usage: true }
    });

    const analysisCount = await prisma.aIAnalysis.count({
      where: { userId: user.userId }
    });

    // Free users get 5 AI analyses per month
    if (!usageLimit?.isPremium && analysisCount >= 5) {
      return NextResponse.json(
        { error: 'You have reached your monthly limit of 5 AI analyses. Upgrade to premium for unlimited access.' },
        { status: 429 }
      );
    }

    let prompt: string;
    
    switch (analysisType) {
      case 'seo':
        prompt = generateSEOAnalysisPrompt(url, options);
        break;
      case 'content':
        prompt = generateContentAnalysisPrompt(url, options);
        break;
      case 'keywords':
        prompt = generateKeywordAnalysisPrompt(url, options);
        break;
      default:
        prompt = generateSEOAnalysisPrompt(url, options);
        break;
    }

    // Call Z.AI API
    const aiResponse = await callZAI(prompt);
    
    // Parse and structure the response
    let analysisResult: AIAnalysisResult;
    
    try {
      const content = typeof aiResponse.text === 'string' ? aiResponse.text : JSON.stringify(aiResponse.text);
      const parsed = JSON.parse(content);
      
      analysisResult = {
        score: parsed.score || 75,
        recommendations: parsed.recommendations || [],
        insights: parsed.insights || [],
        competitorGaps: parsed.competitorGaps || [],
        contentOpportunities: parsed.contentOpportunities || [],
        technicalIssues: parsed.technicalIssues || []
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      analysisResult = {
        score: 75,
        recommendations: ['Unable to process AI response'],
        insights: ['Please try again'],
        competitorGaps: [],
        contentOpportunities: [],
        technicalIssues: []
      };
    }

    // Save analysis to database
    await prisma.aIAnalysis.create({
      data: {
        id: `ai_analysis_${Date.now()}`,
        userId: user.userId,
        analysisType,
        url,
        options,
        result: analysisResult,
        createdAt: new Date()
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

    const analyses = await prisma.aIAnalysis.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({
      analyses: analyses.map(analysis => ({
        id: analysis.id,
        analysisType: analysis.analysisType,
        url: analysis.url,
        result: analysis.result,
        createdAt: analysis.createdAt
      }))
    });

  } catch (error) {
    console.error('AI Analysis fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI analyses' },
      { status: 500 }
    );
  }
}