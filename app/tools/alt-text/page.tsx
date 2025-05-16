import { ImageAltChecker } from "@/components/image-alt-checker";

export default function AltTextPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Alt Text Checker</h1>
        <p className="text-gray-600">
          Check if your images have proper alt text for SEO and accessibility.
        </p>
      </div>
      <ImageAltChecker />
    </div>
  );
}
