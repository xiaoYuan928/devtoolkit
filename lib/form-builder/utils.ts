import type { FieldType, FormField, FormConfig } from './types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'field';
}

export function createField(type: FieldType): FormField {
  const id = generateId();
  const base: FormField = {
    id,
    type,
    label: '',
    name: '',
    placeholder: '',
    required: false,
    options: [],
  };

  switch (type) {
    case 'text':
      return { ...base, label: 'Text Field', name: 'text_field', placeholder: 'Enter text...' };
    case 'email':
      return { ...base, label: 'Email', name: 'email', placeholder: 'you@example.com', required: true };
    case 'phone':
      return { ...base, label: 'Phone', name: 'phone', placeholder: '+1 (555) 123-4567' };
    case 'textarea':
      return { ...base, label: 'Message', name: 'message', placeholder: 'Type your message...', rows: 4 };
    case 'select':
      return { ...base, label: 'Select Option', name: 'select_option', options: [{ label: 'Option 1', value: 'option_1' }, { label: 'Option 2', value: 'option_2' }, { label: 'Option 3', value: 'option_3' }] };
    case 'radio':
      return { ...base, label: 'Choose One', name: 'choose_one', options: [{ label: 'Option A', value: 'option_a' }, { label: 'Option B', value: 'option_b' }] };
    case 'checkbox':
      return { ...base, label: 'Select All That Apply', name: 'select_all', options: [{ label: 'Choice 1', value: 'choice_1' }, { label: 'Choice 2', value: 'choice_2' }] };
    case 'date':
      return { ...base, label: 'Date', name: 'date' };
    case 'number':
      return { ...base, label: 'Number', name: 'number', placeholder: '0', min: 0, max: 100 };
    case 'file':
      return { ...base, label: 'Upload File', name: 'file', accept: '.pdf,.doc,.docx,.jpg,.png' };
    case 'heading':
      return { ...base, label: '', name: '', text: 'Section Title', headingLevel: 'h2' };
    case 'paragraph':
      return { ...base, label: '', name: '', text: 'Add description text here.' };
    case 'divider':
      return { ...base, label: '', name: '' };
    default:
      return base;
  }
}

export function getDefaultFormConfig(): FormConfig {
  return {
    title: 'My Form',
    submitText: 'Submit',
    actionUrl: '',
    method: 'POST',
    fields: [
      { ...createField('text'), label: 'Name', name: 'name', placeholder: 'Your name', required: true },
      { ...createField('email'), label: 'Email', name: 'email', placeholder: 'you@example.com', required: true },
      { ...createField('textarea'), label: 'Message', name: 'message', placeholder: 'Your message...', rows: 4 },
    ],
    styleTheme: 'default',
  };
}
