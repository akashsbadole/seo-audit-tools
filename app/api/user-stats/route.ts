import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7);
    
    // Validate token and get user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get total site audits
    const totalAnalyses = await prisma.siteAudit.count({
      where: { userId: user.id }
    });

    // Get premium analyses (all analyses are considered premium if user is premium)
    const premiumAnalyses = user.isPremium ? totalAnalyses : 
      await prisma.siteAudit.count({
        where: { 
          userId: user.id,
          // You might want to add a field to distinguish premium analyses
          // For now, we'll count completed audits as premium
          status: 'COMPLETED'
        }
      });

    // Get saved reports (audit reports)
    const savedReports = await prisma.auditReport.count({
      where: {
        audit: {
          userId: user.id
        }
      }
    });

    // Get API calls from user usage tracking
    let apiCalls = 0;
    try {
      const userUsage = await prisma.userUsage.findUnique({
        where: { userId: user.id }
      });
      apiCalls = userUsage?.freeSearchesUsed || 0;
    } catch (error) {
      console.error('Error fetching user usage:', error);
    }

    // Get last analysis date
    const lastAnalysisData = await prisma.siteAudit.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });

    const lastAnalysis = lastAnalysisData?.createdAt?.toISOString();

    // Get recent activity
    const recentAudits = await prisma.siteAudit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        url: true,
        status: true,
        createdAt: true,
        completedAt: true,
        seoScore: true,
        digitalCertaintyIndex: true
      }
    });

    const recentKeywordResearch = await prisma.keywordResearch.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 2,
      select: {
        id: true,
        keyword: true,
        searchVolume: true,
        difficulty: true,
        createdAt: true
      }
    });

    // Format recent activity for dashboard
    const recentActivity = [
      ...recentAudits.map(audit => ({
        tool: 'Site Audit',
        url: audit.url,
        date: audit.createdAt.toISOString(),
        status: audit.status.toLowerCase(),
        score: audit.seoScore || audit.digitalCertaintyIndex || null
      })),
      ...recentKeywordResearch.map(research => ({
        tool: 'Keyword Research',
        url: research.keyword,
        date: research.createdAt.toISOString(),
        status: 'completed',
        score: null
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

    // Get usage stats for premium users
    let usageStats = null;
    if (user.isPremium) {
      // Get storage used (this is a placeholder calculation)
      const storageUsed = Math.round(Math.random() * 5 * 1024); // Random MB value for demo
      
      usageStats = {
        apiUsage: {
          used: apiCalls,
          limit: 'Unlimited'
        },
        storageUsed: {
          used: storageUsed,
          total: 10240, // 10GB in MB
          percentage: Math.round((storageUsed / 10240) * 100)
        },
        reportsGenerated: savedReports
      };
    }

    const stats = {
      totalAnalyses,
      premiumAnalyses,
      savedReports,
      apiCalls,
      lastAnalysis,
      recentActivity,
      usageStats,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        createdAt: user.createdAt.toISOString()
      }
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('User stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
}