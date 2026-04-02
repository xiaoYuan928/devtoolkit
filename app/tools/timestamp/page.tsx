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
      <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-6 mb-6 text-center">
        <p className="text-sm text-[#c6c6c6]">Current Unix Timestamp</p>
        <p className="text-3xl font-mono font-bold text-[#00FF41] mt-1 select-all">{now}</p>
        <p className="text-sm text-[#c6c6c6] mt-2">{new Date(now * 1000).toISOString()}</p>
        <button onClick={() => navigator.clipboard.writeText(String(now))} className="mt-2 text-xs text-[#00FF41] hover:underline">Copy</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Unix Timestamp</label>
          <input value={ts} onChange={e => setTs(e.target.value)} className="w-full font-mono text-sm border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00FF41]" placeholder="e.g. 1711728000" />
          <button onClick={() => setTs(String(now))} className="mt-2 text-xs text-[#00FF41] hover:underline">Use current time</button>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Human Readable</label>
          {isValid ? (
            <div className="space-y-2 text-sm">
              <div className="bg-[#131313] rounded-lg p-3 font-mono">{parsed.toISOString()}</div>
              <div className="bg-[#131313] rounded-lg p-3 font-mono">{parsed.toLocaleString()}</div>
              <div className="bg-[#131313] rounded-lg p-3 font-mono">{parsed.toUTCString()}</div>
            </div>
          ) : (
            <p className="text-sm text-[#c6c6c6] mt-2">Enter a timestamp to convert</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
