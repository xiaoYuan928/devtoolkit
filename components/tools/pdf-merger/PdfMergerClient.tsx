'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Dropzone from './Dropzone';
import Panel from './Panel';
import {
  downloadBytes,
  mergePdfs,
  type MergeOptions,
  type PdfFileEntry,
} from './utils';

export default function PdfMergerClient() {
  const [files, setFiles] = useState<PdfFileEntry[]>([]);
  const [options, setOptions] = useState<MergeOptions>({
    preserveBookmarks: true,
    addToc: false,
    compress: false,
  });
  const [merging, setMerging] = useState(false);
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const outputRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    setDone(false);
    setPct(0);
    setStage('');
    setError(null);
    outputRef.current = null;
  }, [files]);

  const onMerge = useCallback(async () => {
    if (files.length < 2 || merging) return;
    setMerging(true);
    setDone(false);
    setError(null);
    setPct(0);
    setStage('Reading file headers…');
    outputRef.current = null;

    try {
      const bytes = await mergePdfs(files, options, (p, s) => {
        setPct(p);
        setStage(s);
      });
      outputRef.current = bytes;
      setPct(100);
      setStage('merged.pdf · ready');
      setDone(true);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : 'Failed to merge PDFs. One of the files may be corrupted or password-protected.';
      setError(msg);
      setPct(0);
      setStage('');
      setDone(false);
    } finally {
      setMerging(false);
    }
  }, [files, merging, options]);

  const onDownload = useCallback(() => {
    if (!outputRef.current) return;
    downloadBytes(outputRef.current, 'merged.pdf');
  }, []);

  const onClear = useCallback(() => {
    setFiles([]);
    setDone(false);
    setMerging(false);
    setPct(0);
    setStage('');
    setError(null);
    outputRef.current = null;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6">
      <Dropzone files={files} setFiles={setFiles} disabled={merging} />
      <Panel
        files={files}
        options={options}
        setOptions={setOptions}
        merging={merging}
        done={done}
        pct={pct}
        stage={stage}
        error={error}
        onMerge={onMerge}
        onDownload={onDownload}
        onClear={onClear}
      />
    </div>
  );
}
