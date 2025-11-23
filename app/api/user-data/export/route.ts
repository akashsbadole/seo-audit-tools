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

    // Get all user data
    const [
      siteAudits,
      domainOverviews,
      keywordResearch,
      competitorAnalyses,
      backlinkAnalyses,
      positionTracking,
      contentAnalyses,
      auditReports,
      userUsage
    ] = await Promise.all([
      // Site Audits
      prisma.siteAudit.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          url: true,
          status: true,
          digitalCertaintyIndex: true,
          seoScore: true,
          accessibilityScore: true,
          performanceScore: true,
          qualityScore: true,
          totalPages: true,
          crawledPages: true,
          totalIssues: true,
          criticalIssues: true,
          warningIssues: true,
          infoIssues: true,
          startedAt: true,
          completedAt: true,
          createdAt: true,
        }
      }),
      
      // Domain Overviews
      prisma.domainOverview.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          domain: true,
          domainAge: true,
          domainAuthority: true,
          pageAuthority: true,
          spamScore: true,
          backlinkCount: true,
          referringDomains: true,
          organicKeywords: true,
          organicTraffic: true,
          paidKeywords: true,
          paidTraffic: true,
          createdAt: true,
        }
      }),
      
      // Keyword Research
      prisma.keywordResearch.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          keyword: true,
          searchVolume: true,
          difficulty: true,
          cpc: true,
          competition: true,
          createdAt: true,
        }
      }),
      
      // Competitor Analyses
      prisma.competitorAnalysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          primaryDomain: true,
          competitorDomain: true,
          createdAt: true,
        }
      }),
      
      // Backlink Analyses
      prisma.backlinkAnalysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          domain: true,
          referringDomains: true,
          domainAuthority: true,
          spamScore: true,
          newBacklinks: true,
          lostBacklinks: true,
          createdAt: true,
        }
      }),
      
      // Position Tracking
      prisma.positionTracking.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          keyword: true,
          targetUrl: true,
          currentRank: true,
          previousRank: true,
          searchVolume: true,
          difficulty: true,
          country: true,
          language: true,
          isTracking: true,
          createdAt: true,
        }
      }),
      
      // Content Analyses
      prisma.contentAnalysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          url: true,
          title: true,
          wordCount: true,
          readabilityScore: true,
          sentimentScore: true,
          createdAt: true,
        }
      }),
      
      // Audit Reports
      prisma.auditReport.findMany({
        where: {
          audit: {
            userId: user.id
          }
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          reportType: true,
          format: true,
          isPublic: true,
          createdAt: true,
        }
      }),
      
      // User Usage
      prisma.userUsage.findUnique({
        where: { userId: user.id },
        select: {
          freeReportsUsed: true,
          freeSearchesUsed: true,
          lastResetDate: true,
          createdAt: true,
        }
      })
    ]);

    // Compile export data
    const exportData = {
      user: {
        ...user,
        exportDate: new Date().toISOString(),
      },
      statistics: {
        totalAudits: siteAudits.length,
        completedAudits: siteAudits.filter(a => a.status === 'COMPLETED').length,
        totalDomainOverviews: domainOverviews.length,
        totalKeywordResearch: keywordResearch.length,
        totalCompetitorAnalyses: competitorAnalyses.length,
        totalBacklinkAnalyses: backlinkAnalyses.length,
        totalPositionTracking: positionTracking.length,
        totalContentAnalyses: contentAnalyses.length,
        totalReports: auditReports.length,
        usage: userUsage,
      },
      data: {
        siteAudits,
        domainOverviews,
        keywordResearch,
        competitorAnalyses,
        backlinkAnalyses,
        positionTracking,
        contentAnalyses,
        auditReports,
      }
    };

    // Get export format from query parameter
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(exportData);
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="seoaudit-data-${user.id}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else {
      // Default to JSON format
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="seoaudit-data-${user.id}-${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    }

  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}

function convertToCSV(data: any): string {
  const csvRows: string[] = [];
  
  // User information
  csvRows.push('User Information');
  csvRows.push(`Name,Email,Is Premium,Join Date,Export Date`);
  csvRows.push(`"${data.user.name}","${data.user.email}","${data.user.isPremium}","${data.user.createdAt}","${data.user.exportDate}"`);
  csvRows.push('');
  
  // Statistics
  csvRows.push('Statistics');
  csvRows.push('Total Audits,Completed Audits,Domain Overviews,Keyword Research,Competitor Analyses,Backlink Analyses,Position Tracking,Content Analyses,Reports,Free Reports Used,Free Searches Used');
  csvRows.push(
    `${data.statistics.totalAudits},${data.statistics.completedAudits},${data.statistics.totalDomainOverviews},${data.statistics.totalKeywordResearch},${data.statistics.totalCompetitorAnalyses},${data.statistics.totalBacklinkAnalyses},${data.statistics.totalPositionTracking},${data.statistics.totalContentAnalyses},${data.statistics.totalReports},${data.statistics.usage?.freeReportsUsed || 0},${data.statistics.usage?.freeSearchesUsed || 0}`
  );
  csvRows.push('');
  
  // Site Audits
  csvRows.push('Site Audits');
  csvRows.push('ID,URL,Status,Digital Certainty Index,SEO Score,Accessibility Score,Performance Score,Quality Score,Total Pages,Crawled Pages,Total Issues,Critical Issues,Warning Issues,Info Issues,Started At,Completed At,Created At');
  data.data.siteAudits.forEach((audit: any) => {
    csvRows.push(
      `${audit.id},"${audit.url}","${audit.status}",${audit.digitalCertaintyIndex || 0},${audit.seoScore || 0},${audit.accessibilityScore || 0},${audit.performanceScore || 0},${audit.qualityScore || 0},${audit.totalPages || 0},${audit.crawledPages || 0},${audit.totalIssues || 0},${audit.criticalIssues || 0},${audit.warningIssues || 0},${audit.infoIssues || 0},"${audit.startedAt || ''}","${audit.completedAt || ''}","${audit.createdAt}"`
    );
  });
  csvRows.push('');
  
  // Domain Overviews
  csvRows.push('Domain Overviews');
  csvRows.push('ID,Domain,Domain Age,Domain Authority,Page Authority,Spam Score,Backlink Count,Referring Domains,Organic Keywords,Organic Traffic,Paid Keywords,Paid Traffic,Created At');
  data.data.domainOverviews.forEach((overview: any) => {
    csvRows.push(
      `${overview.id},"${overview.domain}",${overview.domainAge || 0},${overview.domainAuthority || 0},${overview.pageAuthority || 0},${overview.spamScore || 0},${overview.backlinkCount || 0},${overview.referringDomains || 0},${overview.organicKeywords || 0},${overview.organicTraffic || 0},${overview.paidKeywords || 0},${overview.paidTraffic || 0},"${overview.createdAt}"`
    );
  });
  csvRows.push('');
  
  // Keyword Research
  csvRows.push('Keyword Research');
  csvRows.push('ID,Keyword,Search Volume,Difficulty,CPC,Competition,Created At');
  data.data.keywordResearch.forEach((research: any) => {
    csvRows.push(
      `${research.id},"${research.keyword}",${research.searchVolume || 0},${research.difficulty || 0},${research.cpc || 0},"${research.competition || ''}","${research.createdAt}"`
    );
  });
  csvRows.push('');
  
  return csvRows.join('\n');
}