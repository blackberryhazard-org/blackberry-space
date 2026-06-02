'use client';

import Link from 'next/link';
import { Home, PlusSquare, Heart, Settings, CodeSquare, LogIn, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { name: 'Discover', href: '/', icon: Home },
    { name: 'Create Snippet', href: '/snippets/new', icon: PlusSquare },
    { name: 'Favorites', href: '/favorites', icon: Heart },
  ];

  return (
    <aside className="w-64 h-screen border-r border-neutral-800 bg-neutral-950 flex-shrink-0 hidden md:flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
            <CodeSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-red-500 transition-colors">Blackberry</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-neutral-800/50 text-red-500' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-red-500' : ''}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        {user ? (
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-3 px-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.user_metadata.avatar_url || 'https://picsum.photos/seed/picsum/200/200'} alt="Avatar" className="w-9 h-9 rounded-full bg-neutral-800" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-white truncate">{user.user_metadata.full_name || user.email}</span>
                  <span className="text-xs text-neutral-500 truncate">{user.user_metadata.user_name || 'Developer'}</span>
                </div>
             </div>
             <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <LogIn className="w-4 h-4" />
            Login with GitHub
          </button>
        )}
      </div>
    </aside>
  );
}
