export interface ToolInfo {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: 'format' | 'encode' | 'generate' | 'text' | 'web' | 'dev' | 'business' | 'writing' | 'image';
}

export const categories: Record<string, { label: string; icon: string }> = {
  format: { label: 'Formatters', icon: '📐' },
  encode: { label: 'Encoders & Decoders', icon: '🔐' },
  generate: { label: 'Generators', icon: '🎲' },
  text: { label: 'Text Tools', icon: '📝' },
  web: { label: 'Web Tools', icon: '🌐' },
  dev: { label: 'Dev Utilities', icon: '⚙️' },
  business: { label: 'Business Tools', icon: '💼' },
  writing: { label: 'Writing Tools', icon: '✍️' },
  image: { label: 'Image Tools', icon: '🖼️' },
};

export const tools: ToolInfo[] = [
  // High-value tools first
  { slug: 'invoice', name: 'Invoice Generator', description: 'Create and download professional invoices as PDF', icon: '🧾', category: 'business' },
  { slug: 'form-builder', name: 'Form Builder', description: 'Drag-and-drop form builder with templates and conditional logic', icon: '📝', category: 'web' },
  { slug: 'og-image', name: 'OG Image Generator', description: 'Generate Open Graph images with 12 templates and URL API', icon: '🖼️', category: 'image' },
  { slug: 'email-signature', name: 'Email Signature', description: 'Create professional email signatures for Gmail, Outlook & Apple Mail', icon: '✉️', category: 'business' },
  { slug: 'privacy-policy', name: 'Privacy Policy Generator', description: 'Generate GDPR & CCPA compliant privacy policies for your website', icon: '🛡️', category: 'business' },
  { slug: 'contract-template', name: 'Contract Template', description: 'Generate NDA, freelance agreements, and terms of service', icon: '📋', category: 'business' },
  { slug: 'word-counter', name: 'Word Counter', description: 'Count words, characters, sentences with keyword density analysis', icon: '📊', category: 'writing' },

  // Standard tools
  { slug: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate, and minify JSON data', icon: '{ }', category: 'format' },
  { slug: 'csv-json', name: 'CSV ↔ JSON', description: 'Convert between CSV and JSON formats', icon: '📊', category: 'format' },
  { slug: 'markdown-preview', name: 'Markdown Preview', description: 'Write Markdown and preview HTML in real-time', icon: '📖', category: 'format' },

  { slug: 'base64', name: 'Base64 Encode/Decode', description: 'Encode or decode Base64 strings', icon: '🔄', category: 'encode' },
  { slug: 'url-encode', name: 'URL Encode/Decode', description: 'Encode or decode URL components', icon: '🔗', category: 'encode' },
  { slug: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens', icon: '🎫', category: 'encode' },
  { slug: 'html-entity', name: 'HTML Entity', description: 'Encode/decode HTML entities and special characters', icon: '&amp;', category: 'encode' },

  { slug: 'uuid-generator', name: 'UUID Generator', description: 'Generate random UUIDs (v4) in bulk', icon: '🆔', category: 'generate' },
  { slug: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes', icon: '#️⃣', category: 'generate' },
  { slug: 'lorem-ipsum', name: 'Lorem Ipsum', description: 'Generate placeholder text for designs', icon: '📄', category: 'generate' },

  { slug: 'diff-checker', name: 'Diff Checker', description: 'Compare two texts and highlight differences', icon: '🔍', category: 'text' },

  { slug: 'color-converter', name: 'Color Converter', description: 'Convert between HEX, RGB, and HSL', icon: '🎨', category: 'web' },
  { slug: 'subtitle', name: 'Subtitle Extractor', description: 'Extract and convert subtitles from videos (Deepgram or Whisper)', icon: '🎬', category: 'web' },

  { slug: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions with live matching', icon: '.*', category: 'dev' },
  { slug: 'timestamp', name: 'Unix Timestamp', description: 'Convert between Unix timestamps and dates', icon: '⏰', category: 'dev' },
  { slug: 'cron-parser', name: 'Cron Parser', description: 'Parse cron expressions and see next run times', icon: '📅', category: 'dev' },
];
