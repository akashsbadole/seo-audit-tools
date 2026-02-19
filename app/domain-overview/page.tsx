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
  Globe,
  BarChart3,
  Search,
  TrendingUp,
  Shield,
  Loader2,
  AlertCircle,
  Users,
  Link2,
  ExternalLink,
} from "lucide-react";

interface DomainData {
  domain: string;
  authority: {
    domainAuthority: number;
    pageAuthority: number;
    spamScore: number;
  };
  traffic: {
    organicKeywords: number;
    organicTraffic: number;
    paidKeywords: number;
    paidTraffic: number;
  };
  backlinks: {
    totalBacklinks: number;
    referringDomains: number;
    newBacklinks: number;
    lostBacklinks: number;
  };
  technical: {
    ssl: boolean;
    mobile: boolean;
    speed: number;
    indexPages: number;
  };
  topKeywords: Array<{ keyword: string; position: number; volume: number; url: string }>;
  topPages: Array<{ url: string; traffic: number; keywords: number }>;
  competitors: Array<{ domain: string; authority: number; keywords: number }>;
}

export default function DomainOverviewPage() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DomainData | null>(null);
  const [error, setError] = useState("");

  const analyzeDomain = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain to analyze");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/domain-overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.replace(/^https?:\/\//, "").replace(/\/$/, "") }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || "Failed to analyze domain");
      }
    } catch (err) {
      setError("An error occurred during analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-100";
    if (score >= 40) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Domain Overview</h1>
          <p className="text-gray-600">
            Get comprehensive insights about any domain including authority, traffic, backlinks, and technical SEO metrics.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Analyze Domain
            </CardTitle>
            <CardDescription>Enter a domain to get comprehensive analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyzeDomain()}
                className="flex-1"
              />
              <Button onClick={analyzeDomain} disabled={isLoading}>
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
                    <span className="text-sm text-gray-600">Domain Authority</span>
                    <Globe className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(results.authority.domainAuthority)}`}>
                    {results.authority.domainAuthority}
                  </div>
                  <Progress value={results.authority.domainAuthority} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Organic Traffic</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {results.traffic.organicTraffic.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {results.traffic.organicKeywords.toLocaleString()} keywords
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Backlinks</span>
                    <Link2 className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {results.backlinks.totalBacklinks.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {results.backlinks.referringDomains.toLocaleString()} referring domains
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Spam Score</span>
                    <Shield className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className={`text-3xl font-bold ${results.authority.spamScore <= 3 ? "text-green-600" : results.authority.spamScore <= 7 ? "text-yellow-600" : "text-red-600"}`}>
                    {results.authority.spamScore}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {results.authority.spamScore <= 3 ? "Low risk" : results.authority.spamScore <= 7 ? "Medium risk" : "High risk"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Organic Keywords</CardTitle>
                  <CardDescription>Keywords driving traffic to this domain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.topKeywords.map((kw, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{kw.keyword}</div>
                          <div className="text-xs text-gray-500 truncate">{kw.url}</div>
                        </div>
                        <div className="text-right ml-4">
                          <Badge variant="outline">#{kw.position}</Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {kw.volume.toLocaleString()} vol
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Pages</CardTitle>
                  <CardDescription>Pages with most organic traffic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.topPages.map((page, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm truncate">{page.url}</span>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-medium">{page.traffic.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{page.keywords} keywords</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical SEO</CardTitle>
                  <CardDescription>Technical health of the domain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <Badge className={results.technical.ssl ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {results.technical.ssl ? "Valid" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile Friendly</span>
                      <Badge className={results.technical.mobile ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {results.technical.mobile ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Page Speed Score</span>
                      <span className={`font-medium ${getScoreColor(results.technical.speed)}`}>
                        {results.technical.speed}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Indexed Pages</span>
                      <span className="font-medium">{results.technical.indexPages.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Top Competitors
                  </CardTitle>
                  <CardDescription>Similar domains in search results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.competitors.map((comp, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{comp.domain}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            {comp.keywords.toLocaleString()} keywords
                          </span>
                          <Badge variant="outline">DA: {comp.authority}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
