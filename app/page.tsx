import { AuditForm } from "@/components/audit-form"
import { HeroSection } from "@/components/hero-section"
import { SEOMetaTags } from "@/components/seo-meta-tags"
import { MetaTagsGenerator } from "@/components/meta-tags-generator"
import { OpenGraphGenerator } from "@/components/open-graph-generator"
import { CampaignUrlBuilder } from "@/components/campaign-url-builder"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <HeroSection />
      <div id="seo-audit" className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <AuditForm />
          <SEOMetaTags />
        </div>
      </div>
      
      <div id="meta-tags" className="container mx-auto px-4 py-12 bg-gradient-to-b from-indigo-100 to-purple-100">
        <div className="max-w-3xl mx-auto">
          <MetaTagsGenerator />
        </div>
      </div>

      <div id="open-graph" className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <OpenGraphGenerator />
        </div>
      </div>

      <div id="campaign-url-builder" className="container mx-auto px-4 py-12 bg-gradient-to-b from-indigo-100 to-purple-100">
        <div className="max-w-3xl mx-auto">
          <CampaignUrlBuilder />
        </div>
      </div>
      <ScrollToTop />
    </main>
  )
}
