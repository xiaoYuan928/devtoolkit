'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function generateWords(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) result.push(WORDS[i % WORDS.length]);
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  return result.join(' ') + '.';
}

function generateParagraphs(count: number, wordsPerParagraph: number): string {
  return Array.from({ length: count }, () => generateWords(wordsPerParagraph)).join('\n\n');
}

export default function LoremIpsumPage() {
  const [paragraphs, setParagraphs] = useState(3);
  const [words, setWords] = useState(50);
  const [output, setOutput] = useState('');

  const generate = () => setOutput(generateParagraphs(paragraphs, words));
  const copy = () => navigator.clipboard.writeText(output);

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate placeholder text for your designs and mockups.">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-sm text-[#e2e2e2]">Paragraphs:</label>
        <input type="number" min={1} max={20} value={paragraphs} onChange={e => setParagraphs(Number(e.target.value))} className="w-16 border border-white/10 rounded-lg px-2 py-2 text-sm" />
        <label className="text-sm text-[#e2e2e2]">Words each:</label>
        <input type="number" min={10} max={200} value={words} onChange={e => setWords(Number(e.target.value))} className="w-16 border border-white/10 rounded-lg px-2 py-2 text-sm" />
        <button onClick={generate} className="px-4 py-2 bg-[#00FF41] text-white/70 rounded-lg text-sm font-medium hover:bg-[#00FF41]">Generate</button>
        {output && <button onClick={copy} className="px-4 py-2 bg-[#1f1f1f] text-[#e2e2e2] rounded-lg text-sm font-medium">📋 Copy</button>}
      </div>
      {output && <textarea value={output} readOnly className="w-full h-64 font-mono text-sm border border-white/10 rounded-xl p-4 bg-[#131313] resize-none" />}
    </ToolLayout>
  );
}
