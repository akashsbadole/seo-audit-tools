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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  TrendingUp,
  BarChart3,
  Loader2,
  AlertCircle,
  Target,
  Star,
  DollarSign,
  Hash,
} from "lucide-react";

interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  trend: number[];
}

interface KeywordResult {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: "low" | "medium" | "high";
  trend: number[];
  relatedKeywords: KeywordData[];
  questions: string[];
  serpFeatures: string[];
  opportunities: Array<{ keyword: string; reason: string; opportunity: number }>;
}

export default function KeywordResearchPage() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("us");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<KeywordResult | null>(null);
  const [error, setError] = useState("");

  const researchKeyword = async () => {
    if (!keyword.trim()) {
      setError("Please enter a keyword to research");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/keyword-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, country }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || "Failed to research keyword");
      }
    } catch (err) {
      setError("An error occurred during research");
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return "text-green-600 bg-green-100";
    if (difficulty <= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getCompetitionBadge = (competition: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[competition as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Keyword Research</h1>
          <p className="text-gray-600">
            Discover profitable keywords with advanced research tools, search volume, competition analysis, and SERP features.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Research Keyword
            </CardTitle>
            <CardDescription>Enter a keyword to discover opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && researchKeyword()}
                className="flex-1"
              />
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={researchKeyword} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Research
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
                    <span className="text-sm text-gray-600">Search Volume</span>
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {results.searchVolume.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Monthly searches</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Difficulty</span>
                    <Target className="h-4 w-4 text-orange-500" />
                  </div>
                  <Badge className={`text-xl ${getDifficultyColor(results.difficulty)}`}>
                    {results.difficulty}/100
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {results.difficulty <= 30 ? "Easy to rank" : results.difficulty <= 60 ? "Moderate" : "Hard to rank"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">CPC</span>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    ${results.cpc.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Cost per click</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Competition</span>
                    <Hash className="h-4 w-4 text-purple-500" />
                  </div>
                  <Badge className={getCompetitionBadge(results.competition)}>
                    {results.competition.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Paid competition</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="related" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="related">Related Keywords</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="serp">SERP Features</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              </TabsList>

              <TabsContent value="related" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Keywords</CardTitle>
                    <CardDescription>Keywords related to your search term</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.relatedKeywords.map((kw, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{kw.keyword}</div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <div className="text-gray-500">Volume</div>
                              <div className="font-medium">{kw.searchVolume.toLocaleString()}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-500">KD</div>
                              <Badge className={getDifficultyColor(kw.difficulty)}>{kw.difficulty}</Badge>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-500">CPC</div>
                              <div className="font-medium">${kw.cpc.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Question Keywords</CardTitle>
                    <CardDescription>Questions people ask about this topic</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {results.questions.map((q, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
                          {q}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="serp" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SERP Features</CardTitle>
                    <CardDescription>Features appearing in search results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.serpFeatures.map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-sm py-1 px-3">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="opportunities" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Keyword Opportunities</CardTitle>
                    <CardDescription>High-potential keywords to target</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.opportunities.map((opp, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                          <Star className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{opp.keyword}</div>
                            <div className="text-sm text-gray-600">{opp.reason}</div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {opp.opportunity}% opportunity
                          </Badge>
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
