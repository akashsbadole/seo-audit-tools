import { MobileFriendlinessTester } from "@/components/mobile-friendliness-tester";

export default function MobileFriendlyPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Mobile-Friendliness Tester</h1>
        <p className="text-muted-foreground mb-8">
          Test your website's mobile responsiveness and get detailed
          recommendations for improving the mobile user experience.
        </p>
        <MobileFriendlinessTester />
      </div>
    </div>
  );
}
