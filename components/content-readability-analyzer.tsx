"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReadabilityScore {
  overall: number;
  metrics: {
    fleschKincaid: number;
    gunningFog: number;
    colemanLiau: number;
    smog: number;
    automatedReadability: number;
  };
  suggestions: string[];
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  averageWordsPerSentence: number;
}

export function ContentReadabilityAnalyzer() {
  const [score, setScore] = useState<ReadabilityScore | null>(null);

  const analyzeReadability = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "READABILITY",
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze readability");
      }

      const data = await response.json();
      setScore(data.score);
      toast.success("Readability analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze readability");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="Content Readability Analyzer"
      description="Analyze your content's readability using various metrics and get suggestions for improvement"
      toolType="READABILITY"
      onSubmit={analyzeReadability}
    >
      {score && (
        <div className="mt-8 space-y-6">
          {/* Overall Score */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Overall Readability Score
            </h3>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold">{score.overall}</div>
              <Progress value={score.overall} className="flex-1" />
            </div>
          </Card>

          {/* Content Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Content Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Word Count</p>
                <p className="text-2xl font-bold">{score.wordCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sentences</p>
                <p className="text-2xl font-bold">{score.sentenceCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paragraphs</p>
                <p className="text-2xl font-bold">{score.paragraphCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg. Words/Sentence
                </p>
                <p className="text-2xl font-bold">
                  {score.averageWordsPerSentence.toFixed(1)}
                </p>
              </div>
            </div>
          </Card>

          {/* Readability Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Readability Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Flesch-Kincaid Grade Level</span>
                  <span className="font-medium">
                    {score.metrics.fleschKincaid.toFixed(1)}
                  </span>
                </div>
                <Progress value={score.metrics.fleschKincaid} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Gunning Fog Index</span>
                  <span className="font-medium">
                    {score.metrics.gunningFog.toFixed(1)}
                  </span>
                </div>
                <Progress value={score.metrics.gunningFog} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Coleman-Liau Index</span>
                  <span className="font-medium">
                    {score.metrics.colemanLiau.toFixed(1)}
                  </span>
                </div>
                <Progress value={score.metrics.colemanLiau} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>SMOG Index</span>
                  <span className="font-medium">
                    {score.metrics.smog.toFixed(1)}
                  </span>
                </div>
                <Progress value={score.metrics.smog} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Automated Readability Index</span>
                  <span className="font-medium">
                    {score.metrics.automatedReadability.toFixed(1)}
                  </span>
                </div>
                <Progress
                  value={score.metrics.automatedReadability}
                  className="h-2"
                />
              </div>
            </div>
          </Card>

          {/* Suggestions */}
          {score.suggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Suggestions for Improvement
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {score.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-muted-foreground">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </SEOToolBase>
  );
}
