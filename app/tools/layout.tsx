export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add custom authentication check when needed
  // For now, remove authentication requirement

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tools Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="seoaudit-container py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              SEO Tools &{" "}
              <span className="seoaudit-gradient-text">Utilities</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade SEO tools to help you optimize your website,
              analyze competitors, and improve your search rankings
            </p>
          </div>
        </div>
      </div>

      {/* Tools Content */}
      <div className="seoaudit-container py-12">{children}</div>
    </div>
  );
}
