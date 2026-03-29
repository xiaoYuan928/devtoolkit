'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#6366F1');

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(...rgb) : null;

  return (
    <ToolLayout title="Color Converter" description="Convert between HEX, RGB, and HSL color formats.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">HEX</label>
            <div className="flex gap-2">
              <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
              <input value={hex} onChange={e => setHex(e.target.value)} className="flex-1 font-mono text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          {rgb && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RGB</label>
                <input value={`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`} readOnly className="w-full font-mono text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50" />
              </div>
              {hsl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HSL</label>
                  <input value={`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} readOnly className="w-full font-mono text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CSS Variables</label>
                <div className="font-mono text-xs bg-gray-900 text-green-400 rounded-lg p-3">
                  <p>--color-primary: {hex};</p>
                  <p>--color-rgb: {rgb.join(', ')};</p>
                  {hsl && <p>--color-hsl: {hsl[0]} {hsl[1]}% {hsl[2]}%;</p>}
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <div style={{ backgroundColor: hex }} className="h-40" />
            <div className="p-4 bg-white">
              <div className="flex gap-2">
                <button style={{ backgroundColor: hex }} className="text-white px-4 py-2 rounded-lg text-sm font-medium">Button</button>
                <span style={{ color: hex }} className="font-bold flex items-center">Text Color</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
