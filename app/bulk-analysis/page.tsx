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
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Loader2,
  AlertCircle,
  ExternalLink,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface UrlResult {
  url: string;
  status: "completed" | "error";
  seoScore: number;
  issues: number;
  warnings: number;
}

export default function BulkAnalysisPage() {
  const [name, setName] = useState("");
  const [urls, setUrls] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<UrlResult[] | null>(null);
  const [error, setError] = useState("");

  const startAnalysis = async () => {
    if (!urls.trim()) {
      setError("Please enter URLs to analyze");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bulk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          urls: urls.split("\n").filter(u => u.trim()),
          name 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
      } else {
        setError(data.error || "Failed to analyze URLs");
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

  const stats = results ? {
    total: results.length,
    completed: results.filter(r => r.status === "completed").length,
    avgScore: results.reduce((a, r) => a + r.seoScore, 0) / results.length,
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Analysis</h1>
          <p className="text-gray-600">
            Analyze multiple URLs at once and get comprehensive SEO insights.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Bulk URL Analysis
            </CardTitle>
            <CardDescription>Enter URLs to analyze (one per line)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Analysis name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={6}
            />
            <div className="text-xs text-gray-500">{urls.split("\n").filter(u => u.trim()).length} URLs entered</div>
            <Button onClick={startAnalysis} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Start Bulk Analysis
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

        {results && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Total URLs</div>
                  <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Completed</div>
                  <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Average Score</div>
                  <div className={`text-3xl font-bold ${getScoreColor(stats.avgScore)}`}>
                    {stats.avgScore.toFixed(1)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analysis Results</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.map((result, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {result.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 flex-1">
                          <span className="truncate">{result.url}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(result.seoScore)}`}>{result.seoScore}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{result.issues}</div>
                          <div className="text-xs text-gray-500">Issues</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">{result.warnings}</div>
                          <div className="text-xs text-gray-500">Warnings</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
