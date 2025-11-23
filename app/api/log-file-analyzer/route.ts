import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface LogFileAnalyzerRequest {
  logFileContent?: string;
  logFileUrl?: string;
  analyzeCrawlPatterns?: boolean;
  checkSecurity?: boolean;
  analyzePerformance?: boolean;
  timeRange?: {
    startDate?: string;
    endDate?: string;
  };
}

interface LogFileAnalyzerResult {
  totalEntries: number;
  timeRange?: {
    startDate: string;
    endDate: string;
  };
  crawlStats: {
    totalCrawls: number;
    uniquePages: number;
    crawlFrequency: number;
    avgCrawlDuration: number;
  };
  userAgentAnalysis: {
    topBots: Array<{
      userAgent: string;
      count: number;
      percentage: number;
      pagesCrawled: number;
    }>;
    topPages: Array<{
      url: string;
      crawlCount: number;
      lastCrawled: string;
      statusCode: string;
    }>;
    securityIssues: Array<{
      type: string;
      severity: "low" | "medium" | "high" | "critical";
      description: string;
      count: number;
      firstOccurrence: string;
    }>;
  performanceIssues: Array<{
      type: string;
      severity: "low" | "medium" | "high" | "critical";
      description: string;
      count: number;
      avgResponseTime: number;
    }>;
  recommendations: string[];
  scoreBreakdown: {
    crawlEfficiency: number;
    securityScore: number;
    performanceScore: number;
    overall: number;
  };
}

async function parseLogFile(content: string): Promise<any> {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const entries: any[] = [];
  let currentEntry = null;

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) continue;

    // Parse Apache/Nginx combined log format
    const parts = line.match(/(\S+) \S+ (\S+) \S+ \[([\w:/]+)\] \S+ "([^"]*)" "([^"]*)".*" "([^"]*)"\]/);
    
    if (parts && parts.length >= 9) {
      const entry = {
        timestamp: parts[1] + ' ' + parts[2],
        method: parts[3],
        url: parts[4],
        protocol: parts[5],
        statusCode: parts[6],
        size: parts[7],
        referer: parts[8] || '-',
        userAgent: parts[9] || '-',
        responseTime: parts.length > 10 ? parseFloat(parts[10]) : null,
      };

      if (currentEntry) {
        entries.push(currentEntry);
      }
      currentEntry = entry;
    }
  }

  if (currentEntry) {
    entries.push(currentEntry);
  }

  return {
    entries,
    totalLines: lines.length,
    parsedEntries: entries.length,
  };
}

async function analyzeLogData(entries: any[]): Promise<LogFileAnalyzerResult> {
  const totalEntries = entries.length;
  
  // Get unique pages
  const uniquePages = new Set();
  let totalCrawls = 0;
  let totalResponseTime = 0;
  let responseTimeCount = 0;

  entries.forEach(entry => {
    if (entry.url) {
      uniquePages.add(entry.url);
      totalCrawls++;
    }
    if (entry.responseTime) {
      totalResponseTime += entry.responseTime;
      responseTimeCount++;
    }
  });

  // User agent analysis
  const userAgentCounts: Record<string, number> = {};
  entries.forEach(entry => {
    if (entry.userAgent) {
      userAgentCounts[entry.userAgent] = (userAgentCounts[entry.userAgent] || 0) + 1;
    }
  });

  const topUserAgents = Object.entries(userAgentCounts)
    .sort(([, a], [, b]) => b[1] - a[1])
    .slice(0, 10)
    .map(([userAgent, count]) => ({
      userAgent,
      count,
      percentage: Math.round((count / totalEntries) * 100),
      pagesCrawled: entries.filter(e => e.userAgent === userAgent).length,
    }));

  // Top pages analysis
  const pageCounts: Record<string, number> = {};
  entries.forEach(entry => {
    if (entry.url) {
      pageCounts[entry.url] = (pageCounts[entry.url] || 0) + 1;
    }
  });

  const topPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b[1] - a[1])
    .slice(0, 10)
    .map(([url, count]) => ({
      url,
      crawlCount: count,
      lastCrawled: new Date().toISOString(),
      statusCode: entries.find(e => e.url === url)?.statusCode || '200',
    }));

  // Security analysis
  const securityIssues: any[] = [];
  const statusCodes = entries.map(e => e.statusCode || '200');
  
  // Analyze suspicious patterns
  const suspiciousIPs = new Set();
  const errorRate = statusCodes.filter(code => code.startsWith('4') || code.startsWith('5')).length / totalEntries;
  
  entries.forEach(entry => {
    if (entry.statusCode && (entry.statusCode.startsWith('4') || entry.statusCode.startsWith('5'))) {
      const ipMatch = entry.referer?.match(/\d+\.\d+\.\d+\.\d+\.\d+/);
      if (ipMatch) {
        suspiciousIPs.add(ipMatch[0]);
      }
    }
  });

  suspiciousIPs.forEach(ip => {
    securityIssues.push({
      type: "Suspicious Activity",
      severity: "high" as const,
      description: `High frequency of requests from suspicious IP: ${ip}`,
      count: statusCodes.filter(e => e.referer?.includes(ip)).length,
      firstOccurrence: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    });
  });

  // Performance issues
  const performanceIssues: any[] = [];
  const avgResponseTime = responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0;
  
  entries.forEach(entry => {
    if (entry.responseTime && entry.responseTime > avgResponseTime * 2) {
      performanceIssues.push({
        type: "Slow Response",
        severity: "medium" as const,
        description: `Slow response time detected: ${entry.responseTime}ms for ${entry.url}`,
        count: 1,
        avgResponseTime: entry.responseTime,
      });
    }
  });

  const crawlEfficiency = Math.min(100, (uniquePages.size / totalCrawls) * 100);
  const securityScore = Math.max(0, 100 - (securityIssues.length * 10));
  const performanceScore = Math.max(0, 100 - (performanceIssues.length * 15));
  const overall = Math.round((crawlEfficiency + securityScore + performanceScore) / 3);

  return {
    totalEntries,
    crawlStats: {
      totalCrawls,
      uniquePages: uniquePages.size,
      crawlFrequency: Math.round(totalCrawls / Math.max(1, entries.length / (24 * 60 * 60 * 1000)), // per day
      avgCrawlDuration: avgResponseTime / 1000, // in seconds
    },
    userAgentAnalysis: {
      topBots,
    },
    topPages,
    securityIssues,
    performanceIssues,
    recommendations: generateLogRecommendations(securityIssues, performanceIssues, crawlEfficiency, errorRate),
    scoreBreakdown: {
      crawlEfficiency,
      securityScore,
      performanceScore,
      overall,
    },
  };
}

function generateLogRecommendations(
  securityIssues: any[],
  performanceIssues: any[],
  crawlEfficiency: number,
  errorRate: number
): string[] {
  const recommendations: string[] = [];

  // Security recommendations
  if (securityIssues.length > 0) {
    recommendations.push("Review and block suspicious IP addresses showing unusual activity patterns");
    recommendations.push("Implement rate limiting to prevent abuse from bots");
  }

  // Performance recommendations
  if (performanceIssues.length > 0) {
    recommendations.push("Optimize server response times - average response time is above 2 seconds");
    recommendations.push("Consider implementing caching to reduce server load");
  }

  // Crawl efficiency recommendations
  if (crawlEfficiency < 70) {
    recommendations.push("Improve crawl scheduling - bots are crawling too many duplicate pages");
    recommendations.push("Review robots.txt to guide bots more efficiently");
  }

  // Error rate recommendations
  if (errorRate > 10) {
    recommendations.push("Investigate high error rate - may indicate server issues or bot attacks");
  }

  // General recommendations
  recommendations.push("Set up log rotation to manage large log files");
  recommendations.push("Consider implementing real-time log monitoring");
  recommendations.push("Use structured logging for better analysis");

  return recommendations;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded?.userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body: LogFileAnalyzerRequest = await request.json();
    const {
      logFileContent,
      logFileUrl,
      analyzeCrawlPatterns = true,
      checkSecurity = true,
      checkPerformance = true,
      timeRange = { startDate: undefined, endDate: undefined },
    } = body;

    // Check user limits
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isPremium) {
      const usage = await prisma.userUsage.findUnique({
        where: { userId: user.id },
      });
      if (usage && usage.freeReportsUsed >= 10) {
        return NextResponse.json(
          {
            error:
              "You have reached your monthly limit. Upgrade to premium for unlimited access.",
          },
          { status: 429 }
        );
      }
    }

    let logContent = '';
    let entries: any[] = [];

    if (logFileContent) {
      logContent = logFileContent;
      const parseResult = await parseLogFile(logContent);
      entries = parseResult.entries;
    } else if (logFileUrl) {
      // Fetch log file from URL
      try {
        const response = await fetch(logFileUrl);
        if (!response.ok) {
          return NextResponse.json({ error: "Failed to fetch log file" }, { status: 400 });
        }
        logContent = await response.text();
        const parseResult = await parseLogFile(logContent);
        entries = parseResult.entries;
      }
    } else {
      return NextResponse.json({ error: "Either logFileContent or logFileUrl is required" }, { status: 400 });
    }

    // Perform analysis
    const result = await analyzeLogData(entries);

    // Save to database
    const analysis = await prisma.sEOToolResult.create({
      data: {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        toolType: "LOG_FILE_ANALYZER",
        url: logFileUrl || 'direct-upload',
        result: result as any,
        updatedAt: new Date(),
      },
    });

    // Update usage
    if (!user.isPremium) {
      await prisma.userUsage.upsert({
        where: { userId: user.id },
        update: { freeReportsUsed: { increment: 1 } },
        create: {
          userId: user.id,
          freeReportsUsed: 1,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      ...result,
      analysisId: analysis.id,
    });
  } catch (error) {
    console.error("Log file analyzer error:", error);
    return NextResponse.json(
      { error: "Failed to analyze log file" },
      { status: 500 }
    );
  }
}
