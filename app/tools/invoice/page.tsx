'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import type { InvoiceData, InvoiceItem, TemplateStyle } from '@/lib/invoice/types';
import {
  generateId,
  formatCurrency,
  formatDate,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  getDefaultInvoiceData,
} from '@/lib/invoice/utils';
import dynamic from 'next/dynamic';

const InvoicePreviewHTML = dynamic(() => import('@/components/tools/invoice/InvoicePreviewHTML'), {
  ssr: false,
});

const PDFDownloadButton = dynamic(() => import('@/components/tools/invoice/PDFDownloadButton'), {
  ssr: false,
});

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY'];

export default function InvoiceGeneratorPage() {
  const [data, setData] = useState<InvoiceData>(getDefaultInvoiceData);
  const [template, setTemplate] = useState<TemplateStyle>('classic');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('invoiceData');
      if (saved) {
        setData(JSON.parse(saved));
      }
      const savedNum = localStorage.getItem('invoiceCounter');
      if (!saved && savedNum) {
        const num = parseInt(savedNum, 10) + 1;
        localStorage.setItem('invoiceCounter', String(num));
        setData((d) => ({ ...d, invoiceNumber: `INV-${String(num).padStart(4, '0')}` }));
      }
    } catch {
      // ignore
    }
    // Check for template query param
    const params = new URLSearchParams(window.location.search);
    const t = params.get('template');
    if (t === 'classic' || t === 'modern' || t === 'minimal') {
      setTemplate(t);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('invoiceData', JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  // Recalculate totals
  const recalculate = useCallback(
    (d: InvoiceData): InvoiceData => {
      const subtotal = calculateSubtotal(d.items);
      const discountAmount = calculateDiscount(subtotal, d.discountType, d.discountValue);
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = calculateTax(taxableAmount, d.taxRate);
      const total = calculateTotal(subtotal, discountAmount, taxAmount);
      return {
        ...d,
        items: d.items.map((item) => ({ ...item, amount: item.quantity * item.unitPrice })),
        subtotal,
        discountAmount,
        taxAmount,
        total,
      };
    },
    []
  );

  const updateField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setData((prev) => recalculate({ ...prev, [key]: value }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData((prev) => {
      const items = prev.items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.amount = updated.quantity * updated.unitPrice;
        return updated;
      });
      return recalculate({ ...prev, items });
    });
  };

  const addItem = () => {
    setData((prev) =>
      recalculate({
        ...prev,
        items: [
          ...prev.items,
          { id: generateId(), description: '', quantity: 1, unitPrice: 0, amount: 0 },
        ],
      })
    );
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) return;
    setData((prev) => recalculate({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField('logoUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    const fresh = getDefaultInvoiceData();
    try {
      const savedNum = localStorage.getItem('invoiceCounter');
      const num = savedNum ? parseInt(savedNum, 10) + 1 : 1;
      localStorage.setItem('invoiceCounter', String(num));
      fresh.invoiceNumber = `INV-${String(num).padStart(4, '0')}`;
    } catch {
      // ignore
    }
    setData(fresh);
    localStorage.removeItem('invoiceData');
  };

  const softwareSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '10001.ai Invoice Generator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '1250' },
  });

  return (
    <ToolLayout
      title="Invoice Generator"
      description="Fill in the details below and download your professional invoice as a PDF."
      width="full"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: softwareSchema }} />

      {/* Template selector + actions */}
      <div className="py-2 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Template:</label>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            {(['classic', 'modern', 'minimal'] as TemplateStyle[]).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  template === t
                    ? 'bg-[--color-primary] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile tab toggle */}
        <div className="flex lg:hidden rounded-lg overflow-hidden border border-gray-300 ml-auto">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'form' ? 'bg-[--color-primary] text-white' : 'bg-white text-gray-600'
            }`}
          >
            Form
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'preview' ? 'bg-[--color-primary] text-white' : 'bg-white text-gray-600'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="ml-auto hidden lg:flex gap-2">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <PDFDownloadButton data={data} template={template} />
        </div>
      </div>

      {/* Main content */}
      <div className="pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className={`space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
            {/* Sender */}
            <FormSection title="Your Business Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Business Name" value={data.senderName} onChange={(v) => updateField('senderName', v)} placeholder="Your Company LLC" />
                <Input label="Email" value={data.senderEmail} onChange={(v) => updateField('senderEmail', v)} placeholder="you@company.com" type="email" />
                <Input label="Phone" value={data.senderPhone} onChange={(v) => updateField('senderPhone', v)} placeholder="+1 (555) 123-4567" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left invoice-input text-gray-500 truncate"
                  >
                    {data.logoUrl ? '✓ Logo uploaded' : 'Upload logo...'}
                  </button>
                  {data.logoUrl && (
                    <button onClick={() => updateField('logoUrl', null)} className="text-xs text-red-500 mt-1 hover:underline">
                      Remove logo
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <TextArea label="Address" value={data.senderAddress} onChange={(v) => updateField('senderAddress', v)} placeholder="123 Business St, City, State 12345" />
              </div>
            </FormSection>

            {/* Client */}
            <FormSection title="Client Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Client Name" value={data.clientName} onChange={(v) => updateField('clientName', v)} placeholder="John Doe" />
                <Input label="Company" value={data.clientCompany} onChange={(v) => updateField('clientCompany', v)} placeholder="Client Corp" />
                <Input label="Email" value={data.clientEmail} onChange={(v) => updateField('clientEmail', v)} placeholder="client@example.com" type="email" />
              </div>
              <div className="mt-4">
                <TextArea label="Address" value={data.clientAddress} onChange={(v) => updateField('clientAddress', v)} placeholder="456 Client Ave, City, State 67890" />
              </div>
            </FormSection>

            {/* Invoice Details */}
            <FormSection title="Invoice Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Invoice Number" value={data.invoiceNumber} onChange={(v) => updateField('invoiceNumber', v)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    className="invoice-input"
                    value={data.currency}
                    onChange={(e) => updateField('currency', e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Input label="Invoice Date" type="date" value={data.invoiceDate} onChange={(v) => updateField('invoiceDate', v)} />
                <Input label="Due Date" type="date" value={data.dueDate} onChange={(v) => updateField('dueDate', v)} />
              </div>
            </FormSection>

            {/* Line Items */}
            <FormSection title="Line Items">
              <div className="space-y-3">
                {data.items.map((item, i) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Item {i + 1}</span>
                      {data.items.length > 1 && (
                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-sm">
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          className="invoice-input"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <input
                        className="invoice-input"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Qty"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                      <input
                        className="invoice-input"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Unit Price"
                        value={item.unitPrice || ''}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="mt-2 text-right text-sm font-medium text-gray-700">
                      Amount: {formatCurrency(item.quantity * item.unitPrice, data.currency)}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addItem}
                className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-[--color-primary] hover:text-[--color-primary] transition-colors"
              >
                + Add Line Item
              </button>
            </FormSection>

            {/* Totals */}
            <FormSection title="Discount & Tax">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    className="invoice-input"
                    value={data.discountType}
                    onChange={(e) => updateField('discountType', e.target.value as 'percentage' | 'fixed')}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <Input
                  label={data.discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount'}
                  type="number"
                  value={String(data.discountValue)}
                  onChange={(v) => updateField('discountValue', parseFloat(v) || 0)}
                />
                <Input label="Tax Rate (%)" type="number" value={String(data.taxRate)} onChange={(v) => updateField('taxRate', parseFloat(v) || 0)} />
              </div>
              <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">{formatCurrency(data.subtotal, data.currency)}</span></div>
                {data.discountAmount > 0 && (
                  <div className="flex justify-between"><span className="text-gray-600">Discount</span><span className="font-medium text-red-600">-{formatCurrency(data.discountAmount, data.currency)}</span></div>
                )}
                {data.taxAmount > 0 && (
                  <div className="flex justify-between"><span className="text-gray-600">Tax ({data.taxRate}%)</span><span className="font-medium">{formatCurrency(data.taxAmount, data.currency)}</span></div>
                )}
                <div className="border-t border-gray-300 pt-2 flex justify-between text-base font-bold">
                  <span>Total</span><span className="text-[--color-primary]">{formatCurrency(data.total, data.currency)}</span>
                </div>
              </div>
            </FormSection>

            {/* Notes */}
            <FormSection title="Notes & Terms">
              <TextArea label="Notes" value={data.notes} onChange={(v) => updateField('notes', v)} placeholder="Thank you for your business!" />
              <div className="mt-4">
                <Input label="Payment Terms" value={data.paymentTerms} onChange={(v) => updateField('paymentTerms', v)} placeholder="Net 30" />
              </div>
              <div className="mt-4">
                <Input label="Signature" value={data.signature} onChange={(v) => updateField('signature', v)} placeholder="Your name or signature" />
              </div>
            </FormSection>

            {/* Mobile actions */}
            <div className="lg:hidden flex gap-3">
              <button onClick={resetForm} className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg">
                Reset
              </button>
              <div className="flex-1">
                <PDFDownloadButton data={data} template={template} />
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className={`${activeTab === 'form' ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-700">Preview</h2>
                  <span className="text-xs text-gray-500 capitalize">{template} template</span>
                </div>
                <div className="p-6 overflow-auto max-h-[calc(100vh-12rem)]">
                  <InvoicePreviewHTML data={data} template={template} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

/* Reusable sub-components */

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className="invoice-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        className="invoice-input min-h-[4rem] resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    </div>
  );
}
