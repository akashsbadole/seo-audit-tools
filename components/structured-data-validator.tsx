"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface StructuredDataValidation {
  valid: boolean;
  type: string;
  issues: {
    severity: "error" | "warning" | "info";
    message: string;
    path?: string;
  }[];
  preview: {
    json: any;
    formatted: string;
  };
}

export function StructuredDataValidator() {
  const [validation, setValidation] = useState<StructuredDataValidation | null>(
    null
  );
  const [customJson, setCustomJson] = useState("");

  const validateStructuredData = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "STRUCTURED_DATA",
          url,
          customJson: customJson || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to validate structured data");
      }

      const data = await response.json();
      setValidation(data.validation);
      toast.success("Structured data validation completed!");
    } catch (error) {
      toast.error("Failed to validate structured data");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="Structured Data Validator"
      description="Validate your structured data (JSON-LD) and ensure it follows schema.org guidelines"
      toolType="STRUCTURED_DATA"
      onSubmit={validateStructuredData}
    >
      <div className="mt-8 space-y-6">
        {/* Custom JSON Input */}
        <div className="space-y-2">
          <Label htmlFor="customJson">Custom JSON-LD (Optional)</Label>
          <Textarea
            id="customJson"
            value={customJson}
            onChange={(e) => setCustomJson(e.target.value)}
            placeholder="Enter custom JSON-LD to validate"
            className="h-48 font-mono"
          />
          <p className="text-sm text-muted-foreground">
            Leave empty to validate the current page's structured data
          </p>
        </div>

        {validation && (
          <>
            {/* Validation Results */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant={validation.valid ? "default" : "destructive"}>
                    {validation.valid ? "Valid" : "Invalid"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Type: {validation.type}
                  </span>
                </div>

                {validation.issues.length > 0 && (
                  <div className="space-y-4">
                    {validation.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          issue.severity === "error"
                            ? "bg-red-50 dark:bg-red-900/20"
                            : issue.severity === "warning"
                            ? "bg-yellow-50 dark:bg-yellow-900/20"
                            : "bg-blue-50 dark:bg-blue-900/20"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              issue.severity === "error"
                                ? "destructive"
                                : issue.severity === "warning"
                                ? "secondary"
                                : "secondary"
                            }
                          >
                            {issue.severity}
                          </Badge>
                          {issue.path && (
                            <span className="text-sm text-muted-foreground">
                              {issue.path}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm">{issue.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* JSON Preview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">JSON Preview</h3>
              <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto">
                <code className="text-sm">{validation.preview.formatted}</code>
              </pre>
            </Card>
          </>
        )}
      </div>
    </SEOToolBase>
  );
}
