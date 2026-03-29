'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

export default function UrlEncodePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = (text: string, m: 'encode' | 'decode') => {
    setInput(text);
    try {
      setOutput(m === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text));
    } catch {
      setOutput('⚠️ Invalid input');
    }
  };

  return (
    <ToolLayout title="URL Encode / Decode" description="Encode or decode URL components. Handles special characters and Unicode.">
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setMode('encode'); process(input, 'encode'); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'encode' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Encode</button>
        <button onClick={() => { setMode('decode'); process(input, 'decode'); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'decode' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Decode</button>
        <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">📋 Copy</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => process(e.target.value, mode)} className="w-full h-48 font-mono text-sm border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 resize-none" placeholder="Input..." />
        <textarea value={output} readOnly className="w-full h-48 font-mono text-sm border border-gray-200 rounded-xl p-4 bg-gray-50 resize-none" />
      </div>
    </ToolLayout>
  );
}
