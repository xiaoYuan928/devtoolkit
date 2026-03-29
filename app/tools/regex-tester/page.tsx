'use client';

import { useState, useMemo } from 'react';
import ToolLayout from '@/components/ToolLayout';

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gi');
  const [testStr, setTestStr] = useState('');

  const results = useMemo(() => {
    if (!pattern || !testStr) return { matches: [], error: '' };
    try {
      const re = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups?: Record<string, string> }[] = [];
      let m;
      if (flags.includes('g')) {
        while ((m = re.exec(testStr)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.groups });
          if (m[0].length === 0) re.lastIndex++;
        }
      } else {
        m = re.exec(testStr);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.groups });
      }
      return { matches, error: '' };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, testStr]);

  return (
    <ToolLayout title="Regex Tester" description="Test regular expressions with live matching and group extraction.">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
            <input value={pattern} onChange={e => setPattern(e.target.value)} className="w-full font-mono text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400" placeholder="e.g. (\w+)@(\w+)\.(\w+)" />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">Flags</label>
            <input value={flags} onChange={e => setFlags(e.target.value)} className="w-full font-mono text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400" placeholder="gi" />
          </div>
        </div>
        {results.error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{results.error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test String</label>
          <textarea value={testStr} onChange={e => setTestStr(e.target.value)} className="w-full h-32 font-mono text-sm border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 resize-none" placeholder="Enter text to test against..." />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Matches ({results.matches.length})</h3>
          {results.matches.length === 0 && !results.error && <p className="text-sm text-gray-400">No matches</p>}
          <div className="space-y-2">
            {results.matches.map((m, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-sm">
                <span className="text-indigo-600 font-bold">{m.match}</span>
                <span className="text-gray-400 ml-2">at index {m.index}</span>
                {m.groups && <div className="text-xs text-gray-500 mt-1">Groups: {JSON.stringify(m.groups)}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
