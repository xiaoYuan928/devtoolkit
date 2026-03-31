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
    <div className={`${widthClasses[width]} mx-auto px-4 py-8`}>
      <div className="mb-4">
        <Link href="/" className="text-indigo-500 hover:underline text-sm">← All Tools</Link>
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600 text-sm mb-6">{description}</p>
      {children}
    </div>
  );
}
