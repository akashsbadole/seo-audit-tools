import { Metadata } from "next";
import { BrokenLinkChecker } from "@/components/tools/broken-link-checker";

export const metadata: Metadata = {
  title: "Broken Link Checker - Premium SEO Tool",
  description: "Find broken links (404s), redirects, and server errors across your website. Comprehensive link analysis with detailed reports.",
  keywords: ["broken links", "404 checker", "link validator", "SEO tool", "website audit"],
};

export default function BrokenLinksPage() {
  return (
    <div className="container mx-auto py-8">
      <BrokenLinkChecker />
    </div>
  );
}