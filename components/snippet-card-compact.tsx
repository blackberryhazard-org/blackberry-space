'use client';

import Link from 'next/link';
import { Heart, FileCode2, Clock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
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

export function SnippetCardCompact({ snippet, currentUser, isFavorited = false, onToggleFavorite }: SnippetCardProps) {
  const [localFavorited, setLocalFavorited] = useState(isFavorited);
  const [isToggling, setIsToggling] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser || isToggling) return;

    const next = !localFavorited;
    setIsToggling(true);
    setLocalFavorited(next);
    if (onToggleFavorite) onToggleFavorite(snippet.id, localFavorited);

    try {
      const { error } = next
        ? await supabase.from('favorites').insert({ snippet_id: snippet.id, user_id: currentUser.id })
        : await supabase.from('favorites').delete().eq('snippet_id', snippet.id).eq('user_id', currentUser.id);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      setLocalFavorited(!next);
      if (onToggleFavorite) onToggleFavorite(snippet.id, !next);
      console.error('Failed to toggle favorite:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div onClick={() => router.push(`/snippets/${snippet.id}/view`)} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col group transition-all hover:border-neutral-700 hover:shadow-lg hover:shadow-neutral-950/50 cursor-pointer h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/snippets/${snippet.id}/view`); }}>
        <div className="p-5 flex flex-col gap-4 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                {snippet.title}
              </h3>
              {snippet.description && (
                <p className="text-sm text-neutral-400 mt-2 line-clamp-2 leading-relaxed">{snippet.description}</p>
              )}
            </div>

            <button
              onClick={handleFavorite}
              disabled={!currentUser || isToggling}
              className={`p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shrink-0 ${!currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800 active:scale-95'} ${isToggling ? 'opacity-60 cursor-wait' : ''}`}
              title={!currentUser ? "Login to favorite" : localFavorited ? "Remove from favorites" : "Add to favorites"}
              aria-label={localFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${localFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-500 group-hover:text-neutral-400'}`} aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-auto pt-2">
            <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 text-xs font-mono font-medium flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5" />
              {snippet.language}
            </span>
            {snippet.tags && snippet.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-md bg-red-950/30 text-red-400 border border-red-900/30 text-xs font-medium">
                #{tag}
              </span>
            ))}
            {snippet.tags && snippet.tags.length > 3 && (
              <span className="px-2 py-1 rounded-md text-neutral-500 text-xs font-medium">
                +{snippet.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-neutral-800 overflow-hidden border border-neutral-700">
              {snippet.profiles?.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={snippet.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <span className="text-sm font-medium text-neutral-400 truncate max-w-[120px]">
              {snippet.profiles?.full_name || snippet.profiles?.username || 'Unknown Developer'}
            </span>
          </div>

          <span className="text-xs text-neutral-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
  );
}
