'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import ToolLayout from '@/components/ToolLayout';

type InputType = 'url' | 'file';
type Method = 'deepgram' | 'whisper';
type Format = 'srt' | 'vtt' | 'json' | 'txt' | 'markdown';

interface TranscriptionResponse {
  success: boolean;
  method: Method;
  result?: {
    text: string;
    segments: Array<{
      id: number;
      start: number;
      duration: number;
      text: string;
    }>;
    metadata: {
      language: string;
      totalDuration: number;
      segmentCount: number;
      confidence: number;
    };
    subtitles: Record<string, string>;
  };
  error?: string;
}

export default function SubtitleExtractorPage() {
  // 输入状态
  const [inputType, setInputType] = useState<InputType>('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理方法
  const [method, setMethod] = useState<Method>('whisper');

  // 处理状态
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<Array<{ timestamp: string; message: string }>>([]);

  // 结果状态
  const [result, setResult] = useState<TranscriptionResponse['result'] | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<Format>('srt');
  const [error, setError] = useState<string | null>(null);

  // 验证输入
  const isInputValid = () => {
    if (inputType === 'url') {
      return url.trim().length > 0;
    } else {
      return file !== null;
    }
  };

  // 添加日志
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN');
    setLogs((prev) => [...prev, { timestamp, message }]);
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 验证文件大小（500MB）
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError('文件过大，最大支持 500MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  // 处理拖放
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  };

  // 提交转录任务
  const handleSubmit = async () => {
    if (!isInputValid()) {
      setError('请提供 URL 或选择文件');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setResult(null);

    try {
      addLog('准备上传...');

      // 准备请求体
      let requestBody: any = {
        method,
        language: language === 'auto' ? 'auto' : language,
        outputFormats: ['srt', 'vtt', 'json']
      };

      if (inputType === 'url') {
        addLog(`正在下载视频: ${url.substring(0, 50)}...`);
        requestBody.input = {
          type: 'url',
          url
        };
      } else if (file) {
        addLog(`正在读取文件: ${file.name}`);
        // 转换文件为 base64
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          requestBody.input = {
            type: 'file',
            file: base64
          };

          await submitRequest(requestBody);
        };
        reader.readAsDataURL(file);
        return;
      }

      await submitRequest(requestBody);
    } catch (error: any) {
      setError(error.message || '处理失败');
      setIsProcessing(false);
    }
  };

  const submitRequest = async (requestBody: any) => {
    try {
      setProgress(10);
      addLog('发送请求到服务器...');

      const response = await fetch('/api/tools/subtitle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      setProgress(50);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '请求失败');
      }

      addLog('处理中...');
      const data: TranscriptionResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || '转录失败');
      }

      setProgress(95);
      addLog('格式化结果...');

      setResult(data.result || null);
      setProgress(100);
      addLog('✅ 完成！');
    } catch (error: any) {
      setError(error.message || '处理失败');
      addLog(`❌ 错误: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 下载字幕
  const downloadSubtitle = () => {
    if (!result) return;

    const format = selectedFormat;
    const content = result.subtitles[format];
    if (!content) return;

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `subtitle_${timestamp}.${format === 'markdown' ? 'md' : format}`;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    if (!result) return;

    const format = selectedFormat;
    const content = result.subtitles[format];
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      alert('已复制到剪贴板！');
    } catch {
      alert('复制失败');
    }
  };

  return (
    <ToolLayout
      title="字幕提取器"
      description="从视频或音频自动生成字幕，支持 SRT、VTT、JSON 等格式"
    >
      <div className="space-y-6">
        {/* 错误提示 */}
        {error && (
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <p className="text-white/70">⚠️ {error}</p>
          </div>
        )}

        {/* 1. 输入区 */}
        <div className="space-y-4 bg-[#1f1f1f] rounded-lg p-6 border border-white/5">
          <h3 className="font-headline font-black text-[#e2e2e2] uppercase text-lg">
            步骤 1：选择输入源
          </h3>

          {/* Tab 切换 */}
          <div className="flex gap-2 border-b border-white/10">
            <button
              onClick={() => setInputType('url')}
              className={`pb-3 px-2 font-semibold text-sm uppercase transition-colors ${
                inputType === 'url'
                  ? 'text-[#00FF41] border-b-2 border-[#00FF41]'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              🔗 URL 输入
            </button>
            <button
              onClick={() => setInputType('file')}
              className={`pb-3 px-2 font-semibold text-sm uppercase transition-colors ${
                inputType === 'file'
                  ? 'text-[#00FF41] border-b-2 border-[#00FF41]'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              📁 本地上传
            </button>
          </div>

          {/* URL 输入 */}
          {inputType === 'url' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white/70">视频链接</label>
              <input
                type="text"
                placeholder="https://bilibili.com/video/BV..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 text-[#e2e2e2] rounded-lg px-4 py-3 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] placeholder:text-white/30"
              />
              <p className="text-xs text-white/50">
                支持：YouTube、B 站、优酷等视频 URL
              </p>
            </div>
          )}

          {/* 文件上传 */}
          {inputType === 'file' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white/70">上传文件</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-white/40 hover:bg-white/5"
              >
                <p className="text-2xl mb-2">📁</p>
                <p className="text-white/70">
                  {file ? file.name : '拖放文件或点击选择'}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  支持：MP3、M4A、WAV、MP4、MKV 等（最大 500MB）
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="audio/*,video/*"
                className="hidden"
              />
            </div>
          )}

          {/* 语言选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/70">语言</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-white/10 text-[#e2e2e2] rounded-lg px-4 py-3 focus:outline-none focus:border-[#00FF41]"
            >
              <option value="auto">自动检测</option>
              <option value="zh">中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>

        {/* 2. 方案选择 */}
        {!isProcessing && !result && (
          <div className="space-y-4">
            <h3 className="font-headline font-black text-[#e2e2e2] uppercase text-lg">
              步骤 2：选择处理方案
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 快速方案 */}
              <button
                onClick={() => setMethod('deepgram')}
                disabled
                className="p-6 rounded-lg border-2 border-white/10 bg-[#1f1f1f] opacity-50 text-left cursor-not-allowed"
              >
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-headline font-black text-[#e2e2e2] uppercase mb-2">
                  快速方案
                </h4>
                <p className="text-sm text-white/70 mb-4">Deepgram API</p>
                <ul className="space-y-1 text-xs text-white/50">
                  <li>✓ 30-60 秒</li>
                  <li>✓ 98%+ 准确率</li>
                  <li>⏳ 等待配置...</li>
                </ul>
              </button>

              {/* 免费方案 */}
              <button
                onClick={() => setMethod('whisper')}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  method === 'whisper'
                    ? 'border-[#00FF41] bg-[#00FF41]/10'
                    : 'border-white/10 bg-[#1f1f1f] hover:border-white/20'
                }`}
              >
                <div className="text-2xl mb-2">🆓</div>
                <h4 className="font-headline font-black text-[#e2e2e2] uppercase mb-2">
                  免费方案
                </h4>
                <p className="text-sm text-white/70 mb-4">本地 Whisper</p>
                <ul className="space-y-1 text-xs text-white/50">
                  <li>✓ 完全免费</li>
                  <li>✓ 95%+ 准确率</li>
                  <li>✓ 离线处理</li>
                </ul>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isInputValid()}
              className="w-full bg-[#00FF41] text-black font-headline font-black uppercase py-3 rounded-lg transition-all hover:bg-[#00FF41]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {method === 'deepgram' ? '快速转录（30-60 秒）' : '免费转录（5-15 分钟）'}
            </button>
          </div>
        )}

        {/* 3. 进度显示 */}
        {isProcessing && !result && (
          <div className="bg-[#2a2a2a] rounded-lg p-6 space-y-4 border border-white/5">
            <h3 className="font-headline font-black text-[#e2e2e2] uppercase">处理中...</h3>

            {/* 进度条 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/70">
                <span>总进度</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00FF41] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 实时日志 */}
            <div className="bg-[#131313] rounded p-4 max-h-48 overflow-y-auto font-mono text-xs text-white/70 space-y-1">
              {logs.length === 0 ? (
                <p>等待中...</p>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx}>
                    <span className="text-white/50">{log.timestamp}</span>
                    <span className="ml-2">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. 结果展示 */}
        {result && (
          <div className="space-y-4">
            <h3 className="font-headline font-black text-[#e2e2e2] uppercase text-lg">
              结果
            </h3>

            {/* 格式选择 */}
            <div className="flex gap-2 flex-wrap">
              {(['srt', 'vtt', 'json', 'txt', 'markdown'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-2 rounded text-sm font-semibold uppercase transition-all ${
                    selectedFormat === fmt
                      ? 'bg-[#00FF41] text-black'
                      : 'bg-[#2a2a2a] text-white/70 hover:bg-[#1f1f1f]'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>

            {/* 预览 */}
            <div className="bg-[#1f1f1f] rounded-lg p-4 max-h-64 overflow-y-auto border border-white/5">
              <pre className="font-mono text-xs text-white/70 whitespace-pre-wrap break-words">
                {result.subtitles[selectedFormat]?.slice(0, 500)}
                {result.subtitles[selectedFormat]?.length! > 500 && '...'}
              </pre>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button
                onClick={downloadSubtitle}
                className="flex-1 bg-[#00FF41] text-black font-semibold uppercase py-3 rounded-lg hover:bg-[#00FF41]/90 transition-all"
              >
                ⬇ 下载 {selectedFormat.toUpperCase()}
              </button>
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-[#2a2a2a] text-[#e2e2e2] font-semibold uppercase py-3 rounded-lg hover:bg-[#353535] transition-all border border-white/10"
              >
                📋 复制
              </button>
            </div>

            {/* 元数据 */}
            <div className="bg-[#2a2a2a] rounded-lg p-4 text-xs text-white/60 space-y-2 border border-white/5">
              <div className="flex justify-between">
                <span>总时长</span>
                <span className="text-white/90">
                  {Math.floor(result.metadata.totalDuration)}s
                </span>
              </div>
              <div className="flex justify-between">
                <span>字幕段数</span>
                <span className="text-white/90">{result.metadata.segmentCount}</span>
              </div>
              <div className="flex justify-between">
                <span>识别语言</span>
                <span className="text-white/90">{result.metadata.language}</span>
              </div>
              <div className="flex justify-between">
                <span>识别置信度</span>
                <span className="text-white/90">
                  {(result.metadata.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* 重新开始 */}
            <button
              onClick={() => {
                setResult(null);
                setUrl('');
                setFile(null);
                setError(null);
              }}
              className="w-full bg-[#1f1f1f] text-[#e2e2e2] font-semibold uppercase py-2 rounded-lg hover:bg-[#2a2a2a] transition-all border border-white/10"
            >
              ↻ 处理另一个视频
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
