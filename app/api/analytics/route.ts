import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const audits = await prisma.audit.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      include: {
        seoIssues: true,
        performanceMetrics: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const monitoringData = await prisma.websiteMonitor.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'desc' }
    });

    const aiAnalyses = await prisma.aIAnalysis.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'desc' }
    });

    const competitorAnalyses = await prisma.competitorAnalysis.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'desc' }
    });

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
      charts: {
        trafficChart: generateTrafficChart(timeRange),
        keywordChart: generateKeywordChart(timeRange),
        performanceChart: generatePerformanceChart(timeRange),
        conversionChart: generateConversionChart(timeRange),
      },
      summary: {
        totalAudits: audits.length,
        totalMonitoring: monitoringData.length,
        totalAIAnalyses: aiAnalyses.length,
        totalCompetitorAnalyses: competitorAnalyses.length,
        activeIssues: audits.reduce((sum, audit) => sum + (audit.seoIssues?.length || 0), 0),
        avgPerformanceScore: audits.reduce((sum, audit) => {
          const score = audit.performanceMetrics?.[0]?.score || 0;
          return sum + score;
        }, 0) / (audits.length || 1),
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

function generateTrafficChart(timeRange: string) {
  const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  return Array.from({ length: points }, (_, i) => ({
    date: new Date(Date.now() - (points - i) * (timeRange === '24h' ? 3600000 : 86400000)).toISOString(),
    visitors: Math.floor(Math.random() * 1000) + 500,
    pageViews: Math.floor(Math.random() * 5000) + 2000,
  }));
}

function generateKeywordChart(timeRange: string) {
  const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  return Array.from({ length: points }, (_, i) => ({
    date: new Date(Date.now() - (points - i) * (timeRange === '24h' ? 3600000 : 86400000)).toISOString(),
    rankings: Math.floor(Math.random() * 50) + 100,
    positions: Math.floor(Math.random() * 20) + 10,
  }));
}

function generatePerformanceChart(timeRange: string) {
  const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  return Array.from({ length: points }, (_, i) => ({
    date: new Date(Date.now() - (points - i) * (timeRange === '24h' ? 3600000 : 86400000)).toISOString(),
    loadTime: Math.random() * 2 + 1,
    score: Math.floor(Math.random() * 30) + 70,
  }));
}

function generateConversionChart(timeRange: string) {
  const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  return Array.from({ length: points }, (_, i) => ({
    date: new Date(Date.now() - (points - i) * (timeRange === '24h' ? 3600000 : 86400000)).toISOString(),
    rate: Math.random() * 5 + 1,
    conversions: Math.floor(Math.random() * 20) + 5,
  }));
}
