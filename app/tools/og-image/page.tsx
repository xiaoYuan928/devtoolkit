'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';

const TEMPLATES = [
  { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  { id: 'sunset', name: 'Sunset', preview: 'bg-gradient-to-br from-pink-400 to-rose-500' },
  { id: 'ocean', name: 'Ocean', preview: 'bg-gradient-to-br from-blue-400 to-cyan-400' },
  { id: 'forest', name: 'Forest', preview: 'bg-gradient-to-br from-teal-500 to-emerald-400' },
  { id: 'midnight', name: 'Midnight', preview: 'bg-gradient-to-br from-slate-900 to-indigo-900' },
  { id: 'fire', name: 'Fire', preview: 'bg-gradient-to-br from-red-500 to-amber-400' },
  { id: 'minimal', name: 'Minimal', preview: 'bg-[#1f1f1f] border-2 border-white/10' },
  { id: 'dark', name: 'Dark', preview: 'bg-[#1f1f1f]' },
  { id: 'blue', name: 'Blue', preview: 'bg-[#00FF41]' },
  { id: 'emerald', name: 'Emerald', preview: 'bg-[#00FF41]' },
  { id: 'purple', name: 'Purple', preview: 'bg-purple-600' },
  { id: 'slate', name: 'Slate', preview: 'bg-gradient-to-br from-slate-600 to-slate-800' },
];

export default function OgImagePage() {
  const [title, setTitle] = useState('How to Build a Better Product');
  const [subtitle, setSubtitle] = useState('A guide for modern builders');
  const [author, setAuthor] = useState('10001.ai');
  const [template, setTemplate] = useState('gradient');
  const [fontSize, setFontSize] = useState(60);

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (subtitle) params.set('subtitle', subtitle);
    if (author) params.set('author', author);
    params.set('template', template);
    params.set('fontSize', fontSize.toString());
    return `/api/og?${params.toString()}`;
  }, [title, subtitle, author, template, fontSize]);

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${buildUrl()}` : buildUrl();

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = buildUrl();
    a.download = 'og-image.png';
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
  };

  return (
    <ToolLayout
      title="OG Image Generator"
      description="Create Open Graph images for Twitter, Facebook, LinkedIn, and blogs with 12 templates."
      width="wide"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <div className="bg-[#1f1f1f] rounded-2xl border border-white/10 p-6 space-y-5">
          <h2 className="font-bold text-lg text-[#e2e2e2]">Customize</h2>

          <div>
            <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
              className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#00FF41] focus:border-[#00FF41]"
              placeholder="Your blog title or page heading"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              maxLength={200}
              className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#00FF41] focus:border-[#00FF41]"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Author / Brand</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              maxLength={50}
              className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#00FF41] focus:border-[#00FF41]"
              placeholder="Your name or brand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Font Size: {fontSize}px</label>
            <input
              type="range"
              min={32}
              max={80}
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          {/* Template Picker */}
          <div>
            <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Template</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`aspect-video rounded-lg ${t.preview} transition-all ${
                    template === t.id ? 'ring-2 ring-[#00FF41] ring-offset-2 scale-105' : 'hover:scale-105'
                  }`}
                  title={t.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 bg-[#2a2a2a] text-white/70 py-2.5 rounded-lg font-semibold hover:bg-[#2a2a2a] transition-colors"
            >
              ⬇️ Download PNG
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 bg-[#1f1f1f] text-[#e2e2e2] py-2.5 rounded-lg font-semibold hover:bg-[#1f1f1f] transition-colors"
            >
              📋 Copy URL
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-[#e2e2e2]">Preview (1200×630)</h2>
          <div className="bg-[#1f1f1f] rounded-2xl border border-white/10 p-3">
            <div className="aspect-[1200/630] rounded-lg overflow-hidden bg-[#1f1f1f]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={buildUrl()}
                alt="OG Image Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* URL Preview */}
          <div>
            <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Image URL</label>
            <div className="bg-[#1f1f1f] rounded-lg p-3 font-mono text-xs text-[#00FF41] break-all select-all">
              {fullUrl}
            </div>
          </div>

          {/* Meta Tag */}
          <div>
            <label className="block text-sm font-medium text-[#e2e2e2] mb-1">HTML Meta Tag</label>
            <div className="bg-[#1f1f1f] rounded-lg p-3 font-mono text-xs text-[#00FF41] break-all select-all">
              {`<meta property="og:image" content="${fullUrl}" />`}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-extrabold mb-8">Why Use This Tool?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🎨', title: '12 Templates', desc: 'Gradient, minimal, dark mode — pick one that matches your brand.' },
            { icon: '⚡', title: 'Instant Preview', desc: 'See your OG image update live as you type. No waiting.' },
            { icon: '🔗', title: 'URL API', desc: 'Use the URL directly as your og:image — no download needed.' },
          ].map(f => (
            <div key={f.title} className="bg-[#1f1f1f] rounded-xl border border-white/10 p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-[#e2e2e2] mb-2">{f.title}</h3>
              <p className="text-sm text-[#c6c6c6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: '10001.ai OG Image Generator',
            description: 'Free Open Graph image generator with 12 templates',
            url: 'https://10001.ai/tools/og-image',
            applicationCategory: 'DesignApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
    </ToolLayout>
  );
}
