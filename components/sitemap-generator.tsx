"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface SitemapConfig {
  includeImages: boolean;
  includeLastMod: boolean;
  includeChangeFreq: boolean;
  includePriority: boolean;
  excludePaths: string[];
  customPaths: string[];
}

export function SitemapGenerator() {
  const [config, setConfig] = useState<SitemapConfig>({
    includeImages: true,
    includeLastMod: true,
    includeChangeFreq: true,
    includePriority: true,
    excludePaths: ["/admin/", "/private/"],
    customPaths: [],
  });

  const [generatedContent, setGeneratedContent] = useState("");

  const generateSitemap = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "SITEMAP",
          url,
          config,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate sitemap");
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      toast.success("Sitemap generated successfully!");
    } catch (error) {
      toast.error("Failed to generate sitemap");
      console.error(error);
    }
  };

  const addExcludePath = () => {
    setConfig({
      ...config,
      excludePaths: [...config.excludePaths, ""],
    });
  };

  const updateExcludePath = (index: number, value: string) => {
    const newPaths = [...config.excludePaths];
    newPaths[index] = value;
    setConfig({
      ...config,
      excludePaths: newPaths,
    });
  };

  const addCustomPath = () => {
    setConfig({
      ...config,
      customPaths: [...config.customPaths, ""],
    });
  };

  const updateCustomPath = (index: number, value: string) => {
    const newPaths = [...config.customPaths];
    newPaths[index] = value;
    setConfig({
      ...config,
      customPaths: newPaths,
    });
  };

  return (
    <SEOToolBase
      title="Sitemap Generator"
      description="Generate an XML sitemap for your website"
      toolType="SITEMAP"
      onSubmit={generateSitemap}
    >
      <div className="mt-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Configuration</h3>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="includeImages"
                checked={config.includeImages}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeImages: checked })
                }
              />
              <Label htmlFor="includeImages">Include Images</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="includeLastMod"
                checked={config.includeLastMod}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeLastMod: checked })
                }
              />
              <Label htmlFor="includeLastMod">Include Last Modified Date</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="includeChangeFreq"
                checked={config.includeChangeFreq}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeChangeFreq: checked })
                }
              />
              <Label htmlFor="includeChangeFreq">
                Include Change Frequency
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="includePriority"
                checked={config.includePriority}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includePriority: checked })
                }
              />
              <Label htmlFor="includePriority">Include Priority</Label>
            </div>
          </div>

          {/* Exclude Paths */}
          <div className="space-y-4 mt-6">
            <Label>Exclude Paths</Label>
            {config.excludePaths.map((path, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={path}
                  onChange={(e) => updateExcludePath(index, e.target.value)}
                  placeholder="e.g., /private/"
                />
              </div>
            ))}
            <Button variant="outline" onClick={addExcludePath}>
              Add Exclude Path
            </Button>
          </div>

          {/* Custom Paths */}
          <div className="space-y-4 mt-6">
            <Label>Custom Paths</Label>
            {config.customPaths.map((path, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={path}
                  onChange={(e) => updateCustomPath(index, e.target.value)}
                  placeholder="e.g., /custom-page/"
                />
              </div>
            ))}
            <Button variant="outline" onClick={addCustomPath}>
              Add Custom Path
            </Button>
          </div>
        </div>

        {generatedContent && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Generated Sitemap</h3>
            <div className="relative">
              <Textarea
                value={generatedContent}
                readOnly
                className="font-mono h-64"
              />
              <Button
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                  toast.success("Copied to clipboard!");
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </SEOToolBase>
  );
}
