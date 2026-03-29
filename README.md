# 🧰 DevToolKit

> Free, open-source collection of developer tools. Everything runs in your browser.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)

## ✨ Features

- **15 tools** — JSON formatter, Base64, hash generator, regex tester, and more
- **100% client-side** — your data never leaves your browser
- **No signup** — just open and use
- **Fast** — built with Next.js 16 + Tailwind CSS
- **Open source** — MIT licensed, contributions welcome

## 🛠️ Tools

| Category | Tools |
|----------|-------|
| **Formatters** | JSON Formatter, CSV ↔ JSON, Markdown Preview |
| **Encoders** | Base64, URL Encode, JWT Decoder, HTML Entity |
| **Generators** | UUID Generator, Hash Generator, Lorem Ipsum |
| **Text** | Diff Checker |
| **Web** | Color Converter |
| **Dev** | Regex Tester, Unix Timestamp, Cron Parser |

## 🚀 Getting Started

```bash
git clone https://github.com/qiangxy888/devtoolkit.git
cd devtoolkit
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🏗️ Tech Stack

- [Next.js 16](https://nextjs.org) — App Router
- [Tailwind CSS 4](https://tailwindcss.com) — Styling
- [TypeScript](https://www.typescriptlang.org) — Type safety
- No external tool libraries — all tools implemented from scratch

## 📦 Deploy

One-click deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qiangxy888/devtoolkit)

## 🤝 Contributing

PRs welcome! To add a new tool:

1. Create `app/tools/your-tool/page.tsx`
2. Add entry to `lib/tools.ts`
3. Use the `ToolLayout` component
4. Submit PR

## 📄 License

MIT © 2026 DevToolKit
