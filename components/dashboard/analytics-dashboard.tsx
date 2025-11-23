"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  BarChart3,
  Activity,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";

interface AnalyticsData {
  traffic: {
    visitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    visitorsGrowth: number;
    pageViewsGrowth: number;
  };
  seo: {
    keywordRankings: number;
    organicTraffic: number;
    backlinks: number;
    domainAuthority: number;
    rankingsGrowth: number;
    trafficGrowth: number;
  };
  performance: {
    pageLoadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    uptime: number;
    uptimePercentage: number;
  };
  conversion: {
    conversionRate: number;
    goalCompletions: number;
    costPerAcquisition: number;
    returnOnInvestment: number;
    conversionGrowth: number;
    roiGrowth: number;
  };
  charts: {
    trafficChart: any[];
    keywordChart: any[];
    performanceChart: any[];
    conversionChart: any[];
  };
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-500" : "text-red-500";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const data = analyticsData || {
    traffic: {
      visitors: 0,
      pageViews: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      visitorsGrowth: 0,
      pageViewsGrowth: 0,
    },
    seo: {
      keywordRankings: 0,
      organicTraffic: 0,
      backlinks: 0,
      domainAuthority: 0,
      rankingsGrowth: 0,
      trafficGrowth: 0,
    },
    performance: {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      uptime: 0,
      uptimePercentage: 0,
    },
    conversion: {
      conversionRate: 0,
      goalCompletions: 0,
      costPerAcquisition: 0,
      returnOnInvestment: 0,
      conversionGrowth: 0,
      roiGrowth: 0,
    },
    charts: {
      trafficChart: [],
      keywordChart: [],
      performanceChart: [],
      conversionChart: [],
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your website's performance and metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <GradientButton
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </GradientButton>
          <GradientButton variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </GradientButton>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.traffic.visitors)}</div>
            <div className="flex items-center gap-2 mt-2">
              {getGrowthIcon(data.traffic.visitorsGrowth)}
              <span className={`text-xs ${getGrowthColor(data.traffic.visitorsGrowth)}`}>
                {Math.abs(data.traffic.visitorsGrowth)}% from last period
              </span>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.traffic.pageViews)}</div>
            <div className="flex items-center gap-2 mt-2">
              {getGrowthIcon(data.traffic.pageViewsGrowth)}
              <span className={`text-xs ${getGrowthColor(data.traffic.pageViewsGrowth)}`}>
                {Math.abs(data.traffic.pageViewsGrowth)}% from last period
              </span>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.traffic.bounceRate}%</div>
            <Progress value={100 - data.traffic.bounceRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Lower is better
            </p>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(data.traffic.avgSessionDuration)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Time on site
            </p>
          </CardContent>
        </GlassCard>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
                <CardDescription>
                  Website traffic trends and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Traffic chart will be displayed here</p>
                    <p className="text-sm">Integration with chart library needed</p>
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Where your visitors come from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Organic Search</span>
                    <Badge>45%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Direct</span>
                    <Badge>25%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Social Media</span>
                    <Badge>20%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Referral</span>
                    <Badge>10%</Badge>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <GlassCard>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Keyword Rankings</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.seo.keywordRankings}</div>
                <div className="flex items-center gap-2 mt-2">
                  {getGrowthIcon(data.seo.rankingsGrowth)}
                  <span className={`text-xs ${getGrowthColor(data.seo.rankingsGrowth)}`}>
                    {Math.abs(data.seo.rankingsGrowth)}% growth
                  </span>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.seo.organicTraffic)}</div>
                <div className="flex items-center gap-2 mt-2">
                  {getGrowthIcon(data.seo.trafficGrowth)}
                  <span className={`text-xs ${getGrowthColor(data.seo.trafficGrowth)}`}>
                    {Math.abs(data.seo.trafficGrowth)}% growth
                  </span>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Backlinks</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.seo.backlinks)}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total referring domains
                </p>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Domain Authority</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.seo.domainAuthority}/100</div>
                <Progress value={data.seo.domainAuthority} className="mt-2" />
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <GlassCard>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance.pageLoadTime}s</div>
                <Progress value={Math.max(0, 100 - data.performance.pageLoadTime * 10)} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {data.performance.pageLoadTime <= 2 ? 'Excellent' : data.performance.pageLoadTime <= 3 ? 'Good' : 'Needs improvement'}
                </p>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">First Contentful Paint</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance.firstContentfulPaint}s</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Time to first content
                </p>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance.uptimePercentage}%</div>
                <Progress value={data.performance.uptimePercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Last 30 days
                </p>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
                <CardDescription>
                  Track your conversion performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversion Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{data.conversion.conversionRate}%</span>
                      {getGrowthIcon(data.conversion.conversionGrowth)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Goal Completions</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{data.conversion.goalCompletions}</span>
                      {getGrowthIcon(data.conversion.conversionGrowth)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost per Acquisition</span>
                    <span className="font-bold">${data.conversion.costPerAcquisition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Return on Investment</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{data.conversion.returnOnInvestment}%</span>
                      {getGrowthIcon(data.conversion.roiGrowth)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>
                  User journey through conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Visitors</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Leads</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Qualified Leads</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Customers</span>
                      <span>3%</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}