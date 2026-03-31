import { InvoiceItem, InvoiceData } from './types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  CNY: '¥',
};

export function formatCurrency(amount: number, currency: string): string {
  const symbol = currencySymbols[currency] || currency + ' ';
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calculateDiscount(
  subtotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number {
  if (discountType === 'percentage') {
    return subtotal * (discountValue / 100);
  }
  return discountValue;
}

export function calculateTax(amount: number, taxRate: number): number {
  return amount * (taxRate / 100);
}

export function calculateTotal(
  subtotal: number,
  discountAmount: number,
  taxAmount: number
): number {
  return subtotal - discountAmount + taxAmount;
}

export function getDefaultInvoiceData(): InvoiceData {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 30);

  const fmt = (d: Date) => d.toISOString().split('T')[0];

  return {
    senderName: '',
    senderAddress: '',
    senderEmail: '',
    senderPhone: '',
    logoUrl: null,

    clientName: '',
    clientCompany: '',
    clientAddress: '',
    clientEmail: '',

    invoiceNumber: 'INV-0001',
    invoiceDate: fmt(today),
    dueDate: fmt(due),
    currency: 'USD',

    items: [
      {
        id: generateId(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ],

    subtotal: 0,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,

    notes: '',
    paymentTerms: 'Net 30',
    signature: '',
  };
}
