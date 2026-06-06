import { createClient } from '@/utils/supabase/server';
import { SnippetCard } from '@/components/snippet-card';
import { SnippetCardCompact } from '@/components/snippet-card-compact';
import { Code } from 'lucide-react';
import Link from 'next/link';
import { SearchBar } from '@/components/search-bar';

export const revalidate = 0; // Disable full page caching to always show latest snippets/auth state

export default async function Home(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || '';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch snippets
  let query = supabase
    .from('snippets')
    .select(`
      *,
      profiles ( full_name, avatar_url, username )
    `)
    .order('created_at', { ascending: false });

  if (q) {
    // Strip characters that have special meaning in PostgREST's `or` grammar
    // (comma / parentheses) before interpolating the user's search term.
    const term = q.replace(/[,()]/g, ' ').trim();
    if (term) {
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }
  }

  const { data: snippets, error } = await query;

  // Fetch user favorites if logged in
  let favoritedSnippetIds = new Set<string>();
  if (user) {
    const { data: favorites } = await supabase
      .from('favorites')
      .select('snippet_id')
      .eq('user_id', user.id);
      
    if (favorites) {
      favorites.forEach(f => favoritedSnippetIds.add(f.snippet_id));
    }
  }

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Discover Snippets</h1>
          <p className="text-neutral-400 text-lg">Explore code shared by the Blackberry Space community.</p>
        </div>
        <SearchBar />
      </div>

      {error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400">
           <p className="font-semibold mb-1">Error fetching snippets.</p>
           <p className="text-sm">Please make sure the &quot;snippets&quot; table exists and policies are configured correctly.</p>
           <pre className="mt-4 text-xs font-mono bg-black/30 p-2 rounded">{error.message}</pre>
        </div>
      ) : snippets && snippets.length > 0 ? (
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
         <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/50">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <Code className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No snippets yet</h3>
            <p className="text-neutral-400 max-w-sm mb-6">Be the first to share a piece of code with the community!</p>
            <Link href="/snippets/new" className="px-6 py-2.5 bg-white text-neutral-950 font-bold rounded-xl hover:bg-neutral-200 transition-colors">
              Create Snippet
            </Link>
         </div>
      )}
    </div>
  );
}
