import { SEOScoreCalculator } from "@/components/seo-score-calculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SEOScorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tool Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="seoaudit-container py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              SEO Score{" "}
              <span className="seoaudit-gradient-text">Calculator</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get a comprehensive analysis of your website's SEO performance
              with actionable insights
            </p>
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="seoaudit-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What is SEO Score */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What is an SEO Score?
              </h2>
              <p className="text-gray-600 mb-6">
                An SEO score is a comprehensive metric that evaluates your
                website's search engine optimization across multiple factors. It
                helps identify strengths and weaknesses in your SEO strategy and
                provides actionable insights for improvement.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Scoring Categories
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        title: "Technical SEO",
                        desc: "Site structure and performance",
                      },
                      {
                        title: "Content Quality",
                        desc: "Relevance and optimization",
                      },
                      {
                        title: "User Experience",
                        desc: "Mobile and accessibility",
                      },
                      {
                        title: "Performance",
                        desc: "Loading speed and Core Web Vitals",
                      },
                      {
                        title: "Authority",
                        desc: "Backlinks and trust signals",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-[hsl(var(--seoaudit-orange))] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Key Metrics
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        title: "Page Speed",
                        desc: "Loading and interaction times",
                      },
                      {
                        title: "Mobile-Friendliness",
                        desc: "Responsive design",
                      },
                      { title: "On-Page SEO", desc: "Meta tags and content" },
                      { title: "Security", desc: "HTTPS and safety measures" },
                      { title: "Crawlability", desc: "Search engine access" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-[hsl(var(--seoaudit-light-blue))] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Interpretation */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Score Interpretation
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Score Range
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Rating
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Action Required
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        range: "90 - 100",
                        rating: "Excellent",
                        action: "Maintain and monitor",
                        color: "text-green-600",
                      },
                      {
                        range: "80 - 89",
                        rating: "Good",
                        action: "Minor improvements needed",
                        color: "text-blue-600",
                      },
                      {
                        range: "70 - 79",
                        rating: "Fair",
                        action: "Several issues to address",
                        color: "text-yellow-600",
                      },
                      {
                        range: "60 - 69",
                        rating: "Poor",
                        action: "Significant work required",
                        color: "text-orange-600",
                      },
                      {
                        range: "Below 60",
                        rating: "Critical",
                        action: "Immediate attention needed",
                        color: "text-red-600",
                      },
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">{item.range}</td>
                        <td className={`py-3 px-4 font-medium ${item.color}`}>
                          {item.rating}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {item.action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Key Factors Weighted:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[hsl(var(--seoaudit-orange))] rounded-full mr-2"></div>
                    <span>Technical SEO: 25%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[hsl(var(--seoaudit-light-blue))] rounded-full mr-2"></div>
                    <span>Content Quality: 20%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[hsl(var(--seoaudit-green))] rounded-full mr-2"></div>
                    <span>User Experience: 20%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[hsl(var(--seoaudit-purple))] rounded-full mr-2"></div>
                    <span>Performance: 15%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    <span>Authority: 20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Score Calculator Tool */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Calculate Your SEO Score
            </h2>
            <SEOScoreCalculator />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Best Practices */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Best Practices
            </h3>
            <div className="space-y-3">
              {[
                "Regularly monitor your SEO score",
                "Focus on critical issues first",
                "Implement recommended fixes",
                "Track score changes over time",
                "Compare with competitors",
              ].map((practice, index) => (
                <div key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">{practice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Common Issues
            </h3>
            <div className="space-y-3">
              {[
                "Missing or duplicate meta tags",
                "Slow page load times",
                "Poor mobile optimization",
                "Broken links and 404 errors",
                "Thin or duplicate content",
                "Missing image alt text",
              ].map((issue, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{issue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[hsl(var(--seoaudit-orange))] to-[hsl(var(--seoaudit-light-blue))] rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Need Professional Help?</h3>
            <p className="mb-4 text-sm opacity-90">
              Our SEO experts can help you achieve perfect scores and dominate
              search rankings.
            </p>
            <button className="w-full bg-white text-[hsl(var(--seoaudit-orange))] font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              Get SEO Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
