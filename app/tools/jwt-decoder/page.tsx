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
        <label className="block text-sm font-medium text-gray-700 mb-1">JWT Token</label>
        <textarea value={token} onChange={e => setToken(e.target.value)} className="w-full h-24 font-mono text-xs border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 resize-none" placeholder="Paste your JWT here..." />
      </div>
      {result?.error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">{result.error}</div>}
      {result && !result.error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-red-600 mb-1">Header</label>
            <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-auto">{result.header}</pre>
          </div>
          <div>
            <label className="block text-sm font-semibold text-indigo-600 mb-1">Payload</label>
            <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-auto">{result.payload}</pre>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
