"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  PenTool,
  Brain,
  Target,
  FileText,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  Search,
  Hash,
  BookOpen,
  MessageSquare,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WritingMetrics {
  readabilityScore: number;
  seoScore: number;
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  avgWordsPerParagraph: number;
  keywordDensity: number;
  keywordCount: number;
  headingCount: number;
  linkCount: number;
  imageCount: number;
}

interface Suggestion {
  id: string;
  type: "improvement" | "warning" | "info";
  category: "seo" | "readability" | "structure" | "keywords";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  action?: string;
}

interface OptimizationResult {
  originalText: string;
  optimizedText: string;
  metrics: WritingMetrics;
  suggestions: Suggestion[];
  keywords: string[];
}

export default function WritingAssistantPage() {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [tone, setTone] = useState("neutral");
  const [audience, setAudience] = useState("general");
  const [contentType, setContentType] = useState("blog");
  const [targetLength, setTargetLength] = useState([1000]);
  const [readabilityLevel, setReadabilityLevel] = useState("medium");
  const [includeOptimization, setIncludeOptimization] = useState(true);
  const [includeStructure, setIncludeStructure] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [showOriginal, setShowOriginal] = useState(true);

  const handleAnalyze = async () => {
    if (!content) {
      toast({
        title: "Content Required",
        description: "Please enter some content to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock analysis result
      const mockResult: OptimizationResult = {
        originalText: content,
        optimizedText: `Optimized version of your content with better SEO structure, keyword placement, and readability improvements. The content has been enhanced to include more relevant headings, better keyword density, and improved sentence structure for better user engagement and search engine visibility.`,
        metrics: {
          readabilityScore: 78,
          seoScore: 82,
          wordCount: content.split(/\s+/).length,
          characterCount: content.length,
          sentenceCount: content.split(/[.!?]+/).length,
          paragraphCount: content.split(/\n\n+/).length,
          avgWordsPerSentence: Math.round(
            content.split(/\s+/).length / content.split(/[.!?]+/).length
          ),
          avgWordsPerParagraph: Math.round(
            content.split(/\s+/).length / content.split(/\n\n+/).length
          ),
          keywordDensity: 2.3,
          keywordCount: targetKeyword
            ? content.toLowerCase().split(targetKeyword.toLowerCase()).length -
              1
            : 0,
          headingCount: (content.match(/^#+\s/gm) || []).length,
          linkCount: (content.match(/https?:\/\/[^\s]+/g) || []).length,
          imageCount: (content.match(/!\[.*?\]/g) || []).length,
        },
        suggestions: [
          {
            id: "1",
            type: "improvement",
            category: "seo",
            title: "Add More Headings",
            description:
              "Include H2 and H3 headings to improve content structure and SEO",
            impact: "high",
            action: "Add 2-3 subheadings to break up content",
          },
          {
            id: "2",
            type: "warning",
            category: "readability",
            title: "Long Sentences",
            description:
              "Some sentences are longer than 20 words, which may affect readability",
            impact: "medium",
            action: "Break down long sentences into shorter ones",
          },
          {
            id: "3",
            type: "improvement",
            category: "keywords",
            title: "Keyword Density",
            description: "Your keyword density is slightly below optimal range",
            impact: "medium",
            action: "Include target keyword 2-3 more times naturally",
          },
          {
            id: "4",
            type: "info",
            category: "structure",
            title: "Add Internal Links",
            description:
              "Consider adding internal links to improve site navigation",
            impact: "low",
            action: "Link to relevant pages on your site",
          },
          {
            id: "5",
            type: "improvement",
            category: "seo",
            title: "Meta Description",
            description:
              "Add a compelling meta description to improve click-through rates",
            impact: "high",
            action: "Write a 150-160 character meta description",
          },
        ],
        keywords: targetKeyword
          ? [
              targetKeyword,
              ...secondaryKeywords
                .split(",")
                .map((k) => k.trim())
                .filter((k) => k),
            ]
          : [],
      };

      setResult(mockResult);
      toast({
        title: "Analysis Complete",
        description: "Your content has been analyzed and optimized",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your content",
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
            <PenTool className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Please log in to access the SEO Writing Assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Login to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user.isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <PenTool className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              SEO Writing Assistant is a premium feature. Upgrade to access this
              tool.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/upgrade">
              <Button className="w-full">Upgrade to Premium</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "improvement":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SEO Writing Assistant
          </h1>
          <p className="text-gray-600">
            Optimize your content for search engines and improve readability
            with AI-powered analysis
          </p>
        </div>

        {!result ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Content Analysis
                  </CardTitle>
                  <CardDescription>
                    Enter your content and optimization preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Paste or type your content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full min-h-[300px]"
                    />
                    <div className="text-sm text-gray-600">
                      {content.split(/\s+/).length} words • {content.length}{" "}
                      characters
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="targetKeyword">Target Keyword</Label>
                      <Input
                        id="targetKeyword"
                        placeholder="Main keyword"
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryKeywords">
                        Secondary Keywords
                      </Label>
                      <Input
                        id="secondaryKeywords"
                        placeholder="keyword1, keyword2, keyword3"
                        value={secondaryKeywords}
                        onChange={(e) => setSecondaryKeywords(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="tone">Content Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Select value={audience} onValueChange={setAudience}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="beginners">Beginners</SelectItem>
                          <SelectItem value="experts">Experts</SelectItem>
                          <SelectItem value="marketers">Marketers</SelectItem>
                          <SelectItem value="business">
                            Business Owners
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select
                        value={contentType}
                        onValueChange={setContentType}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="landing">Landing Page</SelectItem>
                          <SelectItem value="product">
                            Product Description
                          </SelectItem>
                          <SelectItem value="email">Email Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Length: {targetLength[0]} words</Label>
                    <Slider
                      value={targetLength}
                      onValueChange={setTargetLength}
                      max={3000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readabilityLevel">Readability Level</Label>
                    <Select
                      value={readabilityLevel}
                      onValueChange={setReadabilityLevel}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy (8th grade)</SelectItem>
                        <SelectItem value="medium">
                          Medium (10th grade)
                        </SelectItem>
                        <SelectItem value="hard">Hard (12th grade)</SelectItem>
                        <SelectItem value="very-hard">
                          Very Hard (College)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-optimization"
                        checked={includeOptimization}
                        onCheckedChange={setIncludeOptimization}
                      />
                      <Label htmlFor="include-optimization">
                        Include SEO optimization suggestions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-structure"
                        checked={includeStructure}
                        onCheckedChange={setIncludeStructure}
                      />
                      <Label htmlFor="include-structure">
                        Analyze content structure
                      </Label>
                    </div>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading || !content}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white mr-2"></div>
                        Analyzing Content...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze & Optimize
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Optimization Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">SEO Analysis</h4>
                      <p className="text-sm text-gray-600">
                        Keyword density, meta tags, and structure optimization
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Readability Score</h4>
                      <p className="text-sm text-gray-600">
                        Improve content readability and engagement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">AI Suggestions</h4>
                      <p className="text-sm text-gray-600">
                        Get actionable improvement recommendations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Writing Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">
                      Use Clear Headings
                    </h4>
                    <p className="text-sm text-blue-800">
                      Structure content with H1, H2, H3 tags
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-1">
                      Optimal Length
                    </h4>
                    <p className="text-sm text-green-800">
                      Aim for 1000+ words for better ranking
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-1">
                      Keyword Placement
                    </h4>
                    <p className="text-sm text-yellow-800">
                      Include keywords in title, headings, and naturally
                      throughout
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    SEO Score
                  </CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(result.metrics.seoScore)}`}
                  >
                    {result.metrics.seoScore}
                  </div>
                  <Progress
                    value={result.metrics.seoScore}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Readability
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(result.metrics.readabilityScore)}`}
                  >
                    {result.metrics.readabilityScore}
                  </div>
                  <Progress
                    value={result.metrics.readabilityScore}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Word Count
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {result.metrics.wordCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Target: {targetLength[0]}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Keyword Density
                  </CardTitle>
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {result.metrics.keywordDensity}%
                  </div>
                  <p className="text-xs text-muted-foreground">Optimal: 1-3%</p>
                </CardContent>
              </Card>
            </div>

            {/* Content Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content Optimization
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOriginal(!showOriginal)}
                  >
                    {showOriginal ? (
                      <EyeOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {showOriginal ? "Hide Original" : "Show Original"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.optimizedText)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Optimized
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="optimized" className="w-full">
                  <TabsList>
                    <TabsTrigger value="original">Original</TabsTrigger>
                    <TabsTrigger value="optimized">Optimized</TabsTrigger>
                    <TabsTrigger value="comparison">Side by Side</TabsTrigger>
                  </TabsList>

                  <TabsContent value="original" className="mt-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {result.originalText}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="optimized" className="mt-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {result.optimizedText}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="comparison" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Original</h4>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm">
                            {result.originalText}
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Optimized</h4>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm">
                            {result.optimizedText}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Optimization Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50"
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <Badge className={getImpactColor(suggestion.impact)}>
                            {suggestion.impact} impact
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {suggestion.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {suggestion.description}
                        </p>
                        {suggestion.action && (
                          <p className="text-sm font-medium text-blue-600">
                            💡 {suggestion.action}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  setContent("");
                  setResult(null);
                }}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Analyze New Content
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
