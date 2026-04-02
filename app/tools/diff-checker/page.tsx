'use client';

import { useState, useMemo } from 'react';
import ToolLayout from '@/components/ToolLayout';

function computeDiff(a: string, b: string): { type: 'same' | 'add' | 'remove'; text: string }[] {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const result: { type: 'same' | 'add' | 'remove'; text: string }[] = [];
  const max = Math.max(aLines.length, bLines.length);
  
  for (let i = 0; i < max; i++) {
    const aLine = aLines[i];
    const bLine = bLines[i];
    if (aLine === bLine) {
      result.push({ type: 'same', text: aLine ?? '' });
    } else {
      if (aLine !== undefined) result.push({ type: 'remove', text: aLine });
      if (bLine !== undefined) result.push({ type: 'add', text: bLine });
    }
  }
  return result;
}

export default function DiffCheckerPage() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const diff = useMemo(() => computeDiff(left, right), [left, right]);
  const changes = diff.filter(d => d.type !== 'same').length;

  return (
    <ToolLayout title="Diff Checker" description="Compare two texts and highlight the differences line by line.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Original</label>
          <textarea value={left} onChange={e => setLeft(e.target.value)} className="w-full h-48 font-mono text-sm border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-[#00FF41] resize-none" placeholder="Paste original text..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Modified</label>
          <textarea value={right} onChange={e => setRight(e.target.value)} className="w-full h-48 font-mono text-sm border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-[#00FF41] resize-none" placeholder="Paste modified text..." />
        </div>
      </div>
      {(left || right) && (
        <div>
          <h3 className="text-sm font-semibold text-[#e2e2e2] mb-2">Diff ({changes} changes)</h3>
          <div className="bg-[#1f1f1f] border border-white/10 rounded-xl overflow-hidden font-mono text-sm">
            {diff.map((d, i) => (
              <div key={i} className={`px-4 py-1 ${d.type === 'add' ? 'bg-[#00FF41] text-[#00FF41]' : d.type === 'remove' ? 'bg-white/10 text-white/70' : 'text-[#e2e2e2]'}`}>
                <span className="inline-block w-6 text-[#c6c6c6]">{d.type === 'add' ? '+' : d.type === 'remove' ? '-' : ' '}</span>
                {d.text || ' '}
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
