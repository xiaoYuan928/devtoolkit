export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceData {
  senderName: string;
  senderAddress: string;
  senderEmail: string;
  senderPhone: string;
  logoUrl: string | null;

  clientName: string;
  clientCompany: string;
  clientAddress: string;
  clientEmail: string;

  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;

  items: InvoiceItem[];

  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;

  notes: string;
  paymentTerms: string;
  signature: string;
}

export interface AffiliateProduct {
  name: string;
  slug: string;
  url: string;
  description: string;
  rating: number;
  price: string;
  features: string[];
  pros: string[];
  cons: string[];
}

export type TemplateStyle = 'classic' | 'modern' | 'minimal';
