'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

function decodeJwt(token: string): { header: string; payload: string; signature: string; error?: string } {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) return { header: '', payload: '', signature: '', error: 'JWT must have 3 parts (header.payload.signature)' };
    const decode = (s: string) => JSON.stringify(JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
    return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] };
  } catch {
    return { header: '', payload: '', signature: '', error: 'Invalid JWT format' };
  }
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState('');
  const result = token ? decodeJwt(token) : null;

  return (
    <ToolLayout title="JWT Decoder" description="Decode and inspect JSON Web Tokens. Shows header, payload, and expiration.">
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#e2e2e2] mb-1">JWT Token</label>
        <textarea value={token} onChange={e => setToken(e.target.value)} className="w-full h-24 font-mono text-xs border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-[#00FF41] resize-none" placeholder="Paste your JWT here..." />
      </div>
      {result?.error && <div className="bg-white/10 border border-white/20 text-white/70 rounded-lg px-4 py-2 text-sm mb-4">{result.error}</div>}
      {result && !result.error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-1">Header</label>
            <pre className="bg-[#1f1f1f] text-[#00FF41] rounded-xl p-4 text-xs overflow-auto">{result.header}</pre>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#00FF41] mb-1">Payload</label>
            <pre className="bg-[#1f1f1f] text-[#00FF41] rounded-xl p-4 text-xs overflow-auto">{result.payload}</pre>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
