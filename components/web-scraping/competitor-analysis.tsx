"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Globe, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Link2, 
  Image, 
  Target,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";

interface CompetitorData {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  headings: { h1: number; h2: number; h3: number };
  links: { internal: number; external: number };
  images: number;
  loadTime: number;
  wordCount: number;
  score?: number;
}

interface AnalysisResult {
  target: CompetitorData;
  competitors: CompetitorData[];
  comparison: {
    targetScore: number;
    competitorScores: number[];
    recommendations: string[];
  };
}

export function CompetitorAnalysis() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [competitorUrls, setCompetitorUrls] = useState(["", "", "", ""]);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleAddCompetitor = () => {
    if (competitorUrls.length < 10) {
      setCompetitorUrls([...competitorUrls, ""]);
    }
  };

  const handleRemoveCompetitor = (index: number) => {
    setCompetitorUrls(competitorUrls.filter((_, i) => i !== index));
  };

  const handleCompetitorChange = (index: number, value: string) => {
    const newUrls = [...competitorUrls];
    newUrls[index] = value;
    setCompetitorUrls(newUrls);
  };

  const analyzeCompetitors = async () => {
    if (!targetUrl) {
      toast({
        title: "Error",
        description: "Please enter your website URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/scraping/competitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUrl,
          competitorUrls: competitorUrls.filter(url => url.trim() !== ""),
          analysisDepth: 1
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
        toast({
          title: "Analysis Complete",
          description: "Successfully analyzed your website and competitors",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to analyze websites",
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

  const exportResults = () => {
    if (!results) return;

    const exportData = {
      analysisDate: new Date().toISOString(),
      target: results.target,
      competitors: results.competitors,
      comparison: results.comparison
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitor-analysis-${Date.now()}.json`;
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
            <Globe className="h-6 w-6" />
            Competitor Analysis
          </CardTitle>
          <CardDescription>
            Analyze your website against competitors to identify SEO opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              Please log in to access the competitor analysis tool
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Login to Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user.isPremium && results) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
            <p className="text-muted-foreground mb-4">
              Competitor analysis is a premium feature. Upgrade to unlock full access.
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
            <Search className="h-6 w-6" />
            Competitor Analysis Tool
          </CardTitle>
          <CardDescription>
            Enter your website URL and up to 10 competitor URLs to analyze and compare SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="target-url">Your Website URL *</Label>
              <Input
                id="target-url"
                placeholder="https://yourwebsite.com"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Competitor URLs</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCompetitor}
                  disabled={competitorUrls.length >= 10}
                >
                  Add Competitor
                </Button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {competitorUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="https://competitor.com"
                      value={url}
                      onChange={(e) => handleCompetitorChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {competitorUrls.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveCompetitor(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={analyzeCompetitors}
              disabled={isLoading || !targetUrl.trim()}
              className="w-full lg:w-auto px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyze Competitors
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Analysis Results
              </span>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
            <CardDescription>
              Comprehensive SEO comparison between your website and competitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="target">Your Site</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Your SEO Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600">
                          {results.comparison.targetScore}
                        </div>
                        <div className="text-sm text-muted-foreground">/ 100</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Avg Competitor Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-600">
                          {Math.round(results.comparison.competitorScores.reduce((a, b) => a + b, 0) / results.comparison.competitorScores.length)}
                        </div>
                        <div className="text-sm text-muted-foreground">/ 100</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Performance Gap</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${results.comparison.targetScore > results.comparison.competitorScores.reduce((a, b) => a + b, 0) / results.comparison.competitorScores.length ? 'text-green-600' : 'text-red-600'}`}>
                          {results.comparison.targetScore > results.comparison.competitorScores.reduce((a, b) => a + b, 0) / results.comparison.competitorScores.length ? '+' : ''}
                          {Math.abs(results.comparison.targetScore - Math.round(results.comparison.competitorScores.reduce((a, b) => a + b, 0) / results.comparison.competitorScores.length))}
                        </div>
                        <div className="text-sm text-muted-foreground">points difference</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="target" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: "Title", value: results.target.title, icon: <Globe className="h-4 w-4" /> },
                    { label: "Load Time", value: `${results.target.loadTime}ms`, icon: <Clock className="h-4 w-4" /> },
                    { label: "Word Count", value: results.target.wordCount.toLocaleString(), icon: <BarChart3 className="h-4 w-4" /> },
                    { label: "H1 Tags", value: results.target.headings.h1, icon: <Target className="h-4 w-4" /> },
                    { label: "H2 Tags", value: results.target.headings.h2, icon: <Target className="h-4 w-4" /> },
                    { label: "Internal Links", value: results.target.links.internal, icon: <Link2 className="h-4 w-4" /> },
                    { label: "Images", value: results.target.images, icon: <Image className="h-4 w-4" /> },
                  ].map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          {stat.icon}
                          <span className="font-medium">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.target.keywords.slice(0, 10).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="competitors" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {results.competitors.map((competitor, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {competitor.url.replace(/^https?:\/\//, '').split('/')[0]}
                        </CardTitle>
                        <CardDescription>SEO Score: {calculateSEOScore(competitor)}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <p><strong>Title:</strong> {competitor.title}</p>
                          <p><strong>Load Time:</strong> {competitor.loadTime}ms</p>
                          <p><strong>Keywords:</strong> {competitor.keywords.length}</p>
                          <p><strong>Internal Links:</strong> {competitor.links.internal}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <div className="space-y-3">
                  {results.comparison.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
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

function calculateSEOScore(data: CompetitorData): number {
  let score = 0;
  
  if (data.title && data.title.length >= 30 && data.title.length <= 60) score += 20;
  else if (data.title && data.title.length > 0) score += 10;
  
  if (data.description && data.description.length >= 120 && data.description.length <= 160) score += 15;
  else if (data.description && data.description.length > 0) score += 8;
  
  if (data.headings.h1 === 1) score += 10;
  if (data.headings.h2 > 0) score += 5;
  if (data.headings.h3 > 0) score += 5;
  
  if (data.wordCount >= 300 && data.wordCount <= 2000) score += 15;
  else if (data.wordCount >= 100) score += 8;
  
  if (data.links.internal >= 5) score += 15;
  else if (data.links.internal >= 2) score += 8;
  
  if (data.images >= 3) score += 10;
  else if (data.images >= 1) score += 5;
  
  if (data.loadTime <= 2000) score += 5;
  else if (data.loadTime <= 3000) score += 2;
  
  return Math.min(score, 100);
}