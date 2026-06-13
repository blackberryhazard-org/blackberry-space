// Neutral fallback for the snippet create/edit forms.
export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto pb-12 animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-56 bg-surface-container-high" />
        <div className="h-4 w-80 max-w-full bg-surface-container" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-surface-container" />
            <div className="h-11 w-full bg-surface-container" />
          </div>
        ))}
        <div className="flex justify-end">
          <div className="h-11 w-40 bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}
