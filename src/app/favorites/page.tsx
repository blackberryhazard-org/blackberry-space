import { createClient } from '@/utils/supabase/server';
import { SnippetCardCompact } from '@/components/snippet-card-compact';
import { Heart, HeartCrack } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Fetch user favorites
  const { data: favorites, error } = await supabase
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

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          Your Favorites
        </h1>
        <p className="text-on-surface-variant text-lg">
          Code snippets you&apos;ve saved for later.
        </p>
      </div>

      {error ? (
        <div className="p-6 bg-[rgba(255,180,171,0.1)] border border-error text-error">
          <p className="font-semibold mb-1">Error fetching favorites.</p>
          <pre className="mt-4 text-xs font-mono bg-surface-container-lowest p-2">
            {error.message}
          </pre>
        </div>
      ) : favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map(
            (fav) =>
              fav.snippets && (
                <SnippetCardCompact
                  key={fav.snippet_id}
                  snippet={fav.snippets}
                  currentUser={user}
                  isFavorited={true}
                />
              ),
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-outline-variant bg-surface-container/50">
          <div className="w-16 h-16 bg-surface-container-high flex items-center justify-center mb-4">
            <HeartCrack className="w-8 h-8 text-on-surface-variant" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">No favorites yet</h3>
          <p className="text-on-surface-variant max-w-sm mb-6">
            Explore the community snippets and heart the ones you find useful.
          </p>
          <Link href="/" className="btn-primary px-6 py-2.5 uppercase tracking-wider">
            Discover Snippets
          </Link>
        </div>
      )}
    </div>
  );
}
