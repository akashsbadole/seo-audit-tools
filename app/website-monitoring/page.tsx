import { WebsiteMonitor } from "@/components/tracking/website-monitor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Monitoring Tool | SEO Audit Platform",
  description: "Monitor your websites' uptime, performance, and status codes in real-time",
};

export default function WebsiteMonitoringPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Website Monitoring</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track your websites' uptime, response times, and status codes with real-time alerts
          </p>
        </div>
        <WebsiteMonitor />
      </div>
    </div>
  );
}