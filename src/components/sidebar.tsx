'use client';

import Link from 'next/link';
import { Home, PlusSquare, CodeSquare, LogIn, LogOut, Compass, FileCode2, ChevronDown, ChevronRight, Swords } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'Home': true,
    'Snippets': true,
    'Challenges': false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
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

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menus = [
    {
      title: 'Main',
      icon: Home,
      subItems: [
        { name: 'Home', href: 'https://blackberryhazard.pages.dev', icon: Home, external: true },
      ]
    },
    {
      title: 'Snippets',
      icon: FileCode2,
      subItems: [
        { name: 'Discover', href: '/', icon: Compass },
        { name: 'Create Snippet', href: '/snippets/new', icon: PlusSquare },
      ]
    },
    {
      title: 'Challenges',
      icon: Swords,
      subItems: [
        { name: 'All Challenges', href: '/coming-soon', icon: Swords },
      ]
    }
  ];

  return (
    <aside className="w-64 h-screen border-r border-[rgba(255,255,255,0.05)] bg-[#121212] flex-shrink-0 hidden md:flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary flex items-center justify-center group-hover:brightness-110 transition-all shadow-[0_0_10px_rgba(74,222,128,0.3)]">
            <CodeSquare className="w-5 h-5 text-[#121212]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors uppercase tracking-[0.05em]">Blackberry</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 mt-2 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {menus.map(menu => {
            const isOpen = openMenus[menu.title];
            return (
              <div key={menu.title}>
                <button
                  onClick={() => toggleMenu(menu.title)}
                  className="w-full px-3 mb-2 flex items-center justify-between text-on-surface-variant hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <menu.icon className="w-4 h-4" />
                    {menu.title}
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {isOpen && (
                  <div className="space-y-1 pl-3 border-l border-[rgba(255,255,255,0.05)] ml-5">
                    {menu.subItems.map((item) => {
                      const isActive = !("external" in item) && ((item.name === 'Discover' && pathname === '/') ||
                                       (item.name !== 'Discover' && pathname === item.href));

                      const linkClasses = `flex items-center gap-3 px-3 py-2 transition-colors text-sm ${
                        isActive
                          ? 'bg-[#1a120c] text-primary border border-primary shadow-[0_0_5px_rgba(74,222,128,0.2)]'
                          : 'text-on-surface hover:text-primary hover:bg-[#1a120c]'
                      }`;

                      if ("external" in item) {
                         return (
                           <a
                             key={item.name}
                             href={item.href}
                             target="_blank"
                             rel="noopener noreferrer"
                             className={linkClasses}
                           >
                             <item.icon className="w-4 h-4" />
                             <span className="font-medium">{item.name}</span>
                           </a>
                         )
                      }

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={linkClasses}
                        >
                          <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
        {user ? (
          <div className="flex flex-col gap-3">
             <Link href="/profile" className="flex items-center gap-3 px-2 py-2 hover:bg-[#1a120c] transition-colors group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.user_metadata.avatar_url || 'https://picsum.photos/seed/picsum/200/200'} alt="Avatar" className="w-9 h-9 bg-surface-container" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{user.user_metadata.full_name || user.email}</span>
                  <span className="text-xs text-on-surface-variant truncate uppercase tracking-wider">{user.user_metadata.user_name || 'Developer'}</span>
                </div>
             </Link>
             <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-error hover:bg-[#1a120c] transition-colors w-full text-left font-medium text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 w-full btn-primary py-2 text-sm uppercase tracking-wider"
          >
            <LogIn className="w-4 h-4" />
            Login with GitHub
          </button>
        )}
      </div>
    </aside>
  );
}
