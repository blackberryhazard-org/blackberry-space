import type {Metadata} from 'next';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Blackberry Space',
  description: 'A platform for developers to share code snippets and solve programming challenges.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-neutral-950 text-neutral-50 font-sans antialiased selection:bg-red-500/30 selection:text-red-200" suppressHydrationWarning>
        <div className="flex min-h-screen bg-neutral-950">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
             <MobileNav />
             <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
               {children}
             </main>
          </div>
        </div>
      </body>
    </html>
  );
}
