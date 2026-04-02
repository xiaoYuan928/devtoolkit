'use client';

import { useState, useMemo } from 'react';
import ToolLayout from '@/components/ToolLayout';

const FIELD_NAMES = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week'];
const PRESETS = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every day at midnight', cron: '0 0 * * *' },
  { label: 'Every Monday at 9am', cron: '0 9 * * 1' },
  { label: 'Every 6 hours', cron: '0 */6 * * *' },
  { label: '1st of every month', cron: '0 0 1 * *' },
  { label: 'Weekdays at 8:30am', cron: '30 8 * * 1-5' },
];

function describeField(value: string, idx: number): string {
  if (value === '*') return `every ${FIELD_NAMES[idx].toLowerCase()}`;
  if (value.startsWith('*/')) return `every ${value.slice(2)} ${FIELD_NAMES[idx].toLowerCase()}s`;
  if (value.includes(',')) return `at ${FIELD_NAMES[idx].toLowerCase()} ${value}`;
  if (value.includes('-')) return `${FIELD_NAMES[idx].toLowerCase()} ${value}`;
  return `${FIELD_NAMES[idx].toLowerCase()} ${value}`;
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid: must have exactly 5 fields';
  return parts.map((p, i) => describeField(p, i)).join(', ');
}

function getNextRuns(expr: string, count: number = 5): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const runs: string[] = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0);
  d.setMilliseconds(0);
  d.setMinutes(d.getMinutes() + 1);

  for (let i = 0; i < 1440 * 365 && runs.length < count; i++) {
    const min = d.getMinutes(), hr = d.getHours(), dom = d.getDate(), mon = d.getMonth() + 1, dow = d.getDay();

    const match = (field: string, val: number, max: number): boolean => {
      if (field === '*') return true;
      if (field.startsWith('*/')) return val % parseInt(field.slice(2)) === 0;
      return field.split(',').some(p => {
        if (p.includes('-')) { const [a, b] = p.split('-').map(Number); return val >= a && val <= b; }
        return parseInt(p) === val;
      });
    };

    if (match(parts[0], min, 59) && match(parts[1], hr, 23) && match(parts[2], dom, 31) && match(parts[3], mon, 12) && match(parts[4], dow, 6)) {
      runs.push(d.toLocaleString());
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return runs;
}

export default function CronParserPage() {
  const [cron, setCron] = useState('0 */6 * * *');
  const parts = cron.trim().split(/\s+/);
  const isValid = parts.length === 5;

  const nextRuns = useMemo(() => getNextRuns(cron), [cron]);

  return (
    <ToolLayout title="Cron Expression Parser" description="Parse cron expressions and see the next scheduled run times.">
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#e2e2e2] mb-1">Cron Expression</label>
        <input value={cron} onChange={e => setCron(e.target.value)} className="w-full font-mono text-lg border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#00FF41] text-center tracking-wider" />
      </div>

      {/* Field breakdown */}
      {isValid && (
        <div className="grid grid-cols-5 gap-2 mb-6">
          {parts.map((p, i) => (
            <div key={i} className="text-center bg-[#1f1f1f] border border-white/10 rounded-lg p-3">
              <p className="font-mono text-lg font-bold text-[#00FF41]">{p}</p>
              <p className="text-xs text-[#c6c6c6] mt-1">{FIELD_NAMES[i]}</p>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="bg-[#2a2a2a] rounded-xl p-4 mb-6">
        <p className="text-sm text-[#00FF41] font-medium">{describeCron(cron)}</p>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#e2e2e2] mb-2">Presets</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.cron} onClick={() => setCron(p.cron)} className={`text-xs px-3 py-1.5 rounded-full ${cron === p.cron ? 'bg-[#00FF41] text-white' : 'bg-[#1f1f1f] text-[#e2e2e2] hover:bg-[#1f1f1f]'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Next runs */}
      {nextRuns.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#e2e2e2] mb-2">Next 5 Runs</h3>
          <div className="bg-[#1f1f1f] border border-white/10 rounded-xl divide-y">
            {nextRuns.map((r, i) => (
              <div key={i} className="px-4 py-2 font-mono text-sm text-[#e2e2e2] flex items-center gap-2">
                <span className="text-[#c6c6c6] text-xs w-4">{i + 1}</span> {r}
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
