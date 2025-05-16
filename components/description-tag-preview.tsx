"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";

// Add template suggestions
const descriptionTemplates = [
  {
    name: "Product",
    template: "Discover our [Product] - [Key Feature]. Perfect for [Target Audience]. [USP] at competitive prices. Shop now and [Benefit]!",
  },
  {
    name: "Service",
    template: "Professional [Service] in [Location]. [Years] years of experience. [USP] guaranteed. Contact us for [Benefit] today!",
  },
  {
    name: "Blog Post",
    template: "Learn [Topic] with our comprehensive guide. Discover [Key Points] and expert tips. Perfect for [Target Audience]. Read now!",
  },
  {
    name: "Event",
    template: "Join us for [Event Name] on [Date]. Experience [Key Highlights]. Perfect for [Target Audience]. Register now for [Benefit]!",
  },
];

interface DescriptionPreview {
  description: string;
  length: number;
  issues: string[];
  preview: {
    desktop: string;
    mobile: string;
  };
  sentiment?: {
    score: number;
    label: string;
  };
  keywords?: Array<{
    word: string;
    count: number;
    density: number;
  }>;
  readability?: {
    score: number;
    level: string;
  };
  competitors?: Array<{
    url: string;
    description: string;
    score: number;
  }>;
}

interface Platform {
  name: string;
  icon: string;
  maxLength: number;
  previewStyle: string;
}

const platforms: Platform[] = [
  {
    name: "Google",
    icon: "🔍",
    maxLength: 160,
    previewStyle: "text-blue-600 hover:underline cursor-pointer",
  },
  {
    name: "Facebook",
    icon: "📱",
    maxLength: 200,
    previewStyle: "text-[#1877f2] font-medium",
  },
  {
    name: "Twitter",
    icon: "🐦",
    maxLength: 200,
    previewStyle: "text-gray-800 dark:text-gray-200",
  },
  {
    name: "LinkedIn",
    icon: "💼",
    maxLength: 220,
    previewStyle: "text-[#0a66c2] font-medium",
  },
];

export function DescriptionTagPreview() {
  const [preview, setPreview] = useState<DescriptionPreview | null>(null);
  const [customDescription, setCustomDescription] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("Google");
  const [showEmojis, setShowEmojis] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [competitorUrls, setCompetitorUrls] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [tone, setTone] = useState(50); // 0-100 scale for formal vs casual

  // Function to apply template
  const applyTemplate = (templateName: string) => {
    const template = descriptionTemplates.find(t => t.name === templateName);
    if (template) {
      setCustomDescription(template.template);
      toast.success(`Applied ${templateName} template`);
    }
  };

  // Function to generate AI suggestions
  const generateAiSuggestions = () => {
    // This would typically call an AI endpoint
    const suggestions = [
      customDescription.replace("[Product]", "Premium Widget").replace("[Key Feature]", "innovative design"),
      customDescription.replace("[Product]", "Elite Widget").replace("[Key Feature]", "superior quality"),
      customDescription.replace("[Product]", "Smart Widget").replace("[Key Feature]", "advanced technology"),
    ];
    setAiSuggestions(suggestions);
    toast.success("Generated new suggestions!");
  };

  const analyzeDescription = async (url: string) => {
    try {
      setCurrentUrl(url);
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "DESCRIPTION_PREVIEW",
          url,
          customDescription: customDescription || undefined,
          targetKeywords: targetKeywords || undefined,
          options: {
            showEmojis,
            autoOptimize,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze meta description");
      }

      const data = await response.json();
      setPreview(data.preview);
      toast.success("Meta description analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze meta description");
      console.error(error);
    }
  };

  const getProgressColor = (length: number, maxLength: number) => {
    const percentage = (length / maxLength) * 100;
    if (percentage < 40) return "bg-yellow-500";
    if (percentage > 90) return "bg-red-500";
    return "bg-green-500";
  };

  const getCurrentPlatform = () => {
    return platforms.find(p => p.name === selectedPlatform) || platforms[0];
  };

  return (
    <SEOToolBase
      title="Meta Description Preview"
      description="Preview how your meta description will appear in search results and get optimization suggestions"
      toolType="DESCRIPTION_PREVIEW"
      onSubmit={analyzeDescription}
    >
      <div className="mt-8 space-y-6">
        {/* Description Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Description Settings</h3>
          <div className="space-y-4">
            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Quick Templates</Label>
              <Select onValueChange={applyTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {descriptionTemplates.map((template) => (
                    <SelectItem key={template.name} value={template.name}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tone Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Tone Adjustment</Label>
                <span className="text-sm text-muted-foreground">
                  {tone < 33 ? "Formal" : tone < 66 ? "Balanced" : "Casual"}
                </span>
              </div>
              <Slider
                value={[tone]}
                onValueChange={(value) => setTone(value[0])}
                max={100}
                step={1}
              />
            </div>

            {/* Custom Description Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="customDescription">Custom Description</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAiSuggestions}
                >
                  Generate AI Suggestions
                </Button>
              </div>
              <Textarea
                id="customDescription"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Enter a custom meta description to preview"
                maxLength={220}
                className="h-32 font-mono"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Characters: {customDescription.length}/{getCurrentPlatform().maxLength}</span>
                <Progress 
                  value={(customDescription.length / getCurrentPlatform().maxLength) * 100} 
                  className={`w-1/2 ${getProgressColor(customDescription.length, getCurrentPlatform().maxLength)}`}
                />
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <Label>AI Suggestions</Label>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                      onClick={() => setCustomDescription(suggestion)}
                    >
                      <p className="text-sm">{suggestion}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">AI Generated</Badge>
                        <Badge variant="outline">Click to Apply</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitor Analysis */}
            <div className="space-y-2">
              <Label htmlFor="competitorUrls">
                Competitor URLs
                <Popover>
                  <PopoverTrigger>
                    <Info className="w-4 h-4 inline-block ml-2" />
                  </PopoverTrigger>
                  <PopoverContent>
                    Add competitor URLs to analyze their meta descriptions and get insights.
                  </PopoverContent>
                </Popover>
              </Label>
              <Textarea
                id="competitorUrls"
                value={competitorUrls}
                onChange={(e) => setCompetitorUrls(e.target.value)}
                placeholder="Enter competitor URLs (one per line)"
                className="h-20"
              />
            </div>

            {/* Target Keywords */}
            <div className="space-y-2">
              <Label htmlFor="targetKeywords">Target Keywords (comma-separated)</Label>
              <Input
                id="targetKeywords"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
                placeholder="e.g., seo, meta description, search results"
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showEmojis}
                  onCheckedChange={setShowEmojis}
                  id="show-emojis"
                />
                <Label htmlFor="show-emojis">Include Emojis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoOptimize}
                  onCheckedChange={setAutoOptimize}
                  id="auto-optimize"
                />
                <Label htmlFor="auto-optimize">Auto-Optimize</Label>
              </div>
            </div>
          </div>
        </Card>

        {preview && (
          <>
            {/* Platform Previews */}
            <Card className="p-6">
              <Tabs defaultValue="Google">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Platform Preview</h3>
                  <TabsList>
                    {platforms.map((platform) => (
                      <TabsTrigger
                        key={platform.name}
                        value={platform.name}
                        onClick={() => setSelectedPlatform(platform.name)}
                        className="flex items-center space-x-1"
                      >
                        <span>{platform.icon}</span>
                        <span>{platform.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value="Google">
                  <div className="space-y-6">
                    {/* Desktop Preview */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Desktop View</h4>
                      <div className="p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
                        <div className="space-y-2">
                          <div className={getCurrentPlatform().previewStyle}>
                            {preview.preview.desktop}
                          </div>
                          <div className="text-green-700 dark:text-green-500 text-sm">
                            {currentUrl}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Preview */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Mobile View</h4>
                      <div className="p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-sm max-w-[360px]">
                        <div className="space-y-2">
                          <div className={getCurrentPlatform().previewStyle}>
                            {preview.preview.mobile}
                          </div>
                          <div className="text-green-700 dark:text-green-500 text-xs">
                            {currentUrl}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {platforms.slice(1).map((platform) => (
                  <TabsContent key={platform.name} value={platform.name}>
                    <div className="space-y-6">
                      {/* Desktop Preview */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Desktop View</h4>
                        <div className="p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
                          <div className="space-y-2">
                            <div className={platform.previewStyle}>
                              {preview.preview.desktop}
                            </div>
                            <div className="text-green-700 dark:text-green-500 text-sm">
                              {currentUrl}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Preview */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Mobile View</h4>
                        <div className="p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-sm max-w-[360px]">
                          <div className="space-y-2">
                            <div className={platform.previewStyle}>
                              {preview.preview.mobile}
                            </div>
                            <div className="text-green-700 dark:text-green-500 text-xs">
                              {currentUrl}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>

            {/* Advanced Analysis */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Advanced Analysis</h3>
              <div className="space-y-6">
                {/* Basic Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Length</p>
                    <p className="text-lg font-medium">
                      {preview.length} characters
                      {preview.length > getCurrentPlatform().maxLength && (
                        <span className="text-red-500 ml-2">
                          (Too long)
                        </span>
                      )}
                    </p>
                  </div>
                  {preview.sentiment && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Sentiment</p>
                      <p className="text-lg font-medium flex items-center">
                        {preview.sentiment.label}
                        <span className="ml-2">
                          {preview.sentiment.score > 0 ? "😊" : preview.sentiment.score < 0 ? "☹️" : "😐"}
                        </span>
                      </p>
                    </div>
                  )}
                  {preview.readability && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Readability</p>
                      <p className="text-lg font-medium">
                        {preview.readability.level}
                      </p>
                    </div>
                  )}
                </div>

                {/* Keyword Analysis */}
                {preview.keywords && preview.keywords.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Keyword Usage</p>
                    <div className="grid grid-cols-2 gap-4">
                      {preview.keywords.map((keyword, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span>{keyword.word}</span>
                          <span className="text-sm text-muted-foreground">
                            {keyword.count}x ({keyword.density.toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Issues and Suggestions */}
                {preview.issues.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Optimization Tips</p>
                    <ul className="space-y-2">
                      {preview.issues.map((issue, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-red-500">⚠️</span>
                          <span className="text-sm">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}

        {preview?.competitors && preview.competitors.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Competitor Analysis</h3>
            <div className="space-y-4">
              {preview.competitors.map((competitor, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">{competitor.url}</span>
                    <Badge variant={competitor.score > 80 ? "default" : "secondary"}>
                      Score: {competitor.score}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{competitor.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </SEOToolBase>
  );
}
