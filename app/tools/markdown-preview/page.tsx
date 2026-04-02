'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

// Simple markdown to HTML (no external deps)
function md2html(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-[#1f1f1f] px-1 rounded text-sm">$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#00FF41] underline">$1</a>')
    .replace(/^---$/gm, '<hr class="my-4">')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

const SAMPLE = `# Hello World

## This is a subtitle

This is a paragraph with **bold** and *italic* text.

- Item one
- Item two
- Item three

Here's some \`inline code\` and a [link](https://10001.ai).

---

### Code Example

Check out the \`JSON Formatter\` tool!
`;

export default function MarkdownPreviewPage() {
  const [input, setInput] = useState(SAMPLE);

  return (
    <ToolLayout title="Markdown Preview" description="Write Markdown and see the HTML preview in real-time.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Markdown</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-96 font-mono text-sm border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-[#00FF41] resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Preview</label>
          <div className="w-full h-96 border border-white/10 rounded-xl p-4 bg-[#1f1f1f] overflow-auto prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: md2html(input) }} />
        </div>
      </div>
    </ToolLayout>
  );
}
