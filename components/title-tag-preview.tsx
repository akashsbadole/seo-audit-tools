"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TitlePreview {
  title: string;
  length: number;
  issues: string[];
  preview: {
    desktop: string;
    mobile: string;
  };
}

export function TitleTagPreview() {
  const [preview, setPreview] = useState<TitlePreview | null>(null);
  const [customTitle, setCustomTitle] = useState("");

  const analyzeTitle = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "TITLE_PREVIEW",
          url,
          customTitle: customTitle || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze title tag");
      }

      const data = await response.json();
      setPreview(data.preview);
      toast.success("Title tag analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze title tag");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="Title Tag Preview"
      description="Preview how your title tag will appear in search results and get optimization suggestions"
      toolType="TITLE_PREVIEW"
      onSubmit={analyzeTitle}
    >
      <div className="mt-8 space-y-6">
        {/* Custom Title Input */}
        <div className="space-y-2">
          <Label htmlFor="customTitle">Custom Title (Optional)</Label>
          <Input
            id="customTitle"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Enter a custom title to preview"
            maxLength={60}
          />
          <p className="text-sm text-muted-foreground">
            Leave empty to analyze the current title tag
          </p>
        </div>

        {preview && (
          <>
            {/* Title Preview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Title Preview</h3>
              <div className="space-y-6">
                {/* Desktop Preview */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Desktop</h4>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="mt-2 font-medium text-blue-600 dark:text-blue-400">
                      {preview.preview.desktop}
                    </div>
                  </div>
                </div>

                {/* Mobile Preview */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Mobile</h4>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="mt-2 font-medium text-blue-600 dark:text-blue-400">
                      {preview.preview.mobile}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Analysis */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Analysis</h3>
              <div className="space-y-4">
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

                {preview.issues.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Issues</p>
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
          </>
        )}
      </div>
    </SEOToolBase>
  );
}
