'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ToolLayout from '@/components/ToolLayout';
import type { FormConfig, FormField, FieldType } from '@/lib/form-builder/types';
import { generateId, createField, getDefaultFormConfig, slugify } from '@/lib/form-builder/utils';
import { generateHTML, generateCSS } from '@/lib/form-builder/code-generator';
import { templates } from '@/lib/form-builder/templates';
import SortableField from '@/components/tools/form-builder/SortableField';
import FieldEditor from '@/components/tools/form-builder/FieldEditor';
import CodeOutput from '@/components/tools/form-builder/CodeOutput';

const fieldTypes: { type: FieldType; label: string; icon: string }[] = [
  { type: 'text', label: 'Text Input', icon: 'Aa' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'phone', label: 'Phone', icon: '📱' },
  { type: 'textarea', label: 'Text Area', icon: '📝' },
  { type: 'select', label: 'Dropdown', icon: '▼' },
  { type: 'radio', label: 'Radio', icon: '◉' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'number', label: 'Number', icon: '#' },
  { type: 'file', label: 'File Upload', icon: '📎' },
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'paragraph', label: 'Paragraph', icon: '¶' },
  { type: 'divider', label: 'Divider', icon: '—' },
];

type Tab = 'build' | 'preview' | 'code';

export default function FormBuilderPage() {
  const [config, setConfig] = useState<FormConfig>(getDefaultFormConfig);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('build');
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem('formBuilderConfig');
      if (saved) setConfig(JSON.parse(saved));
    } catch { /* ignore */ }
    const params = new URLSearchParams(window.location.search);
    const tmpl = params.get('template');
    if (tmpl) {
      const t = templates.find(tp => tp.id === tmpl);
      if (t) setConfig({ ...t.config, fields: t.config.fields.map(f => ({ ...f, id: generateId() })) });
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('formBuilderConfig', JSON.stringify(config)); } catch { /* ignore */ }
  }, [config]);

  const addField = useCallback((type: FieldType) => {
    const field = createField(type);
    setConfig(prev => ({ ...prev, fields: [...prev.fields, field] }));
    setSelectedId(field.id);
  }, []);

  const removeField = useCallback((id: string) => {
    setConfig(prev => ({ ...prev, fields: prev.fields.filter(f => f.id !== id) }));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => {
        if (f.id !== id) return f;
        const updated = { ...f, ...updates };
        if (updates.label && !updates.name) updated.name = slugify(updates.label);
        return updated;
      }),
    }));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setConfig(prev => {
        const oldIdx = prev.fields.findIndex(f => f.id === active.id);
        const newIdx = prev.fields.findIndex(f => f.id === over.id);
        return { ...prev, fields: arrayMove(prev.fields, oldIdx, newIdx) };
      });
    }
  }, []);

  const resetForm = () => {
    setConfig(getDefaultFormConfig());
    setSelectedId(null);
    localStorage.removeItem('formBuilderConfig');
  };

  const htmlCode = generateHTML(config);
  const cssCode = generateCSS(config.styleTheme);
  const fullCode = `<style>\n${cssCode}\n</style>\n\n${htmlCode}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedField = config.fields.find(f => f.id === selectedId);

  const softwareSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '10001.ai Form Builder',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  });

  return (
    <ToolLayout
      title="Form Builder"
      description="Drag, drop, and customize form fields, then export clean HTML and CSS."
      width="full"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: softwareSchema }} />

      <div className="py-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select className="form-input !w-auto text-sm" value={config.styleTheme} onChange={e => setConfig(prev => ({ ...prev, styleTheme: e.target.value as FormConfig['styleTheme'] }))}>
              <option value="default">Default Style</option>
              <option value="modern">Modern Style</option>
              <option value="minimal">Minimal Style</option>
            </select>
            <button onClick={resetForm} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Reset</button>
            <button onClick={copyCode} className="px-4 py-2 text-sm font-semibold text-white bg-[--color-primary] rounded-lg hover:bg-[--color-primary-dark]">
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>
        <div className="flex lg:hidden mt-4 rounded-lg overflow-hidden border border-gray-300">
          {(['build', 'preview', 'code'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 px-4 py-2 text-sm font-medium capitalize ${tab === t ? 'bg-[--color-primary] text-white' : 'bg-white text-gray-600'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Component Panel */}
          <div className={`lg:col-span-2 ${tab !== 'build' ? 'hidden lg:block' : ''}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Add Fields</h2>
              <div className="space-y-1">
                {fieldTypes.map(ft => (
                  <button key={ft.type} onClick={() => addField(ft.type)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-[--color-primary] rounded-lg transition-colors text-left">
                    <span className="w-6 text-center text-xs">{ft.icon}</span>{ft.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Canvas */}
          <div className={`lg:col-span-6 ${tab !== 'build' ? 'hidden lg:block' : ''}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <input className="text-xl font-bold text-gray-900 w-full mb-1 border-0 border-b-2 border-transparent focus:border-[--color-primary] focus:outline-none pb-1" value={config.title} onChange={e => setConfig(prev => ({ ...prev, title: e.target.value }))} placeholder="Form Title" />
              <div className="flex gap-4 mb-6 mt-2">
                <input className="text-sm text-gray-500 border-0 border-b border-transparent focus:border-gray-300 focus:outline-none" value={config.submitText} onChange={e => setConfig(prev => ({ ...prev, submitText: e.target.value }))} placeholder="Submit button text" />
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={config.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {config.fields.map(field => (
                      <SortableField key={field.id} field={field} isSelected={selectedId === field.id} onSelect={() => setSelectedId(field.id)} onRemove={() => removeField(field.id)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {config.fields.length === 0 && (
                <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-lg mb-2">No fields yet</p>
                  <p className="text-sm">Click a field type from the left panel to add it</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview / Code / Editor */}
          <div className={`lg:col-span-4 ${tab === 'build' && !selectedField ? '' : ''}`}>
            <div className="sticky top-20 space-y-4">
              <div className="hidden lg:flex rounded-lg overflow-hidden border border-gray-200">
                {(['preview', 'code'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`flex-1 px-4 py-2 text-sm font-medium capitalize ${(tab === t || (tab === 'build' && t === 'preview')) ? 'bg-[--color-primary] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                    {t === 'preview' ? '👁 Preview' : '< > Code'}
                  </button>
                ))}
              </div>

              {selectedField && (tab === 'build') && (
                <FieldEditor field={selectedField} onUpdate={(updates) => updateField(selectedField.id, updates)} />
              )}

              {(tab === 'preview' || tab === 'build') && !(selectedField && tab === 'build') && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Live Preview</span>
                    <span className="text-xs text-gray-500 capitalize">{config.styleTheme}</span>
                  </div>
                  <div className="p-4">
                    <div dangerouslySetInnerHTML={{ __html: `<style>${cssCode}</style>${htmlCode}` }} />
                  </div>
                </div>
              )}

              {tab === 'code' && (
                <CodeOutput htmlCode={htmlCode} cssCode={cssCode} fullCode={fullCode} onCopy={copyCode} copied={copied} />
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-900">Export Notes</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            This tool generates static HTML and CSS in the browser. Use the exported code in landing pages, prototypes, or marketing sites, then connect submissions to your own backend or form endpoint.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
