'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

function encodeEntities(text: string): string {
  return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);
}

function decodeEntities(text: string): string {
  const textarea = typeof document !== 'undefined' ? document.createElement('textarea') : null;
  if (!textarea) return text;
  textarea.innerHTML = text;
  return textarea.value;
}

export default function HtmlEntityPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = (text: string, m: 'encode' | 'decode') => {
    setInput(text);
    setOutput(m === 'encode' ? encodeEntities(text) : decodeEntities(text));
  };

  return (
    <ToolLayout title="HTML Entity Encode / Decode" description="Encode special characters to HTML entities or decode them back.">
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setMode('encode'); process(input, 'encode'); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'encode' ? 'bg-[#00FF41] text-white' : 'bg-[#1f1f1f] text-[#e2e2e2]'}`}>Encode</button>
        <button onClick={() => { setMode('decode'); process(input, 'decode'); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'decode' ? 'bg-[#00FF41] text-white' : 'bg-[#1f1f1f] text-[#e2e2e2]'}`}>Decode</button>
        <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 bg-[#1f1f1f] text-[#e2e2e2] rounded-lg text-sm font-medium">📋 Copy</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => process(e.target.value, mode)} className="w-full h-48 font-mono text-sm border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-[#00FF41] resize-none" placeholder={mode === 'encode' ? '<div class="hello">' : '&lt;div class=&quot;hello&quot;&gt;'} />
        <textarea value={output} readOnly className="w-full h-48 font-mono text-sm border border-white/10 rounded-xl p-4 bg-[#131313] resize-none" />
      </div>
    </ToolLayout>
  );
}
