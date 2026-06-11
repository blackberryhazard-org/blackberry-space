import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SnippetCardCompact } from '@/components/snippet-card-compact';
import { FileCode2, Heart, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export const revalidate = 0;

export default async function ProfilePage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab || 'snippets';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Fetch user profile data
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  let snippets: any[] = [];
  const favoritedSnippetIds = new Set<string>();

  // Get favorites for toggling
  const { data: favoritesData } = await supabase
    .from('favorites')
    .select('snippet_id')
    .eq('user_id', user.id);

  if (favoritesData) {
    favoritesData.forEach((f) => favoritedSnippetIds.add(f.snippet_id));
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
      snippets = data.map((f) => f.snippets).filter(Boolean);
    }
  }

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <div className="bg-surface-container border border-[rgba(255,255,255,0.05)] p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 bg-surface-container-high overflow-hidden border border-[rgba(255,255,255,0.1)] flex-shrink-0">
          {user.user_metadata.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-on-surface-variant">
              {user.user_metadata.full_name?.[0] || user.email?.[0] || '?'}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
            {user.user_metadata.full_name || 'Anonymous Developer'}
          </h1>
          <p className="text-on-surface-variant text-lg mb-4">
            @{user.user_metadata.user_name || 'developer'}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-outline font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined{' '}
              {profile?.created_at
                ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })
                : 'recently'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.05)] mb-8">
        <Link
          href="/profile?tab=snippets"
          className={`flex items-center gap-2 px-4 py-3 transition-colors font-bold uppercase tracking-wider text-sm border-b-2 -mb-px ${
            tab === 'snippets'
              ? 'text-primary border-primary'
              : 'text-on-surface-variant border-transparent hover:text-on-surface'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          My Snippets
        </Link>
        <Link
          href="/profile?tab=favorites"
          className={`flex items-center gap-2 px-4 py-3 transition-colors font-bold uppercase tracking-wider text-sm border-b-2 -mb-px ${
            tab === 'favorites'
              ? 'text-primary border-primary'
              : 'text-on-surface-variant border-transparent hover:text-on-surface'
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
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-outline-variant bg-surface-container/30">
          <div className="w-16 h-16 bg-surface-container-high flex items-center justify-center mb-4">
            {tab === 'snippets' ? (
              <FileCode2 className="w-8 h-8 text-on-surface-variant" />
            ) : (
              <Heart className="w-8 h-8 text-on-surface-variant" />
            )}
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">
            {tab === 'snippets' ? 'No snippets yet' : 'No favorites yet'}
          </h3>
          <p className="text-on-surface-variant max-w-sm">
            {tab === 'snippets'
              ? "You haven't shared any code snippets with the community yet."
              : "You haven't favorited any snippets yet. Explore the community and save your favorites!"}
          </p>
        </div>
      )}
    </div>
  );
}
