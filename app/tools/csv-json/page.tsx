'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return '[]';
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
  return JSON.stringify(data, null, 2);
}

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data) || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row: Record<string, unknown>) => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
  return [headers.join(','), ...rows].join('\n');
}

export default function CsvJsonPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json');

  const convert = () => {
    try {
      setOutput(mode === 'csv2json' ? csvToJson(input) : jsonToCsv(input));
    } catch (e: unknown) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  };

  return (
    <ToolLayout title="CSV ↔ JSON Converter" description="Convert between CSV and JSON formats instantly.">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('csv2json')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'csv2json' ? 'bg-[#00FF41] text-white' : 'bg-[#1f1f1f] text-[#e2e2e2]'}`}>CSV → JSON</button>
        <button onClick={() => setMode('json2csv')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'json2csv' ? 'bg-[#00FF41] text-white' : 'bg-[#1f1f1f] text-[#e2e2e2]'}`}>JSON → CSV</button>
        <button onClick={convert} className="px-4 py-2 bg-[#00FF41] text-white/70 rounded-lg text-sm font-medium hover:bg-[#00FF41]">Convert</button>
        <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 bg-[#1f1f1f] text-[#e2e2e2] rounded-lg text-sm font-medium">📋 Copy</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-64 font-mono text-sm border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-[#00FF41] resize-none" placeholder={mode === 'csv2json' ? 'name,email,age\nJohn,john@test.com,30' : '[{"name":"John","email":"john@test.com"}]'} />
        <textarea value={output} readOnly className="w-full h-64 font-mono text-sm border border-white/10 rounded-xl p-4 bg-[#131313] resize-none" placeholder="Output..." />
      </div>
    </ToolLayout>
  );
}
