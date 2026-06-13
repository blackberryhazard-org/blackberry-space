// Neutral centered fallback for the coming-soon route.
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-4 animate-pulse text-center">
        <div className="h-10 w-10 mx-auto bg-surface-container-high" />
        <div className="h-6 w-48 mx-auto bg-surface-container-high" />
        <div className="h-4 w-72 max-w-full mx-auto bg-surface-container" />
      </div>
    </div>
  );
}
