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
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Free <span className="text-indigo-500">Developer Tools</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          {tools.length} tools, all free, all open source. Everything runs in your browser — your data never leaves.
        </p>

        {/* Search */}
        <div className="mt-6 max-w-md mx-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Tools by Category */}
      {grouped.map(group => (
        <section key={group.key} className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>{group.icon}</span> {group.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map(tool => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-mono text-sm font-bold">
                    {tool.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Open Source Banner */}
      <section className="mt-12 bg-indigo-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900">100% Open Source</h2>
        <p className="text-gray-600 mt-2">MIT licensed. Star, fork, contribute, or self-host.</p>
        <a
          href="https://github.com/qiangxy888/devtoolkit"
          target="_blank"
          rel="noopener"
          className="mt-4 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800"
        >
          ⭐ Star on GitHub
        </a>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'DevToolKit',
            description: 'Open-source collection of free developer tools',
            url: 'https://devtoolkit.dev',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
    </div>
  );
}
