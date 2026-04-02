import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://10001.ai'),
  title: '10001.ai — Free Online Tools',
  description: 'Open-source collection of 22+ online tools for developers, writers, businesses, and creators. Free, browser-based, and privacy-friendly.',
  keywords: ['online tools', 'free tools', 'json formatter', 'invoice generator', 'word counter', 'og image generator'],
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}')` }} />
          </>
        )}
      </head>
      <body className="antialiased bg-[#131313] text-[#e2e2e2] min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-[#131313]/90 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#00FF41] uppercase">10001.ai</span>
            </a>
            <div className="flex items-center gap-6">
              <a href="https://github.com/xiaoYuan928/devtoolkit" target="_blank" rel="noopener"
                className="text-white/60 hover:text-[#00FF41] text-sm font-semibold uppercase tracking-wide transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <div className="text-[#00FF41] font-black text-xl mb-2 uppercase">10001.ai</div>
                <p className="uppercase text-[10px] tracking-widest text-white/30">
                  ©2024 10001.ai. Open Source Core.
                </p>
              </div>
              <div className="flex gap-10 uppercase text-[10px] tracking-widest font-bold">
                <a href="https://github.com/xiaoYuan928/devtoolkit" className="text-white/40 hover:text-[#00FF41] transition-colors">Github</a>
                <a href="https://10001.ai" className="text-white/40 hover:text-[#00FF41] transition-colors">Website</a>
                <a href="#" className="text-white/40 hover:text-[#00FF41] transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
