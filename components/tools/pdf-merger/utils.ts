import { PDFDocument } from 'pdf-lib';

export interface PdfFileEntry {
  id: string;
  file: File;
  name: string;
  size: number;
}

export interface MergeOptions {
  preserveBookmarks: boolean;
  addToc: boolean;
  compress: boolean;
}

export type ProgressHandler = (pct: number, stage: string) => void;

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

const frame = () => new Promise<void>((r) => setTimeout(r, 0));

export async function mergePdfs(
  entries: PdfFileEntry[],
  options: MergeOptions,
  onProgress: ProgressHandler
): Promise<Uint8Array> {
  onProgress(4, 'Reading file headers…');
  await frame();

  const merged = await PDFDocument.create();
  const total = entries.length;

  for (let i = 0; i < total; i++) {
    const entry = entries[i];
    const label = `Parsing ${pad2(i + 1)}/${pad2(total)} · ${entry.name}`;
    const base = 10 + (i / total) * 70;
    onProgress(base, label);
    await frame();

    const buf = await entry.file.arrayBuffer();
    const src = await PDFDocument.load(buf, { ignoreEncryption: true });
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));

    const end = 10 + ((i + 1) / total) * 70;
    onProgress(end, label);
    await frame();
  }

  onProgress(86, 'Stitching pages…');
  await frame();

  if (options.preserveBookmarks) {
    const title = 'merged.pdf';
    merged.setTitle(title);
    merged.setProducer('10001.ai PDF Merger');
  }

  onProgress(94, 'Writing output stream…');
  await frame();

  const bytes = await merged.save({
    useObjectStreams: options.compress,
    addDefaultPage: false,
  });

  onProgress(100, 'merged.pdf · ready');
  return bytes;
}

export function downloadBytes(bytes: Uint8Array, filename: string): void {
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([buf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
