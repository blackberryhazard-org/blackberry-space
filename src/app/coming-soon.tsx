import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
        <Wrench className="w-10 h-10 text-neutral-400" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Coming Soon</h1>
      <p className="text-neutral-400 text-lg mb-8 max-w-md">
        We&apos;re working hard on this feature. Check back later to see what we&apos;ve built!
      </p>
      <Link href="/" className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-500 transition-colors">
        Return to Discover
      </Link>
    </div>
  );
}
