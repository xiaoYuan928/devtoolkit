'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FormField } from '@/lib/form-builder/types';

interface Props {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

const typeLabels: Record<string, string> = {
  text: 'Text Input',
  email: 'Email',
  phone: 'Phone',
  textarea: 'Text Area',
  select: 'Dropdown',
  radio: 'Radio Group',
  checkbox: 'Checkbox Group',
  date: 'Date Picker',
  number: 'Number',
  file: 'File Upload',
  heading: 'Heading',
  paragraph: 'Paragraph',
  divider: 'Divider',
};

export default function SortableField({ field, isSelected, onSelect, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isLayoutField = ['heading', 'paragraph', 'divider'].includes(field.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
        isSelected ? 'border-[--color-primary] bg-indigo-50' : 'border-transparent hover:border-gray-200 bg-gray-50'
      }`}
    >
      {/* Drag handle */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </div>

      {/* Field info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase">{typeLabels[field.type] || field.type}</span>
          {field.required && <span className="text-xs text-red-500 font-medium">Required</span>}
        </div>
        <div className="text-sm font-medium text-gray-900 truncate mt-0.5">
          {isLayoutField ? (field.text || field.type) : (field.label || 'Untitled Field')}
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
        aria-label="Remove field"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
