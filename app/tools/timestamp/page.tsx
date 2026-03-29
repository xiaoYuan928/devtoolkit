'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';

export default function TimestampPage() {
  const [ts, setTs] = useState('');
  const [now, setNow] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    setNow(Math.floor(Date.now() / 1000));
    return () => clearInterval(id);
  }, []);

  const parsed = ts ? new Date(Number(ts) * (ts.length > 10 ? 1 : 1000)) : null;
  const isValid = parsed && !isNaN(parsed.getTime());

  return (
    <ToolLayout title="Unix Timestamp Converter" description="Convert between Unix timestamps and human-readable dates.">
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 text-center">
        <p className="text-sm text-gray-500">Current Unix Timestamp</p>
        <p className="text-3xl font-mono font-bold text-indigo-600 mt-1 select-all">{now}</p>
        <p className="text-sm text-gray-500 mt-2">{new Date(now * 1000).toISOString()}</p>
        <button onClick={() => navigator.clipboard.writeText(String(now))} className="mt-2 text-xs text-indigo-500 hover:underline">Copy</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unix Timestamp</label>
          <input value={ts} onChange={e => setTs(e.target.value)} className="w-full font-mono text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400" placeholder="e.g. 1711728000" />
          <button onClick={() => setTs(String(now))} className="mt-2 text-xs text-indigo-500 hover:underline">Use current time</button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Human Readable</label>
          {isValid ? (
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 font-mono">{parsed.toISOString()}</div>
              <div className="bg-gray-50 rounded-lg p-3 font-mono">{parsed.toLocaleString()}</div>
              <div className="bg-gray-50 rounded-lg p-3 font-mono">{parsed.toUTCString()}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mt-2">Enter a timestamp to convert</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
