import { StructuredDataValidator } from "@/components/structured-data-validator";

export default function StructuredDataPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Structured Data Validator</h1>
        <p className="text-muted-foreground mb-8">
          Validate your structured data (JSON-LD) against schema.org guidelines
          and ensure it's properly formatted for search engines.
        </p>
        <StructuredDataValidator />
      </div>
    </div>
  );
}
