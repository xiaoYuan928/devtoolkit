'use client';

import Progress from './Progress';
import { fmtBytes } from './utils';
import type { MergeOptions, PdfFileEntry } from './utils';

interface Props {
  files: PdfFileEntry[];
  options: MergeOptions;
  setOptions: React.Dispatch<React.SetStateAction<MergeOptions>>;
  merging: boolean;
  done: boolean;
  pct: number;
  stage: string;
  error: string | null;
  onMerge: () => void;
  onDownload: () => void;
  onClear: () => void;
}

const ctaBase =
  'w-full px-5 py-4 font-headline font-black text-[13px] uppercase tracking-[0.18em] rounded-lg border-0 cursor-pointer transition-all inline-flex items-center justify-center gap-2.5';

const ctaPrimary =
  'bg-[#00FF41] text-black hover:bg-[#00FF41]/90 hover:shadow-[0_0_0_3px_rgba(0,255,65,0.25)] disabled:bg-[#2a2a2a] disabled:text-white/30 disabled:cursor-not-allowed disabled:shadow-none';

const ctaGhost =
  'bg-transparent text-[#c6c6c6] border border-white/10 hover:text-[#00FF41] hover:border-[#00FF41] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#c6c6c6] disabled:hover:border-white/10';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-headline font-black text-[16px] uppercase tracking-[0.08em] text-[#e2e2e2] m-0 mb-3">
      {children}
    </h2>
  );
}

export default function Panel({
  files,
  options,
  setOptions,
  merging,
  done,
  pct,
  stage,
  error,
  onMerge,
  onDownload,
  onClear,
}: Props) {
  const total = files.reduce((a, f) => a + f.size, 0);
  const statusLabel = done ? 'READY' : merging ? 'MERGING…' : 'WAITING';
  const statusColor = done ? 'text-[#00FF41]' : 'text-[#e2e2e2]';

  const primaryLabel = merging
    ? '◐ Merging…'
    : done
      ? '⬇ Download merged.pdf'
      : '▶ Merge PDFs';

  const onPrimaryClick = () => {
    if (merging) return;
    if (done) onDownload();
    else onMerge();
  };

  const primaryDisabled = files.length < 2 || merging;

  return (
    <aside className="bg-[#1f1f1f] border border-white/5 rounded-xl p-7 flex flex-col gap-6">
      <section>
        <SectionTitle>How it works</SectionTitle>
        <ol className="flex flex-col gap-3.5 m-0 p-0 list-none [counter-reset:pdfstep]">
          {[
            'Drop in two or more PDF files — or click to browse.',
            'Drag the list to reorder. Order is preserved in the output.',
            <>
              Hit{' '}
              <b className="text-[#00FF41] font-semibold">Merge PDFs</b> —
              processed locally, never uploaded.
            </>,
          ].map((text, i) => (
            <li
              key={i}
              className="relative pl-9 font-body text-sm text-[#e2e2e2] leading-[1.5]"
            >
              <span
                className="absolute left-0 top-0 font-mono text-[11px] font-semibold text-[#00FF41] px-2 py-1 bg-[#131313] rounded-sm"
                style={{ border: '1px solid rgba(0,255,65,0.30)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {text}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionTitle>Options</SectionTitle>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2.5 font-body text-[13px] text-[#e2e2e2] cursor-pointer">
            <input
              type="checkbox"
              checked={options.preserveBookmarks}
              onChange={(e) =>
                setOptions((o) => ({ ...o, preserveBookmarks: e.target.checked }))
              }
              className="w-3.5 h-3.5 accent-[#00FF41]"
              disabled={merging}
            />
            Preserve bookmarks &amp; outlines
          </label>
          <label className="flex items-center gap-2.5 font-body text-[13px] text-[#e2e2e2] cursor-pointer">
            <input
              type="checkbox"
              checked={options.addToc}
              onChange={(e) => setOptions((o) => ({ ...o, addToc: e.target.checked }))}
              className="w-3.5 h-3.5 accent-[#00FF41]"
              disabled={merging}
            />
            Add a table of contents page
          </label>
          <label className="flex items-center gap-2.5 font-body text-[13px] text-[#e2e2e2] cursor-pointer">
            <input
              type="checkbox"
              checked={options.compress}
              onChange={(e) =>
                setOptions((o) => ({ ...o, compress: e.target.checked }))
              }
              className="w-3.5 h-3.5 accent-[#00FF41]"
              disabled={merging}
            />
            Compress output (recompress images)
          </label>
        </div>
      </section>

      <section>
        <SectionTitle>Queue</SectionTitle>
        <dl className="grid grid-cols-2 gap-2 font-mono text-xs m-0">
          <dt className="text-white/50 uppercase tracking-[0.12em] text-[10px] font-bold">
            Files
          </dt>
          <dd className="text-white m-0">{files.length}</dd>
          <dt className="text-white/50 uppercase tracking-[0.12em] text-[10px] font-bold">
            Total size
          </dt>
          <dd className="text-white m-0 tabular-nums">
            {files.length === 0 ? '—' : fmtBytes(total)}
          </dd>
          <dt className="text-white/50 uppercase tracking-[0.12em] text-[10px] font-bold">
            Output
          </dt>
          <dd className="text-white m-0">merged.pdf</dd>
          <dt className="text-white/50 uppercase tracking-[0.12em] text-[10px] font-bold">
            Status
          </dt>
          <dd className={`m-0 ${statusColor}`}>{statusLabel}</dd>
        </dl>
      </section>

      {error && (
        <div className="font-mono text-[12px] text-[#ffdadb] bg-[#be003d]/10 border border-[#be003d]/40 rounded-sm px-3 py-2 leading-relaxed break-words">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2.5 mt-auto">
        {(merging || done) && <Progress pct={pct} stage={stage} done={done} />}

        <button
          type="button"
          className={`${ctaBase} ${ctaPrimary}`}
          disabled={primaryDisabled && !done}
          onClick={onPrimaryClick}
        >
          {primaryLabel}
        </button>

        <button
          type="button"
          className={`${ctaBase} ${ctaGhost}`}
          disabled={files.length === 0 || merging}
          onClick={onClear}
        >
          Clear Queue
        </button>

        <div className="font-mono text-[11px] text-white/50 flex items-center gap-2 justify-center mt-1">
          <span
            className="w-1.5 h-1.5 bg-[#00FF41] rounded-full"
            style={{ boxShadow: '0 0 8px rgba(0,255,65,0.60)' }}
          />
          Runs entirely in your browser. No upload.
        </div>
      </div>
    </aside>
  );
}
