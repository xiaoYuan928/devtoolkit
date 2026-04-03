/**
 * 字幕格式化工具
 * 支持：SRT、VTT、JSON、TXT、Markdown
 */

export interface Segment {
  id: number;
  start: number;
  duration: number;
  text: string;
}

export interface TranscriptionResult {
  text: string;
  segments: Segment[];
  metadata: {
    language: string;
    totalDuration: number;
    segmentCount: number;
    confidence: number;
  };
}

/**
 * 格式化为 SRT（SubRip）格式
 * 用于视频播放器
 */
export function formatToSRT(result: TranscriptionResult): string {
  return result.segments
    .map(
      (seg) =>
        `${seg.id}\n${formatTime(seg.start)} --> ${formatTime(seg.start + seg.duration)}\n${seg.text}`
    )
    .join('\n\n');
}

/**
 * 格式化为 VTT（WebVTT）格式
 * Web 标准字幕格式
 */
export function formatToVTT(result: TranscriptionResult): string {
  return (
    'WEBVTT\n\n' +
    result.segments
      .map(
        (seg) =>
          `${formatTimeVTT(seg.start)} --> ${formatTimeVTT(seg.start + seg.duration)}\n${seg.text}`
      )
      .join('\n\n')
  );
}

/**
 * 格式化为 JSON
 * 结构化数据，支持编程操作
 */
export function formatToJSON(result: TranscriptionResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * 格式化为纯文本
 * 仅包含文本内容，无时间戳
 */
export function formatToTXT(result: TranscriptionResult): string {
  return result.segments.map((seg) => seg.text).join('\n');
}

/**
 * 格式化为 Markdown
 * 带有时间戳，适合文档
 */
export function formatToMarkdown(result: TranscriptionResult): string {
  return (
    `# 字幕转录\n\n**语言**: ${result.metadata.language}\n**时长**: ${formatDuration(result.metadata.totalDuration)}\n\n---\n\n` +
    result.segments
      .map((seg) => `**${formatTimeVTT(seg.start)}**: ${seg.text}`)
      .join('\n\n')
  );
}

/**
 * SRT 时间格式：HH:MM:SS,mmm
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

/**
 * VTT 时间格式：HH:MM:SS.mmm
 */
function formatTimeVTT(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

/**
 * 格式化时长显示
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours} 小时`);
  if (minutes > 0) parts.push(`${minutes} 分钟`);
  if (secs > 0) parts.push(`${secs} 秒`);

  return parts.join(' ');
}

/**
 * 导出文件
 */
export function exportSubtitle(
  format: 'srt' | 'vtt' | 'json' | 'txt' | 'markdown',
  result: TranscriptionResult
): { content: string; filename: string; mimeType: string } {
  let content = '';
  let filename = '';
  let mimeType = '';

  const timestamp = new Date().toISOString().slice(0, 10);

  switch (format) {
    case 'srt':
      content = formatToSRT(result);
      filename = `subtitle_${timestamp}.srt`;
      mimeType = 'text/plain';
      break;
    case 'vtt':
      content = formatToVTT(result);
      filename = `subtitle_${timestamp}.vtt`;
      mimeType = 'text/plain';
      break;
    case 'json':
      content = formatToJSON(result);
      filename = `subtitle_${timestamp}.json`;
      mimeType = 'application/json';
      break;
    case 'txt':
      content = formatToTXT(result);
      filename = `subtitle_${timestamp}.txt`;
      mimeType = 'text/plain';
      break;
    case 'markdown':
      content = formatToMarkdown(result);
      filename = `subtitle_${timestamp}.md`;
      mimeType = 'text/markdown';
      break;
  }

  return { content, filename, mimeType };
}
