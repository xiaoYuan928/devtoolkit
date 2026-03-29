'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

async function computeHash(text: string, algo: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const ALGORITHMS = [
  { label: 'SHA-256', algo: 'SHA-256' },
  { label: 'SHA-384', algo: 'SHA-384' },
  { label: 'SHA-512', algo: 'SHA-512' },
  { label: 'SHA-1', algo: 'SHA-1' },
];

export default function HashGeneratorPage() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generate = async (text: string) => {
    setInput(text);
    if (!text) { setHashes({}); return; }
    const results: Record<string, string> = {};
    for (const { label, algo } of ALGORITHMS) {
      results[label] = await computeHash(text, algo);
    }
    setHashes(results);
  };

  return (
    <ToolLayout title="Hash Generator" description="Generate SHA-256, SHA-384, SHA-512, and SHA-1 hashes. Uses Web Crypto API — nothing leaves your browser.">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Input Text</label>
        <textarea value={input} onChange={e => generate(e.target.value)} className="w-full h-32 font-mono text-sm border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 resize-none" placeholder="Enter text to hash..." />
      </div>
      <div className="space-y-3">
        {ALGORITHMS.map(({ label }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-700">{label}</span>
              {hashes[label] && <button onClick={() => navigator.clipboard.writeText(hashes[label])} className="text-xs text-indigo-500 hover:underline">Copy</button>}
            </div>
            <p className="font-mono text-xs text-gray-600 break-all">{hashes[label] || '—'}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
