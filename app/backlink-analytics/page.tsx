"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Link2,
  BarChart3,
  Search,
  Globe,
  TrendingUp,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface BacklinkData {
  domain: string;
  totalBacklinks: number;
  referringDomains: number;
  newBacklinks: number;
  lostBacklinks: number;
  domainAuthority: number;
  spamScore: number;
  topReferringDomains: Array<{ domain: string; backlinks: number; authority: number }>;
  anchorTexts: Array<{ text: string; count: number; type: string }>;
  linkTypes: { dofollow: number; nofollow: number };
  topPages: Array<{ url: string; backlinks: number }>;
}

export default function BacklinkAnalyticsPage() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BacklinkData | null>(null);
  const [error, setError] = useState("");

  const analyzeBacklinks = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/backlink-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.replace(/^https?:\/\//, "").replace(/\/$/, "") }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || "Failed to analyze backlinks");
      }
    } catch (err) {
      setError("An error occurred during analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Backlink Analytics</h1>
          <p className="text-gray-600">
            Analyze backlink profiles, domain authority, and linking patterns to improve your SEO.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Analyze Backlinks
            </CardTitle>
            <CardDescription>Enter a domain to analyze its backlink profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyzeBacklinks()}
                className="flex-1"
              />
              <Button onClick={analyzeBacklinks} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Backlinks</span>
                    <Link2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {results.totalBacklinks.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Referring Domains</span>
                    <Globe className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {results.referringDomains.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Domain Authority</span>
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {results.domainAuthority}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Spam Score</span>
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className={`text-3xl font-bold ${results.spamScore <= 3 ? "text-green-600" : results.spamScore <= 7 ? "text-yellow-600" : "text-red-600"}`}>
                    {results.spamScore}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">New Backlinks (30 days)</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">+{results.newBacklinks.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Lost Backlinks (30 days)</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">-{results.lostBacklinks.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Link Types</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Dofollow</span>
                        <span className="font-medium">{results.linkTypes.dofollow}%</span>
                      </div>
                      <Progress value={results.linkTypes.dofollow} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Nofollow</span>
                        <span className="font-medium">{results.linkTypes.nofollow}%</span>
                      </div>
                      <Progress value={results.linkTypes.nofollow} className="h-2 bg-gray-200 [&>div]:bg-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="referring" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="referring">Referring Domains</TabsTrigger>
                <TabsTrigger value="anchors">Anchor Text</TabsTrigger>
                <TabsTrigger value="pages">Top Linked Pages</TabsTrigger>
              </TabsList>

              <TabsContent value="referring" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {results.topReferringDomains.map((ref, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium">{ref.domain}</div>
                              <div className="text-xs text-gray-500">Authority: {ref.authority}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-600">{ref.backlinks.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">backlinks</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="anchors" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {results.anchorTexts.map((anchor, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">"{anchor.text}"</div>
                            <Badge variant="outline" className="mt-1">{anchor.type}</Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{anchor.count.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">occurrences</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pages" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {results.topPages.map((page, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 flex-1">
                            <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate">{page.url}</span>
                          </div>
                          <div className="font-bold text-blue-600">{page.backlinks.toLocaleString()}</div>
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
