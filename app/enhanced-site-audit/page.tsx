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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Search,
  FileText,
  Settings,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  Eye,
  Bug,
  Smartphone,
  Monitor,
  Router,
  Database,
  ArrowRight,
  ExternalLink,
  Download,
  Share2,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuditResult {
  overallScore: number;
  technicalSeo: {
    score: number;
    issues: Array<{
      type: "error" | "warning" | "info";
      title: string;
      description: string;
      impact: "high" | "medium" | "low";
    }>;
  };
  performance: {
    score: number;
    metrics: {
      pageSpeed: number;
      loadTime: string;
      firstContentfulPaint: string;
      largestContentfulPaint: string;
    };
  };
  contentAnalysis: {
    score: number;
    wordCount: number;
    readabilityScore: number;
    keywordDensity: number;
    headingStructure: boolean;
  };
  mobileUsability: {
    score: number;
    issues: Array<{
      type: "error" | "warning";
      title: string;
      description: string;
    }>;
  };
  security: {
    score: number;
    httpsEnabled: boolean;
    securityHeaders: Array<string>;
    vulnerabilities: Array<string>;
  };
}

export default function EnhancedSiteAuditPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [competitorUrls, setCompetitorUrls] = useState("");
  const [auditDepth, setAuditDepth] = useState("standard");
  const [includeCompetitors, setIncludeCompetitors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AuditResult | null>(null);

  const handleAudit = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to audit",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual API integration
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock results
      const mockResults: AuditResult = {
        overallScore: 78,
        technicalSeo: {
          score: 85,
          issues: [
            {
              type: "error",
              title: "Missing H1 Tag",
              description:
                "Your homepage is missing an H1 tag, which is important for SEO",
              impact: "high",
            },
            {
              type: "warning",
              title: "Large Image Files",
              description:
                "Several images are not optimized and are slowing down your site",
              impact: "medium",
            },
            {
              type: "info",
              title: "Missing Meta Description",
              description: "Some pages are missing meta descriptions",
              impact: "low",
            },
          ],
        },
        performance: {
          score: 72,
          metrics: {
            pageSpeed: 72,
            loadTime: "2.8s",
            firstContentfulPaint: "1.2s",
            largestContentfulPaint: "2.5s",
          },
        },
        contentAnalysis: {
          score: 68,
          wordCount: 450,
          readabilityScore: 65,
          keywordDensity: 2.1,
          headingStructure: true,
        },
        mobileUsability: {
          score: 90,
          issues: [
            {
              type: "warning",
              title: "Text Too Small",
              description:
                "Some text elements are too small to read on mobile devices",
              description: "Some buttons are too close together on mobile",
            },
          ],
        },
        security: {
          score: 95,
          httpsEnabled: true,
          securityHeaders: [
            "X-Frame-Options",
            "X-XSS-Protection",
            "X-Content-Type-Options",
          ],
          vulnerabilities: [],
        },
      };

      setResults(mockResults);
      toast({
        title: "Audit Complete",
        description: "Your enhanced site audit has been completed successfully",
      });
    } catch (error) {
      toast({
        title: "Audit Failed",
        description: "There was an error running the audit. Please try again.",
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
            <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Please log in to access the Enhanced Site Audit tool
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
            <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Enhanced Site Audit is a premium feature. Upgrade to access this
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enhanced Site Audit
          </h1>
          <p className="text-gray-600">
            Comprehensive SEO audit with advanced metrics and detailed analysis
          </p>
        </div>

        {!results ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Site Audit Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your enhanced site audit settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="url">Website URL *</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitors">
                      Competitor URLs (Optional)
                    </Label>
                    <Textarea
                      id="competitors"
                      placeholder="Enter competitor URLs, one per line"
                      value={competitorUrls}
                      onChange={(e) => setCompetitorUrls(e.target.value)}
                      className="w-full"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-competitors"
                      checked={includeCompetitors}
                      onCheckedChange={setIncludeCompetitors}
                    />
                    <Label htmlFor="include-competitors">
                      Include competitor analysis
                    </Label>
                  </div>

                  <div className="space-y-3">
                    <Label>Audit Depth</Label>
                    <RadioGroup
                      value={auditDepth}
                      onValueChange={setAuditDepth}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quick" id="quick" />
                        <Label htmlFor="quick">Quick Scan (Top 50 pages)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">
                          Standard Scan (Top 200 pages)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="comprehensive"
                          id="comprehensive"
                        />
                        <Label htmlFor="comprehensive">
                          Comprehensive (All pages)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      What's included:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Technical SEO analysis</li>
                      <li>• Performance metrics</li>
                      <li>• Content quality assessment</li>
                      <li>• Mobile usability check</li>
                      <li>• Security vulnerability scan</li>
                      <li>• Competitive benchmarking</li>
                      {includeCompetitors && <li>• Competitor analysis</li>}
                    </ul>
                  </div>

                  <Button
                    onClick={handleAudit}
                    disabled={isLoading || !url}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white mr-2"></div>
                        Running Audit...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Start Enhanced Audit
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
                    <TrendingUp className="h-5 w-5" />
                    Audit Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Comprehensive Analysis</h4>
                      <p className="text-sm text-gray-600">
                        Deep dive into technical SEO, performance, and content
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Competitive Insights</h4>
                      <p className="text-sm text-gray-600">
                        Compare your site against competitors
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">
                        Actionable Recommendations
                      </h4>
                      <p className="text-sm text-gray-600">
                        Get specific steps to improve your SEO
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Audits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>example.com</span>
                      <Badge variant="secondary">2 days ago</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>blog.example.com</span>
                      <Badge variant="secondary">1 week ago</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>shop.example.com</span>
                      <Badge variant="secondary">2 weeks ago</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Audit Results
                </CardTitle>
                <CardDescription>
                  Enhanced site audit completed for {url}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">
                    {results.overallScore}
                  </div>
                  <div className="text-gray-600 mb-4">Overall SEO Score</div>
                  <Progress value={results.overallScore} className="h-2 mb-6" />
                  <div className="flex justify-center gap-4 mb-6">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="technical">Technical SEO</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="technical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Technical SEO Score: {results.technicalSeo.score}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.technicalSeo.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                        >
                          {issue.type === "error" && (
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                          )}
                          {issue.type === "warning" && (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                          )}
                          {issue.type === "info" && (
                            <Eye className="h-5 w-5 text-blue-500 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{issue.title}</h4>
                              <Badge
                                variant={
                                  issue.impact === "high"
                                    ? "destructive"
                                    : issue.impact === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {issue.impact} impact
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {issue.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Performance Score: {results.performance.score}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Page Speed
                        </div>
                        <div className="text-2xl font-bold">
                          {results.performance.metrics.pageSpeed}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Load Time
                        </div>
                        <div className="text-2xl font-bold">
                          {results.performance.metrics.loadTime}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          First Contentful Paint
                        </div>
                        <div className="text-2xl font-bold">
                          {results.performance.metrics.firstContentfulPaint}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Largest Contentful Paint
                        </div>
                        <div className="text-2xl font-bold">
                          {results.performance.metrics.largestContentfulPaint}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Content Analysis Score: {results.contentAnalysis.score}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Word Count
                        </div>
                        <div className="text-2xl font-bold">
                          {results.contentAnalysis.wordCount}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Readability Score
                        </div>
                        <div className="text-2xl font-bold">
                          {results.contentAnalysis.readabilityScore}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Keyword Density
                        </div>
                        <div className="text-2xl font-bold">
                          {results.contentAnalysis.keywordDensity}%
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Heading Structure
                        </div>
                        <div className="text-2xl font-bold">
                          {results.contentAnalysis.headingStructure
                            ? "Good"
                            : "Needs Work"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mobile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Mobile Usability Score: {results.mobileUsability.score}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.mobileUsability.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                        >
                          {issue.type === "error" && (
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                          )}
                          {issue.type === "warning" && (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{issue.title}</h4>
                            <p className="text-sm text-gray-600">
                              {issue.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Score: {results.security.score}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {results.security.httpsEnabled ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <h4 className="font-medium">HTTPS Enabled</h4>
                          <p className="text-sm text-gray-600">
                            {results.security.httpsEnabled
                              ? "Your site is using HTTPS"
                              : "HTTPS is not enabled"}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Security Headers</h4>
                        <div className="space-y-1">
                          {results.security.securityHeaders.map(
                            (header, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{header}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {results.security.vulnerabilities.length > 0 && (
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h4 className="font-medium mb-2 text-red-900">
                            Security Vulnerabilities
                          </h4>
                          <div className="space-y-1">
                            {results.security.vulnerabilities.map(
                              (vulnerability, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-red-800"
                                >
                                  {vulnerability}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button onClick={() => setResults(null)}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Run New Audit
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
