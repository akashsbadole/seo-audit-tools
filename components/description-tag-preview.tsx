"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DescriptionPreview {
  description: string;
  length: number;
  issues: string[];
  preview: {
    desktop: string;
    mobile: string;
  };
}

export function DescriptionTagPreview() {
  const [preview, setPreview] = useState<DescriptionPreview | null>(null);
  const [customDescription, setCustomDescription] = useState("");

  const analyzeDescription = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "DESCRIPTION_PREVIEW",
          url,
          customDescription: customDescription || undefined,
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

  return (
    <SEOToolBase
      title="Meta Description Preview"
      description="Preview how your meta description will appear in search results and get optimization suggestions"
      toolType="DESCRIPTION_PREVIEW"
      onSubmit={analyzeDescription}
    >
      <div className="mt-8 space-y-6">
        {/* Custom Description Input */}
        <div className="space-y-2">
          <Label htmlFor="customDescription">
            Custom Description (Optional)
          </Label>
          <Textarea
            id="customDescription"
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="Enter a custom meta description to preview"
            maxLength={160}
            className="h-32"
          />
          <p className="text-sm text-muted-foreground">
            Leave empty to analyze the current meta description
          </p>
        </div>

        {preview && (
          <>
            {/* Description Preview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Description Preview
              </h3>
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
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
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
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
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
                    {preview.length > 160 && (
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
