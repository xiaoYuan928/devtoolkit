export type FieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'file' | 'heading' | 'paragraph' | 'divider';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  options: FieldOption[];
  rows?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  accept?: string;
  headingLevel?: 'h2' | 'h3';
  text?: string;
}

export interface FormConfig {
  title: string;
  submitText: string;
  actionUrl: string;
  method: 'GET' | 'POST';
  fields: FormField[];
  styleTheme: 'default' | 'modern' | 'minimal';
}

export interface AffiliateProduct {
  name: string;
  slug: string;
  url: string;
  description: string;
  rating: number;
  price: string;
  features: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  content: string;
  keywords: string[];
}
