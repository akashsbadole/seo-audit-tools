import { DescriptionTagPreview } from "@/components/description-tag-preview";

export default function DescriptionPreviewPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Meta Description Preview</h1>
        <p className="text-muted-foreground mb-8">
          Preview how your meta description will appear in search results and
          get optimization suggestions. This tool helps you create compelling
          meta descriptions that improve click-through rates and SEO
          performance.
        </p>
        <DescriptionTagPreview />
      </div>
    </div>
  );
}
