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

  const [isLoading, setIsLoading] = useState(false);

  const generateSitemap = async (url: string) => {
    setIsLoading(true);
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate sitemap");
      }

      if (data?.content) {
        // Create blob and download link
        const blob = new Blob([data.content], { type: "application/xml" });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "sitemap.xml";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        toast.success(
          data.source === "existing_sitemap"
            ? "Found and downloaded existing sitemap!"
            : `Generated and downloaded sitemap with ${data.urlCount} URLs`
        );
      } else {
        throw new Error("No sitemap content received");
      }
    } catch (error) {
      console.error("Sitemap generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate sitemap"
      );
    } finally {
      setIsLoading(false);
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
      description="Generate and download an XML sitemap for your website"
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
      </div>
    </SEOToolBase>
  );
}
