import { MetaTagsGenerator } from "@/components/meta-tags-generator";

export default function MetaTagGeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Meta Tag Generator</h1>
      <MetaTagsGenerator />
    </div>
  );
}
