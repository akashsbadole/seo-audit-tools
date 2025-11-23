"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";

interface InternalLink {
  url: string;
  text: string;
  isBroken: boolean;
  statusCode?: number;
  isNoFollow: boolean;
  isExternal: boolean;
  anchorText: string;
}

export function InternalLinkingAnalyzer() {
  const [results, setResults] = useState<InternalLink[]>([]);

  const analyzeLinks = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "INTERNAL_LINKS",
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze internal links");
      }

      const data = await response.json();
      setResults(data.links);
      toast.success("Internal links analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze internal links");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="Internal Linking Analyzer"
      description="Analyze internal links and identify opportunities for improvement"
      toolType="INTERNAL_LINKS"
      onSubmit={analyzeLinks}
    >
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link Text
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issues
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((link, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {link.anchorText}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {link.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {link.isBroken ? (
                        <span className="text-red-600">
                          Broken ({link.statusCode})
                        </span>
                      ) : (
                        <span className="text-green-600">Working</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {link.isExternal ? "External" : "Internal"}
                      {link.isNoFollow && " (NoFollow)"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {link.isBroken && (
                          <li className="text-red-600">Broken link</li>
                        )}
                        {link.isNoFollow && (
                          <li className="text-yellow-600">
                            NoFollow attribute
                          </li>
                        )}
                        {link.anchorText.length < 3 && (
                          <li className="text-yellow-600">Short anchor text</li>
                        )}
                      </ul>
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
