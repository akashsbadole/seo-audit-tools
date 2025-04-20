"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"

export function OpenGraphGenerator() {
  const [ogData, setOgData] = useState({
    title: "",
    description: "",
    url: "",
    type: "website",
    image: "",
    audio: "",
    video: "",
    determiner: "",
    locale: "en_US",
    alternateLocales: "",
    siteName: "",
  })

  const [copied, setCopied] = useState(false)

  const generateOpenGraphTags = () => {
    return `<!-- Open Graph / Facebook -->
<meta property="og:type" content="${ogData.type}">
<meta property="og:url" content="${ogData.url}">
<meta property="og:title" content="${ogData.title}">
<meta property="og:description" content="${ogData.description}">
<meta property="og:image" content="${ogData.image}">
${ogData.audio ? `<meta property="og:audio" content="${ogData.audio}">` : ""}
${ogData.video ? `<meta property="og:video" content="${ogData.video}">` : ""}
${ogData.determiner ? `<meta property="og:determiner" content="${ogData.determiner}">` : ""}
<meta property="og:locale" content="${ogData.locale}">
${ogData.alternateLocales ? ogData.alternateLocales.split(",").map(locale => 
  `<meta property="og:locale:alternate" content="${locale.trim()}">`
).join("\n") : ""}
${ogData.siteName ? `<meta property="og:site_name" content="${ogData.siteName}">` : ""}`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOpenGraphTags())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Open Graph Meta Tags Generator</CardTitle>
        <CardDescription>
          Generate Open Graph meta tags for better social media sharing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={ogData.title}
                onChange={(e) => setOgData({ ...ogData, title: e.target.value })}
                placeholder="Page Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={ogData.description}
                onChange={(e) => setOgData({ ...ogData, description: e.target.value })}
                placeholder="Page Description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={ogData.url}
                onChange={(e) => setOgData({ ...ogData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={ogData.type}
                onChange={(e) => setOgData({ ...ogData, type: e.target.value })}
                placeholder="website"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={ogData.image}
                onChange={(e) => setOgData({ ...ogData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio">Audio URL</Label>
              <Input
                id="audio"
                value={ogData.audio}
                onChange={(e) => setOgData({ ...ogData, audio: e.target.value })}
                placeholder="https://example.com/audio.mp3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Video URL</Label>
              <Input
                id="video"
                value={ogData.video}
                onChange={(e) => setOgData({ ...ogData, video: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="determiner">Determiner</Label>
              <Input
                id="determiner"
                value={ogData.determiner}
                onChange={(e) => setOgData({ ...ogData, determiner: e.target.value })}
                placeholder="the"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Input
                id="locale"
                value={ogData.locale}
                onChange={(e) => setOgData({ ...ogData, locale: e.target.value })}
                placeholder="en_US"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alternateLocales">Alternate Locales</Label>
              <Input
                id="alternateLocales"
                value={ogData.alternateLocales}
                onChange={(e) => setOgData({ ...ogData, alternateLocales: e.target.value })}
                placeholder="fr_FR, es_ES"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={ogData.siteName}
                onChange={(e) => setOgData({ ...ogData, siteName: e.target.value })}
                placeholder="Website Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label>Generated Open Graph Tags</Label>
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
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                <code>{generateOpenGraphTags()}</code>
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 