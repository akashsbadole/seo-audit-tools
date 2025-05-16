import { TitleTagPreview } from "@/components/title-tag-preview";

export default function TitlePreviewPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Title Tag Preview</h1>
        <p className="text-muted-foreground mb-8">
          Preview how your title tag will appear in search results and get
          optimization suggestions. This tool helps you create effective title
          tags that attract clicks and improve SEO.
        </p>
        <TitleTagPreview />
      </div>
    </div>
  );
}
