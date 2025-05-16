"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CanonicalCheck {
  hasCanonical: boolean;
  canonicalUrl: string | null;
  isSelfReferencing: boolean;
  isAbsolute: boolean;
  matchesCurrentUrl: boolean;
  issues: {
    severity: "error" | "warning" | "info";
    message: string;
  }[];
}

export function CanonicalURLChecker() {
  const [check, setCheck] = useState<CanonicalCheck | null>(null);

  const checkCanonical = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "CANONICAL_URL",
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check canonical URL");
      }

      const data = await response.json();
      setCheck(data.check);
      toast.success("Canonical URL check completed!");
    } catch (error) {
      toast.error("Failed to check canonical URL");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="Canonical URL Checker"
      description="Check if your page has a proper canonical URL tag and if it's correctly configured"
      toolType="CANONICAL_URL"
      onSubmit={checkCanonical}
    >
      {check && (
        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Canonical URL Check Results
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant={check.hasCanonical ? "default" : "destructive"}>
                  {check.hasCanonical ? "Found" : "Not Found"}
                </Badge>
                {check.canonicalUrl && (
                  <span className="text-sm text-muted-foreground">
                    {check.canonicalUrl}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Self-Referencing</p>
                  <Badge
                    variant={check.isSelfReferencing ? "default" : "secondary"}
                  >
                    {check.isSelfReferencing ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Absolute URL</p>
                  <Badge variant={check.isAbsolute ? "default" : "secondary"}>
                    {check.isAbsolute ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Matches Current URL</p>
                  <Badge
                    variant={check.matchesCurrentUrl ? "default" : "secondary"}
                  >
                    {check.matchesCurrentUrl ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {check.issues.length > 0 && (
                <div className="space-y-4">
                  {check.issues.map((issue, index) => (
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
                      </div>
                      <p className="mt-1 text-sm">{issue.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </SEOToolBase>
  );
}
