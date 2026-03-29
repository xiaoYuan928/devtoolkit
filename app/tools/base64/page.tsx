'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

export default function Base64Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = (text: string, m: 'encode' | 'decode') => {
    setInput(text);
    try {
      if (m === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setOutput('⚠️ Invalid input');
    }
  };

  return (
    <ToolLayout title="Base64 Encode / Decode" description="Encode text to Base64 or decode Base64 to text. Supports UTF-8.">
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setMode('encode'); process(input, 'encode'); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'encode' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
          Encode
        </button>
        <button onClick={() => { setMode('decode'); process(input, 'decode'); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'decode' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
          Decode
        </button>
        <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">📋 Copy</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{mode === 'encode' ? 'Plain Text' : 'Base64 String'}</label>
          <textarea value={input} onChange={e => process(e.target.value, mode)} className="w-full h-64 font-mono text-sm border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 resize-none" placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}</label>
          <textarea value={output} readOnly className="w-full h-64 font-mono text-sm border border-gray-200 rounded-xl p-4 bg-gray-50 resize-none" />
        </div>
      </div>
    </ToolLayout>
  );
}
