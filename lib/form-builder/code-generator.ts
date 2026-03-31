import type { FormConfig, FormField } from './types';

function indent(str: string, level: number): string {
  return str.split('\n').map(line => '  '.repeat(level) + line).join('\n');
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateFieldHTML(field: FormField): string {
  const req = field.required ? ' required' : '';
  const ph = field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : '';

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'date':
      const inputType = field.type === 'phone' ? 'tel' : field.type;
      return `<div class="form-group">\n  <label for="${field.name}">${escapeHtml(field.label)}${field.required ? ' <span class="required">*</span>' : ''}</label>\n  <input type="${inputType}" id="${field.name}" name="${field.name}"${ph}${req}${field.maxLength ? ` maxlength="${field.maxLength}"` : ''} />\n</div>`;

    case 'number':
      return `<div class="form-group">\n  <label for="${field.name}">${escapeHtml(field.label)}${field.required ? ' <span class="required">*</span>' : ''}</label>\n  <input type="number" id="${field.name}" name="${field.name}"${ph}${req}${field.min !== undefined ? ` min="${field.min}"` : ''}${field.max !== undefined ? ` max="${field.max}"` : ''} />\n</div>`;

    case 'textarea':
      return `<div class="form-group">\n  <label for="${field.name}">${escapeHtml(field.label)}${field.required ? ' <span class="required">*</span>' : ''}</label>\n  <textarea id="${field.name}" name="${field.name}"${ph} rows="${field.rows || 4}"${req}></textarea>\n</div>`;

    case 'select':
      const opts = field.options.map(o => `    <option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join('\n');
      return `<div class="form-group">\n  <label for="${field.name}">${escapeHtml(field.label)}${field.required ? ' <span class="required">*</span>' : ''}</label>\n  <select id="${field.name}" name="${field.name}"${req}>\n    <option value="">Select...</option>\n${opts}\n  </select>\n</div>`;

    case 'radio':
      const radios = field.options.map(o =>
        `    <label class="radio-label"><input type="radio" name="${field.name}" value="${escapeHtml(o.value)}"${req} /> ${escapeHtml(o.label)}</label>`
      ).join('\n');
      return `<div class="form-group">\n  <label>${escapeHtml(field.label)}${field.required ? ' <span class="required">*</span>' : ''}</label>\n  <div class="radio-group">\n${radios}\n  </div>\n</div>`;

    case 'checkbox':
      const checks = field.options.map(o =>
        `    <label class="checkbox-label"><input type="checkbox" name="${field.name}" value="${escapeHtml(o.value)}" /> ${escapeHtml(o.label)}</label>`
      ).join('\n');
      return `<div class="form-group">\n  <label>${escapeHtml(field.label)}${field.required ? ' <span class="required">*</span>' : ''}</label>\n  <div class="checkbox-group">\n${checks}\n  </div>\n</div>`;

    case 'file':
      return `<div class="form-group">\n  <label for="${field.name}">${escapeHtml(field.label)}${field.required ? ' <span class="required">*</span>' : ''}</label>\n  <input type="file" id="${field.name}" name="${field.name}"${field.accept ? ` accept="${field.accept}"` : ''}${req} />\n</div>`;

    case 'heading':
      const tag = field.headingLevel || 'h2';
      return `<${tag}>${escapeHtml(field.text || '')}</${tag}>`;

    case 'paragraph':
      return `<p class="form-description">${escapeHtml(field.text || '')}</p>`;

    case 'divider':
      return `<hr class="form-divider" />`;

    default:
      return '';
  }
}

export function generateHTML(config: FormConfig): string {
  const fieldsHTML = config.fields.map(f => indent(generateFieldHTML(f), 1)).join('\n\n');
  const action = config.actionUrl ? ` action="${escapeHtml(config.actionUrl)}"` : '';

  return `<form method="${config.method}"${action} class="form-container">
  <h1 class="form-title">${escapeHtml(config.title)}</h1>

${fieldsHTML}

  <div class="form-group">
    <button type="submit" class="submit-btn">${escapeHtml(config.submitText)}</button>
  </div>
</form>`;
}

export function generateCSS(theme: 'default' | 'modern' | 'minimal'): string {
  const colors = {
    default: { primary: '#7c3aed', bg: '#f9fafb', border: '#d1d5db', radius: '8px' },
    modern: { primary: '#2563eb', bg: '#ffffff', border: '#e5e7eb', radius: '12px' },
    minimal: { primary: '#374151', bg: '#ffffff', border: '#e5e7eb', radius: '4px' },
  };
  const c = colors[theme];

  return `.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 32px;
  background: ${c.bg};
  border-radius: ${c.radius};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #111827;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group input[type="number"],
.form-group input[type="date"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${c.border};
  border-radius: ${c.radius};
  font-size: 14px;
  color: #1f2937;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: ${c.primary};
  box-shadow: 0 0 0 3px ${c.primary}20;
}

.required { color: #ef4444; }

.radio-group, .checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.radio-label, .checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
}

.form-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.form-divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 24px 0;
}

h2 { font-size: 20px; font-weight: 700; color: #111827; margin: 24px 0 8px; }
h3 { font-size: 16px; font-weight: 600; color: #374151; margin: 16px 0 8px; }

.submit-btn {
  width: 100%;
  padding: 12px 24px;
  background: ${c.primary};
  color: #fff;
  border: none;
  border-radius: ${c.radius};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.submit-btn:hover { opacity: 0.9; }`;
}
