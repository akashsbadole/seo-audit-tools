"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";

interface HeaderTag {
  level: number;
  text: string;
  hasKeyword: boolean;
  issues: string[];
}

export function HeaderTagChecker() {
  const [results, setResults] = useState<HeaderTag[]>([]);

  const analyzeHeaders = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "HEADER_TAGS",
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze header tags");
      }

      const data = await response.json();
      setResults(data.headers);
    } catch (error) {
      toast.error("Failed to analyze header tags");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="Header Tag Checker"
      description="Analyze your page's header structure and identify potential SEO issues."
      toolType="HEADER_TAGS"
      onSubmit={analyzeHeaders}
    >
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Text
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issues
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((header, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      H{header.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {header.text}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {header.issues.length === 0 ? (
                        <span className="text-green-600">Good</span>
                      ) : (
                        <span className="text-red-600">Issues Found</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {header.issues.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {header.issues.map((issue, i) => (
                            <li key={i} className="text-red-600">
                              {issue}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-green-600">No issues</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SEOToolBase>
  );
}
