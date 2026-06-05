'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function EditSnippetPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [snippet, setSnippet] = useState<any>(null);
  const resolvedParams = use(params);

  useEffect(() => {
    async function fetchSnippet() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/');
          return;
        }

        const { data, error } = await supabase
          .from('snippets')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (error) throw error;

        if (data.user_id !== user.id) {
          router.push('/');
          return;
        }

        setSnippet(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load snippet');
      } finally {
        setLoading(false);
      }
    }

    fetchSnippet();
  }, [resolvedParams.id, router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const language = formData.get('language') as string;
    const code = formData.get('code') as string;
    const tagsString = formData.get('tags') as string;
    const credits = formData.get('credits') as string;

    const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);

    try {
      const { error: updateError } = await supabase
        .from('snippets')
        .update({
          title,
          description,
          language,
          code,
          tags,
          credits,
        })
        .eq('id', resolvedParams.id);

      if (updateError) {
        throw updateError;
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const languages = ['javascript', 'typescript', 'python', 'html', 'css', 'go', 'rust', 'java', 'c++', 'c', 'c#', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'bash', 'json', 'yaml', 'markdown'];

  if (loading) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-neutral-500" /></div>;
  }

  if (!snippet) {
    return <div className="text-center text-red-400">Snippet not found or you do not have permission to edit it.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Edit Snippet</h1>
        <p className="text-neutral-400 text-lg">Update your shared code.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2 md:col-span-2">
             <label htmlFor="title" className="block text-sm font-medium text-neutral-300">Title</label>
             <input
               type="text"
               name="title"
               id="title"
               required
               defaultValue={snippet.title}
               placeholder="e.g. React custom hook for responsive check"
               className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-medium"
             />
           </div>

           <div className="space-y-2 md:col-span-2">
             <label htmlFor="description" className="block text-sm font-medium text-neutral-300">Description</label>
             <textarea
               name="description"
               id="description"
               rows={3}
               defaultValue={snippet.description || ''}
               placeholder="Briefly explain what this code does..."
               className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none"
             />
           </div>

           <div className="space-y-2">
             <label htmlFor="language" className="block text-sm font-medium text-neutral-300">Language</label>
             <select
               name="language"
               id="language"
               required
               defaultValue={snippet.language}
               className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all appearance-none"
             >
               <option value="" disabled>Select language...</option>
               {languages.sort().map(lang => (
                 <option key={lang} value={lang}>{lang}</option>
               ))}
             </select>
           </div>

           <div className="space-y-2">
             <label htmlFor="tags" className="block text-sm font-medium text-neutral-300">Tags (comma separated)</label>
             <input
               type="text"
               name="tags"
               id="tags"
               defaultValue={(snippet.tags || []).join(', ')}
               placeholder="react, hooks, ui"
               className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
             />
           </div>

           <div className="space-y-2 md:col-span-2">
             <label htmlFor="code" className="block text-sm font-medium text-neutral-300">Code</label>
             <textarea
               name="code"
               id="code"
               required
               rows={10}
               defaultValue={snippet.code}
               placeholder="Paste your code here..."
               className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-300 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-mono text-sm leading-relaxed"
             />
           </div>

           <div className="space-y-2 md:col-span-2">
             <label htmlFor="credits" className="block text-sm font-medium text-neutral-300">Credits (Optional)</label>
             <input
               type="text"
               name="credits"
               id="credits"
               defaultValue={snippet.credits || ''}
               placeholder="Original author or source link"
               className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
             />
           </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
