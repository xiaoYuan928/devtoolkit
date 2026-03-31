'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setError('');
      setOutput('✅ Valid JSON');
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output || input);
  };

  const sample = () => {
    const s = `{
  "name": "10001.ai",
  "version": "1.0.0",
  "tools": ["json-formatter", "base64", "hash"],
  "config": {
    "theme": "dark",
    "indent": 2,
    "validateOnType": true
  },
  "stats": {
    "users": 10000,
    "rating": 4.9
  }
}`;
    setInput(s);
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout title="JSON Formatter & Validator" description="Format, validate, and minify JSON. Runs entirely in your browser.">
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={format} className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600">Format</button>
        <button onClick={minify} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Minify</button>
        <button onClick={validate} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Validate</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">📋 Copy</button>
        <button onClick={sample} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">📌 Sample</button>
        <select value={indent} onChange={e => setIndent(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={1}>Tab</option>
        </select>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full h-96 font-mono text-sm border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 resize-none"
            placeholder='Paste your JSON here...'
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 font-mono text-sm border border-gray-200 rounded-xl p-4 bg-gray-50 resize-none"
            placeholder="Formatted output will appear here"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
