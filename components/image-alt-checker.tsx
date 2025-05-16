"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";

interface ImageAlt {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  hasAlt: boolean;
  isDecorative: boolean;
  issues: string[];
}

export function ImageAltChecker() {
  const [results, setResults] = useState<ImageAlt[]>([]);

  const analyzeImages = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "ALT_TEXT",
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image alt text");
      }

      const data = await response.json();
      setResults(data.images);
      toast.success("Image alt text analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze image alt text");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="Image Alt Text Checker"
      description="Check if your images have proper alt text for SEO and accessibility"
      toolType="ALT_TEXT"
      onSubmit={analyzeImages}
    >
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alt Text
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
                {results.map((image, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="h-10 w-10 object-cover rounded"
                        />
                        <span className="truncate max-w-xs">{image.src}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {image.alt || "No alt text"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {image.hasAlt ? (
                        <span className="text-green-600">Has Alt Text</span>
                      ) : (
                        <span className="text-red-600">Missing Alt Text</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {image.issues.map((issue, i) => (
                          <li key={i} className="text-red-600">
                            {issue}
                          </li>
                        ))}
                        {!image.hasAlt && (
                          <li className="text-red-600">Missing alt text</li>
                        )}
                        {image.hasAlt && image.alt.length < 3 && (
                          <li className="text-yellow-600">
                            Alt text too short
                          </li>
                        )}
                        {image.hasAlt && image.alt.length > 125 && (
                          <li className="text-yellow-600">Alt text too long</li>
                        )}
                        {!image.width || !image.height ? (
                          <li className="text-yellow-600">
                            Missing dimensions
                          </li>
                        ) : null}
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
