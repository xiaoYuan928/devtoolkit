'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fmtBytes, pad2 } from './utils';

interface Props {
  id: string;
  name: string;
  size: number;
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}

const iconBtnBase =
  'bg-transparent border border-white/10 text-[#c6c6c6] px-2.5 py-1.5 rounded-sm font-mono text-xs leading-none transition-all';

export default function FileRow({ id, name, size, index, total, onMove, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 5 : 'auto',
  };

  const atTop = index === 0;
  const atBottom = index === total - 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[28px_1fr_auto_auto_auto] items-center gap-3 bg-[#131313] border border-white/5 rounded-lg px-3.5 py-3 hover:bg-[#2a2a2a] transition-colors"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="font-mono text-[11px] text-white/50 text-center cursor-grab active:cursor-grabbing bg-transparent border-0 p-0 select-none touch-none"
        title="Drag to reorder"
        aria-label={`Drag handle for ${name}`}
      >
        {pad2(index + 1)}
      </button>

      <span
        className="font-body text-sm text-[#e2e2e2] overflow-hidden text-ellipsis whitespace-nowrap"
        title={name}
      >
        {name}
      </span>

      <span className="font-mono text-[11px] text-white/50 tabular-nums">{fmtBytes(size)}</span>

      <div className="flex gap-1">
        <button
          type="button"
          disabled={atTop}
          onClick={() => onMove(-1)}
          className={`${iconBtnBase} ${
            atTop
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:text-[#00FF41] hover:border-[#00FF41]'
          }`}
          title="Move up"
          aria-label={`Move ${name} up`}
        >
          ↑
        </button>
        <button
          type="button"
          disabled={atBottom}
          onClick={() => onMove(+1)}
          className={`${iconBtnBase} ${
            atBottom
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:text-[#00FF41] hover:border-[#00FF41]'
          }`}
          title="Move down"
          aria-label={`Move ${name} down`}
        >
          ↓
        </button>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className={`${iconBtnBase} hover:text-[#ffdadb] hover:border-[#be003d]/60`}
        title="Remove"
        aria-label={`Remove ${name}`}
      >
        ✕
      </button>
    </div>
  );
}
