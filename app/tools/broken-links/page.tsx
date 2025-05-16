import { BrokenLinkFinder } from "@/components/broken-link-finder";

export default function BrokenLinksPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Broken Link Finder</h1>
        <p className="text-gray-600">
          Find and fix broken links on your website to improve user experience
          and SEO.
        </p>
      </div>
      <BrokenLinkFinder />
    </div>
  );
}
