import Link from 'next/link';

interface ToolLayoutProps {
  title: string;
  description: string;
  width?: 'default' | 'wide' | 'full';
  children: React.ReactNode;
}

const widthClasses = {
  default: 'max-w-5xl',
  wide: 'max-w-6xl',
  full: 'max-w-7xl',
};

export default function ToolLayout({
  title,
  description,
  width = 'default',
  children,
}: ToolLayoutProps) {
  return (
    <div className={`${widthClasses[width]} mx-auto px-6 md:px-12 py-8`}>
      <div className="mb-6">
        <Link href="/" className="text-[#00FF41] hover:text-white text-sm font-semibold uppercase tracking-wide transition-colors">← All Tools</Link>
      </div>
      <h1 className="text-3xl sm:text-4xl font-headline font-black text-[#e2e2e2] mb-2 uppercase tracking-tight">{title}</h1>
      <p className="text-[#c6c6c6] text-base mb-8 leading-relaxed">{description}</p>
      {children}
    </div>
  );
}
