import { AuditForm } from "@/components/audit-form"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ContactForm } from "@/components/contact-form"
import { ScrollToTop } from "@/components/scroll-to-top"
import { PremiumFeatures } from "@/components/premium-features"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <HeroSection />
      <div id="seo-audit" className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <AuditForm />
        </div>
      </div>
      <PremiumFeatures />
      <AboutSection />
      <ContactForm />
      <ScrollToTop />
    </main>
  )
}
