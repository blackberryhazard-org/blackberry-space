'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [htmlCode, setHtmlCode] = useState<string>('');

  useEffect(() => {
    async function highlightCode() {
      try {
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(code, {
          lang: language,
          theme: 'dark-plus',
        });
        setHtmlCode(html);
      } catch (err) {
        console.error('Error highlighting code with shiki:', err);
        const escapeHtml = (text: string) => {
          return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        };
        setHtmlCode(`<pre class="shiki dark-plus" style="background-color:#1E1E1E;color:#D4D4D4;" tabindex="0"><code>${escapeHtml(code)}</code></pre>`);
      }
    }
    highlightCode();
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#1E1E1E] border border-neutral-800 shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
          {language}
        </div>
        <button
          onClick={handleCopy}
          className="text-neutral-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>
      <div className="p-4 overflow-auto custom-scrollbar font-mono text-sm leading-relaxed max-h-[600px]">
        {htmlCode ? (
          <div
            dangerouslySetInnerHTML={{ __html: htmlCode }}
            className="[&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 [&>pre]:!text-[0.875rem]"
          />
        ) : (
          <pre className="text-neutral-400 animate-pulse">Loading code...</pre>
        )}
      </div>
    </div>
  );
}
