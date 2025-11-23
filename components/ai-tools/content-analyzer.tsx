"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Download,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";

interface AIAnalysis {
  id: string;
  analysisType: string;
  url: string;
  result: {
    score: number;
    recommendations: string[];
    insights: string[];
    competitorGaps: string[];
    contentOpportunities: string[];
    technicalIssues: string[];
  };
  createdAt: string;
}

export function ContentAnalyzer() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [analysisType, setAnalysisType] = useState<"seo" | "content" | "keywords">("seo");
  const [depth, setDepth] = useState(3);
  const [includeCompetitors, setIncludeCompetitors] = useState(false);
  const [language, setLanguage] = useState("en");
  const [results, setResults] = useState<AIAnalysis[]>([]);

  const fetchAnalyses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/ai/analyze', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.analyses);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch AI analyses",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching analyses",
        variant: "destructive",
      });
    }
  };

  const analyzeContent = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url,
          analysisType,
          options: {
            depth,
            includeCompetitors,
            language
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Analysis Complete",
          description: "AI analysis completed successfully",
        });
        // Refresh the analyses list
        fetchAnalyses();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to analyze content",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during analysis",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportAnalysis = (analysis: AIAnalysis) => {
    const exportData = {
      analysisId: analysis.id,
      url: analysis.url,
      analysisType: analysis.analysisType,
      result: analysis.result,
      createdAt: analysis.createdAt
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Content Analyzer
          </CardTitle>
          <CardDescription>
            Analyze your content with AI-powered insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              Please log in to access AI-powered content analysis
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Login to Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user.isPremium && results.length > 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Analysis Results
          </CardTitle>
          <CardDescription>
            You've reached your free limit. Upgrade to premium for unlimited AI analyses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
            <p className="text-muted-foreground mb-4">
              AI-powered content analysis is a premium feature. Upgrade to unlock unlimited analyses.
            </p>
            <Button onClick={() => window.location.href = '/upgrade'}>
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Content Analyzer
          </CardTitle>
          <CardDescription>
            Get AI-powered insights into your content quality, SEO performance, and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="url">Website URL *</Label>
              <Input
                id="url"
                placeholder="https://yourwebsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="analysis-type">Analysis Type</Label>
                  <select
                    id="analysis-type"
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value as "seo" | "content" | "keywords")}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="seo">SEO Analysis</option>
                    <option value="content">Content Quality</option>
                    <option value="keywords">Keyword Analysis</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="depth">Analysis Depth</Label>
                  <Input
                    id="depth"
                    type="number"
                    min="1"
                    max="5"
                    value={depth}
                    onChange={(e) => setDepth(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="language">Target Language</Label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include-competitors"
                    checked={includeCompetitors}
                    onChange={(e) => setIncludeCompetitors(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="include-competitors">Include Competitor Analysis</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={analyzeContent}
                disabled={isLoading || !url.trim()}
                className="w-full md:w-auto px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Content
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={fetchAnalyses}
                className="w-full md:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                View Previous Analyses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                Analysis Results
              </span>
              <Button variant="outline" size="sm" onClick={() => fetchAnalyses()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>
              AI-powered insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="gaps">Competitor Gaps</TabsTrigger>
                <TabsTrigger value="technical">Technical Issues</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">SEO Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${results[0].result.score >= 80 ? 'text-green-600' : results[0].result.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {results[0].result.score}
                        </div>
                        <div className="text-sm text-muted-foreground">/ 100</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Analysis Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <Badge variant="secondary" className="text-lg">
                          {results[0].analysisType.toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Analyzed URL</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground truncate">
                          {results[0].url}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <div className="space-y-3">
                  {results[0].result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="space-y-3">
                  {results[0].result.insights.map((insight, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">Insight #{index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{insight}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gaps" className="space-y-4">
                <div className="space-y-3">
                  {results[0].result.competitorGaps.map((gap, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <TrendingUp className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{gap}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="space-y-3">
                  {results[0].result.technicalIssues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{issue}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}