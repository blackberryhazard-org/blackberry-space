'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function CreateSnippetPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const language = formData.get('language') as string;
    const code = formData.get('code') as string;
    const tagsString = formData.get('tags') as string;
    const credits = formData.get('credits') as string;

    const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setError('You must be logged in to create a snippet.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('snippets')
        .insert({
          title,
          description,
          language,
          code,
          tags,
          credits,
          user_id: session.user.id
        })
        .select()
        .single();
        
      if (insertError) {
        console.error(insertError);
        setError(insertError.message || 'Failed to create snippet.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const languages = ['javascript', 'typescript', 'python', 'html', 'css', 'go', 'rust', 'java', 'c++', 'c', 'c#', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'bash', 'json', 'yaml', 'markdown'];

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Snippet</h1>
        <p className="text-neutral-400 text-lg">Share your code with the Blackberry Space community.</p>
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
               defaultValue=""
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
               placeholder="Original author or source link"
               className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
             />
           </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Publish Snippet
          </button>
        </div>
      </form>
    </div>
  );
}
