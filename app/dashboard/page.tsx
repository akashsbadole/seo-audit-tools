"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Globe,
  Brain,
  FileText,
  Settings,
  Shield,
  Search,
  Link2,
  Database,
  Zap,
  Users,
  Activity,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
} from "lucide-react";

interface DashboardStats {
  totalAnalyses: number;
  premiumAnalyses: number;
  savedReports: number;
  apiCalls: number;
  lastAnalysis?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    premiumAnalyses: 0,
    savedReports: 0,
    apiCalls: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportUserData = async (format: 'json' | 'csv') => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return;
      }

      const response = await fetch(`/api/user-data/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seoaudit-data-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/user-stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalAnalyses: data.totalAnalyses || 0,
            premiumAnalyses: data.premiumAnalyses || 0,
            savedReports: data.savedReports || 0,
            apiCalls: data.apiCalls || 0,
            lastAnalysis: data.lastAnalysis,
          });
          
          // Store the recent activity from the API
          if (data.recentActivity) {
            setRecentActivity(data.recentActivity);
          }
          
          // Store usage stats for premium users
          if (data.usageStats) {
            setUsageStats(data.usageStats);
          }
        } else {
          console.error('Failed to fetch user stats');
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const premiumFeatures = [
    {
      title: "Domain Overview",
      description: "Comprehensive domain analysis and authority metrics",
      icon: <Globe className="h-8 w-8" />,
      href: "/domain-overview",
      color: "bg-blue-500",
    },
    {
      title: "Keyword Research",
      description: "Discover high-value keywords with advanced research",
      icon: <Search className="h-8 w-8" />,
      href: "/keyword-research",
      color: "bg-green-500",
    },
    {
      title: "Competitor Analysis",
      description: "Analyze competitors' strategies and performance",
      icon: <TrendingUp className="h-8 w-8" />,
      href: "/competitor-analysis",
      color: "bg-purple-500",
    },
    {
      title: "Backlink Analytics",
      description: "Analyze backlink profile and authority",
      icon: <Link2 className="h-8 w-8" />,
      href: "/backlink-analytics",
      color: "bg-orange-500",
    },
    {
      title: "Enhanced Site Audit",
      description: "Comprehensive SEO audit with advanced metrics",
      icon: <Shield className="h-8 w-8" />,
      href: "/enhanced-site-audit",
      color: "bg-red-500",
    },
    {
      title: "Position Tracking",
      description: "Track keyword rankings over time",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "/position-tracking",
      color: "bg-indigo-500",
    },
    {
      title: "Content Ideas Generator",
      description: "Generate data-driven content ideas",
      icon: <Brain className="h-8 w-8" />,
      href: "/content-ideas",
      color: "bg-pink-500",
    },
    {
      title: "SEO Writing Assistant",
      description: "AI-powered content optimization",
      icon: <FileText className="h-8 w-8" />,
      href: "/writing-assistant",
      color: "bg-teal-500",
    },
    {
      title: "Bulk Analysis",
      description: "Analyze multiple URLs at once",
      icon: <Zap className="h-8 w-8" />,
      href: "/bulk-analysis",
      color: "bg-cyan-500",
    },
    {
      title: "Log File Analyzer",
      description: "Analyze server logs for SEO insights",
      icon: <Database className="h-8 w-8" />,
      href: "/log-file-analyzer",
      color: "bg-gray-500",
    },
  ];


  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Settings className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="w-full"
            >
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-[hsl(var(--seoaudit-orange))]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name || user.email}!
            </h1>
            <p className="text-gray-600">
              {user.isPremium
                ? "Access your premium SEO tools and analytics"
                : "Upgrade to premium to unlock all features"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportUserData('json')}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export JSON'}
            </Button>
            <Button
              variant="outline"
              onClick={() => exportUserData('csv')}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Analyses
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Premium Tools Used
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premiumAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                {user.isPremium ? "Full access" : "Limited access"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saved Reports
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.savedReports}</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.apiCalls}</div>
              <p className="text-xs text-muted-foreground">
                {user.isPremium
                  ? "Unlimited"
                  : `${1000 - stats.apiCalls} remaining`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${feature.color} text-white`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {user.isPremium ? (
                    <Link href={feature.href}>
                      <Button className="w-full">
                        Use Tool
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-center">
                      <Button variant="outline" className="w-full" disabled>
                        <Shield className="mr-2 h-4 w-4" />
                        Premium Only
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upgrade Banner for Non-Premium Users */}
        {!user.isPremium && (
          <Card className="mb-8 bg-gradient-to-r from-[hsl(var(--seoaudit-orange))/10] to-[hsl(var(--seoaudit-orange))/5] border-[hsl(var(--seoaudit-orange))]/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Unlock all premium features and get unlimited access to
                    advanced SEO tools
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Unlimited analyses and reports
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      API access for automation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Priority customer support
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <Link href="/upgrade">
                    <Button className="bg-[hsl(var(--seoaudit-orange))] hover:bg-[hsl(var(--seoaudit-orange))]/90 text-white px-8">
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest analyses and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {activity.tool}
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.url}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.status === "completed" && activity.score && (
                          <Badge variant="secondary">
                            Score: {activity.score}
                          </Badge>
                        )}
                        {activity.status === "processing" && (
                          <Badge variant="outline">Processing</Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity</p>
                    <Link href="/tools">
                      <Button variant="outline" className="mt-2">
                        Start Your First Analysis
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/reports">
                <Button variant="outline" className="w-full mt-4">
                  View All Reports
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          {user.isPremium && (
            <Card>
              <CardHeader>
                <CardTitle>Usage Stats</CardTitle>
                <CardDescription>
                  Your API and feature usage this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {usageStats ? (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          API Usage
                        </span>
                        <span className="text-sm text-gray-600">
                          {usageStats.apiUsage.used} / {usageStats.apiUsage.limit}
                        </span>
                      </div>
                      <Progress 
                        value={usageStats.apiUsage.limit === 'Unlimited' ? 100 : (usageStats.apiUsage.used / parseInt(usageStats.apiUsage.limit)) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Storage Used
                        </span>
                        <span className="text-sm text-gray-600">
                          {(usageStats.storageUsed.used / 1024).toFixed(1)} GB / {(usageStats.storageUsed.total / 1024).toFixed(1)} GB
                        </span>
                      </div>
                      <Progress value={usageStats.storageUsed.percentage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Reports Generated
                        </span>
                        <span className="text-sm text-gray-600">
                          {usageStats.reportsGenerated}
                        </span>
                      </div>
                      <Progress value={Math.min(usageStats.reportsGenerated * 5, 100)} className="h-2" />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-r-2 border-[hsl(var(--seoaudit-orange))] mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading usage stats...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}