import { Coffee } from "lucide-react";

interface BuyMeCoffeeProps {
  username: string;
  className?: string;
}

export function BuyMeCoffee({ username, className = "" }: BuyMeCoffeeProps) {
  return (
    <div className=" ">
      <a
        href={`https://www.buymeacoffee.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-black font-semibold rounded-lg hover:bg-[#FFDD00]/90 transition-colors shadow-lg hover:shadow-xl ${className}`}
      >
        <Coffee className="w-5 h-5" />
        <span>Buy me a coffee</span>
      </a>
    </div>
  );
}
