"use client";

import { useState } from "react";
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
  Zap,
  Database,
  Upload,
  FileText,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  BarChart3,
  Search,
  Globe,
  Target,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UrlData {
  id: string;
  url: string;
  status: "pending" | "analyzing" | "completed" | "error";
  seoScore: number;
  issues: number;
  warnings: number;
  analyzedAt?: string;
  errorMessage?: string;
}

interface BulkAnalysisResult {
  id: string;
  name: string;
  urls: UrlData[];
  totalUrls: number;
  completedUrls: number;
  failedUrls: number;
  averageScore: number;
  createdAt: string;
  completedAt?: string;
}

export default function BulkAnalysisPage() {
  const { toast } = useToast();
  const [urls, setUrls] = useState("");
  const [analysisType, setAnalysisType] = useState("seo");
  const [name, setName] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [includeCompetitors, setIncludeCompetitors] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] =
    useState<BulkAnalysisResult | null>(null);
  const [history, setHistory] = useState<BulkAnalysisResult[]>([
    {
      id: "1",
      name: "Product Pages Analysis",
      urls: [],
      totalUrls: 25,
      completedUrls: 25,
      failedUrls: 0,
      averageScore: 78.5,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date(Date.now() - 82800000).toISOString(),
    },
    {
      id: "2",
      name: "Blog Content Audit",
      urls: [],
      totalUrls: 50,
      completedUrls: 48,
      failedUrls: 2,
      averageScore: 72.3,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      completedAt: new Date(Date.now() - 164700000).toISOString(),
    },
  ]);

  const handleStartAnalysis = async () => {
    if (!urls || !name) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter analysis name and URLs to analyze",
        variant: "destructive",
      });
      return;
    }

    const urlList = urls.split("\n").filter((url) => url.trim());
    if (urlList.length === 0) {
      toast({
        title: "No Valid URLs",
        description: "Please enter at least one valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create analysis result
      const newAnalysis: BulkAnalysisResult = {
        id: Date.now().toString(),
        name,
        urls: urlList.map((url, index) => ({
          id: `${index}`,
          url: url.trim(),
          status: "pending",
        })),
        totalUrls: urlList.length,
        completedUrls: 0,
        failedUrls: 0,
        averageScore: 0,
        createdAt: new Date().toISOString(),
      };

      setCurrentAnalysis(newAnalysis);

      // Mock API call with progress updates
      for (let i = 0; i < urlList.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setCurrentAnalysis((prev) => {
          if (!prev) return null;

          const updatedUrls = [...prev.urls];
          updatedUrls[i] = {
            ...updatedUrls[i],
            status: Math.random() > 0.1 ? "completed" : "error",
            seoScore: Math.floor(Math.random() * 40) + 60,
            issues: Math.floor(Math.random() * 10),
            warnings: Math.floor(Math.random() * 5),
            analyzedAt: new Date().toISOString(),
            errorMessage:
              Math.random() > 0.1 ? undefined : "Failed to analyze URL",
          };

          const completed = updatedUrls.filter(
            (u) => u.status === "completed"
          ).length;
          const failed = updatedUrls.filter((u) => u.status === "error").length;
          const scores = updatedUrls
            .filter((u) => u.status === "completed")
            .map((u) => u.seoScore);
          const avgScore =
            scores.length > 0
              ? scores.reduce((a, b) => a + b, 0) / scores.length
              : 0;

          return {
            ...prev,
            urls: updatedUrls,
            completedUrls: completed,
            failedUrls: failed,
            averageScore: avgScore,
            completedAt:
              completed + failed === prev.totalUrls
                ? new Date().toISOString()
                : undefined,
          };
        });
      }

      toast({
        title: "Analysis Complete",
        description: `Bulk analysis of ${urlList.length} URLs completed successfully`,
      });

      // Add to history
      if (currentAnalysis) {
        setHistory((prev) => [currentAnalysis, ...prev]);
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error running the bulk analysis",
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
            <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Please log in to access the Bulk Analysis tool
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
            <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Bulk Analysis is a premium feature. Upgrade to access this tool.
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />;
      case "analyzing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressPercentage = (analysis: BulkAnalysisResult) => {
    return Math.round(
      ((analysis.completedUrls + analysis.failedUrls) / analysis.totalUrls) *
        100
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bulk Analysis
          </h1>
          <p className="text-gray-600">
            Analyze multiple URLs at once and get comprehensive SEO insights
          </p>
        </div>

        {!currentAnalysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Bulk Analysis Configuration
                  </CardTitle>
                  <CardDescription>
                    Set up your bulk analysis to analyze multiple URLs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Analysis Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Product Pages Audit"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urls">URLs to Analyze *</Label>
                    <Textarea
                      id="urls"
                      placeholder="Enter URLs, one per line&#10;https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                      value={urls}
                      onChange={(e) => setUrls(e.target.value)}
                      className="w-full"
                      rows={8}
                    />
                    <div className="text-sm text-gray-600">
                      {urls.split("\n").filter((url) => url.trim()).length} URLs
                      entered
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="analysisType">Analysis Type</Label>
                      <Select
                        value={analysisType}
                        onValueChange={setAnalysisType}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seo">SEO Analysis</SelectItem>
                          <SelectItem value="performance">
                            Performance Analysis
                          </SelectItem>
                          <SelectItem value="content">
                            Content Analysis
                          </SelectItem>
                          <SelectItem value="technical">
                            Technical SEO
                          </SelectItem>
                          <SelectItem value="comprehensive">
                            Comprehensive Analysis
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notificationEmail">
                        Notification Email (Optional)
                      </Label>
                      <Input
                        id="notificationEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
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
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="deep-analysis"
                        checked={deepAnalysis}
                        onCheckedChange={setDeepAnalysis}
                      />
                      <Label htmlFor="deep-analysis">
                        Deep analysis (slower but more detailed)
                      </Label>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      What's included:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• SEO score calculation for each URL</li>
                      <li>• Technical issues detection</li>
                      <li>• Content quality assessment</li>
                      <li>• Performance metrics</li>
                      <li>• Competitive benchmarking</li>
                      {includeCompetitors && <li>• Competitor analysis</li>}
                      {deepAnalysis && (
                        <li>• In-depth page structure analysis</li>
                      )}
                    </ul>
                  </div>

                  <Button
                    onClick={handleStartAnalysis}
                    disabled={isLoading || !urls || !name}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white mr-2"></div>
                        Starting Analysis...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Start Bulk Analysis
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
                    <BarChart3 className="h-5 w-5" />
                    Analysis Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Save Time</h4>
                      <p className="text-sm text-gray-600">
                        Analyze hundreds of URLs at once
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Comprehensive Data</h4>
                      <p className="text-sm text-gray-600">
                        Get detailed insights for each page
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Track Progress</h4>
                      <p className="text-sm text-gray-600">
                        Monitor analysis in real-time
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {history.map((analysis) => (
                    <div key={analysis.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{analysis.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        {analysis.totalUrls} URLs • Avg score:{" "}
                        {analysis.averageScore.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Analysis Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {currentAnalysis.name}
                </CardTitle>
                <CardDescription>
                  Bulk analysis in progress -{" "}
                  {currentAnalysis.completedUrls + currentAnalysis.failedUrls}{" "}
                  of {currentAnalysis.totalUrls} URLs analyzed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{getProgressPercentage(currentAnalysis)}%</span>
                    </div>
                    <Progress
                      value={getProgressPercentage(currentAnalysis)}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {currentAnalysis.totalUrls}
                      </div>
                      <div className="text-sm text-gray-600">Total URLs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {currentAnalysis.completedUrls}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {currentAnalysis.failedUrls}
                      </div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                    <div>
                      <div
                        className={`text-2xl font-bold ${getScoreColor(currentAnalysis.averageScore)}`}
                      >
                        {currentAnalysis.averageScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Avg Score</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium text-sm text-gray-700 border-b">
                    <div>URL</div>
                    <div className="text-center">Status</div>
                    <div className="text-center">SEO Score</div>
                    <div className="text-center">Issues</div>
                    <div className="text-center">Warnings</div>
                    <div className="text-center">Actions</div>
                  </div>

                  {currentAnalysis.urls.map((url) => (
                    <div
                      key={url.id}
                      className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-gray-50"
                    >
                      <div className="truncate">
                        <a
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span className="truncate">{url.url}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>
                      <div className="text-center flex items-center justify-center">
                        {getStatusIcon(url.status)}
                      </div>
                      <div className="text-center">
                        {url.status === "completed" ? (
                          <span
                            className={`font-medium ${getScoreColor(url.seoScore)}`}
                          >
                            {url.seoScore}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="text-center">
                        {url.status === "completed" ? (
                          <span
                            className={
                              url.issues > 0 ? "text-red-600" : "text-green-600"
                            }
                          >
                            {url.issues}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="text-center">
                        {url.status === "completed" ? (
                          <span
                            className={
                              url.warnings > 0
                                ? "text-yellow-600"
                                : "text-green-600"
                            }
                          >
                            {url.warnings}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      <div className="text-center">
                        {url.status === "completed" ? (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setCurrentAnalysis(null)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Full Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
