"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  FileText,
  Loader2,
  AlertCircle,
  Upload,
  Database,
  Bot,
  CheckCircle,
  Download,
} from "lucide-react";

interface LogAnalysisResult {
  summary: {
    totalRequests: number;
    uniquePages: number;
    crawlBudget: number;
    botTraffic: number;
    errors: number;
  };
  topPages: Array<{ url: string; requests: number; status: number }>;
  issues: Array<{ type: string; title: string; description: string; count: number }>;
  recommendations: Array<{ title: string; description: string; priority: string }>;
}

export default function LogFileAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LogAnalysisResult | null>(null);
  const [error, setError] = useState("");

  const analyzeFile = async () => {
    if (!file) {
      setError("Please upload a log file");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/log-file-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, size: file.size }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || "Failed to analyze log file");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Log File Analyzer</h1>
          <p className="text-gray-600">
            Analyze server logs to understand crawl behavior and optimize your SEO strategy.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload Log File
            </CardTitle>
            <CardDescription>Upload server logs for SEO analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".log,.txt,.gz,.zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="log-file"
              />
              <label htmlFor="log-file" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-900 mb-2">
                  {file ? file.name : "Click to upload or drag and drop"}
                </div>
                <div className="text-sm text-gray-500">
                  Supported: .log, .txt, .gz, .zip (max 50MB)
                </div>
              </label>
            </div>
            <Button onClick={analyzeFile} disabled={isLoading || !file} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Analyze Log File
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

        {results && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Total Requests</div>
                  <div className="text-3xl font-bold text-blue-600">{results.summary.totalRequests.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Unique Pages</div>
                  <div className="text-3xl font-bold text-green-600">{results.summary.uniquePages.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Crawl Budget</div>
                  <div className="text-3xl font-bold text-purple-600">{results.summary.crawlBudget}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Errors</div>
                  <div className="text-3xl font-bold text-red-600">{results.summary.errors}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="pages" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pages">Top Pages</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="pages" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Most Crawled Pages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.topPages.map((page, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{page.url}</span>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{page.requests} requests</Badge>
                            <Badge>{page.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="issues" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detected Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">{issue.title}</div>
                            <div className="text-sm text-gray-600">{issue.description}</div>
                          </div>
                          <Badge variant="outline">{issue.count} occurrences</Badge>
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
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">{rec.title}</div>
                            <div className="text-sm text-gray-600">{rec.description}</div>
                          </div>
                          <Badge>{rec.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
