'use client';
import Link from 'next/link';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Heart, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  credits: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
    username: string;
  }
}

interface SnippetCardProps {
  snippet: Snippet;
  currentUser: any;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string, currentlyFavorited: boolean) => void;
}

export function SnippetCard({ snippet, currentUser, isFavorited = false, onToggleFavorite }: SnippetCardProps) {
  const [copied, setCopied] = useState(false);
  const [localFavorited, setLocalFavorited] = useState(isFavorited);
  const [isToggling, setIsToggling] = useState(false);
  const supabase = createClient();
  const router = useRouter();


  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting || !currentUser || currentUser.id !== snippet.user_id) return;

    if (window.confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const { error } = await supabase.from('snippets').delete().eq('id', snippet.id);
        if (error) throw error;
        router.refresh();
      } catch (err) {
        console.error('Failed to delete snippet:', err);
        alert('Failed to delete snippet. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = async () => {
    // Ignore clicks while a request is in flight to avoid duplicate rows / race conditions.
    if (!currentUser || isToggling) return;

    const next = !localFavorited;

    // Optimistic UI update
    setIsToggling(true);
    setLocalFavorited(next);
    if (onToggleFavorite) onToggleFavorite(snippet.id, localFavorited);

    try {
      const { error } = next
        ? await supabase.from('favorites').insert({ snippet_id: snippet.id, user_id: currentUser.id })
        : await supabase.from('favorites').delete().eq('snippet_id', snippet.id).eq('user_id', currentUser.id);

      if (error) throw error;

      // Re-sync server components (e.g. the Favorites list) with the new state.
      router.refresh();
    } catch (err) {
      // Roll back the optimistic update on failure.
      setLocalFavorited(!next);
      if (onToggleFavorite) onToggleFavorite(snippet.id, next);
      console.error('Failed to toggle favorite:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col group">
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              {snippet.title}
            </h3>
            {snippet.description && (
              <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{snippet.description}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {currentUser && currentUser.id === snippet.user_id && (
              <>
                <Link
                  href={`/snippets/${snippet.id}/edit`}
                  className="p-2 rounded-xl transition-all hover:bg-neutral-800 text-neutral-500 hover:text-white"
                  title="Edit snippet"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`p-2 rounded-xl transition-all hover:bg-neutral-800 text-neutral-500 hover:text-red-500 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Delete snippet"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={handleFavorite}

            disabled={!currentUser || isToggling}
            className={`p-2 rounded-xl transition-all ${!currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800 active:scale-95'} ${isToggling ? 'opacity-60 cursor-wait' : ''}`}
            title={!currentUser ? "Login to favorite" : localFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${localFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-500'}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 text-xs font-mono font-medium">
            {snippet.language}
          </span>
          {snippet.tags && snippet.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-md bg-red-950/30 text-red-400 border border-red-900/30 text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="relative border-t border-neutral-800 flex-1 flex flex-col">
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
               onClick={handleCopy}
               className="p-1.5 rounded-lg bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700 backdrop-blur-sm transition-all"
               title="Copy Code"
             >
               {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
             </button>
          </div>
         <div className="max-h-[300px] overflow-auto flex-1 font-mono text-sm leading-relaxed custom-scrollbar">
           <SyntaxHighlighter
             language={snippet.language}
             style={vscDarkPlus}
             customStyle={{
               margin: 0,
               padding: '1rem',
               background: '#09090b', // darker background for code
               fontSize: '0.875rem',
             }}
             showLineNumbers={true}
             lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#52525b', textAlign: 'right' }}
           >
             {snippet.code}
           </SyntaxHighlighter>
         </div>
      </div>

       <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-neutral-800 overflow-hidden border border-neutral-700">
                {snippet.profiles?.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={snippet.profiles.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <span className="text-sm text-neutral-400">
                {snippet.profiles?.full_name || snippet.profiles?.username || 'Unknown Developer'}
              </span>
           </div>
           
           <span className="text-xs text-neutral-500">
              {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}
           </span>
       </div>
    </div>
  );
}
