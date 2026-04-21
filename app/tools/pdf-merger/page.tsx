import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import PdfMergerClient from '@/components/tools/pdf-merger/PdfMergerClient';

export const metadata: Metadata = {
  title: 'PDF Merger — 10001.ai',
  description:
    'Combine multiple PDFs into a single file. Drag to reorder, tweak options, download. Runs entirely in your browser — files never leave your device.',
};

export default function PdfMergerPage() {
  return (
    <ToolLayout
      title="PDF Merger"
      description="Combine multiple PDFs into a single file. Drag to reorder, tweak options, download. Runs entirely in your browser — files never leave your device."
      width="wide"
    >
      <PdfMergerClient />
    </ToolLayout>
  );
}
