import { AuditForm } from "@/components/audit-form"
import { HeroSection } from "@/components/hero-section"
import { SEOMetaTags } from "@/components/seo-meta-tags"
import { MetaTagsGenerator } from "@/components/meta-tags-generator"
import { CampaignUrlBuilder } from "@/components/campaign-url-builder"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <AuditForm />
          <SEOMetaTags />
        </div>
      </div>
      
      <div id="meta-tags" className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <MetaTagsGenerator />
        </div>
      </div>

      <div id="campaign-url-builder" className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <CampaignUrlBuilder />
        </div>
      </div>
    </main>
  )
}
