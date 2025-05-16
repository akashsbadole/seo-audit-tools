import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface UsageStatus {
  freeReportsUsed: number;
  freeSearchesUsed: number;
  isPremium: boolean;
}

export function UsageStatus() {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      if (!session?.user?.email) return;

      try {
        const response = await fetch("/api/usage");
        const data = await response.json();
        setUsage(data);
      } catch (error) {
        console.error("Error fetching usage:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, [session]);

  if (!session) {
    return null;
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading usage status...</div>;
  }

  if (!usage) {
    return (
      <div className="text-sm text-gray-500">Error loading usage status</div>
    );
  }

  const reportsRemaining = Math.max(0, 10 - usage.freeReportsUsed);
  const searchesRemaining = Math.max(0, 10 - usage.freeSearchesUsed);

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Your Usage Status</h3>

      {usage.isPremium ? (
        <div className="text-green-600 font-medium">
          You have unlimited access with Premium!
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Free Reports:</span>
            <span className="font-medium">
              {reportsRemaining} of 10 remaining
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Free Searches:</span>
            <span className="font-medium">
              {searchesRemaining} of 10 remaining
            </span>
          </div>

          <Button
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // TODO: Implement premium upgrade flow
              window.location.href = "/upgrade";
            }}
          >
            Upgrade to Premium
          </Button>
        </div>
      )}
    </div>
  );
}
