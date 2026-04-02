'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tools, categories } from '@/lib/tools';

export default function HomePage() {
  const [search, setSearch] = useState('');

  const filtered = search
    ? tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
    : tools;

  const grouped = Object.keys(categories).map(cat => ({
    ...categories[cat],
    key: cat,
    items: filtered.filter(t => t.category === cat),
  })).filter(g => g.items.length > 0);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto pt-24 pb-16 px-6 text-center">
        <h1 className="font-headline font-black text-5xl md:text-7xl uppercase mb-6 tracking-tight text-white">
          Free Online <span className="text-[#00FF41]">Tools</span>
        </h1>
        <p className="text-lg md:text-xl font-body text-white/50 max-w-2xl mx-auto mb-12 uppercase tracking-wide">
          High-performance computational utilities. No registration. No tracking. Pure utility.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="SEARCH_UTILITIES..."
            className="w-full bg-[#2a2a2a] border border-white/10 text-white font-headline font-medium text-lg md:text-xl py-5 px-8 pr-16 rounded-lg focus:ring-1 focus:ring-[#00FF41] focus:border-[#00FF41] outline-none transition-all placeholder:text-white/20 uppercase"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-[#00FF41]">🔍</div>
        </div>
      </section>

      {/* Tools by Category */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        {grouped.map(group => (
          <div key={group.key} className="mb-12">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
              <span className="text-2xl">{group.icon}</span> {group.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map(tool => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group tool-card bg-[#1f1f1f] border border-white/5 rounded-lg p-8 flex flex-col h-full transition-all duration-200 hover:border-[#00FF41] hover:bg-[#2a2a2a] hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-3xl">{tool.icon}</span>
                    <span className="text-white/10 text-xs font-black uppercase tracking-widest">Tool</span>
                  </div>
                  <h3 className="font-headline font-black text-2xl mb-3 text-white uppercase tracking-tight">{tool.name}</h3>
                  <p className="font-body text-white/50 text-sm mb-8 flex-grow leading-relaxed">{tool.description}</p>
                  <button className="w-full py-3 border border-white/10 group-hover:border-[#00FF41] group-hover:text-[#00FF41] transition-colors font-headline uppercase text-xs font-black tracking-widest">
                    Execute Tool
                  </button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Open Source Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="bg-[#1f1f1f] border border-[#00FF41]/20 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-black text-white mb-4 uppercase">100% Open Source</h2>
          <p className="text-white/60 mb-8 uppercase text-sm tracking-wider">MIT licensed. Star, fork, contribute, or self-host.</p>
          <a
            href="https://github.com/xiaoYuan928/devtoolkit"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 bg-[#00FF41] text-black px-8 py-4 rounded-lg font-headline font-black uppercase text-sm tracking-widest hover:bg-[#00FF41]/90 transition-colors"
          >
            ⭐ Star on GitHub
          </a>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: '10001.ai',
            description: 'Open-source collection of free online tools',
            url: 'https://10001.ai',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
    </div>
  );
}
