'use client';

import { useState } from 'react';
import type { InvoiceData, TemplateStyle } from '@/lib/invoice/types';

interface Props {
  data: InvoiceData;
  template: TemplateStyle;
}

export default function PDFDownloadButton({ data, template }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { default: InvoicePDF } = await import('./InvoicePDF');
      const blob = await pdf(<InvoicePDF data={data} template={template} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.invoiceNumber || 'invoice'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full bg-[--color-primary] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[--color-primary-dark] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  );
}
