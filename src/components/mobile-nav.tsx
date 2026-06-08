'use client';

import Link from 'next/link';
import { Home, PlusSquare, CodeSquare, Menu, X, LogIn, LogOut, Compass, FileCode2, ChevronDown, ChevronRight, Swords } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
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
    return () => authListener.subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
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
    <div className="md:hidden">
      <header className="h-16 border-b border-[rgba(255,255,255,0.05)] bg-[#121212] flex items-center justify-between px-4 sticky top-0 z-40">
         <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(74,222,128,0.3)]">
            <CodeSquare className="w-4 h-4 text-[#121212]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors uppercase tracking-[0.05em]">Blackberry</span>
        </Link>
        <button onClick={() => setIsOpen(true)} className="p-2 text-on-surface hover:text-white">
           <Menu className="w-6 h-6" />
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col">
          <div className="h-16 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between px-4">
             <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                  <CodeSquare className="w-4 h-4 text-[#121212]" />
                </div>
                <span className="text-lg font-bold text-white uppercase tracking-[0.05em]">Blackberry</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 text-on-surface hover:text-white">
                <X className="w-6 h-6" />
              </button>
          </div>
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-6">
              {menus.map(menu => {
                const isOpen = openMenus[menu.title];
                return (
                  <div key={menu.title}>
                    <button
                      onClick={() => toggleMenu(menu.title)}
                      className="w-full px-4 mb-3 flex items-center justify-between text-on-surface-variant hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                        <menu.icon className="w-5 h-5" />
                        {menu.title}
                      </div>
                      {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>

                    {isOpen && (
                      <div className="space-y-2 pl-4 border-l border-[rgba(255,255,255,0.05)] ml-6">
                        {menu.subItems.map((item) => {
                          const isActive = !("external" in item) && ((item.name === 'Discover' && pathname === '/') ||
                                           (item.name !== 'Discover' && pathname === item.href));

                          const linkClasses = `flex items-center gap-3 px-4 py-3 transition-colors ${
                            isActive
                              ? 'bg-[#1a120c] text-primary border border-primary shadow-[0_0_5px_rgba(74,222,128,0.2)]'
                              : 'text-on-surface active:bg-[#1a120c] hover:text-primary'
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
                                 <item.icon className="w-5 h-5" />
                                 <span className="font-medium text-base">{item.name}</span>
                               </a>
                             )
                          }

                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={linkClasses}
                            >
                              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                              <span className="font-medium text-base">{item.name}</span>
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

          <div className="p-6 border-t border-[rgba(255,255,255,0.05)]">
             {user ? (
              <div className="flex flex-col gap-4">
                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 active:bg-[#1a120c] transition-colors group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={user.user_metadata.avatar_url || 'https://picsum.photos/seed/picsum/200/200'} alt="Avatar" className="w-10 h-10 bg-surface-container" />
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-white group-hover:text-primary">{user.user_metadata.full_name || user.email}</span>
                      <span className="text-sm text-on-surface-variant uppercase tracking-wider">{user.user_metadata.user_name || 'Developer'}</span>
                    </div>
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full bg-[#1a120c] active:bg-surface-container-high text-error py-3 transition-colors text-base font-bold uppercase tracking-wider border border-[rgba(255,255,255,0.05)]"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
                <button
                  onClick={() => { handleLogin(); setIsOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full btn-primary py-3 text-base uppercase tracking-wider"
                >
                  <LogIn className="w-5 h-5" />
                  Login with GitHub
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
