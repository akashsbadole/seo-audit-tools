"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";

interface BrokenLink {
  url: string;
  statusCode: number;
  sourceUrl: string;
  anchorText: string;
  isInternal: boolean;
  error: string;
}

export function BrokenLinkFinder() {
  const [results, setResults] = useState<BrokenLink[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const findBrokenLinks = async (url: string) => {
    try {
      setIsScanning(true);
      setProgress(0);

      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "BROKEN_LINKS",
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to scan for broken links");
      }

      const data = await response.json();
      setResults(data.links);
      toast.success("Broken links scan complete!");
    } catch (error) {
      toast.error("Failed to scan for broken links");
      console.error(error);
    } finally {
      setIsScanning(false);
      setProgress(100);
    }
  };

  return (
    <SEOToolBase
      title="Broken Link Finder"
      description="Find and fix broken links on your website"
      toolType="BROKEN_LINKS"
      onSubmit={findBrokenLinks}
    >
      {isScanning && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Scanning...
            </span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
            <span className="text-sm text-gray-500">
              Found {results.length} broken links
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Broken Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Found On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anchor Text
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((link, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          link.statusCode >= 500
                            ? "bg-red-100 text-red-800"
                            : link.statusCode >= 400
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {link.statusCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href={link.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {link.sourceUrl}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {link.anchorText || "No anchor text"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {link.error}
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
