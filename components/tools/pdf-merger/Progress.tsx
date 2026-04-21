'use client';

interface Props {
  pct: number;
  stage: string;
  done: boolean;
}

export default function Progress({ pct, stage, done }: Props) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="flex flex-col gap-2">
      <style>{`@keyframes pdfmerger-blink{50%{opacity:0.3}}`}</style>
      <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-[0.12em]">
        <span className="text-white/50 font-bold">{done ? 'Complete' : 'Merging'}</span>
        <span className="text-[#00FF41] font-bold text-[13px] tracking-normal">
          {clamped.toFixed(0).padStart(3, '0')}%
        </span>
      </div>
      <div className="relative h-2 bg-[#131313] border border-white/5 rounded-sm overflow-hidden">
        <div
          className="absolute top-0 bottom-0 left-0 bg-[#00FF41] transition-[width] duration-[150ms] ease-linear"
          style={{
            width: `${clamped}%`,
            boxShadow: done
              ? '0 0 16px rgba(0,255,65,0.80)'
              : '0 0 12px rgba(0,255,65,0.50)',
          }}
        />
      </div>
      <div className="flex justify-between items-center font-mono text-[11px] text-[#c6c6c6]">
        <span className="truncate pr-2">{stage}</span>
        {!done && (
          <span
            className="text-[#00FF41] shrink-0"
            style={{ animation: 'pdfmerger-blink 1s steps(2) infinite' }}
          >
            ●
          </span>
        )}
      </div>
    </div>
  );
}
