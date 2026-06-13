// Neutral centered fallback for the login route.
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6 animate-pulse">
        <div className="h-8 w-40 mx-auto bg-surface-container-high" />
        <div className="h-4 w-64 max-w-full mx-auto bg-surface-container" />
        <div className="h-12 w-full bg-surface-container-high" />
      </div>
    </div>
  );
}
