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
import { toast } from "@/components/ui/use-toast";
import {
  Link2,
  BarChart3,
  Search,
  Globe,
  TrendingUp,
  Shield,
  Loader2,
  AlertCircle,
  Target,
  ExternalLink,
} from "lucide-react";

export default function BacklinkAnalyticsPage() {
  const [domain, setDomain] = useState("");
  const [includeCompetitors, setIncludeCompetitors] = useState(false);
  const [competitorDomains, setCompetitorDomains] = useState(["", "", ""]);
  const [maxBacklinks, setMaxBacklinks] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAddCompetitor = () => {
    if (competitorDomains.length < 5) {
      setCompetitorDomains([...competitorDomains, ""]);
    }
  };

  const handleRemoveCompetitor = (index: number) => {
    const newDomains = competitorDomains.filter((_, i) => i !== index);
    setCompetitorDomains(newDomains);
  };

  const handleCompetitorChange = (index: number, value: string) => {
    const newDomains = [...competitorDomains];
    newDomains[index] = value;
    setCompetitorDomains(newDomains);
  };

  const analyzeBacklinks = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/backlink-analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          domain,
          includeCompetitors,
          competitorDomains: competitorDomains.filter((d) => d.trim() !== ""),
          maxBacklinks,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
        toast({
          title: "Analysis Complete",
          description: "Backlink analysis completed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to analyze backlinks",
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link2 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access the backlink analytics tool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="w-full"
            >
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user.isPremium && results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <BarChart3 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Backlink analytics is a premium feature. Upgrade to unlock full
              access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/upgrade")}
              className="w-full"
            >
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Backlink Analytics
          </h1>
          <p className="text-gray-600">
            Analyze backlink profiles, domain authority, and linking patterns to
            improve your SEO strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Backlink Analysis
              </CardTitle>
              <CardDescription>
                Enter domain to analyze backlinks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain *
                </label>
                <Input
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Backlinks
                </label>
                <select
                  value={maxBacklinks}
                  onChange={(e) => setMaxBacklinks(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[hsl(var(--seoaudit-orange))] focus:border-transparent"
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="competitors"
                    checked={includeCompetitors}
                    onChange={(e) => setIncludeCompetitors(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="competitors"
                    className="text-sm font-medium text-gray-700"
                  >
                    Include competitor analysis
                  </label>
                </div>

                {includeCompetitors && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Competitor Domains
                    </label>
                    {competitorDomains.map((compDomain, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="competitor.com"
                          value={compDomain}
                          onChange={(e) =>
                            handleCompetitorChange(index, e.target.value)
                          }
                          className="flex-1"
                        />
                        {competitorDomains.length > 1 && (
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
                    {competitorDomains.length < 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddCompetitor}
                        className="w-full"
                      >
                        Add Competitor
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={analyzeBacklinks}
                disabled={isLoading || !domain.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Analyze Backlinks
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Analysis Results
                  </span>
                  <Badge variant="secondary">
                    Score: {results.score.overall}/100
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Comprehensive backlink analysis for {results.domain}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="referring">
                      Referring Domains
                    </TabsTrigger>
                    <TabsTrigger value="anchor">Anchor Text</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-blue-600">
                          {results.totalBacklinks?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Backlinks
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-green-600">
                          {results.referringDomains?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Referring Domains
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-orange-600">
                          {results.newBacklinks?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          New Backlinks
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-red-600">
                          {results.lostBacklinks?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Lost Backlinks
                        </div>
                      </div>
                    </div>

                    {/* Authority Score */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Authority Metrics
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">
                            Domain Authority
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            {results.domainAuthority}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Spam Score
                          </div>
                          <div className="text-xl font-bold text-red-600">
                            {results.spamScore}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Competitor Analysis */}
                    {results.competitors && results.competitors.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Competitor Comparison
                        </h3>
                        <div className="space-y-2">
                          {results.competitors.map(
                            (comp: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="font-medium">{comp.domain}</div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-600">
                                    BL: {comp.totalBacklinks}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    DA: {comp.domainAuthority}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="referring" className="space-y-4">
                    {results.topReferringDomains &&
                      results.topReferringDomains.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Top Referring Domains
                          </h3>
                          <div className="space-y-2">
                            {results.topReferringDomains
                              .slice(0, 10)
                              .map((domain: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <Globe className="h-5 w-5 text-blue-600" />
                                    <div>
                                      <div className="font-medium">
                                        {domain.domain}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Authority: {domain.authority}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-blue-600">
                                      {domain.backlinks}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      backlinks
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </TabsContent>

                  <TabsContent value="anchor" className="space-y-4">
                    {results.anchorTexts && results.anchorTexts.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Anchor Text Analysis
                        </h3>
                        <div className="space-y-2">
                          {results.anchorTexts.map(
                            (anchor: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                              >
                                <div className="flex-1">
                                  <div className="font-medium">
                                    "{anchor.text}"
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Type: {anchor.type}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-blue-600">
                                    {anchor.count}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    occurrences
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="trends" className="space-y-4">
                    {results.trends && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Link Trends
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">
                              New Links
                            </h4>
                            <div className="space-y-1">
                              {results.trends.newLinks
                                ?.slice(-3)
                                .map((link: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-600">
                                      {new Date(link.date).toLocaleDateString()}
                                    </span>
                                    <span className="font-medium text-green-600">
                                      +{link.count}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Lost Links
                            </h4>
                            <div className="space-y-1">
                              {results.trends.lostLinks
                                ?.slice(-3)
                                .map((link: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-600">
                                      {new Date(link.date).toLocaleDateString()}
                                    </span>
                                    <span className="font-medium text-red-600">
                                      -{link.count}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Authority Growth
                            </h4>
                            <div className="space-y-1">
                              {results.trends.authorityGrowth
                                ?.slice(-3)
                                .map((auth: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-600">
                                      {new Date(auth.date).toLocaleDateString()}
                                    </span>
                                    <span className="font-medium text-blue-600">
                                      {auth.authority}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Recommendations */}
                {results.recommendations &&
                  results.recommendations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recommendations
                      </h3>
                      <div className="space-y-2">
                        {results.recommendations.map(
                          (rec: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg"
                            >
                              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{rec}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
