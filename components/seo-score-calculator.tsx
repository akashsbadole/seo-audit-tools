"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface SEOScore {
  overall: number;
  categories: {
    technical: number;
    content: number;
    performance: number;
    accessibility: number;
  };
  issues: {
    critical: string[];
    warning: string[];
    info: string[];
  };
}

export function SEOScoreCalculator() {
  const [score, setScore] = useState<SEOScore | null>(null);

  const calculateScore = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "SEO_SCORE",
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate SEO score");
      }

      const data = await response.json();
      setScore(data.score);
      toast.success("SEO score calculated successfully!");
    } catch (error) {
      toast.error("Failed to calculate SEO score");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="SEO Score Calculator"
      description="Calculate your website's overall SEO score and identify areas for improvement"
      toolType="SEO_SCORE"
      onSubmit={calculateScore}
    >
      {score && (
        <div className="mt-8 space-y-6">
          {/* Overall Score */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold">{score.overall}</div>
              <Progress value={score.overall} className="flex-1" />
            </div>
          </Card>

          {/* Category Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Technical SEO</h4>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">
                  {score.categories.technical}
                </div>
                <Progress
                  value={score.categories.technical}
                  className="flex-1"
                />
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">Content Quality</h4>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">
                  {score.categories.content}
                </div>
                <Progress value={score.categories.content} className="flex-1" />
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">Performance</h4>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">
                  {score.categories.performance}
                </div>
                <Progress
                  value={score.categories.performance}
                  className="flex-1"
                />
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">Accessibility</h4>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">
                  {score.categories.accessibility}
                </div>
                <Progress
                  value={score.categories.accessibility}
                  className="flex-1"
                />
              </div>
            </Card>
          </div>

          {/* Issues */}
          <div className="space-y-4">
            {score.issues.critical.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-2">
                  Critical Issues
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {score.issues.critical.map((issue, index) => (
                    <li key={index} className="text-red-600">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {score.issues.warning.length > 0 && (
              <div>
                <h4 className="font-semibold text-yellow-600 mb-2">Warnings</h4>
                <ul className="list-disc list-inside space-y-1">
                  {score.issues.warning.map((issue, index) => (
                    <li key={index} className="text-yellow-600">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {score.issues.info.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">
                  Suggestions
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {score.issues.info.map((issue, index) => (
                    <li key={index} className="text-blue-600">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </SEOToolBase>
  );
}
