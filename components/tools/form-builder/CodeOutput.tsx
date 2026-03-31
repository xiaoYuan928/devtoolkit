'use client';

import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface Props {
  htmlCode: string;
  cssCode: string;
  fullCode: string;
  onCopy: () => void;
  copied: boolean;
}

export default function CodeOutput({ htmlCode, cssCode, fullCode, onCopy, copied }: Props) {
  const [codeTab, setCodeTab] = useState<'full' | 'html' | 'css'>('full');

  const code = codeTab === 'html' ? htmlCode : codeTab === 'css' ? cssCode : fullCode;
  const lang = codeTab === 'css' ? 'css' : 'markup';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex gap-1">
          {(['full', 'html', 'css'] as const).map(t => (
            <button
              key={t}
              onClick={() => setCodeTab(t)}
              className={`px-3 py-1 text-xs font-medium rounded-md ${codeTab === t ? 'bg-[--color-primary] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              {t === 'full' ? 'HTML + CSS' : t.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={onCopy} className="text-xs font-semibold text-[--color-primary] hover:underline">
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <div className="max-h-[60vh] overflow-auto">
        <Highlight theme={themes.nightOwl} code={code} language={lang}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre className="p-4 text-xs leading-relaxed overflow-x-auto" style={{ ...style, margin: 0, background: '#011627' }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 text-right mr-4 text-gray-600 select-none">{i + 1}</span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
