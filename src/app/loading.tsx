// Shown during navigation/streaming for the card-grid routes (Discover,
// Profile, Favorites). Pure Tailwind — no extra dependencies.
function SkeletonCard() {
  return (
    <div className="card-container overflow-hidden flex flex-col h-full animate-pulse">
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-5 w-2/3 bg-surface-container-high" />
            <div className="h-3 w-full bg-surface-container" />
            <div className="h-3 w-4/5 bg-surface-container" />
          </div>
          <div className="w-9 h-9 bg-surface-container shrink-0" />
        </div>
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="h-6 w-20 bg-surface-container-high" />
          <div className="h-6 w-16 bg-surface-container" />
        </div>
      </div>
      <div className="px-5 py-4 bg-background border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-surface-container" />
          <div className="h-3 w-24 bg-surface-container" />
        </div>
        <div className="h-3 w-16 bg-surface-container" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="pb-12">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-64 bg-surface-container-high animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-surface-container animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
