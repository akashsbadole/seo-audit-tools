import { HeaderTagChecker } from "@/components/header-tag-checker";

export default function HeaderTagCheckerPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Header Tag Checker</h1>
        <p className="text-gray-600">
          Analyze your page's header structure and identify potential SEO
          issues.
        </p>
      </div>
      <HeaderTagChecker />
    </div>
  );
}
