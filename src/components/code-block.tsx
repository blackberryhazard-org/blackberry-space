'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false; // Memperbaiki penanganan race condition jika props berubah cepat

    async function highlightCode() {
      try {
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(code, {
          lang: language,
          theme: 'dark-plus',
        });
        if (!ignore) {
          setHtmlCode(html);
        }
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
        if (!ignore) {
          setHtmlCode(`<pre class="shiki dark-plus" style="background-color:#1E1E1E;color:#D4D4D4;" tabindex="0"><code>${escapeHtml(code)}</code></pre>`);
        }
      }
    }

    highlightCode();

    return () => {
      ignore = true;
    };
  }, [code, language]);

  const handleExport = async () => {
    if (!blockRef.current) return;
    try {
      setIsExporting(true);
      // Memberikan jeda mikro agar DOM sempat menyembunyikan tombol sebelum di-render ke gambar
      await new Promise((resolve) => setTimeout(resolve, 50));

      const dataUrl = await toPng(blockRef.current, {
        cacheBust: true,
        backgroundColor: '#1E1E1E',
        style: {
          margin: '0',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        }
      });
      const link = document.createElement('a');
      link.download = `snippet-${language}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
      alert('Gagal mengekspor gambar.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying text:', err);
      alert('Gagal menyalin kode ke clipboard.');
    }
  };

  return (
    <div ref={blockRef} className="rounded-xl overflow-hidden bg-[#1E1E1E] border border-neutral-800 shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
          {language}
        </div>
        {/* Menyembunyikan tombol secara visual saat proses export agar tidak ikut masuk ke dalam gambar */}
        <div className={`flex items-center gap-3 transition-opacity duration-150 ${isExporting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="text-neutral-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded disabled:opacity-50"
            aria-label="Export code as image"
            title="Export code as image"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Download className="w-4 h-4" aria-hidden="true" />}
          </button>
          <button
            onClick={handleCopy}
            className="text-neutral-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
            aria-label="Copy code"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div className="p-4 overflow-auto custom-scrollbar font-mono text-sm leading-relaxed max-h-[600px] bg-[#1E1E1E]">
        {htmlCode ? (
          <div
            dangerouslySetInnerHTML={{ __html: htmlCode }}
            className="
              [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 [&>pre]:!text-[0.875rem]
              [&>pre>code]:[counter-reset:line]
              [&>pre>code>.line]:before:[counter-increment:line]
              [&>pre>code>.line]:before:content-[counter(line)]
              [&>pre>code>.line]:before:inline-block
              [&>pre>code>.line]:before:w-6
              [&>pre>code>.line]:before:mr-4
              [&>pre>code>.line]:before:text-right
              [&>pre>code>.line]:before:text-neutral-600
              [&>pre>code>.line]:before:select-none
            "
          />
        ) : (
          <pre className="text-neutral-400 animate-pulse">Loading code...</pre>
        )}
      </div>
    </div>
  );
}