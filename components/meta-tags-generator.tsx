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
import { Copy, Check } from "lucide-react";

export function MetaTagsGenerator() {
  const [metaData, setMetaData] = useState({
    title: "",
    description: "",
    keywords: "",
    author: "",
    robots: "index, follow",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogUrl: "",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    canonicalUrl: "",
    revisitAfter: "1 days",
    geoRegion: "",
    geoPlacename: "",
    geoPosition: "",
    icbm: "",
    distribution: "global",
    rating: "general",
    breadcrumbItems: JSON.stringify([
      { position: 1, name: "Home", item: "" },
      { position: 2, name: "Category", item: "" },
    ]),
    articleHeadline: "",
    articleDescription: "",
    articleAuthor: "",
    articleDatePublished: "",
  });

  const [copied, setCopied] = useState(false);

  const generateMetaTags = () => {
    return `<!-- Primary Meta Tags -->
<title>${metaData.title}</title>
<meta name="title" content="${metaData.title}">
<meta name="description" content="${metaData.description}">
<meta name="keywords" content="${metaData.keywords}">
<meta name="author" content="${metaData.author}">
<meta name="robots" content="${metaData.robots}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${metaData.ogType}">
<meta property="og:url" content="${metaData.ogUrl}">
<meta property="og:title" content="${metaData.ogTitle || metaData.title}">
<meta property="og:description" content="${metaData.ogDescription || metaData.description}">
<meta property="og:image" content="${metaData.ogImage}">

<!-- Twitter -->
<meta property="twitter:card" content="${metaData.twitterCard}">
<meta property="twitter:url" content="${metaData.ogUrl}">
<meta property="twitter:title" content="${metaData.twitterTitle || metaData.title}">
<meta property="twitter:description" content="${metaData.twitterDescription || metaData.description}">
<meta property="twitter:image" content="${metaData.twitterImage || metaData.ogImage}">

<!-- Canonical URL -->
<link rel="canonical" href="${metaData.canonicalUrl}">

<!-- Additional SEO Meta Tags -->
<meta name="revisit-after" content="${metaData.revisitAfter}">
${metaData.geoRegion ? `<meta name="geo.region" content="${metaData.geoRegion}">` : ""}
${metaData.geoPlacename ? `<meta name="geo.placename" content="${metaData.geoPlacename}">` : ""}
${metaData.geoPosition ? `<meta name="geo.position" content="${metaData.geoPosition}">` : ""}
${metaData.icbm ? `<meta name="ICBM" content="${metaData.icbm}">` : ""}
<meta name="distribution" content="${metaData.distribution}">
<meta name="rating" content="${metaData.rating}">

<!-- Structured Data -->
${
  metaData.breadcrumbItems
    ? `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": ${metaData.breadcrumbItems}
}
</script>`
    : ""
}

${
  metaData.articleHeadline
    ? `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${metaData.articleHeadline}",
  "description": "${metaData.articleDescription}",
  "author": "${metaData.articleAuthor}",
  "datePublished": "${metaData.articleDatePublished}"
}
</script>`
    : ""
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMetaTags());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Meta Tags Generator</CardTitle>
        <CardDescription>
          Generate all necessary meta tags for your website's SEO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={metaData.title}
                onChange={(e) =>
                  setMetaData({ ...metaData, title: e.target.value })
                }
                placeholder="Website Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                value={metaData.description}
                onChange={(e) =>
                  setMetaData({ ...metaData, description: e.target.value })
                }
                placeholder="Website Description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={metaData.keywords}
                onChange={(e) =>
                  setMetaData({ ...metaData, keywords: e.target.value })
                }
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={metaData.author}
                onChange={(e) =>
                  setMetaData({ ...metaData, author: e.target.value })
                }
                placeholder="Author Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ogUrl">Open Graph URL</Label>
              <Input
                id="ogUrl"
                value={metaData.ogUrl}
                onChange={(e) =>
                  setMetaData({ ...metaData, ogUrl: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ogImage">Open Graph Image</Label>
              <Input
                id="ogImage"
                value={metaData.ogImage}
                onChange={(e) =>
                  setMetaData({ ...metaData, ogImage: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={metaData.canonicalUrl}
                onChange={(e) =>
                  setMetaData({ ...metaData, canonicalUrl: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revisitAfter">Revisit After</Label>
              <Input
                id="revisitAfter"
                value={metaData.revisitAfter}
                onChange={(e) =>
                  setMetaData({ ...metaData, revisitAfter: e.target.value })
                }
                placeholder="1 days"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="geoRegion">Geo Region</Label>
              <Input
                id="geoRegion"
                value={metaData.geoRegion}
                onChange={(e) =>
                  setMetaData({ ...metaData, geoRegion: e.target.value })
                }
                placeholder="US"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="geoPlacename">Geo Place Name</Label>
              <Input
                id="geoPlacename"
                value={metaData.geoPlacename}
                onChange={(e) =>
                  setMetaData({ ...metaData, geoPlacename: e.target.value })
                }
                placeholder="New York"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="geoPosition">Geo Position</Label>
              <Input
                id="geoPosition"
                value={metaData.geoPosition}
                onChange={(e) =>
                  setMetaData({ ...metaData, geoPosition: e.target.value })
                }
                placeholder="40.7128;-74.0060"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icbm">ICBM</Label>
              <Input
                id="icbm"
                value={metaData.icbm}
                onChange={(e) =>
                  setMetaData({ ...metaData, icbm: e.target.value })
                }
                placeholder="40.7128, -74.0060"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distribution">Distribution</Label>
              <Input
                id="distribution"
                value={metaData.distribution}
                onChange={(e) =>
                  setMetaData({ ...metaData, distribution: e.target.value })
                }
                placeholder="global"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                value={metaData.rating}
                onChange={(e) =>
                  setMetaData({ ...metaData, rating: e.target.value })
                }
                placeholder="general"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="breadcrumbItems">Breadcrumb Items (JSON)</Label>
              <Textarea
                id="breadcrumbItems"
                value={metaData.breadcrumbItems}
                onChange={(e) =>
                  setMetaData({ ...metaData, breadcrumbItems: e.target.value })
                }
                placeholder='[{"position": 1, "name": "Home", "item": "https://yourwebsite.com"}]'
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="articleHeadline">Article Headline</Label>
              <Input
                id="articleHeadline"
                value={metaData.articleHeadline}
                onChange={(e) =>
                  setMetaData({ ...metaData, articleHeadline: e.target.value })
                }
                placeholder="Article Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="articleDescription">Article Description</Label>
              <Textarea
                id="articleDescription"
                value={metaData.articleDescription}
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    articleDescription: e.target.value,
                  })
                }
                placeholder="Article Description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="articleAuthor">Article Author</Label>
              <Input
                id="articleAuthor"
                value={metaData.articleAuthor}
                onChange={(e) =>
                  setMetaData({ ...metaData, articleAuthor: e.target.value })
                }
                placeholder="Author Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="articleDatePublished">
                Article Date Published
              </Label>
              <Input
                id="articleDatePublished"
                type="date"
                value={metaData.articleDatePublished}
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    articleDatePublished: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <Label>Generated Meta Tags</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <pre className="bg-indigo-200 p-4 rounded-md overflow-auto text-sm">
                <code>{generateMetaTags()}</code>
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
