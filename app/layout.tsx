import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevToolKit — Free Online Developer Tools',
  description: 'Open-source collection of 20+ developer tools. JSON formatter, Base64, hash generator, regex tester, and more. All free, all in your browser.',
  keywords: ['developer tools', 'online tools', 'json formatter', 'base64 encode', 'hash generator', 'regex tester'],
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}')` }} />
          </>
        )}
      </head>
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🧰</span>
              <span className="text-xl font-bold">Dev<span className="text-indigo-500">ToolKit</span></span>
            </a>
            <div className="flex items-center gap-4">
              <a href="https://github.com/qiangxy888/devtoolkit" target="_blank" rel="noopener"
                className="text-gray-500 hover:text-gray-900 text-sm font-medium flex items-center gap-1">
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t mt-auto py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            <p>Open source under MIT License. All tools run in your browser — no data is sent to any server.</p>
            <p className="mt-1">
              <a href="https://github.com/qiangxy888/devtoolkit" className="text-indigo-500 hover:underline">GitHub</a>
              {' · '}
              <a href="https://hitools.dev" className="text-indigo-500 hover:underline">HiTools</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
