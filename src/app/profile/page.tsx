import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SnippetCard } from '@/components/snippet-card';
import { SnippetCardCompact } from '@/components/snippet-card-compact';
import { FileCode2, Heart, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export const revalidate = 0;

export default async function ProfilePage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab || 'snippets';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Fetch user profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  let snippets: any[] = [];
  let favoritedSnippetIds = new Set<string>();

  // Get favorites for toggling
  const { data: favoritesData } = await supabase
    .from('favorites')
    .select('snippet_id')
    .eq('user_id', user.id);

  if (favoritesData) {
    favoritesData.forEach(f => favoritedSnippetIds.add(f.snippet_id));
  }

  if (tab === 'snippets') {
    const { data } = await supabase
      .from('snippets')
      .select(`
        *,
        profiles ( full_name, avatar_url, username )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    snippets = data || [];
  } else if (tab === 'favorites') {
    const { data } = await supabase
      .from('favorites')
      .select(`
        snippet_id,
        snippets (
          *,
          profiles ( full_name, avatar_url, username )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      // Map out the nested snippet structure
      snippets = data.map(f => f.snippets).filter(Boolean);
    }
  }

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-2xl bg-neutral-800 overflow-hidden border border-neutral-700 flex-shrink-0">
          {user.user_metadata.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-neutral-500">
              {user.user_metadata.full_name?.[0] || user.email?.[0] || '?'}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            {user.user_metadata.full_name || 'Anonymous Developer'}
          </h1>
          <p className="text-neutral-400 text-lg mb-4">
            @{user.user_metadata.user_name || 'developer'}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined {profile?.created_at ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }) : 'recently'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-neutral-800 mb-8 pb-4">
        <Link
          href="/profile?tab=snippets"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium ${
            tab === 'snippets'
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          My Snippets
        </Link>
        <Link
          href="/profile?tab=favorites"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium ${
            tab === 'favorites'
              ? 'bg-red-500/10 text-red-400'
              : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          Favorites
        </Link>
      </div>

      {snippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {snippets.map((snippet) => (
            <SnippetCardCompact
              key={snippet.id}
              snippet={snippet}
              currentUser={user}
              isFavorited={favoritedSnippetIds.has(snippet.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/30">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
            {tab === 'snippets' ? (
              <FileCode2 className="w-8 h-8 text-neutral-500" />
            ) : (
              <Heart className="w-8 h-8 text-neutral-500" />
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {tab === 'snippets' ? 'No snippets yet' : 'No favorites yet'}
          </h3>
          <p className="text-neutral-400 max-w-sm">
            {tab === 'snippets'
              ? "You haven't shared any code snippets with the community yet."
              : "You haven't favorited any snippets yet. Explore the community and save your favorites!"}
          </p>
        </div>
      )}
    </div>
  );
}
