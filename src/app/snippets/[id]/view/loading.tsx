// Skeleton for the snippet view route — mirrors the card + code block layout.
export default function Loading() {
  return (
    <div className="pb-12 max-w-4xl mx-auto animate-pulse">
      <div className="mb-6 h-4 w-32 bg-surface-container" />

      <div className="card-container overflow-hidden flex flex-col">
        <div className="p-5 flex flex-col gap-4">
          <div className="space-y-2">
            <div className="h-6 w-1/2 bg-surface-container-high" />
            <div className="h-3 w-3/4 bg-surface-container" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-surface-container-high" />
            <div className="h-6 w-16 bg-surface-container" />
          </div>
        </div>
        <div className="p-4 bg-background border-t border-[rgba(255,255,255,0.05)] flex items-center gap-2">
          <div className="w-6 h-6 bg-surface-container" />
          <div className="h-3 w-28 bg-surface-container" />
        </div>
      </div>

      <div className="mt-8 border border-outline-variant bg-surface-container-lowest">
        <div className="h-11 bg-surface-container border-b border-outline-variant" />
        <div className="p-4 space-y-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-3 bg-surface-container"
              style={{ width: `${90 - ((i * 7) % 45)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
