"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface TitlePreview {
  title: string;
  length: number;
  issues: string[];
  preview: {
    desktop: string;
    mobile: string;
  };
}

interface TitleSuggestion {
  title: string;
  score: number;
  reason: string;
}

export function TitleTagPreview() {
  const [preview, setPreview] = useState<TitlePreview | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [brandName, setBrandName] = useState("");
  const [includeBrand, setIncludeBrand] = useState(false);
  const [separator, setSeparator] = useState("|");
  const [previewMode, setPreviewMode] = useState<"google" | "bing" | "facebook">("google");
  const [titleCase, setTitleCase] = useState(false);
  const [hostname, setHostname] = useState("");

  // Format title based on settings
  const formatTitle = (title: string) => {
    let formattedTitle = title;

    // Apply title case if enabled
    if (titleCase) {
      formattedTitle = formattedTitle
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    // Add brand name if enabled
    if (includeBrand && brandName) {
      formattedTitle = `${formattedTitle} ${separator} ${brandName}`;
    }

    return formattedTitle;
  };

  // Preview title in different platforms
  const getPlatformPreview = () => {
    if (!preview) return null;

    const title = formatTitle(preview.title);
    
    switch (previewMode) {
      case "google":
        return {
          desktop: title.length > 60 ? title.substring(0, 57) + "..." : title,
          mobile: title.length > 40 ? title.substring(0, 37) + "..." : title
        };
      case "bing":
        return {
          desktop: title.length > 65 ? title.substring(0, 62) + "..." : title,
          mobile: title.length > 45 ? title.substring(0, 42) + "..." : title
        };
      case "facebook":
        return {
          desktop: title.length > 70 ? title.substring(0, 67) + "..." : title,
          mobile: title.length > 50 ? title.substring(0, 47) + "..." : title
        };
    }
  };

  // Check title strength
  const analyzeTitleStrength = (title: string) => {
    const issues: string[] = [];
    const words = title.split(' ');

    // Length checks
    if (title.length < 30) {
      issues.push("Title is too short (minimum 30 characters recommended)");
    } else if (title.length > 60) {
      issues.push("Title is too long (maximum 60 characters recommended)");
    }

    // Word count
    if (words.length < 3) {
      issues.push("Use at least 3 words in your title");
    }

    // Power words check
    const powerWords = ["best", "top", "guide", "how", "why", "tips", "secrets"];
    if (!powerWords.some(word => title.toLowerCase().includes(word))) {
      issues.push("Consider adding power words (e.g., 'Best', 'How to', 'Guide')");
    }

    // Number check
    if (!/\d/.test(title)) {
      issues.push("Consider including numbers for better CTR");
    }

    // Keyword position
    const firstWord = words[0].toLowerCase();
    if (powerWords.includes(firstWord)) {
      issues.push("Consider starting with your main keyword instead of a power word");
    }

    return issues;
  };

  const analyzeTitle = async (url: string) => {
    try {
      // Extract hostname from the input URL
      const urlObj = new URL(url);
      setHostname(urlObj.hostname);

      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "TITLE_PREVIEW",
          url,
          customTitle: customTitle ? formatTitle(customTitle) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze title tag");
      }

      const data = await response.json();
      const formattedTitle = formatTitle(data.preview.title);
      setPreview({
        ...data.preview,
        title: formattedTitle,
        issues: analyzeTitleStrength(formattedTitle)
      });
      toast.success("Title tag analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze title tag");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="Title Tag Preview"
      description="Preview and optimize your title tags across different platforms"
      toolType="TITLE_PREVIEW"
      onSubmit={analyzeTitle}
    >
      <div className="mt-8 space-y-6">
        {/* Title Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Title Settings</h3>
          <div className="space-y-4">
            {/* Custom Title Input */}
            <div className="space-y-2">
              <Label htmlFor="customTitle">Custom Title</Label>
              <Input
                id="customTitle"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter a custom title to preview"
                maxLength={60}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Characters: {customTitle.length}/60</span>
                <span>Words: {customTitle.split(' ').length}</span>
              </div>
            </div>

            {/* Brand Settings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="brandName">Brand Name</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={includeBrand}
                    onCheckedChange={setIncludeBrand}
                    id="include-brand"
                  />
                  <Label htmlFor="include-brand">Include Brand</Label>
                </div>
              </div>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter your brand name"
                disabled={!includeBrand}
              />
            </div>

            {/* Separator Selection */}
            <div className="space-y-2">
              <Label>Separator</Label>
              <div className="flex gap-2">
                {["|", "-", "•", ":", "»"].map((sep) => (
                  <Button
                    key={sep}
                    variant={separator === sep ? "default" : "outline"}
                    onClick={() => setSeparator(sep)}
                    className="w-12"
                  >
                    {sep}
                  </Button>
                ))}
              </div>
            </div>

            {/* Title Case Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="titleCase">Title Case</Label>
              <Switch
                checked={titleCase}
                onCheckedChange={setTitleCase}
                id="titleCase"
              />
            </div>
          </div>
        </Card>

        {/* Platform Preview */}
        <Card className="p-6">
          <Tabs defaultValue="google" onValueChange={(v: any) => setPreviewMode(v)}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Platform Preview</h3>
              <TabsList>
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="bing">Bing</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="google" className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Desktop</h4>
                <div className="p-4 bg-white border rounded-lg">
                  <div className="text-blue-600 text-xl hover:underline cursor-pointer">
                    {preview && getPlatformPreview()?.desktop}
                  </div>
                  <div className="text-green-700 text-sm mt-1">
                    {hostname}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Mobile</h4>
                <div className="p-4 bg-white border rounded-lg max-w-[360px]">
                  <div className="text-blue-600 text-base hover:underline cursor-pointer">
                    {preview && getPlatformPreview()?.mobile}
                  </div>
                  <div className="text-green-700 text-xs mt-1">
                    {hostname}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bing" className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Desktop</h4>
                <div className="p-4 bg-white border rounded-lg">
                  <div className="text-[#006d21] text-xl hover:underline cursor-pointer">
                    {preview && getPlatformPreview()?.desktop}
                  </div>
                  <div className="text-green-700 text-sm mt-1">
                    {hostname}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="facebook" className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Preview</h4>
                <div className="p-4 bg-white border rounded-lg">
                  <div className="text-[#1877f2] text-xl font-medium">
                    {preview && getPlatformPreview()?.desktop}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    {hostname}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Analysis */}
        {preview && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Analysis</h3>
            <div className="space-y-4">
              {/* Character Analysis */}
              <div>
                <p className="text-sm text-muted-foreground">Length</p>
                <p className="text-lg font-medium">
                  {preview.length} characters
                  {preview.length > 60 && (
                    <span className="text-red-500 ml-2">
                      (Exceeds recommended length)
                    </span>
                  )}
                </p>
              </div>

              {/* Platform Limits */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Platform Limits</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Google Desktop:</span>
                    <span className={preview.length > 60 ? "text-red-500" : "text-green-500"}>
                      {preview.length}/60
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Google Mobile:</span>
                    <span className={preview.length > 40 ? "text-red-500" : "text-green-500"}>
                      {preview.length}/40
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bing:</span>
                    <span className={preview.length > 65 ? "text-red-500" : "text-green-500"}>
                      {preview.length}/65
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Facebook:</span>
                    <span className={preview.length > 70 ? "text-red-500" : "text-green-500"}>
                      {preview.length}/70
                    </span>
                  </div>
                </div>
              </div>

              {/* Issues */}
              {preview.issues.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Optimization Tips</p>
                  <ul className="list-disc list-inside space-y-1">
                    {preview.issues.map((issue, index) => (
                      <li key={index} className="text-red-500">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </SEOToolBase>
  );
}
