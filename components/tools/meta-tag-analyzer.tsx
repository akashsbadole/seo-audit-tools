"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  RefreshCw,
  Download,
  FileText,
  Copy,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

interface MetaTagAnalysis {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string;
  h1: string[];
  h2: string[];
  metaTags: string[];
  ogTags: Array<{ property: string; content: string }>;
  twitterTags: Array<{ name: string; content: string }>;
  canonical: string;
  robots: string;
  viewport: string;
  charset: string;
  language: string;
  favicon: string;
  issues: string[];
  recommendations: string[];
  score: number;
  createdAt: string;
}

export function MetaTagAnalyzer() {
  const [url, setUrl] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<MetaTagAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<MetaTagAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
    fetchAnalysisHistory();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const response = await fetch('/api/user/premium-status');
      const data = await response.json();
      setIsPremium(data.isPremium);
    } catch (error) {
      console.error('Failed to check premium status:', error);
    }
  };

  const fetchAnalysisHistory = async () => {
    try {
      const response = await fetch('/api/tools/meta-analyzer');
      const data = await response.json();
      setAnalysisHistory(data);
    } catch (error) {
      console.error('Failed to fetch analysis history:', error);
    }
  };

  const analyzeUrl = async () => {
    if (!url) return;

    setLoading(true);
    try {
      const response = await fetch('/api/tools/meta-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCurrentAnalysis(data.analysis);
        fetchAnalysisHistory(); // Refresh history
      } else {
        alert(data.error || 'Failed to analyze meta tags');
      }
    } catch (error) {
      console.error('Error analyzing meta tags:', error);
      alert('Failed to analyze meta tags');
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (analysis: MetaTagAnalysis) => {
    const reportData = {
      url: analysis.url,
      score: analysis.score,
      title: analysis.title,
      description: analysis.description,
      keywords: analysis.keywords,
      h1: analysis.h1,
      h2: analysis.h2,
      canonical: analysis.canonical,
      viewport: analysis.viewport,
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      analyzedAt: analysis.createdAt
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `meta-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Meta Tag Analyzer
            <Badge variant="outline" className="ml-2">
              Premium
            </Badge>
          </CardTitle>
          <CardDescription>
            Analyze page titles, meta descriptions, headers (H1-H6), and other SEO elements.
            Get comprehensive recommendations for better search engine optimization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Page URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>
          
          <GradientButton
            onClick={analyzeUrl}
            disabled={loading || !url}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze Meta Tags
              </>
            )}
          </GradientButton>
        </CardContent>
      </GlassCard>

      {/* Analysis Results */}
      {currentAnalysis && (
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results: {new URL(currentAnalysis.url).hostname}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-lg font-bold ${getScoreColor(currentAnalysis.score)}`}>
                  Score: {currentAnalysis.score}/100
                </Badge>
                <span className={`font-medium ${getScoreColor(currentAnalysis.score)}`}>
                  {getScoreLabel(currentAnalysis.score)}
                </span>
              </div>
            </CardTitle>
            <CardDescription>
              Analyzed on: {new Date(currentAnalysis.createdAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Meta Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Basic Meta Tags</h4>
                
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <div className="flex items-center gap-2">
                      <Input value={currentAnalysis.title} readOnly className="font-mono text-sm" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentAnalysis.title)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentAnalysis.title.length} characters (recommended: 30-60)
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <div className="flex items-start gap-2">
                      <textarea
                        value={currentAnalysis.description}
                        readOnly
                        className="font-mono text-sm w-full h-20 p-2 border rounded resize-none"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentAnalysis.description)}
                        className="h-8 w-8 p-0 mt-1"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentAnalysis.description.length} characters (recommended: 120-160)
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Keywords</Label>
                    <div className="flex items-center gap-2">
                      <Input value={currentAnalysis.keywords} readOnly className="font-mono text-sm" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentAnalysis.keywords)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Tags */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Header Tags</h4>
                
                <div>
                  <Label className="text-sm font-medium">H1 Tags</Label>
                  {currentAnalysis.h1.length > 0 ? (
                    <div className="space-y-1">
                      {currentAnalysis.h1.map((h1, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={h1} readOnly className="font-mono text-sm" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(h1)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No H1 tags found</div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">H2 Tags</Label>
                  {currentAnalysis.h2.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {currentAnalysis.h2.map((h2, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={h2} readOnly className="font-mono text-sm" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(h2)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No H2 tags found</div>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Meta Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Technical Meta Tags</h4>
                
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium">Canonical URL</Label>
                    <div className="flex items-center gap-2">
                      <Input value={currentAnalysis.canonical} readOnly className="font-mono text-sm" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentAnalysis.canonical)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Viewport</Label>
                    <div className="flex items-center gap-2">
                      <Input value={currentAnalysis.viewport} readOnly className="font-mono text-sm" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentAnalysis.viewport)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Robots</Label>
                    <div className="flex items-center gap-2">
                      <Input value={currentAnalysis.robots} readOnly className="font-mono text-sm" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentAnalysis.robots)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Language</Label>
                    <div className="flex items-center gap-2">
                      <Input value={currentAnalysis.language} readOnly className="font-mono text-sm" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentAnalysis.language)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Tags */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Social Media Tags</h4>
                
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium">Open Graph Tags</Label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {currentAnalysis.ogTags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={`og:${tag.property}: ${tag.content}`} readOnly className="font-mono text-sm" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${tag.property}: ${tag.content}`)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Twitter Card Tags</Label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {currentAnalysis.twitterTags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={`twitter:${tag.name}: ${tag.content}`} readOnly className="font-mono text-sm" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${tag.name}: ${tag.content}`)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues and Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Issues Found
                </h4>
                {currentAnalysis.issues.length > 0 ? (
                  <div className="space-y-2">
                    {currentAnalysis.issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-orange-800">{issue}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">No critical issues found!</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Recommendations
                </h4>
                {currentAnalysis.recommendations.length > 0 && (
                  <div className="space-y-2">
                    {currentAnalysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => exportResults(currentAnalysis)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Analysis
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <GlassCard>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>
              Your previous meta tag analyses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisHistory.slice(0, 5).map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setCurrentAnalysis(analysis)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`font-medium ${getScoreColor(analysis.score)}`}>
                      {analysis.score}/100
                    </div>
                    <div>
                      <div className="font-medium">
                        {new URL(analysis.url).hostname}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        exportResults(analysis);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}

export default MetaTagAnalyzer;