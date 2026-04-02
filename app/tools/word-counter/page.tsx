'use client';

import { useState, useMemo } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { analyzeText, analyzeKeywords, analyzeReadability, getSocialLimits, convertCase, cleanText } from '@/lib/word-counter/analyzer';

const statCards = [
  { key: 'words', label: 'Words', icon: '📝' },
  { key: 'characters', label: 'Characters', icon: '🔤' },
  { key: 'charactersNoSpaces', label: 'Chars (no spaces)', icon: '🔡' },
  { key: 'sentences', label: 'Sentences', icon: '📄' },
  { key: 'paragraphs', label: 'Paragraphs', icon: '📑' },
  { key: 'pages', label: 'Pages', icon: '📖' },
] as const;

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'keywords' | 'readability' | 'social' | 'case' | 'clean'>('stats');

  const stats = useMemo(() => analyzeText(text), [text]);
  const keywords = useMemo(() => analyzeKeywords(text), [text]);
  const readability = useMemo(() => analyzeReadability(text), [text]);
  const socialLimits = useMemo(() => getSocialLimits(text), [text]);

  const [caseMode, setCaseMode] = useState('upper');
  const caseModes = [
    { id: 'upper', label: 'UPPER' }, { id: 'lower', label: 'lower' },
    { id: 'title', label: 'Title Case' }, { id: 'sentence', label: 'Sentence case' },
    { id: 'camel', label: 'camelCase' }, { id: 'snake', label: 'snake_case' },
  ];

  const cleanModes = [
    { id: 'extraSpaces', label: 'Remove Extra Spaces' },
    { id: 'emptyLines', label: 'Remove Empty Lines' },
    { id: 'htmlTags', label: 'Strip HTML Tags' },
    { id: 'specialChars', label: 'Remove Special Chars' },
  ];

  const handleCopy = (t: string) => navigator.clipboard.writeText(t);

  const readabilityColor = readability.fleschEase >= 60 ? 'text-[#00FF41] bg-[#00FF41]' : readability.fleschEase >= 40 ? 'text-[#c6c6c6] bg-[#2a2a2a]' : 'text-white/70 bg-white/10';

  const tabs = [
    { id: 'stats', label: '📊 Stats', mobileLabel: 'Stats' },
    { id: 'keywords', label: '🔑 Keywords', mobileLabel: 'Keywords' },
    { id: 'readability', label: '📖 Readability', mobileLabel: 'Read' },
    { id: 'social', label: '📱 Social Limits', mobileLabel: 'Social' },
    { id: 'case', label: '🔠 Case Convert', mobileLabel: 'Case' },
    { id: 'clean', label: '🧹 Clean Text', mobileLabel: 'Clean' },
  ] as const;

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, readability, keyword density, and more."
      width="full"
    >
      <div className="pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Text Input */}
          <div className="lg:col-span-2">
            <div className="bg-[#1f1f1f] rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-[#e2e2e2]">Your Text</label>
                <div className="flex items-center gap-3 text-xs text-[#c6c6c6]">
                  <span>⏱ {stats.readingTime} read</span>
                  <span>🗣 {stats.speakingTime} speak</span>
                </div>
              </div>
              <textarea
                className="w-full h-64 p-4 border border-white/10 rounded-xl text-sm text-[#c6c6c6] leading-relaxed resize-y focus:outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[#00FF41]"
                placeholder="Start typing or paste your text here..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
              {text && (
                <button onClick={() => setText('')} className="mt-2 text-xs text-[#c6c6c6] hover:text-[#c6c6c6]">Clear text</button>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-6 bg-[#1f1f1f] rounded-2xl border border-white/10">
              <div className="flex overflow-x-auto border-b border-white/10">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.id ? 'text-[--color-primary] border-b-2 border-[--color-primary]' : 'text-[#c6c6c6] hover:text-[#e2e2e2]'}`}>
                    <span className="hidden sm:inline">{t.label}</span>
                    <span className="sm:hidden">{t.mobileLabel}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Stats Tab */}
                {activeTab === 'stats' && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {statCards.map(s => (
                        <div key={s.key} className="bg-[#131313] rounded-xl p-4 text-center">
                          <div className="text-2xl mb-1">{s.icon}</div>
                          <div className="text-2xl font-bold text-[#e2e2e2]">{stats[s.key].toLocaleString()}</div>
                          <div className="text-xs text-[#c6c6c6] mt-1">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-[#c6c6c6]">
                      <div>⏱ Reading Time: <strong>{stats.readingTime}</strong></div>
                      <div>🗣 Speaking Time: <strong>{stats.speakingTime}</strong></div>
                      <div>📏 Avg Word Length: <strong>{stats.avgWordLength}</strong> chars</div>
                      <div>📐 Avg Sentence Length: <strong>{stats.avgSentenceLength}</strong> words</div>
                      {stats.longestWord && <div className="col-span-2">🏆 Longest Word: <strong>{stats.longestWord}</strong></div>}
                    </div>
                  </div>
                )}

                {/* Keywords Tab */}
                {activeTab === 'keywords' && (
                  <div className="space-y-6">
                    {[{ label: 'Top Keywords', data: keywords.single }, { label: 'Top 2-Word Phrases', data: keywords.bigrams }, { label: 'Top 3-Word Phrases', data: keywords.trigrams }].map(section => (
                      <div key={section.label}>
                        <h3 className="text-sm font-semibold text-[#e2e2e2] mb-3">{section.label}</h3>
                        {section.data.length === 0 ? <p className="text-sm text-[#c6c6c6]">Not enough text to analyze.</p> : (
                          <div className="space-y-2">
                            {section.data.map((kw, i) => (
                              <div key={i} className="flex items-center justify-between bg-[#131313] rounded-lg px-4 py-2">
                                <span className="text-sm text-[#c6c6c6] font-medium">{kw.word}</span>
                                <div className="flex items-center gap-4 text-xs text-[#c6c6c6]">
                                  <span>{kw.count}x</span>
                                  <span className="bg-[#00FF41] text-[#00FF41] px-2 py-0.5 rounded-full font-semibold">{kw.density}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {stats.words > 0 && (
                      <div className="bg-[#00FF41] border border-[#00FF41] rounded-xl p-4 text-sm text-[#00FF41]">
                        💡 <strong>SEO Tip:</strong> Aim for roughly 1-2% keyword density for your target topic, then rewrite awkward repetitions before publishing.
                      </div>
                    )}
                  </div>
                )}

                {/* Readability Tab */}
                {activeTab === 'readability' && (
                  <div>
                    <div className="flex items-center gap-6 mb-6">
                      <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center ${readabilityColor}`}>
                        <span className="text-3xl font-extrabold">{readability.fleschEase}</span>
                        <span className="text-xs">/ 100</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#e2e2e2]">{readability.label}</h3>
                        <p className="text-sm text-[#c6c6c6] mt-1">{readability.description}</p>
                        <p className="text-sm text-[#c6c6c6] mt-2">Grade Level: <strong>{readability.fleschGrade}</strong></p>
                      </div>
                    </div>
                    <div className="w-full bg-[#1f1f1f] rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all ${readability.fleschEase >= 60 ? 'bg-[#00FF41]' : readability.fleschEase >= 40 ? 'bg-[#2a2a2a]' : 'bg-white/10'}`} style={{ width: `${readability.fleschEase}%` }} />
                    </div>
                    <div className="mt-6 bg-[#00FF41] border border-[#00FF41] rounded-xl p-4 text-sm text-[#00FF41]">
                      💡 Want to improve readability? Shorter sentences, fewer filler words, and more concrete nouns usually move the score in the right direction.
                    </div>
                  </div>
                )}

                {/* Social Limits Tab */}
                {activeTab === 'social' && (
                  <div className="space-y-3">
                    {socialLimits.map(s => (
                      <div key={s.platform} className={`flex items-center justify-between p-4 rounded-xl border ${s.exceeded ? 'bg-white/10 border-white/20' : 'bg-[#131313] border-white/10'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{s.icon}</span>
                          <span className="text-sm font-medium text-[#c6c6c6]">{s.platform}</span>
                        </div>
                        <div className="text-sm">
                          <span className={s.exceeded ? 'text-white/70 font-bold' : 'text-[#c6c6c6]'}>{s.current.toLocaleString()}</span>
                          <span className="text-[#c6c6c6]"> / {s.limit.toLocaleString()}</span>
                          {s.exceeded && <span className="ml-2 text-xs text-white/70">⚠️ Over limit</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Case Converter Tab */}
                {activeTab === 'case' && (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {caseModes.map(m => (
                        <button key={m.id} onClick={() => setCaseMode(m.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${caseMode === m.id ? 'bg-[--color-primary] text-white' : 'bg-[#1f1f1f] text-[#e2e2e2] hover:bg-[#1f1f1f]'}`}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                    <div className="bg-[#131313] rounded-xl p-4 min-h-[100px]">
                      <p className="text-sm text-[#c6c6c6] whitespace-pre-wrap">{text ? convertCase(text, caseMode) : 'Type text above to see conversion...'}</p>
                    </div>
                    {text && (
                      <button onClick={() => handleCopy(convertCase(text, caseMode))} className="mt-3 text-sm text-[--color-primary] hover:underline font-medium">📋 Copy converted text</button>
                    )}
                  </div>
                )}

                {/* Clean Text Tab */}
                {activeTab === 'clean' && (
                  <div className="space-y-3">
                    {cleanModes.map(m => (
                      <button key={m.id} onClick={() => setText(cleanText(text, m.id))}
                        className="w-full text-left px-4 py-3 bg-[#131313] hover:bg-[#00FF41] rounded-xl text-sm font-medium text-[#e2e2e2] hover:text-[--color-primary] transition-colors">
                        🧹 {m.label}
                      </button>
                    ))}
                    {!text && <p className="text-sm text-[#c6c6c6]">Type text above to use cleaning tools.</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-[#1f1f1f] rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-[#e2e2e2] mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Words', value: stats.words },
                  { label: 'Characters', value: stats.characters },
                  { label: 'Sentences', value: stats.sentences },
                  { label: 'Paragraphs', value: stats.paragraphs },
                  { label: 'Reading Time', value: stats.readingTime },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <span className="text-[#c6c6c6]">{s.label}</span>
                    <span className="font-semibold text-[#e2e2e2]">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1f1f1f] rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-[#e2e2e2] mb-4">Writing Workflow</h3>
              <div className="space-y-3 text-sm text-[#c6c6c6]">
                <p>Use the tabs to move from raw counts to readability, keyword density, case conversion, and text cleanup.</p>
                <p>The analysis runs locally in your browser, so pasted drafts stay on your device.</p>
              </div>
            </div>

            <div className="bg-[#1f1f1f] rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-[#e2e2e2] mb-4">Included Modes</h3>
              <ul className="space-y-2 text-sm text-[#c6c6c6]">
                {[
                  'Word, character, sentence, and paragraph counts',
                  'Single-word and phrase keyword density',
                  'Flesch readability score and grade level',
                  'Social post character limit checks',
                  'Case conversion and text cleanup tools',
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
