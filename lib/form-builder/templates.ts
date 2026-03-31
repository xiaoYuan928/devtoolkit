import type { FormConfig } from './types';
import { generateId } from './utils';

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  config: FormConfig;
}

export const templates: TemplateInfo[] = [
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'Simple contact form with name, email, and message fields.',
    icon: '📧',
    config: {
      title: 'Contact Us',
      submitText: 'Send Message',
      actionUrl: '',
      method: 'POST',
      styleTheme: 'default',
      fields: [
        { id: generateId(), type: 'text', label: 'Full Name', name: 'full_name', placeholder: 'John Doe', required: true, options: [] },
        { id: generateId(), type: 'email', label: 'Email Address', name: 'email', placeholder: 'john@example.com', required: true, options: [] },
        { id: generateId(), type: 'phone', label: 'Phone Number', name: 'phone', placeholder: '+1 (555) 123-4567', required: false, options: [] },
        { id: generateId(), type: 'select', label: 'Subject', name: 'subject', placeholder: '', required: true, options: [{ label: 'General Inquiry', value: 'general' }, { label: 'Support', value: 'support' }, { label: 'Sales', value: 'sales' }, { label: 'Partnership', value: 'partnership' }] },
        { id: generateId(), type: 'textarea', label: 'Message', name: 'message', placeholder: 'How can we help you?', required: true, options: [], rows: 5 },
      ],
    },
  },
  {
    id: 'feedback',
    name: 'Feedback Form',
    description: 'Collect user feedback with ratings and comments.',
    icon: '⭐',
    config: {
      title: 'Share Your Feedback',
      submitText: 'Submit Feedback',
      actionUrl: '',
      method: 'POST',
      styleTheme: 'modern',
      fields: [
        { id: generateId(), type: 'text', label: 'Your Name', name: 'name', placeholder: 'Jane Smith', required: false, options: [] },
        { id: generateId(), type: 'email', label: 'Email', name: 'email', placeholder: 'jane@example.com', required: true, options: [] },
        { id: generateId(), type: 'select', label: 'Overall Rating', name: 'rating', placeholder: '', required: true, options: [{ label: '5 - Excellent', value: '5' }, { label: '4 - Good', value: '4' }, { label: '3 - Average', value: '3' }, { label: '2 - Poor', value: '2' }, { label: '1 - Terrible', value: '1' }] },
        { id: generateId(), type: 'radio', label: 'Category', name: 'category', placeholder: '', required: true, options: [{ label: 'Product', value: 'product' }, { label: 'Service', value: 'service' }, { label: 'Website', value: 'website' }, { label: 'Other', value: 'other' }] },
        { id: generateId(), type: 'textarea', label: 'Comments', name: 'comments', placeholder: 'Tell us more about your experience...', required: false, options: [], rows: 5 },
      ],
    },
  },
  {
    id: 'registration',
    name: 'Registration Form',
    description: 'User registration with personal details and account info.',
    icon: '📝',
    config: {
      title: 'Create Your Account',
      submitText: 'Register',
      actionUrl: '',
      method: 'POST',
      styleTheme: 'default',
      fields: [
        { id: generateId(), type: 'text', label: 'First Name', name: 'first_name', placeholder: 'John', required: true, options: [] },
        { id: generateId(), type: 'text', label: 'Last Name', name: 'last_name', placeholder: 'Doe', required: true, options: [] },
        { id: generateId(), type: 'email', label: 'Email Address', name: 'email', placeholder: 'john@example.com', required: true, options: [] },
        { id: generateId(), type: 'phone', label: 'Phone', name: 'phone', placeholder: '+1 (555) 123-4567', required: false, options: [] },
        { id: generateId(), type: 'date', label: 'Date of Birth', name: 'date_of_birth', placeholder: '', required: false, options: [] },
        { id: generateId(), type: 'checkbox', label: 'Interests', name: 'interests', placeholder: '', required: false, options: [{ label: 'Technology', value: 'tech' }, { label: 'Design', value: 'design' }, { label: 'Business', value: 'business' }, { label: 'Marketing', value: 'marketing' }] },
      ],
    },
  },
  {
    id: 'survey',
    name: 'Survey Form',
    description: 'Customer satisfaction survey with multiple question types.',
    icon: '📊',
    config: {
      title: 'Customer Satisfaction Survey',
      submitText: 'Submit Survey',
      actionUrl: '',
      method: 'POST',
      styleTheme: 'minimal',
      fields: [
        { id: generateId(), type: 'heading', label: '', name: '', placeholder: '', required: false, options: [], text: 'Customer Satisfaction Survey', headingLevel: 'h2' },
        { id: generateId(), type: 'paragraph', label: '', name: '', placeholder: '', required: false, options: [], text: 'We value your opinion! Please take a moment to answer the following questions.' },
        { id: generateId(), type: 'radio', label: 'How satisfied are you with our product?', name: 'satisfaction', placeholder: '', required: true, options: [{ label: 'Very Satisfied', value: 'very_satisfied' }, { label: 'Satisfied', value: 'satisfied' }, { label: 'Neutral', value: 'neutral' }, { label: 'Dissatisfied', value: 'dissatisfied' }] },
        { id: generateId(), type: 'radio', label: 'How likely are you to recommend us?', name: 'recommend', placeholder: '', required: true, options: [{ label: 'Very Likely', value: 'very_likely' }, { label: 'Likely', value: 'likely' }, { label: 'Unlikely', value: 'unlikely' }, { label: 'Very Unlikely', value: 'very_unlikely' }] },
        { id: generateId(), type: 'textarea', label: 'Any additional comments?', name: 'comments', placeholder: 'Share your thoughts...', required: false, options: [], rows: 4 },
        { id: generateId(), type: 'checkbox', label: 'What features do you use most?', name: 'features_used', placeholder: '', required: false, options: [{ label: 'Dashboard', value: 'dashboard' }, { label: 'Reports', value: 'reports' }, { label: 'Integrations', value: 'integrations' }, { label: 'API', value: 'api' }] },
      ],
    },
  },
  {
    id: 'order',
    name: 'Order Form',
    description: 'Product order form with quantity and shipping details.',
    icon: '🛒',
    config: {
      title: 'Place Your Order',
      submitText: 'Place Order',
      actionUrl: '',
      method: 'POST',
      styleTheme: 'modern',
      fields: [
        { id: generateId(), type: 'text', label: 'Full Name', name: 'full_name', placeholder: 'John Doe', required: true, options: [] },
        { id: generateId(), type: 'email', label: 'Email', name: 'email', placeholder: 'john@example.com', required: true, options: [] },
        { id: generateId(), type: 'phone', label: 'Phone', name: 'phone', placeholder: '+1 (555) 123-4567', required: true, options: [] },
        { id: generateId(), type: 'select', label: 'Product', name: 'product', placeholder: '', required: true, options: [{ label: 'Basic Plan', value: 'basic' }, { label: 'Pro Plan', value: 'pro' }, { label: 'Enterprise Plan', value: 'enterprise' }] },
        { id: generateId(), type: 'number', label: 'Quantity', name: 'quantity', placeholder: '1', required: true, options: [], min: 1, max: 100 },
        { id: generateId(), type: 'textarea', label: 'Shipping Address', name: 'address', placeholder: '123 Main St, City, State, ZIP', required: true, options: [], rows: 3 },
        { id: generateId(), type: 'textarea', label: 'Order Notes', name: 'notes', placeholder: 'Any special instructions?', required: false, options: [], rows: 3 },
      ],
    },
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'Job application form with resume upload and experience details.',
    icon: '💼',
    config: {
      title: 'Job Application',
      submitText: 'Submit Application',
      actionUrl: '',
      method: 'POST',
      styleTheme: 'default',
      fields: [
        { id: generateId(), type: 'text', label: 'Full Name', name: 'full_name', placeholder: 'John Doe', required: true, options: [] },
        { id: generateId(), type: 'email', label: 'Email', name: 'email', placeholder: 'john@example.com', required: true, options: [] },
        { id: generateId(), type: 'phone', label: 'Phone', name: 'phone', placeholder: '+1 (555) 123-4567', required: true, options: [] },
        { id: generateId(), type: 'select', label: 'Position Applied For', name: 'position', placeholder: '', required: true, options: [{ label: 'Frontend Developer', value: 'frontend' }, { label: 'Backend Developer', value: 'backend' }, { label: 'Designer', value: 'designer' }, { label: 'Product Manager', value: 'pm' }, { label: 'Other', value: 'other' }] },
        { id: generateId(), type: 'select', label: 'Years of Experience', name: 'experience', placeholder: '', required: true, options: [{ label: '0-1 years', value: '0-1' }, { label: '2-3 years', value: '2-3' }, { label: '4-6 years', value: '4-6' }, { label: '7+ years', value: '7+' }] },
        { id: generateId(), type: 'textarea', label: 'Cover Letter', name: 'cover_letter', placeholder: 'Tell us why you are a great fit...', required: false, options: [], rows: 6 },
        { id: generateId(), type: 'file', label: 'Resume/CV', name: 'resume', placeholder: '', required: true, options: [], accept: '.pdf,.doc,.docx' },
      ],
    },
  },
];
