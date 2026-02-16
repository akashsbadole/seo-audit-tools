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
  Search,
  TrendingUp,
  BarChart3,
  Globe,
  Loader2,
  AlertCircle,
  Target,
  Star,
} from "lucide-react";

export default function KeywordResearchPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("us");
  const [language, setLanguage] = useState("en");
  const [includeRelated, setIncludeRelated] = useState(true);
  const [includeSuggestions, setIncludeSuggestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const researchKeyword = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a keyword to research",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/keyword-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          keyword,
          location,
          language,
          includeRelated,
          includeSuggestions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
        toast({
          title: "Research Complete",
          description: "Keyword research completed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to research keyword",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during research",
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
            <Search className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access keyword research tool
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
            <TrendingUp className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Keyword research is a premium feature. Upgrade to unlock full
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
            Keyword Research
          </h1>
          <p className="text-gray-600">
            Discover profitable keywords with advanced research tools, search
            volume, competition analysis, and SERP features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Research Keyword
              </CardTitle>
              <CardDescription>Enter keyword to analyze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keyword *
                </label>
                <Input
                  placeholder="Enter keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[hsl(var(--seoaudit-orange))] focus:border-transparent"
                  >
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[hsl(var(--seoaudit-orange))] focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="related"
                    checked={includeRelated}
                    onChange={(e) => setIncludeRelated(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="related"
                    className="text-sm font-medium text-gray-700"
                  >
                    Include related keywords
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="suggestions"
                    checked={includeSuggestions}
                    onChange={(e) => setIncludeSuggestions(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="suggestions"
                    className="text-sm font-medium text-gray-700"
                  >
                    Include content suggestions
                  </label>
                </div>
              </div>

              <Button
                onClick={researchKeyword}
                disabled={isLoading || !keyword.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Research Keyword
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
                    <BarChart3 className="h-5 w-5" />
                    Research Results
                  </span>
                  <Badge variant="secondary">
                    Score: {results.score.overall}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis for "{results.keyword}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="related">Related</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="opportunities">
                      Opportunities
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-blue-600">
                          {results.searchVolume?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Search Volume
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-orange-600">
                          {results.difficulty}
                        </div>
                        <div className="text-sm text-gray-600">Difficulty</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-green-600">
                          ${results.cpc?.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">CPC</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.competition}
                        </div>
                        <div className="text-sm text-gray-600">Competition</div>
                      </div>
                    </div>

                    {/* SERP Features */}
                    {results.serpFeatures &&
                      results.serpFeatures.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            SERP Features
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {results.serpFeatures.map(
                              (feature: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant={
                                    feature.present ? "default" : "secondary"
                                  }
                                >
                                  {feature.type
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </TabsContent>

                  <TabsContent value="related" className="space-y-4">
                    {results.relatedKeywords &&
                      results.relatedKeywords.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Related Keywords
                          </h3>
                          <div className="space-y-2">
                            {results.relatedKeywords
                              .slice(0, 10)
                              .map((kw: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {kw.keyword}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Relevance: {kw.relevance}%
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-600">
                                      Vol: {kw.volume}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Diff: {kw.difficulty}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </TabsContent>

                  <TabsContent value="suggestions" className="space-y-4">
                    {results.suggestions && results.suggestions.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Content Suggestions
                        </h3>
                        <div className="space-y-2">
                          {results.suggestions.map(
                            (suggestion: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {suggestion.keyword}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Type: {suggestion.type}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-600">
                                    Vol: {suggestion.volume}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="opportunities" className="space-y-4">
                    {results.opportunities &&
                      results.opportunities.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Opportunities
                          </h3>
                          <div className="space-y-3">
                            {results.opportunities.map(
                              (opp: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
                                >
                                  <Target className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                      {opp.keyword}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {opp.reason}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge
                                      variant="default"
                                      className="bg-green-100 text-green-800"
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      {opp.opportunity}%
                                    </Badge>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
