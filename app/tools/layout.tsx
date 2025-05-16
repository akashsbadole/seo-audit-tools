import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">{children}</div>
    </div>
  );
}
