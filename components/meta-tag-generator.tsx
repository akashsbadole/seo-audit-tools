"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function MetaTagGenerator() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    url: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const generateMetaTags = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!formData.title || !formData.description || !formData.url) {
        toast.error("Title, description, and URL are required");
        return;
      }

      // Call the API
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "META_TAGS",
          url: formData.url,
          data: formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate meta tags");
      }

      const result = await response.json();

      // Generate meta tags
      const metaTags = `
<!-- Primary Meta Tags -->
<title>${formData.title}</title>
<meta name="title" content="${formData.title}">
<meta name="description" content="${formData.description}">
<meta name="keywords" content="${formData.keywords}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${formData.url}">
<meta property="og:title" content="${formData.ogTitle || formData.title}">
<meta property="og:description" content="${
        formData.ogDescription || formData.description
      }">
<meta property="og:image" content="${formData.ogImage}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${formData.url}">
<meta property="twitter:title" content="${formData.ogTitle || formData.title}">
<meta property="twitter:description" content="${
        formData.ogDescription || formData.description
      }">
<meta property="twitter:image" content="${formData.ogImage}">
      `.trim();

      // Copy to clipboard
      await navigator.clipboard.writeText(metaTags);
      toast.success("Meta tags copied to clipboard!");
    } catch (error) {
      console.error("Error generating meta tags:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate meta tags"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Tag Generator</CardTitle>
        <CardDescription>
          Generate optimized meta tags for your web pages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Page URL</Label>
              <Input
                id="url"
                placeholder="Enter your page URL"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                placeholder="Enter your page title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                placeholder="Enter your meta description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="Enter keywords (comma-separated)"
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogTitle">Open Graph Title (optional)</Label>
              <Input
                id="ogTitle"
                placeholder="Enter Open Graph title"
                value={formData.ogTitle}
                onChange={(e) =>
                  setFormData({ ...formData, ogTitle: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogDescription">
                Open Graph Description (optional)
              </Label>
              <Textarea
                id="ogDescription"
                placeholder="Enter Open Graph description"
                value={formData.ogDescription}
                onChange={(e) =>
                  setFormData({ ...formData, ogDescription: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImage">Open Graph Image URL (optional)</Label>
              <Input
                id="ogImage"
                placeholder="Enter image URL"
                value={formData.ogImage}
                onChange={(e) =>
                  setFormData({ ...formData, ogImage: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            onClick={generateMetaTags}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate & Copy Meta Tags"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
