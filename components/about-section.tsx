import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Globe, Shield, BarChart } from "lucide-react"

export function AboutSection() {
  return (
    <div id="about" className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gradient-to-b from-indigo-50 to-purple-50 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-indigo-900">About SEOTool</CardTitle>
            <CardDescription className="text-center text-lg text-indigo-700">
              Your Comprehensive SEO Solution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Globe className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900">Global Reach</h3>
                    <p className="text-indigo-700">
                      Our tools help you optimize your website for global audiences, ensuring maximum visibility across search engines.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900">Secure & Reliable</h3>
                    <p className="text-indigo-700">
                      We prioritize your data security and provide reliable tools that you can trust for your SEO needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <BarChart className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900">Data-Driven Insights</h3>
                    <p className="text-indigo-700">
                      Get actionable insights based on comprehensive data analysis to improve your website's performance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900">User-Focused</h3>
                    <p className="text-indigo-700">
                      Our tools are designed with users in mind, providing intuitive interfaces and valuable results.
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-indigo-700">
                  SEOTool is dedicated to helping businesses and individuals improve their online presence through comprehensive SEO analysis and optimization tools. Our platform combines cutting-edge technology with user-friendly interfaces to deliver powerful results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 