"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface RobotsTxtConfig {
  userAgents: string[];
  allowPaths: string[];
  disallowPaths: string[];
  sitemapUrl: string;
  crawlDelay: number;
  customRules: string[];
}

export function RobotsTxtGenerator() {
  const [config, setConfig] = useState<RobotsTxtConfig>({
    userAgents: ["*"],
    allowPaths: ["/"],
    disallowPaths: ["/admin/", "/private/"],
    sitemapUrl: "",
    crawlDelay: 10,
    customRules: [],
  });

  const [generatedContent, setGeneratedContent] = useState("");

  const generateRobotsTxt = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "ROBOTS_TXT",
          url,
          config,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate robots.txt");
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      toast.success("Robots.txt generated successfully!");
    } catch (error) {
      toast.error("Failed to generate robots.txt");
      console.error(error);
    }
  };

  const addUserAgent = () => {
    setConfig({
      ...config,
      userAgents: [...config.userAgents, ""],
    });
  };

  const updateUserAgent = (index: number, value: string) => {
    const newUserAgents = [...config.userAgents];
    newUserAgents[index] = value;
    setConfig({
      ...config,
      userAgents: newUserAgents,
    });
  };

  const addPath = (type: "allow" | "disallow") => {
    setConfig({
      ...config,
      [type === "allow" ? "allowPaths" : "disallowPaths"]: [
        ...config[type === "allow" ? "allowPaths" : "disallowPaths"],
        "",
      ],
    });
  };

  const updatePath = (
    type: "allow" | "disallow",
    index: number,
    value: string
  ) => {
    const newPaths = [
      ...config[type === "allow" ? "allowPaths" : "disallowPaths"],
    ];
    newPaths[index] = value;
    setConfig({
      ...config,
      [type === "allow" ? "allowPaths" : "disallowPaths"]: newPaths,
    });
  };

  const addCustomRule = () => {
    setConfig({
      ...config,
      customRules: [...config.customRules, ""],
    });
  };

  const updateCustomRule = (index: number, value: string) => {
    const newRules = [...config.customRules];
    newRules[index] = value;
    setConfig({
      ...config,
      customRules: newRules,
    });
  };

  return (
    <SEOToolBase
      title="Robots.txt Generator"
      description="Generate a robots.txt file for your website"
      toolType="ROBOTS_TXT"
      onSubmit={generateRobotsTxt}
    >
      <div className="mt-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Configuration</h3>

          {/* User Agents */}
          <div className="space-y-4">
            <Label>User Agents</Label>
            {config.userAgents.map((agent, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={agent}
                  onChange={(e) => updateUserAgent(index, e.target.value)}
                  placeholder="e.g., * or Googlebot"
                />
              </div>
            ))}
            <Button variant="outline" onClick={addUserAgent}>
              Add User Agent
            </Button>
          </div>

          {/* Allow Paths */}
          <div className="space-y-4 mt-6">
            <Label>Allow Paths</Label>
            {config.allowPaths.map((path, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={path}
                  onChange={(e) => updatePath("allow", index, e.target.value)}
                  placeholder="e.g., /public/"
                />
              </div>
            ))}
            <Button variant="outline" onClick={() => addPath("allow")}>
              Add Allow Path
            </Button>
          </div>

          {/* Disallow Paths */}
          <div className="space-y-4 mt-6">
            <Label>Disallow Paths</Label>
            {config.disallowPaths.map((path, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={path}
                  onChange={(e) =>
                    updatePath("disallow", index, e.target.value)
                  }
                  placeholder="e.g., /private/"
                />
              </div>
            ))}
            <Button variant="outline" onClick={() => addPath("disallow")}>
              Add Disallow Path
            </Button>
          </div>

          {/* Sitemap URL */}
          <div className="space-y-4 mt-6">
            <Label>Sitemap URL</Label>
            <Input
              value={config.sitemapUrl}
              onChange={(e) =>
                setConfig({ ...config, sitemapUrl: e.target.value })
              }
              placeholder="e.g., https://example.com/sitemap.xml"
            />
          </div>

          {/* Crawl Delay */}
          <div className="space-y-4 mt-6">
            <Label>Crawl Delay (seconds)</Label>
            <Input
              type="number"
              value={config.crawlDelay}
              onChange={(e) =>
                setConfig({ ...config, crawlDelay: parseInt(e.target.value) })
              }
              min="0"
              max="30"
            />
          </div>

          {/* Custom Rules */}
          <div className="space-y-4 mt-6">
            <Label>Custom Rules</Label>
            {config.customRules.map((rule, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={rule}
                  onChange={(e) => updateCustomRule(index, e.target.value)}
                  placeholder="e.g., Host: example.com"
                />
              </div>
            ))}
            <Button variant="outline" onClick={addCustomRule}>
              Add Custom Rule
            </Button>
          </div>
        </div>

        {generatedContent && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Generated Robots.txt</h3>
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
