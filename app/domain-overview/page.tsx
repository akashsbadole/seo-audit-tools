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
import { toast } from "@/components/ui/use-toast";
import {
  Globe,
  BarChart3,
  Search,
  TrendingUp,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function DomainOverviewPage() {
  
  const [domain, setDomain] = useState("");
  const [includeCompetitors, setIncludeCompetitors] = useState(false);
  const [competitorDomains, setCompetitorDomains] = useState(["", "", ""]);
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

  const analyzeDomain = async () => {
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
      const response = await fetch("/api/domain-overview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          domain,
          includeCompetitors,
          competitorDomains: competitorDomains.filter((d) => d.trim() !== ""),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
        toast({
          title: "Analysis Complete",
          description: "Domain overview analysis completed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to analyze domain",
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Domain Overview
          </h1>
          <p className="text-gray-600">
            Get comprehensive insights about any domain including authority,
            traffic, backlinks, and technical SEO metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Domain Analysis
              </CardTitle>
              <CardDescription>Enter domain to analyze</CardDescription>
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
                onClick={analyzeDomain}
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
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analyze Domain
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
                  Comprehensive analysis for {results.domain.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Domain Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Domain Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Domain Age:</span>
                        <span className="font-medium">
                          {results.domain.age} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registrar:</span>
                        <span className="font-medium">
                          {results.domain.registrar}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nameservers:</span>
                        <span className="font-medium">
                          {results.domain.nameservers.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Authority */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Authority Metrics
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Domain Authority:</span>
                        <span className="font-medium">
                          {results.authority.domainAuthority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Page Authority:</span>
                        <span className="font-medium">
                          {results.authority.pageAuthority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spam Score:</span>
                        <span className="font-medium">
                          {results.authority.spamScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Traffic */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Traffic Estimates
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Organic Keywords:</span>
                        <span className="font-medium">
                          {results.traffic.organicKeywords?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Organic Traffic:</span>
                        <span className="font-medium">
                          {results.traffic.organicTraffic?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid Keywords:</span>
                        <span className="font-medium">
                          {results.traffic.paidKeywords?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Backlinks */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Backlink Profile
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Backlinks:</span>
                        <span className="font-medium">
                          {results.backlinks.totalBacklinks?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Referring Domains:
                        </span>
                        <span className="font-medium">
                          {results.backlinks.referringDomains?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New Backlinks:</span>
                        <span className="font-medium">
                          {results.backlinks.newBacklinks?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

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
