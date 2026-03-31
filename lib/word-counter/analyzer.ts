// Stop words to exclude from keyword density
const STOP_WORDS = new Set([
  'the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at',
  'this','but','his','by','from','they','we','her','she','or','an','will','my','one','all','would','there',
  'their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time',
  'no','just','him','know','take','people','into','year','your','good','some','could','them','see','other',
  'than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our',
  'work','first','well','way','even','new','want','because','any','these','give','day','most','us','is','are',
  'was','were','been','being','has','had','does','did','shall','should','may','might','must','need','dare',
  'am','has','had','very','more','much','many','such','own','same','each','every','both','few','other',
  'another','still','already','here','where','why','how','what','each','every',
]);

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  pages: number;
  readingTime: string;
  speakingTime: string;
  avgWordLength: number;
  avgSentenceLength: number;
  longestWord: string;
}

export interface KeywordEntry {
  word: string;
  count: number;
  density: number;
}

export interface ReadabilityResult {
  fleschEase: number;
  fleschGrade: number;
  label: string;
  description: string;
}

export interface SocialLimit {
  platform: string;
  limit: number;
  current: number;
  exceeded: boolean;
  icon: string;
}

function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(w => w.length > 0);
}

function countSentences(text: string): number {
  const matches = text.match(/[.!?]+(\s|$)/g);
  return matches ? matches.length : (text.trim().length > 0 ? 1 : 0);
}

function countParagraphs(text: string): number {
  return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim().length > 0 ? 1 : 0);
}

function formatTime(minutes: number): string {
  if (minutes < 1) return '< 1 min';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  return `${h} hr ${m} min`;
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

export function analyzeText(text: string): TextStats {
  if (!text.trim()) {
    return { words: 0, characters: 0, charactersNoSpaces: 0, sentences: 0, paragraphs: 0, pages: 0, readingTime: '0 min', speakingTime: '0 min', avgWordLength: 0, avgSentenceLength: 0, longestWord: '' };
  }

  const words = tokenize(text);
  const wordCount = words.length;
  const charCount = text.length;
  const charNoSpace = text.replace(/\s/g, '').length;
  const sentenceCount = countSentences(text);
  const paragraphCount = countParagraphs(text);
  const cleanWords = words.map(w => w.replace(/[^a-zA-Z'-]/g, '')).filter(w => w.length > 0);
  const avgWordLen = cleanWords.length > 0 ? cleanWords.reduce((a, w) => a + w.length, 0) / cleanWords.length : 0;
  const longest = cleanWords.reduce((a, b) => b.length > a.length ? b : a, '');

  return {
    words: wordCount,
    characters: charCount,
    charactersNoSpaces: charNoSpace,
    sentences: sentenceCount,
    paragraphs: paragraphCount,
    pages: Math.ceil(wordCount / 250),
    readingTime: formatTime(wordCount / 225),
    speakingTime: formatTime(wordCount / 130),
    avgWordLength: Math.round(avgWordLen * 10) / 10,
    avgSentenceLength: sentenceCount > 0 ? Math.round(wordCount / sentenceCount * 10) / 10 : 0,
    longestWord: longest,
  };
}

export function analyzeKeywords(text: string, topN: number = 10): { single: KeywordEntry[]; bigrams: KeywordEntry[]; trigrams: KeywordEntry[] } {
  const words = tokenize(text).map(w => w.toLowerCase().replace(/[^a-z0-9'-]/g, '')).filter(w => w.length > 1);
  const total = words.length;
  if (total === 0) return { single: [], bigrams: [], trigrams: [] };

  // Singles
  const singleMap = new Map<string, number>();
  for (const w of words) {
    if (!STOP_WORDS.has(w)) singleMap.set(w, (singleMap.get(w) || 0) + 1);
  }
  const single = [...singleMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count, density: Math.round(count / total * 10000) / 100 }));

  // Bigrams
  const biMap = new Map<string, number>();
  for (let i = 0; i < words.length - 1; i++) {
    const gram = `${words[i]} ${words[i + 1]}`;
    biMap.set(gram, (biMap.get(gram) || 0) + 1);
  }
  const bigrams = [...biMap.entries()]
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count, density: Math.round(count / (total - 1) * 10000) / 100 }));

  // Trigrams
  const triMap = new Map<string, number>();
  for (let i = 0; i < words.length - 2; i++) {
    const gram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    triMap.set(gram, (triMap.get(gram) || 0) + 1);
  }
  const trigrams = [...triMap.entries()]
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count, density: Math.round(count / (total - 2) * 10000) / 100 }));

  return { single, bigrams, trigrams };
}

export function analyzeReadability(text: string): ReadabilityResult {
  const words = tokenize(text);
  const wordCount = words.length;
  const sentenceCount = countSentences(text);

  if (wordCount < 10 || sentenceCount === 0) {
    return { fleschEase: 0, fleschGrade: 0, label: 'N/A', description: 'Need at least 10 words to analyze readability.' };
  }

  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const asl = wordCount / sentenceCount;
  const asw = totalSyllables / wordCount;

  const fleschEase = Math.round(206.835 - 1.015 * asl - 84.6 * asw);
  const fleschGrade = Math.round((0.39 * asl + 11.8 * asw - 15.59) * 10) / 10;

  let label: string, description: string;
  if (fleschEase >= 80) { label = 'Very Easy'; description = 'Easily understood by 11-year-olds. Great for broad audiences.'; }
  else if (fleschEase >= 60) { label = 'Standard'; description = 'Easily understood by 13-15 year-olds. Good for most content.'; }
  else if (fleschEase >= 40) { label = 'Difficult'; description = 'Best understood by college students. Consider simplifying.'; }
  else { label = 'Very Difficult'; description = 'University-graduate level. May need simplification for general audiences.'; }

  return { fleschEase: Math.max(0, Math.min(100, fleschEase)), fleschGrade: Math.max(0, fleschGrade), label, description };
}

export function getSocialLimits(text: string): SocialLimit[] {
  const chars = text.length;
  return [
    { platform: 'Twitter / X', limit: 280, current: chars, exceeded: chars > 280, icon: '𝕏' },
    { platform: 'Instagram Caption', limit: 2200, current: chars, exceeded: chars > 2200, icon: '📸' },
    { platform: 'LinkedIn Post', limit: 3000, current: chars, exceeded: chars > 3000, icon: '💼' },
    { platform: 'Facebook Post', limit: 63206, current: chars, exceeded: chars > 63206, icon: '📘' },
    { platform: 'YouTube Description', limit: 5000, current: chars, exceeded: chars > 5000, icon: '🎬' },
    { platform: 'Meta Description', limit: 160, current: chars, exceeded: chars > 160, icon: '🔍' },
    { platform: 'Title Tag', limit: 60, current: chars, exceeded: chars > 60, icon: '🏷️' },
  ];
}

export function convertCase(text: string, mode: string): string {
  switch (mode) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
    case 'sentence': return text.replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()).replace(/^./, c => c.toUpperCase());
    case 'camel': return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
    case 'snake': return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');
    default: return text;
  }
}

export function cleanText(text: string, mode: string): string {
  switch (mode) {
    case 'extraSpaces': return text.replace(/ +/g, ' ');
    case 'emptyLines': return text.replace(/\n\s*\n/g, '\n');
    case 'htmlTags': return text.replace(/<[^>]*>/g, '');
    case 'specialChars': return text.replace(/[^a-zA-Z0-9\s.,!?'-]/g, '');
    default: return text;
  }
}
