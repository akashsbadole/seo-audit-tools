"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  PenTool,
  Loader2,
  AlertCircle,
  Brain,
  Hash,
  FileText,
  Copy,
  Lightbulb,
} from "lucide-react";

interface AnalysisResult {
  seoScore: number;
  readabilityScore: number;
  wordCount: number;
  keywordDensity: number;
  suggestions: Array<{
    type: string;
    title: string;
    description: string;
    impact: string;
  }>;
  optimizedContent: string;
}

export default function WritingAssistantPage() {
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const analyzeContent = async () => {
    if (!content.trim()) {
      setError("Please enter some content");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/writing-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, keyword }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to analyze content");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getImpactColor = (impact: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[impact] || "bg-gray-100 text-gray-800";
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimizedContent);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Writing Assistant</h1>
          <p className="text-gray-600">
            Optimize your content for search engines with AI-powered analysis and suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                Content Analysis
              </CardTitle>
              <CardDescription>Paste your content to analyze and optimize</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Target Keyword (optional)</label>
                <Input
                  placeholder="Enter your target keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Content</label>
                <Textarea
                  placeholder="Paste your content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
                <div className="text-xs text-gray-500 mt-1">{content.split(/\s+/).filter(w => w).length} words</div>
              </div>
              <Button onClick={analyzeContent} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Content
                  </>
                )}
              </Button>
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Content Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">SEO Score</span>
                    <span className={`font-bold ${getScoreColor(result.seoScore)}`}>{result.seoScore}/100</span>
                  </div>
                  <Progress value={result.seoScore} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Readability</span>
                    <span className={`font-bold ${getScoreColor(result.readabilityScore)}`}>{result.readabilityScore}/100</span>
                  </div>
                  <Progress value={result.readabilityScore} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.wordCount}</div>
                    <div className="text-xs text-gray-500">Word Count</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{result.keywordDensity}%</div>
                    <div className="text-xs text-gray-500">Keyword Density</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {result && (
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Optimization Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{s.title}</span>
                          <Badge className={getImpactColor(s.impact)}>{s.impact} impact</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Optimized Content
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 rounded-lg font-mono text-sm whitespace-pre-wrap">
                  {result.optimizedContent}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
