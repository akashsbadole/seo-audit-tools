import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block p-2 bg-indigo-800 rounded-full mb-4">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Comprehensive SEO Audit Tool
          </h1>
          <p className="text-xl text-indigo-200 mb-8">
            Analyze your website's SEO performance and get actionable insights to improve your search engine rankings
          </p>
          <Button 
            size="lg" 
            className="rounded-full px-8 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none"
          >
            Start Your Audit <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
