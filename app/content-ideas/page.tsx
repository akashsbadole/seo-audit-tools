"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
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
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Search,
  Globe,
  FileText,
  Target,
  Users,
  BarChart3,
  Calendar,
  Clock,
  ArrowUp,
  ArrowRight,
  Download,
  Share2,
  Mail,
  RefreshCw,
  Star,
  Hash,
  MessageSquare,
  Video,
  Image,
  PenTool,
  BookOpen,
  ExternalLink,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  contentType: "blog" | "video" | "infographic" | "podcast" | "guide";
  difficulty: "easy" | "medium" | "hard";
  searchVolume: number;
  competition: "low" | "medium" | "high";
  targetKeywords: string[];
  readTime: string;
  potentialTraffic: number;
  trending: boolean;
}

export default function ContentIdeasPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState("all");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("neutral");
  const [length, setLength] = useState("medium");
  const [includeTrending, setIncludeTrending] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [includeStatistics, setIncludeStatistics] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate content ideas",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock content ideas
      const mockIdeas: ContentIdea[] = [
        {
          id: "1",
          title: "10 Essential SEO Tips for Beginners That Actually Work",
          description:
            "A comprehensive guide covering the most important SEO strategies that beginners can implement right away to improve their website rankings.",
          contentType: "blog",
          difficulty: "easy",
          searchVolume: 12000,
          competition: "medium",
          targetKeywords: [
            "seo tips",
            "beginner seo",
            "search engine optimization",
          ],
          readTime: "8 min",
          potentialTraffic: 8500,
          trending: true,
        },
        {
          id: "2",
          title: "The Ultimate Guide to Keyword Research in 2024",
          description:
            "Master keyword research with advanced techniques, tools, and strategies that professional SEOs use to find profitable keywords.",
          contentType: "guide",
          difficulty: "medium",
          searchVolume: 8500,
          competition: "high",
          targetKeywords: ["keyword research", "seo tools", "keyword analysis"],
          readTime: "12 min",
          potentialTraffic: 12000,
          trending: false,
        },
        {
          id: "3",
          title: "Video: How to Conduct a Technical SEO Audit Step by Step",
          description:
            "Follow along as we perform a complete technical SEO audit, identifying and fixing common issues that impact search rankings.",
          contentType: "video",
          difficulty: "hard",
          searchVolume: 6500,
          competition: "medium",
          targetKeywords: ["technical seo", "seo audit", "website analysis"],
          readTime: "15 min",
          potentialTraffic: 9500,
          trending: true,
        },
        {
          id: "4",
          title: "Infographic: The State of SEO in 2024",
          description:
            "Visual representation of the latest SEO trends, statistics, and predictions for the coming year based on industry data.",
          contentType: "infographic",
          difficulty: "medium",
          searchVolume: 3200,
          competition: "low",
          targetKeywords: [
            "seo trends",
            "seo statistics",
            "search engine optimization",
          ],
          readTime: "5 min",
          potentialTraffic: 4500,
          trending: false,
        },
        {
          id: "5",
          title: "Podcast: Interview with Top SEO Experts About Future Trends",
          description:
            "Join us as we sit down with leading SEO experts to discuss the future of search engine optimization and emerging trends.",
          contentType: "podcast",
          difficulty: "medium",
          searchVolume: 1800,
          competition: "low",
          targetKeywords: ["seo podcast", "seo experts", "search trends"],
          readTime: "25 min",
          potentialTraffic: 2200,
          trending: false,
        },
        {
          id: "6",
          title: "Common SEO Mistakes That Are Killing Your Rankings",
          description:
            "Discover the most common SEO mistakes website owners make and learn how to fix them to improve your search rankings.",
          contentType: "blog",
          difficulty: "easy",
          searchVolume: 9800,
          competition: "high",
          targetKeywords: ["seo mistakes", "ranking factors", "seo errors"],
          readTime: "6 min",
          potentialTraffic: 7200,
          trending: true,
        },
      ];

      setIdeas(mockIdeas);
      toast({
        title: "Ideas Generated",
        description: `Generated ${mockIdeas.length} content ideas for "${topic}"`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating content ideas",
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
            <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Please log in to access the Content Ideas Generator
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
            <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              Content Ideas Generator is a premium feature. Upgrade to access
              this tool.
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

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "infographic":
        return <Image className="h-4 w-4" />;
      case "podcast":
        return <MessageSquare className="h-4 w-4" />;
      case "guide":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <PenTool className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content idea has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Ideas Generator
          </h1>
          <p className="text-gray-600">
            Generate data-driven content ideas that will attract traffic and
            engage your audience
          </p>
        </div>

        {!ideas.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Content Configuration
                  </CardTitle>
                  <CardDescription>
                    Tell us about your content needs to generate personalized
                    ideas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Main Topic *</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., digital marketing, SEO, content writing"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Target Keywords (Optional)</Label>
                    <Textarea
                      id="keywords"
                      placeholder="Enter keywords, one per line"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="w-full"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="blog">Blog Posts</SelectItem>
                          <SelectItem value="video">Video Content</SelectItem>
                          <SelectItem value="infographic">
                            Infographics
                          </SelectItem>
                          <SelectItem value="podcast">Podcasts</SelectItem>
                          <SelectItem value="guide">Guides</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="length">Content Length</Label>
                      <Select value={length} onValueChange={setLength}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">
                            Short (under 500 words)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (500-1500 words)
                          </SelectItem>
                          <SelectItem value="long">
                            Long (1500+ words)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., beginners, marketers, small business owners"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>

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

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-trending"
                        checked={includeTrending}
                        onCheckedChange={setIncludeTrending}
                      />
                      <Label htmlFor="include-trending">
                        Include trending topics
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-questions"
                        checked={includeQuestions}
                        onCheckedChange={setIncludeQuestions}
                      />
                      <Label htmlFor="include-questions">
                        Include question-based content
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-statistics"
                        checked={includeStatistics}
                        onCheckedChange={setIncludeStatistics}
                      />
                      <Label htmlFor="include-statistics">
                        Include data-driven ideas
                      </Label>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading || !topic}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white mr-2"></div>
                        Generating Ideas...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Generate Content Ideas
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
                    <TrendingUp className="h-5 w-5" />
                    Content Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Data-Driven Ideas</h4>
                      <p className="text-sm text-gray-600">
                        Based on search trends and competition analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">SEO Optimized</h4>
                      <p className="text-sm text-gray-600">
                        Includes target keywords and search volume data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Audience Focused</h4>
                      <p className="text-sm text-gray-600">
                        Tailored to your specific target audience
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Blog Posts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Video Content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Infographics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Podcasts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Comprehensive Guides</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Content Ideas for "{topic}"
                </h2>
                <p className="text-gray-600">
                  Generated {ideas.length} content ideas based on your
                  specifications
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIdeas([])}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate More
                </Button>
              </div>
            </div>

            {/* Content Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ideas.map((idea) => (
                <Card
                  key={idea.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getContentTypeIcon(idea.contentType)}
                          <Badge variant="outline" className="capitalize">
                            {idea.contentType}
                          </Badge>
                          {idea.trending && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg mb-2">
                          {idea.title}
                        </CardTitle>
                        <CardDescription>{idea.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Metrics Row */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Search Volume:</span>
                          <span className="ml-2 font-medium">
                            {idea.searchVolume.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Read Time:</span>
                          <span className="ml-2 font-medium">
                            {idea.readTime}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Difficulty:</span>
                          <Badge
                            className={`ml-2 ${getDifficultyColor(idea.difficulty)}`}
                          >
                            {idea.difficulty}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-gray-600">Competition:</span>
                          <Badge
                            className={`ml-2 ${getCompetitionColor(idea.competition)}`}
                          >
                            {idea.competition}
                          </Badge>
                        </div>
                      </div>

                      {/* Keywords */}
                      <div>
                        <span className="text-sm text-gray-600">
                          Target Keywords:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {idea.targetKeywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              <Hash className="h-3 w-3 mr-1" />
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Potential Traffic */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-900">
                            Potential Monthly Traffic
                          </span>
                          <span className="text-lg font-bold text-blue-900">
                            {idea.potentialTraffic.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(idea.title)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Title
                        </Button>
                        <Button size="sm">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Use This Idea
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Generate More Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setIdeas([])}
                className="px-8"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate More Ideas
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
