"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Loader2,
  AlertCircle,
  Plus,
  Download,
  Eye,
  ExternalLink,
  Target,
} from "lucide-react";

interface KeywordRank {
  id: string;
  keyword: string;
  url: string;
  currentRank: number;
  previousRank: number;
  change: number;
  searchVolume: number;
  competition: string;
  lastChecked: string;
}

interface TrackingResult {
  domain: string;
  keywords: KeywordRank[];
  stats: {
    totalKeywords: number;
    averageRank: number;
    improved: number;
    declined: number;
    unchanged: number;
  };
}

export default function PositionTrackingPage() {
  const [domain, setDomain] = useState("");
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("us");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");

  const startTracking = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/position-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
          keywords: keywords.split("\n").filter(k => k.trim()),
          location,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || "Failed to track positions");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Position Tracking</h1>
          <p className="text-gray-600">
            Track your keyword rankings over time and monitor SEO performance.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Track Keywords
            </CardTitle>
            <CardDescription>Enter domain and keywords to track rankings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Domain</label>
                <Input
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={startTracking} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Track Positions
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Keywords (one per line, optional)</label>
              <Textarea
                placeholder="keyword 1&#10;keyword 2&#10;keyword 3"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={3}
              />
            </div>
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Keywords</span>
                    <Search className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{results.stats.totalKeywords}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Average Rank</span>
                    <Target className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{results.stats.averageRank.toFixed(1)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Improved</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">{results.stats.improved}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Declined</span>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">{results.stats.declined}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Tracked Keywords</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Keyword</th>
                        <th className="text-left p-3">URL</th>
                        <th className="text-center p-3">Current</th>
                        <th className="text-center p-3">Previous</th>
                        <th className="text-center p-3">Change</th>
                        <th className="text-center p-3">Volume</th>
                        <th className="text-center p-3">Competition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.keywords.map((kw) => (
                        <tr key={kw.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{kw.keyword}</td>
                          <td className="p-3">
                            <a href={kw.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                              <span className="truncate max-w-[200px]">{kw.url}</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </td>
                          <td className="p-3 text-center">
                            <Badge className="bg-green-100 text-green-800">#{kw.currentRank}</Badge>
                          </td>
                          <td className="p-3 text-center text-gray-600">#{kw.previousRank}</td>
                          <td className={`p-3 text-center flex items-center justify-center gap-1 ${getChangeColor(kw.change)}`}>
                            {getChangeIcon(kw.change)}
                            <span className="font-medium">{kw.change > 0 ? "+" : ""}{kw.change}</span>
                          </td>
                          <td className="p-3 text-center">{kw.searchVolume.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <Badge variant="outline">{kw.competition}</Badge>
                          </td>
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
