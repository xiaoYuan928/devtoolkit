'use client';

import type { InvoiceData, TemplateStyle } from '@/lib/invoice/types';
import { formatCurrency, formatDate } from '@/lib/invoice/utils';

interface Props {
  data: InvoiceData;
  template: TemplateStyle;
}

const templateColors: Record<TemplateStyle, { primary: string; accent: string; headerBg: string }> = {
  classic: { primary: '#2563eb', accent: '#dbeafe', headerBg: '#2563eb' },
  modern: { primary: '#0f172a', accent: '#f1f5f9', headerBg: '#0f172a' },
  minimal: { primary: '#374151', accent: '#f9fafb', headerBg: '#ffffff' },
};

export default function InvoicePreviewHTML({ data, template }: Props) {
  const colors = templateColors[template];
  const isMinimal = template === 'minimal';

  return (
    <div className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: '#1f2937' }}>
      {/* Header */}
      <div
        className="rounded-lg p-6 mb-6"
        style={{
          backgroundColor: isMinimal ? '#ffffff' : colors.headerBg,
          color: isMinimal ? colors.primary : '#ffffff',
          border: isMinimal ? '2px solid #e5e7eb' : 'none',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            {data.logoUrl && (
              <img src={data.logoUrl} alt="Logo" className="h-12 mb-3 object-contain" style={{ maxWidth: '120px' }} />
            )}
            <h2 className="text-xl font-bold">{data.senderName || 'Your Business'}</h2>
            {data.senderAddress && <p className="text-xs mt-1 opacity-80 whitespace-pre-line">{data.senderAddress}</p>}
            {data.senderEmail && <p className="text-xs opacity-80">{data.senderEmail}</p>}
            {data.senderPhone && <p className="text-xs opacity-80">{data.senderPhone}</p>}
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-extrabold tracking-wide">INVOICE</h1>
            <p className="text-xs mt-2 opacity-80">{data.invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Dates & Client */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bill To</h3>
          <p className="font-semibold">{data.clientName || 'Client Name'}</p>
          {data.clientCompany && <p className="text-gray-600">{data.clientCompany}</p>}
          {data.clientAddress && <p className="text-gray-600 whitespace-pre-line text-xs">{data.clientAddress}</p>}
          {data.clientEmail && <p className="text-gray-600 text-xs">{data.clientEmail}</p>}
        </div>
        <div className="text-right">
          <div className="space-y-1 text-xs">
            <p><span className="text-gray-500">Invoice Date:</span> <span className="font-medium">{formatDate(data.invoiceDate)}</span></p>
            <p><span className="text-gray-500">Due Date:</span> <span className="font-medium">{formatDate(data.dueDate)}</span></p>
            <p><span className="text-gray-500">Payment Terms:</span> <span className="font-medium">{data.paymentTerms}</span></p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr style={{ backgroundColor: colors.accent }}>
            <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 rounded-l-lg">Description</th>
            <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600">Qty</th>
            <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600">Price</th>
            <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 rounded-r-lg">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="px-3 py-2.5 text-gray-800">{item.description || '—'}</td>
              <td className="px-3 py-2.5 text-right text-gray-700">{item.quantity}</td>
              <td className="px-3 py-2.5 text-right text-gray-700">{formatCurrency(item.unitPrice, data.currency)}</td>
              <td className="px-3 py-2.5 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice, data.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">{formatCurrency(data.subtotal, data.currency)}</span>
          </div>
          {data.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">
                Discount {data.discountType === 'percentage' ? `(${data.discountValue}%)` : ''}
              </span>
              <span className="font-medium text-red-600">-{formatCurrency(data.discountAmount, data.currency)}</span>
            </div>
          )}
          {data.taxAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Tax ({data.taxRate}%)</span>
              <span className="font-medium">{formatCurrency(data.taxAmount, data.currency)}</span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-2 flex justify-between text-base font-bold">
            <span>Total</span>
            <span style={{ color: colors.primary }}>{formatCurrency(data.total, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: colors.accent }}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</h3>
          <p className="text-gray-700 text-xs whitespace-pre-line">{data.notes}</p>
        </div>
      )}

      {/* Signature */}
      {data.signature && (
        <div className="mt-8 flex justify-end">
          <div className="text-right">
            <div className="border-b border-gray-400 pb-1 mb-1 min-w-[160px]">
              <span className="text-sm italic text-gray-800">{data.signature}</span>
            </div>
            <span className="text-xs text-gray-500">Authorized Signature</span>
          </div>
        </div>
      )}
    </div>
  );
}
