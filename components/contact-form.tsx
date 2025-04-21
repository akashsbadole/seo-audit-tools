"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ContactError } from "@/components/contact-error"

export function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setSuccess(true)
      setFormData({ fullName: "", email: "", message: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-green-600">Message Sent!</h3>
        <p className="text-gray-600">Thank you for your message. We'll get back to you soon.</p>
        <Button 
          variant="outline" 
          onClick={() => {
            setSuccess(false)
            setFormData({ fullName: "", email: "", message: "" })
          }}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <div id="contact" className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gradient-to-b from-indigo-50 to-purple-50 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-indigo-900">Contact Us</CardTitle>
            <CardDescription className="text-center text-lg text-indigo-700">
              Have questions? We'd love to hear from you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <ContactError error={error} onRetry={handleRetry} />}
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-indigo-900">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                  className={`bg-white border-indigo-200 focus:border-indigo-500`}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-indigo-900">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className={`bg-white border-indigo-200 focus:border-indigo-500`}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-indigo-900">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message here..."
                  required
                  className={`bg-white border-indigo-200 focus:border-indigo-500 min-h-[150px]`}
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 