"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Database,
  Upload,
  FileText,
  Download,
  Share2,
  RefreshCw,
  Search,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
  Calendar,
  Bot,
  Spider,
  Users,
  ArrowRight,
  FileArchive,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogFileData {
  totalRequests: number;
  uniquePages: number;
  crawlBudget: number;
  organicTraffic: number;
  botTraffic: number;
  errors: number;
  redirects: number;
  dateRange: string;
}

interface CrawlInsight {
  url: string;
  requests: number;
  status: number;
  userAgent: string;
  crawlFrequency: string;
  lastCrawled: string;
  issues: string[];
}

interface LogAnalysisResult {
  summary: LogFileData;
  topPages: CrawlInsight[];
  crawlPatterns: {
    hourly: Array<{ hour: number; requests: number }>;
    daily: Array<{ date: string; requests: number }>;
  };
  issues: Array<{
    type: "error" | "warning" | "info";
    title: string;
    description: string;
    impact: string;
    count: number;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
}

export default function LogFileAnalyzerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [logType, setLogType] = useState("apache");
  const [timeRange, setTimeRange] = useState("30");
  const [includeBots, setIncludeBots] = useState(true);
  const [analyzePatterns, setAnalyzePatterns] = useState(true);
  const [checkErrors, setCheckErrors] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LogAnalysisResult | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      // Check file size (max 50MB)
      if (uploadedFile.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      setFile(uploadedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "File Required",
        description: "Please upload a log file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock analysis results
      const mockResults: LogAnalysisResult = {
        summary: {
          totalRequests: 45678,
          uniquePages: 1234,
          crawlBudget: 78.5,
          organicTraffic: 23456,
          botTraffic: 12345,
          errors: 234,
          redirects: 567,
          dateRange: "Last 30 days",
        },
        topPages: [
          {
            url: "/",
            requests: 1234,
            status: 200,
            userAgent: "Googlebot",
            crawlFrequency: "Daily",
            lastCrawled: "2024-01-15 14:30:00",
            issues: [],
          },
          {
            url: "/blog/seo-tips",
            requests: 987,
            status: 200,
            userAgent: "Googlebot",
            crawlFrequency: "Daily",
            lastCrawled: "2024-01-15 12:15:00",
            issues: [],
          },
          {
            url: "/products/premium",
            requests: 876,
            status: 404,
            userAgent: "Googlebot",
            crawlFrequency: "Weekly",
            lastCrawled: "2024-01-14 09:45:00",
            issues: ["Page not found", "High error rate"],
          },
          {
            url: "/about",
            requests: 654,
            status: 301,
            userAgent: "Bingbot",
            crawlFrequency: "Weekly",
            lastCrawled: "2024-01-13 16:20:00",
            issues: ["Redirect chain detected"],
          },
        ],
        crawlPatterns: {
          hourly: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            requests: Math.floor(Math.random() * 2000) + 500,
          })),
          daily: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(
              Date.now() - (29 - i) * 86400000
            ).toLocaleDateString(),
            requests: Math.floor(Math.random() * 2000) + 1000,
          })),
        },
        issues: [
          {
            type: "error",
            title: "High 404 Error Rate",
            description: "Significant number of 404 errors detected",
            impact: "High - Affects crawl budget and indexing",
            count: 234,
          },
          {
            type: "warning",
            title: "Crawl Budget Waste",
            description: "Bots are crawling low-value pages frequently",
            impact: "Medium - Reduces efficient crawling",
            count: 89,
          },
          {
            type: "info",
            title: "Unusual Bot Activity",
            description: "Unknown bot detected crawling your site",
            impact: "Low - Monitor for potential issues",
            count: 12,
          },
        ],
        recommendations: [
          {
            title: "Fix 404 Errors",
            description:
              "Implement proper redirects for broken links to preserve link equity",
            priority: "high",
          },
          {
            title: "Optimize Crawl Budget",
            description:
              "Use robots.txt to block low-value pages from search engine crawlers",
            priority: "medium",
          },
          {
            title: "Monitor Bot Traffic",
            description: "Set up monitoring for unusual bot activity patterns",
            priority: "low",
          },
        ],
      };

      setResults(mockResults);
      toast({
        title: "Analysis Complete",
        description: "Log file analysis completed successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the log file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Database className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Please log in to access the Log File Analyzer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Login to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user.isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Database className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Log File Analyzer is a premium feature. Upgrade to access this
              tool.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/upgrade">
              <Button className="w-full">Upgrade to Premium</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600";
    if (status >= 300 && status < 400) return "text-yellow-600";
    if (status >= 400 && status < 500) return "text-orange-600";
    if (status >= 500) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Log File Analyzer
          </h1>
          <p className="text-gray-600">
            Analyze server logs to understand crawl behavior and optimize your
            SEO strategy
          </p>
        </div>

        {!results ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Log File Upload
                  </CardTitle>
                  <CardDescription>
                    Upload your server log files for comprehensive analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="file">Log File *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        id="file"
                        type="file"
                        accept=".log,.txt,.gz,.zip"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="file" className="cursor-pointer">
                        <FileArchive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-lg font-medium text-gray-900 mb-2">
                          {file
                            ? file.name
                            : "Click to upload or drag and drop"}
                        </div>
                        <div className="text-sm text-gray-600">
                          Supported formats: .log, .txt, .gz, .zip (max 50MB)
                        </div>
                      </label>
                    </div>
                    {file && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            {file.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFile(null)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="logType">Log Format</Label>
                      <Select value={logType} onValueChange={setLogType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apache">Apache</SelectItem>
                          <SelectItem value="nginx">Nginx</SelectItem>
                          <SelectItem value="iis">IIS</SelectItem>
                          <SelectItem value="cloudflare">Cloudflare</SelectItem>
                          <SelectItem value="auto">Auto-detect</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeRange">Time Range</Label>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Last 7 days</SelectItem>
                          <SelectItem value="30">Last 30 days</SelectItem>
                          <SelectItem value="90">Last 90 days</SelectItem>
                          <SelectItem value="all">All available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-bots"
                        checked={includeBots}
                        onCheckedChange={setIncludeBots}
                      />
                      <Label htmlFor="include-bots">
                        Analyze bot traffic patterns
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="analyze-patterns"
                        checked={analyzePatterns}
                        onCheckedChange={setAnalyzePatterns}
                      />
                      <Label htmlFor="analyze-patterns">
                        Analyze crawl patterns
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="check-errors"
                        checked={checkErrors}
                        onCheckedChange={setCheckErrors}
                      />
                      <Label htmlFor="check-errors">
                        Check for errors and issues
                      </Label>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      What we analyze:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Search engine crawler behavior</li>
                      <li>• Crawl budget utilization</li>
                      <li>• Error patterns and issues</li>
                      <li>• Most frequently crawled pages</li>
                      <li>• Bot traffic identification</li>
                      <li>• Crawl frequency analysis</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading || !file}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white mr-2"></div>
                        Analyzing Log File...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Analyze Log File
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Analysis Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Crawl Insights</h4>
                      <p className="text-sm text-gray-600">
                        Understand how search engines crawl your site
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Error Detection</h4>
                      <p className="text-sm text-gray-600">
                        Identify crawling issues and errors
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Budget Optimization</h4>
                      <p className="text-sm text-gray-600">
                        Optimize your crawl budget allocation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supported Formats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Apache</Badge>
                    <span className="text-sm">Common access logs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Nginx</Badge>
                    <span className="text-sm">Nginx access logs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">IIS</Badge>
                    <span className="text-sm">IIS server logs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Cloudflare</Badge>
                    <span className="text-sm">Cloudflare logs</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Requests
                  </CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {results.summary.totalRequests.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {results.summary.dateRange}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Crawl Budget
                  </CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {results.summary.crawlBudget}%
                  </div>
                  <Progress
                    value={results.summary.crawlBudget}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Bot Traffic
                  </CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {results.summary.botTraffic.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(
                      (results.summary.botTraffic /
                        results.summary.totalRequests) *
                        100
                    )}
                    % of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Errors</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {results.summary.errors}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Need attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            <Tabs defaultValue="pages" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pages">Top Pages</TabsTrigger>
                <TabsTrigger value="patterns">Crawl Patterns</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pages" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Most Crawled Pages</CardTitle>
                    <CardDescription>
                      Pages that receive the most attention from search engine
                      crawlers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-6 gap-4 p-4 font-medium text-sm text-gray-700 border-b">
                        <div>URL</div>
                        <div className="text-center">Requests</div>
                        <div className="text-center">Status</div>
                        <div className="text-center">Bot</div>
                        <div className="text-center">Frequency</div>
                        <div className="text-center">Last Crawled</div>
                      </div>

                      {results.topPages.map((page, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-gray-50"
                        >
                          <div className="truncate font-medium">{page.url}</div>
                          <div className="text-center">{page.requests}</div>
                          <div
                            className={`text-center ${getStatusColor(page.status)}`}
                          >
                            {page.status}
                          </div>
                          <div className="text-center">
                            <Badge variant="outline">{page.userAgent}</Badge>
                          </div>
                          <div className="text-center">
                            {page.crawlFrequency}
                          </div>
                          <div className="text-center text-sm text-gray-600">
                            {new Date(page.lastCrawled).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patterns" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hourly Crawl Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {results.crawlPatterns.hourly
                          .slice(0, 12)
                          .map((hour) => (
                            <div
                              key={hour.hour}
                              className="flex items-center gap-2"
                            >
                              <span className="text-sm w-12">
                                {hour.hour}:00
                              </span>
                              <div className="flex-1">
                                <Progress
                                  value={(hour.requests / 2500) * 100}
                                  className="h-2"
                                />
                              </div>
                              <span className="text-sm w-16 text-right">
                                {hour.requests}
                              </span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Crawl Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {results.crawlPatterns.daily.slice(0, 10).map((day) => (
                          <div
                            key={day.date}
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm w-24">{day.date}</span>
                            <div className="flex-1">
                              <Progress
                                value={(day.requests / 3000) * 100}
                                className="h-2"
                              />
                            </div>
                            <span className="text-sm w-16 text-right">
                              {day.requests}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="issues" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detected Issues</CardTitle>
                    <CardDescription>
                      Problems and warnings found in your log files
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-lg bg-gray-50"
                        >
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{issue.title}</h4>
                              <Badge variant="outline">
                                {issue.count} occurrences
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {issue.description}
                            </p>
                            <p className="text-sm font-medium text-orange-600">
                              {issue.impact}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>
                      Actionable steps to improve your crawl efficiency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-lg bg-blue-50"
                        >
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{rec.title}</h4>
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {rec.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  setResults(null);
                  setFile(null);
                }}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Analyze Another File
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
