import { CanonicalURLChecker } from "@/components/canonical-url-checker";

export default function CanonicalURLPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Canonical URL Checker</h1>
        <p className="text-muted-foreground mb-8">
          Check if your page has a proper canonical URL tag and ensure it's
          correctly configured to prevent duplicate content issues.
        </p>
        <CanonicalURLChecker />
      </div>
    </div>
  );
}
