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
import { Progress } from "@/components/ui/progress";
import {
  Users,
  BarChart3,
  Search,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  Globe,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

interface CompetitorData {
  domain: string;
  authority: number;
  organicTraffic: number;
  organicKeywords: number;
  backlinks: number;
  changes: {
    traffic: number;
    keywords: number;
  };
  topKeywords: Array<{ keyword: string; position: number; volume: number }>;
  gaps: string[];
}

interface AnalysisResult {
  yourDomain: CompetitorData;
  competitors: CompetitorData[];
  keywordGaps: Array<{ keyword: string; competitorsRank: number; yourRank: number | null; volume: number }>;
  sharedKeywords: Array<{ keyword: string; positions: Record<string, number>; volume: number }>;
  opportunities: Array<{ keyword: string; difficulty: number; volume: number; reason: string }>;
}

export default function CompetitorAnalysisPage() {
  const [domain, setDomain] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const analyzeCompetitors = async () => {
    if (!domain.trim()) {
      setError("Please enter your domain");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          domain: domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
          competitors: competitors.split("\n").filter(c => c.trim()).slice(0, 5)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || "Failed to analyze competitors");
      }
    } catch (err) {
      setError("An error occurred during analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitor Analysis</h1>
          <p className="text-gray-600">
            Analyze your competitors' SEO strategies and identify opportunities to outrank them.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Compare Domains
            </CardTitle>
            <CardDescription>Enter your domain and up to 5 competitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Your Domain</label>
              <Input
                placeholder="yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Competitors (one per line)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="competitor1.com&#10;competitor2.com&#10;competitor3.com"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={analyzeCompetitors} disabled={isLoading} className="w-full">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[results.yourDomain, ...results.competitors].map((site, i) => (
                <Card key={i} className={i === 0 ? "border-orange-300 border-2" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {i === 0 && <Globe className="h-5 w-5 text-orange-500" />}
                        {site.domain}
                      </CardTitle>
                      {i === 0 && <Badge className="bg-orange-100 text-orange-800">Your Site</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Domain Authority</span>
                        <span className="font-bold text-lg">{site.authority}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Organic Traffic</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{site.organicTraffic.toLocaleString()}</span>
                          {getChangeIcon(site.changes.traffic)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Keywords</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{site.organicKeywords.toLocaleString()}</span>
                          {getChangeIcon(site.changes.keywords)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Backlinks</span>
                        <span className="font-medium">{site.backlinks.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keyword Gaps</CardTitle>
                  <CardDescription>Keywords competitors rank for but you don't</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.keywordGaps.map((gap, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{gap.keyword}</div>
                          <div className="text-xs text-gray-500">Vol: {gap.volume.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Competitor: #{gap.competitorsRank}</div>
                          <div className="text-sm text-red-600">You: Not ranking</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Opportunities</CardTitle>
                  <CardDescription>Keywords you should target</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.opportunities.map((opp, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">{opp.keyword}</div>
                          <div className="text-xs text-gray-600">{opp.reason}</div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">KD: {opp.difficulty}</Badge>
                          <div className="text-xs text-gray-500 mt-1">Vol: {opp.volume.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shared Keywords Comparison</CardTitle>
                <CardDescription>Keywords where multiple domains compete</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Keyword</th>
                        <th className="text-center p-3">Volume</th>
                        <th className="text-center p-3">{results.yourDomain.domain}</th>
                        {results.competitors.map((c, i) => (
                          <th key={i} className="text-center p-3">{c.domain}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.sharedKeywords.map((kw, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{kw.keyword}</td>
                          <td className="p-3 text-center text-sm text-gray-600">{kw.volume.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <Badge variant="outline">#{kw.positions[results.yourDomain.domain] || '-'}</Badge>
                          </td>
                          {results.competitors.map((c, ci) => (
                            <td key={ci} className="p-3 text-center">
                              <Badge variant="outline">#{kw.positions[c.domain] || '-'}</Badge>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
