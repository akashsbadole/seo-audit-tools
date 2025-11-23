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

    const userId = decoded.userId;
    const dbUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's recent audits
    const recentAudits = await prisma.siteAudit.findMany({
      where: {
        userId: dbUser.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        url: true,
        status: true,
        digitalCertaintyIndex: true,
        seoScore: true,
        accessibilityScore: true,
        performanceScore: true,
        qualityScore: true,
        totalIssues: true,
        criticalIssues: true,
        createdAt: true,
        completedAt: true
      }
    })

    // Calculate overall metrics
    const completedAudits = recentAudits.filter(audit => audit.status === 'COMPLETED')
    
    const avgScores = completedAudits.length > 0 ? {
      digitalCertaintyIndex: Math.round(
        completedAudits.reduce((sum, audit) => sum + (audit.digitalCertaintyIndex || 0), 0) / completedAudits.length
      ),
      seoScore: Math.round(
        completedAudits.reduce((sum, audit) => sum + (audit.seoScore || 0), 0) / completedAudits.length
      ),
      accessibilityScore: Math.round(
        completedAudits.reduce((sum, audit) => sum + (audit.accessibilityScore || 0), 0) / completedAudits.length
      ),
      performanceScore: Math.round(
        completedAudits.reduce((sum, audit) => sum + (audit.performanceScore || 0), 0) / completedAudits.length
      ),
      qualityScore: Math.round(
        completedAudits.reduce((sum, audit) => sum + (audit.qualityScore || 0), 0) / completedAudits.length
      )
    } : {
      digitalCertaintyIndex: 0,
      seoScore: 0,
      accessibilityScore: 0,
      performanceScore: 0,
      qualityScore: 0
    }

    // Get total audit count
    const totalAudits = await prisma.siteAudit.count({
      where: {
        userId: dbUser.id
      }
    })

    // Get active and resolved issues count
    const activeIssues = await prisma.auditIssue.count({
      where: {
        audit: {
          userId: dbUser.id
        },
        isFixed: false
      }
    })

    const resolvedIssues = await prisma.auditIssue.count({
      where: {
        audit: {
          userId: dbUser.id
        },
        isFixed: true
      }
    })

    // Get keyword tracking data
    const keywordRankings = await prisma.keywordTracking.findMany({
      where: {
        userId: dbUser.id,
        isTracking: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10,
      select: {
        keyword: true,
        currentRank: true,
        previousRank: true,
        searchVolume: true
      }
    })

    // Format keyword data for frontend
    const formattedKeywords = keywordRankings.map(kw => ({
      keyword: kw.keyword,
      position: kw.currentRank || 0,
      change: (kw.previousRank && kw.currentRank) ? (kw.previousRank - kw.currentRank) : 0,
      volume: kw.searchVolume || 0
    }))

    // Sample traffic data (in a real app, this would come from analytics integration)
    const trafficData = [
      { date: '2024-01-01', visitors: 1200, pageViews: 3400, bounceRate: 45 },
      { date: '2024-01-02', visitors: 1350, pageViews: 3800, bounceRate: 42 },
      { date: '2024-01-03', visitors: 1100, pageViews: 3100, bounceRate: 48 },
      { date: '2024-01-04', visitors: 1450, pageViews: 4200, bounceRate: 40 },
      { date: '2024-01-05', visitors: 1600, pageViews: 4600, bounceRate: 38 },
      { date: '2024-01-06', visitors: 1380, pageViews: 3900, bounceRate: 44 },
      { date: '2024-01-07', visitors: 1520, pageViews: 4300, bounceRate: 41 }
    ]

    const dashboardData = {
      ...avgScores,
      totalAudits,
      activeIssues,
      resolvedIssues,
      recentAudits: recentAudits.map(audit => ({
        ...audit,
        createdAt: audit.createdAt.toISOString(),
        completedAt: audit.completedAt?.toISOString()
      })),
      keywordRankings: formattedKeywords,
      trafficData
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
