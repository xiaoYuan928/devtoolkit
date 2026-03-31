# 10001.ai

Free online tools for developers, writers, businesses, and creators.

22+ tools, fully open source, all in your browser.

## Tool Categories

### Formatters
- JSON Formatter
- CSV ↔ JSON
- Markdown Preview

### Encoders & Decoders
- Base64 Encode/Decode
- URL Encode/Decode
- JWT Decoder
- HTML Entity

### Generators
- UUID Generator
- Hash Generator
- Lorem Ipsum

### Text Tools
- Diff Checker

### Web Tools
- Color Converter
- Form Builder

### Dev Utilities
- Regex Tester
- Unix Timestamp
- Cron Parser

### Business Tools
- Email Signature Generator
- Privacy Policy Generator
- Contract Template Generator
- Invoice Generator

### Writing Tools
- Word Counter

### Image Tools
- OG Image Generator

## Quick Start

```bash
git clone https://github.com/qiangxy888/devtoolkit.git
cd devtoolkit
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project Structure

- `app/tools/{slug}/page.tsx`: tool pages
- `lib/tools.ts`: tool registry and categories
- `components/ToolLayout.tsx`: shared page wrapper
- `app/sitemap.ts`: sitemap generated from the tool registry

## Contributing

Add a new tool in two steps:

1. Register it in `lib/tools.ts`
2. Create `app/tools/{slug}/page.tsx` and wrap the UI with `ToolLayout`

More detail is in `CONTRIBUTING.md`.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## License

MIT
