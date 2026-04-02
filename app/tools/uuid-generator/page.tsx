'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

export default function UuidGeneratorPage() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);

  const generate = () => {
    const result = Array.from({ length: count }, () => {
      const id = crypto.randomUUID();
      return uppercase ? id.toUpperCase() : id;
    });
    setUuids(result);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <ToolLayout title="UUID Generator" description="Generate random UUIDs (v4) in bulk. Uses crypto.randomUUID() for cryptographic randomness.">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-sm text-[#e2e2e2]">Count:</label>
        <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} className="w-20 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <label className="text-sm text-[#e2e2e2] flex items-center gap-1">
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-[#00FF41]" /> Uppercase
        </label>
        <button onClick={generate} className="px-4 py-2 bg-[#00FF41] text-white/70 rounded-lg text-sm font-medium hover:bg-[#00FF41]">Generate</button>
        {uuids.length > 0 && <button onClick={copyAll} className="px-4 py-2 bg-[#1f1f1f] text-[#e2e2e2] rounded-lg text-sm font-medium">📋 Copy All</button>}
      </div>
      {uuids.length > 0 && (
        <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4 font-mono text-sm space-y-1">
          {uuids.map((u, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <span className="text-[#c6c6c6] w-6 text-right text-xs">{i + 1}</span>
              <span className="flex-1 select-all">{u}</span>
              <button onClick={() => navigator.clipboard.writeText(u)} className="text-xs text-[#00FF41] opacity-0 group-hover:opacity-100">Copy</button>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
