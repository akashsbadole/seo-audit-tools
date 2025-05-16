import { RobotsTxtGenerator } from "@/components/robots-txt-generator";

export default function RobotsTxtPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Robots.txt Generator</h1>
        <p className="text-muted-foreground mb-8">
          Generate a robots.txt file to control search engine crawling behavior
          on your website.
        </p>
        <RobotsTxtGenerator />
      </div>
    </div>
  );
}
