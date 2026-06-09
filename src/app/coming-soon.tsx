import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 shadow-xl">
        <Wrench className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-4 uppercase tracking-[0.05em]">Coming Soon</h1>
      <p className="text-on-surface-variant text-lg mb-8 max-w-md font-medium leading-relaxed">
        We&apos;re working hard on this feature. Check back later to see what we&apos;ve built!
      </p>
      <Link href="/" className="btn-primary px-8 py-3.5 uppercase tracking-wider font-bold text-sm">
        Return to Discover
      </Link>
    </div>
  );
}
