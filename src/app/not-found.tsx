import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-4">404 - Page Not Found</h1>
      <p className="text-neutral-400 text-lg mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-500 transition-colors">
        Return to Discover
      </Link>
    </div>
  );
}
