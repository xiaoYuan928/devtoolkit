'use client';

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useRef, useState } from 'react';
import FileRow from './FileRow';
import type { PdfFileEntry } from './utils';

interface Props {
  files: PdfFileEntry[];
  setFiles: React.Dispatch<React.SetStateAction<PdfFileEntry[]>>;
  disabled?: boolean;
}

const ghostBtn =
  'bg-[#1f1f1f] text-[#e2e2e2] border border-white/10 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-[#2a2a2a] hover:border-[#00FF41] hover:text-[#00FF41] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1f1f1f] disabled:hover:border-white/10 disabled:hover:text-[#e2e2e2]';

export default function Dropzone({ files, setFiles, disabled = false }: Props) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = (list: FileList | null) => {
    if (!list || disabled) return;
    const incoming = Array.from(list).filter(
      (f) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name)
    );
    if (incoming.length === 0) return;
    setFiles((prev) => [
      ...prev,
      ...incoming.map((f) => ({
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: f,
        name: f.name,
        size: f.size,
      })),
    ]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    add(e.dataTransfer.files);
  };

  const onBrowse = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const move = (id: string, dir: -1 | 1) => {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= prev.length) return prev;
      const copy = prev.slice();
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  };

  const remove = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setFiles((prev) => {
      const oldIdx = prev.findIndex((f) => f.id === active.id);
      const newIdx = prev.findIndex((f) => f.id === over.id);
      if (oldIdx < 0 || newIdx < 0) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  const borderClass = drag
    ? 'border-[#00FF41] bg-[#00FF41]/[0.04] shadow-[0_0_0_3px_rgba(0,255,65,0.15)]'
    : 'border-white/15';

  return (
    <div
      className={`relative bg-[#1f1f1f] border border-dashed ${borderClass} rounded-xl p-8 min-h-[420px] flex flex-col transition-colors`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = '';
        }}
      />

      {files.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 pointer-events-none">
          <div
            className="font-mono text-[56px] leading-none text-[#00FF41] tracking-tight px-[22px] py-[14px] border rounded-xl bg-[#131313]"
            style={{ borderColor: 'rgba(0,255,65,0.30)' }}
          >
            PDF
          </div>
          <h3 className="font-headline font-black text-[22px] uppercase tracking-tight text-white m-0">
            Drop PDFs here
          </h3>
          <p className="font-mono text-xs text-white/50 m-0">
            or click to browse · multiple files accepted · 100% in-browser
          </p>
          <button
            type="button"
            className={`pointer-events-auto mt-2 ${ghostBtn}`}
            onClick={onBrowse}
            disabled={disabled}
          >
            Choose Files
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={files.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {files.map((f, i) => (
                <FileRow
                  key={f.id}
                  id={f.id}
                  name={f.name}
                  size={f.size}
                  index={i}
                  total={files.length}
                  onMove={(dir) => move(f.id, dir)}
                  onRemove={() => remove(f.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
            <span className="font-mono text-[11px] text-white/50 flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 bg-[#00FF41] rounded-full"
                style={{ boxShadow: '0 0 8px rgba(0,255,65,0.60)' }}
              />
              {files.length} file{files.length === 1 ? '' : 's'} queued
            </span>
            <button
              type="button"
              className={ghostBtn}
              onClick={onBrowse}
              disabled={disabled}
            >
              + Add more
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
