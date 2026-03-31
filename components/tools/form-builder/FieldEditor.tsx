'use client';

import type { FormField, FieldOption } from '@/lib/form-builder/types';

interface Props {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function FieldEditor({ field, onUpdate }: Props) {
  const isLayoutField = ['heading', 'paragraph', 'divider'].includes(field.type);
  const hasOptions = ['select', 'radio', 'checkbox'].includes(field.type);

  const updateOption = (index: number, key: keyof FieldOption, value: string) => {
    const newOptions = [...field.options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    if (key === 'label') {
      newOptions[index].value = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    }
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const num = field.options.length + 1;
    onUpdate({ options: [...field.options, { label: `Option ${num}`, value: `option_${num}` }] });
  };

  const removeOption = (index: number) => {
    if (field.options.length <= 1) return;
    onUpdate({ options: field.options.filter((_, i) => i !== index) });
  };

  if (field.type === 'divider') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Divider</h3>
        <p className="text-xs text-gray-500">No configuration needed for dividers.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Field Settings</h3>
      <div className="space-y-4">
        {/* Text for heading/paragraph */}
        {(field.type === 'heading' || field.type === 'paragraph') && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Text</label>
              {field.type === 'heading' ? (
                <input className="form-input" value={field.text || ''} onChange={e => onUpdate({ text: e.target.value })} placeholder="Heading text" />
              ) : (
                <textarea className="form-input" value={field.text || ''} onChange={e => onUpdate({ text: e.target.value })} placeholder="Paragraph text" rows={3} />
              )}
            </div>
            {field.type === 'heading' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Level</label>
                <select className="form-input" value={field.headingLevel || 'h2'} onChange={e => onUpdate({ headingLevel: e.target.value as 'h2' | 'h3' })}>
                  <option value="h2">H2 — Section</option>
                  <option value="h3">H3 — Subsection</option>
                </select>
              </div>
            )}
          </>
        )}

        {/* Regular field settings */}
        {!isLayoutField && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
              <input className="form-input" value={field.label} onChange={e => onUpdate({ label: e.target.value })} placeholder="Field label" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Field Name (HTML)</label>
              <input className="form-input font-mono text-xs" value={field.name} onChange={e => onUpdate({ name: e.target.value })} placeholder="field_name" />
            </div>
            {!hasOptions && field.type !== 'file' && field.type !== 'date' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Placeholder</label>
                <input className="form-input" value={field.placeholder} onChange={e => onUpdate({ placeholder: e.target.value })} placeholder="Placeholder text" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input type="checkbox" id={`req-${field.id}`} checked={field.required} onChange={e => onUpdate({ required: e.target.checked })} className="w-4 h-4 text-[--color-primary] rounded" />
              <label htmlFor={`req-${field.id}`} className="text-sm text-gray-700">Required field</label>
            </div>

            {/* Textarea rows */}
            {field.type === 'textarea' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rows</label>
                <input className="form-input" type="number" min={2} max={10} value={field.rows || 4} onChange={e => onUpdate({ rows: parseInt(e.target.value) || 4 })} />
              </div>
            )}

            {/* Number min/max */}
            {field.type === 'number' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min</label>
                  <input className="form-input" type="number" value={field.min ?? ''} onChange={e => onUpdate({ min: e.target.value ? parseFloat(e.target.value) : undefined })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max</label>
                  <input className="form-input" type="number" value={field.max ?? ''} onChange={e => onUpdate({ max: e.target.value ? parseFloat(e.target.value) : undefined })} />
                </div>
              </div>
            )}

            {/* File accept */}
            {field.type === 'file' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Accepted file types</label>
                <input className="form-input" value={field.accept || ''} onChange={e => onUpdate({ accept: e.target.value })} placeholder=".pdf,.doc,.jpg" />
              </div>
            )}

            {/* Options editor */}
            {hasOptions && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Options</label>
                <div className="space-y-2">
                  {field.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input className="form-input flex-1" value={opt.label} onChange={e => updateOption(i, 'label', e.target.value)} placeholder={`Option ${i + 1}`} />
                      {field.options.length > 1 && (
                        <button onClick={() => removeOption(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={addOption} className="mt-2 text-sm text-[--color-primary] hover:underline font-medium">+ Add option</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
