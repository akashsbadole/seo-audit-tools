import { AuditForm } from "@/components/audit-form";
import { AboutSection } from "@/components/about-section";
import { ContactForm } from "@/components/contact-form";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SeoauditHeroSection } from "@/components/seoaudit-hero-section";
import { SeoauditFeatures } from "@/components/seoaudit-features";
import { SeoauditPricing } from "@/components/seoaudit-pricing";
import { SeoauditTestimonials } from "@/components/seoaudit-testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <SeoauditHeroSection />
      <SeoauditFeatures />
      <SeoauditTestimonials />
      <SeoauditPricing />
      
      {/* <section className="py-24 bg-[#0a0a0f] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Get Your Free SEO Audit
            </h2>
            <p className="text-xl text-gray-400">
              Enter your website URL below for an instant SEO analysis
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <AuditForm />
          </div>
        </div>
      </section> */}

      {/* <AboutSection />
      <ContactForm /> */}
      <ScrollToTop />
    </main>
  );
}
