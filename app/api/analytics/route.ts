import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';

    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const analyticsData = {
      traffic: {
        visitors: Math.floor(Math.random() * 10000) + 5000,
        pageViews: Math.floor(Math.random() * 50000) + 25000,
        bounceRate: Math.floor(Math.random() * 30) + 30,
        avgSessionDuration: Math.floor(Math.random() * 180) + 120,
        visitorsGrowth: Math.floor(Math.random() * 40) - 10,
        pageViewsGrowth: Math.floor(Math.random() * 50) - 15,
      },
      seo: {
        keywordRankings: Math.floor(Math.random() * 500) + 100,
        organicTraffic: Math.floor(Math.random() * 8000) + 2000,
        backlinks: Math.floor(Math.random() * 1000) + 200,
        domainAuthority: Math.floor(Math.random() * 30) + 40,
        rankingsGrowth: Math.floor(Math.random() * 20) - 5,
        trafficGrowth: Math.floor(Math.random() * 30) - 10,
      },
      performance: {
        pageLoadTime: Math.random() * 3 + 1,
        firstContentfulPaint: Math.random() * 2 + 0.5,
        largestContentfulPaint: Math.random() * 3 + 1.5,
        cumulativeLayoutShift: Math.random() * 0.3,
        uptime: Math.floor(Math.random() * 100) + 900,
        uptimePercentage: Math.floor(Math.random() * 5) + 95,
      },
      conversion: {
        conversionRate: Math.random() * 5 + 1,
        goalCompletions: Math.floor(Math.random() * 100) + 20,
        costPerAcquisition: Math.floor(Math.random() * 100) + 50,
        returnOnInvestment: Math.floor(Math.random() * 300) + 100,
        conversionGrowth: Math.floor(Math.random() * 20) - 5,
        roiGrowth: Math.floor(Math.random() * 50) - 10,
      },
      summary: {
        totalAudits: 0,
        totalMonitoring: 0,
        totalAIAnalyses: 0,
        totalCompetitorAnalyses: 0,
        activeIssues: 0,
        avgPerformanceScore: 0,
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
