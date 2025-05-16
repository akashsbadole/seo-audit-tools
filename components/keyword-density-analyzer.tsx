"use client";

import { useState } from "react";
import { SEOToolBase } from "@/components/seo-tool-base";
import { toast } from "sonner";

interface KeywordDensity {
  word: string;
  count: number;
  density: number;
}

export function KeywordDensityAnalyzer() {
  const [results, setResults] = useState<KeywordDensity[]>([]);

  const analyzeDensity = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "KEYWORD_DENSITY",
          url,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage;
        try {
          const error = JSON.parse(text);
          errorMessage = error.error;
        } catch {
          errorMessage = text;
        }
        toast.error(errorMessage || "Failed to analyze keyword density");
        return;
      }

      const result = await response.json();
      setResults(result.result.keywords);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("An error occurred while analyzing keyword density");
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <SEOToolBase
        title="Keyword Density Analyzer"
        description="Analyze keyword density in your content"
        toolType="KEYWORD_DENSITY"
        onSubmit={analyzeDensity}
      />

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Density
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((keyword, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {keyword.word}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.density.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
