import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7);
    
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const exportData = {
      user: {
        id: "user_1",
        name: "Demo User",
        email: "demo@example.com",
        isPremium: false,
        createdAt: new Date().toISOString(),
        exportDate: new Date().toISOString(),
      },
      statistics: {
        totalAudits: 5,
        completedAudits: 4,
        totalDomainOverviews: 3,
        totalKeywordResearch: 10,
        totalCompetitorAnalyses: 2,
        totalBacklinkAnalyses: 3,
        totalPositionTracking: 15,
        totalContentAnalyses: 8,
        totalReports: 2,
        usage: {
          freeReportsUsed: 5,
          freeSearchesUsed: 8
        }
      },
      data: {
        siteAudits: [
          { id: "1", url: "https://example.com", status: "COMPLETED", seoScore: 85, createdAt: new Date().toISOString() }
        ],
        domainOverviews: [
          { id: "1", domain: "example.com", domainAuthority: 45, createdAt: new Date().toISOString() }
        ],
        keywordResearch: [
          { id: "1", keyword: "seo tools", searchVolume: 12000, difficulty: 65, createdAt: new Date().toISOString() }
        ],
        competitorAnalyses: [],
        backlinkAnalyses: [],
        positionTracking: [],
        contentAnalyses: [],
        auditReports: [],
      }
    };

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    if (format === 'csv') {
      const csvData = `User Information
Name,Email,Is Premium,Join Date,Export Date
"${exportData.user.name}","${exportData.user.email}","${exportData.user.isPremium}","${exportData.user.createdAt}","${exportData.user.exportDate}"

Statistics
Total Audits,Completed Audits,Domain Overviews,Keyword Research
${exportData.statistics.totalAudits},${exportData.statistics.completedAudits},${exportData.statistics.totalDomainOverviews},${exportData.statistics.totalKeywordResearch}`;
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="seoaudit-data-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="seoaudit-data-${new Date().toISOString().split('T')[0]}.json"`
      }
    });

  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
