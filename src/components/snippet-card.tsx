'use client';

import { Heart, Share2, Check } from 'lucide-react';
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
  };
}

interface SnippetCardProps {
  snippet: Snippet;
  currentUser: any;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string, currentlyFavorited: boolean) => void;
}

export function SnippetCard({
  snippet,
  currentUser,
  isFavorited = false,
  onToggleFavorite,
}: SnippetCardProps) {
  const [localFavorited, setLocalFavorited] = useState(isFavorited);
  const [isToggling, setIsToggling] = useState(false);
  const [shared, setShared] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleShare = async () => {
    const url = `${window.location.origin}/snippets/${snippet.id}/view`;
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleFavorite = async () => {
    if (!currentUser || isToggling) return;

    const next = !localFavorited;
    setIsToggling(true);
    setLocalFavorited(next);
    if (onToggleFavorite) onToggleFavorite(snippet.id, localFavorited);

    try {
      const { error } = next
        ? await supabase
            .from('favorites')
            .insert({ snippet_id: snippet.id, user_id: currentUser.id })
        : await supabase
            .from('favorites')
            .delete()
            .eq('snippet_id', snippet.id)
            .eq('user_id', currentUser.id);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      setLocalFavorited(!next);
      if (onToggleFavorite) onToggleFavorite(snippet.id, next);
      console.error('Failed to toggle favorite:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="card-container overflow-hidden flex flex-col group">
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-on-surface tracking-tight">{snippet.title}</h3>
            {snippet.description && (
              <p className="text-sm text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                {snippet.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 transition-all hover:bg-[rgba(255,255,255,0.05)] text-outline hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Share snippet"
              aria-label="Share snippet link"
            >
              {shared ? (
                <Check className="w-5 h-5 text-primary" aria-hidden="true" />
              ) : (
                <Share2 className="w-5 h-5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={handleFavorite}
              disabled={!currentUser || isToggling}
              className={`p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${!currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[rgba(255,255,255,0.05)] active:scale-95'} ${isToggling ? 'opacity-60 cursor-wait' : ''}`}
              title={
                !currentUser
                  ? 'Login to favorite'
                  : localFavorited
                    ? 'Remove from favorites'
                    : 'Add to favorites'
              }
              aria-label={localFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-5 h-5 ${localFavorited ? 'fill-primary text-primary' : 'text-outline'}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 bg-surface-container-high text-on-surface text-xs font-mono font-bold uppercase tracking-wider border border-[rgba(255,255,255,0.1)]">
            {snippet.language}
          </span>
          {snippet.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-[rgba(107,251,154,0.1)] text-primary border border-primary text-xs font-bold uppercase tracking-wider"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 bg-background border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-surface-container overflow-hidden border border-[rgba(255,255,255,0.1)]">
            {snippet.profiles?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={snippet.profiles.avatar_url}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
            {snippet.profiles?.full_name || snippet.profiles?.username || 'Unknown Developer'}
          </span>
        </div>

        <span className="text-xs text-outline uppercase tracking-wider">
          {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
