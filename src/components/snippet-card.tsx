'use client';

import Link from 'next/link';
import { Heart, Edit, Trash2, Share2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
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
    const [localFavorited, setLocalFavorited] = useState(isFavorited);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shared, setShared] = useState(false);

  const supabase = createClient();
  const router = useRouter();


  const handleShare = async () => {
    const url = `${window.location.origin}/snippets/${snippet.id}/view`;
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleDelete = async () => {
    if (isDeleting || !currentUser || currentUser.id !== snippet.user_id) return;

    if (window.confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        // SECURITY ENHANCEMENT: Defense in depth to prevent IDOR
        // Ensures only the snippet owner can delete it, even if RLS is misconfigured
        const { error } = await supabase
          .from('snippets')
          .delete()
          .eq('id', snippet.id)
          .eq('user_id', currentUser.id);

        if (error) throw error;
        router.refresh();
      } catch (err) {
        console.error('Failed to delete snippet:', err);
        alert('Failed to delete snippet. Please try again.');
        setIsDeleting(false);
      }
    }
  };


  const handleFavorite = async () => {
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
      if (onToggleFavorite) onToggleFavorite(snippet.id, next);
      console.error('Failed to toggle favorite:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800  overflow-hidden flex flex-col group">
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
            <button
              onClick={handleShare}
              className="p-2  transition-all hover:bg-neutral-800 text-neutral-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              title="Share snippet"
              aria-label="Share snippet link"
            >
              {shared ? <Check className="w-5 h-5 text-green-500" aria-hidden="true" /> : <Share2 className="w-5 h-5" aria-hidden="true" />}
            </button>
            {currentUser && currentUser.id === snippet.user_id && (
              <>
                <Link
                  href={`/snippets/${snippet.id}/edit`}
                  className="p-2  transition-all hover:bg-neutral-800 text-neutral-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  title="Edit snippet"
                  aria-label="Edit snippet"
                >
                  <Edit className="w-5 h-5" aria-hidden="true" />
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`p-2  transition-all hover:bg-neutral-800 text-neutral-500 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Delete snippet"
                  aria-label="Delete snippet"
                >
                  <Trash2 className="w-5 h-5" aria-hidden="true" />
                </button>
              </>
            )}
            <button
              onClick={handleFavorite}
              disabled={!currentUser || isToggling}
              className={`p-2  transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${!currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800 active:scale-95'} ${isToggling ? 'opacity-60 cursor-wait' : ''}`}
              title={!currentUser ? "Login to favorite" : localFavorited ? "Remove from favorites" : "Add to favorites"}
              aria-label={localFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${localFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-500'}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1  bg-neutral-800 text-neutral-300 text-xs font-mono font-medium">
            {snippet.language}
          </span>
          {snippet.tags && snippet.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1  bg-red-950/30 text-red-400 border border-red-900/30 text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>



       <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6  bg-neutral-800 overflow-hidden border border-neutral-700">
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
