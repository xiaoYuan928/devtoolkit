# 字幕提取工具 - 架构设计文档

**日期**: 2026-04-03  
**版本**: 1.0  
**作者**: Claude Code

---

## 📋 目录

1. [概述](#概述)
2. [系统架构](#系统架构)
3. [API 设计](#api-设计)
4. [前端设计](#前端设计)
5. [后端实现](#后端实现)
6. [数据流](#数据流)
7. [错误处理](#错误处理)
8. [性能优化](#性能优化)
9. [部署方案](#部署方案)
10. [后期扩展](#后期扩展)

---

## 概述

### 目标

在 10001.ai 新增**字幕提取工具**，支持：
- 📹 输入：YouTube URL、B 站 URL、本地音频文件
- 🎯 两种处理方案：
  - **方案 A（免费）**：本地 Whisper（5-15 min）
  - **方案 B（快速）**：Deepgram API（30-60 sec）
- 📥 输出：SRT、VTT、JSON、TXT、Markdown

### 核心特性

| 特性 | 免费（Whisper） | 快速（Deepgram） |
|------|-----------------|-----------------|
| 处理速度 | 5-15 min | 30-60 sec ✨ |
| 成本 | $0 | $0.002/min |
| 准确率 | 95%+ | 98%+ 最好 |
| 离线 | ✓ 可离线 | ✗ 需网络 |
| 并发 | 受 CPU 限制 | 无限制 |
| 最佳用途 | 急不得 | 需要快 |

---

## 系统架构

### 高层架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                          用户浏览器                               │
├─────────────────────────────────────────────────────────────────┤
│                  /app/tools/subtitle/page.tsx                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 1. 输入组件（URL/文件上传）                               │   │
│  │ 2. 方案选择（Whisper/Deepgram）                          │   │
│  │ 3. 进度显示（WebSocket/Polling）                         │   │
│  │ 4. 结果展示（预览+下载）                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────┬─────────────────────────────────────────────┘
                     │ HTTP/WebSocket
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  POST /api/tools/subtitle/transcribe                           │
│    ├─ 验证输入（URL 有效性、文件大小）                         │
│    ├─ 下载/上传处理（audio conversion）                        │
│    ├─ 路由到 Whisper 或 Deepgram                              │
│    └─ 返回 taskId（Whisper）或直接结果（Deepgram）           │
│                                                                  │
│  GET /api/tools/subtitle/progress?taskId=...                  │
│    └─ 查询 Whisper 任务进度                                     │
│                                                                  │
│  WebSocket /api/tools/subtitle/ws                             │
│    └─ 实时推送进度更新                                         │
│                                                                  │
└────────────────┬──────────────────────────┬──────────────────────┘
                 │                          │
            Whisper 队列            Deepgram API 调用
                 │                          │
        ┌────────┴────────┐        ┌────────┴─────────┐
        │                 │        │                  │
        ↓                 ↓        ↓                  ↓
    ┌─────────┐      ┌────────┐  ┌──────────┐   ┌──────────┐
    │  队列   │      │ Python │  │ Deepgram │   │ 结果     │
    │系统     │─────→│Whisper │──│  API     │───│缓存+格式 │
    └─────────┘      │ 子进程 │  │  (REST)  │   │化        │
                     └────────┘  └──────────┘   └──────────┘
                         │                           │
                    ┌────┴────┐              ┌──────┴────────┐
                    │进度日志 │              │ SRT/JSON/VTT  │
                    │(内存)   │              │ (临时存储)    │
                    └─────────┘              └───────────────┘
```

### 部署架构

```
Vercel Edge
  ↓
Next.js App Server (app/tools/subtitle/page.tsx)
  ├─ 静态：UI 组件
  ├─ API Routes：/api/tools/subtitle/*
  └─ 可选：Webhook 回调
       ↓
      [选择处理方案]
       ↓
    ┌──┴──┐
    │     │
    ↓     ↓
Whisper  Deepgram
(本地或  (API)
 Docker)

存储：
  ├─ 临时：/tmp（任务日志）
  ├─ 结果缓存：内存或 Redis（可选）
  └─ 数据库：可选（任务历史）
```

---

## API 设计

### 1. 提交转录任务

**POST** `/api/tools/subtitle/transcribe`

**请求体**

```json
{
  "method": "whisper" | "deepgram",
  "input": {
    "type": "url" | "file",
    "url": "https://bilibili.com/video/BV1Mq9JBMEps/",
    // 或
    "file": "base64_encoded_audio_or_multipart_file"
  },
  "language": "zh" | "en" | "ja" | "auto",
  "outputFormats": ["srt", "json", "vtt"],
  "options": {
    "skipTranslation": true,
    "preserveTimestamps": true
  }
}
```

**响应（Deepgram - 快速，直接返回）**

```json
{
  "success": true,
  "method": "deepgram",
  "processingTime": 45,
  "result": {
    "text": "你好啊朋友们...",
    "segments": [
      {
        "id": 1,
        "start": 0,
        "duration": 1.72,
        "text": "你好啊朋友们"
      }
    ],
    "subtitles": {
      "srt": "1\n00:00:00,000 --> 00:00:01,720\n你好啊朋友们\n",
      "vtt": "WEBVTT\n\n00:00:00.000 --> 00:00:01.720\n你好啊朋友们\n",
      "json": {
        "segments": [...]
      }
    },
    "metadata": {
      "language": "zh",
      "totalDuration": 694,
      "segmentCount": 714,
      "confidence": 0.96
    }
  }
}
```

**响应（Whisper - 慢速，返回 taskId）**

```json
{
  "success": true,
  "method": "whisper",
  "taskId": "task_1712142600_abc123",
  "status": "queued",
  "message": "任务已加入队列，预计需要 5-15 分钟"
}
```

**错误响应**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "提供的 URL 无效或无法访问",
    "details": "Failed to fetch: https://..."
  }
}
```

---

### 2. 查询进度（Whisper 专用）

**GET** `/api/tools/subtitle/progress?taskId=task_1712142600_abc123`

**响应**

```json
{
  "taskId": "task_1712142600_abc123",
  "status": "processing" | "completed" | "failed",
  "progress": 45,
  "currentStep": "transcribing",
  "logs": [
    { "timestamp": "2026-04-03T12:10:05Z", "message": "下载音频..." },
    { "timestamp": "2026-04-03T12:10:15Z", "message": "提取音频流..." },
    { "timestamp": "2026-04-03T12:10:25Z", "message": "运行 Whisper..." },
    { "timestamp": "2026-04-03T12:11:30Z", "message": "00:00-01:00 完成" }
  ],
  "result": null  // 完成时返回结果
}
```

---

### 3. WebSocket 实时更新（可选）

**连接**: `WS /api/tools/subtitle/ws?taskId=...`

**消息格式**

```json
// 进度更新
{
  "type": "progress",
  "taskId": "task_...",
  "progress": 60,
  "currentStep": "formatting"
}

// 日志消息
{
  "type": "log",
  "message": "处理 00:30-01:00 段...",
  "timestamp": "2026-04-03T12:11:45Z"
}

// 完成
{
  "type": "complete",
  "result": { ... }
}

// 错误
{
  "type": "error",
  "message": "转录失败：内存不足",
  "code": "OUT_OF_MEMORY"
}
```

---

## 前端设计

### 页面结构

**文件**: `/app/tools/subtitle/page.tsx`

```typescript
export default function SubtitleExtractorPage() {
  return (
    <ToolLayout
      title="字幕提取器"
      description="从视频或音频自动生成字幕，支持 SRT、VTT、JSON 格式"
    >
      <div className="space-y-6">
        {/* 1. 输入区 */}
        <InputSection />
        
        {/* 2. 方案选择 */}
        <MethodSelector />
        
        {/* 3. 进度显示 */}
        {isProcessing && <ProgressDisplay />}
        
        {/* 4. 结果展示 */}
        {result && <ResultDisplay />}
      </div>
    </ToolLayout>
  );
}
```

### 1️⃣ 输入区组件（InputSection）

```typescript
interface InputSectionProps {
  onInputChange: (input: InputData) => void;
}

// 状态管理
const [inputType, setInputType] = useState<'url' | 'file'>('url');
const [url, setUrl] = useState('');
const [file, setFile] = useState<File | null>(null);
const [language, setLanguage] = useState('zh');

// UI 结构
<div className="space-y-4">
  {/* Tab: URL / 文件 */}
  <div className="flex gap-2 border-b border-white/10">
    <Button variant={inputType === 'url' ? 'accent' : 'ghost'}>
      🔗 URL 输入
    </Button>
    <Button variant={inputType === 'file' ? 'accent' : 'ghost'}>
      📁 本地上传
    </Button>
  </div>

  {/* URL 输入 */}
  {inputType === 'url' && (
    <div className="space-y-2">
      <label>视频链接</label>
      <input
        placeholder="https://bilibili.com/video/BV..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="input-primary"
      />
      <p className="text-xs text-white/50">
        支持：YouTube、B 站、优酷等视频 URL
      </p>
    </div>
  )}

  {/* 文件上传 */}
  {inputType === 'file' && (
    <DragDropZone
      onFileDrop={(files) => setFile(files[0])}
      acceptedFormats={['audio/*', 'video/*']}
      maxSize={500 * 1024 * 1024}  // 500MB
    />
  )}

  {/* 语言选择 */}
  <div className="space-y-2">
    <label>语言</label>
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="auto">自动检测</option>
      <option value="zh">中文</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      {/* ... 更多语言 */}
    </select>
  </div>
</div>
```

### 2️⃣ 方案选择（MethodSelector）

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* 方案 A: Whisper */}
  <MethodCard
    title="🆓 免费方案"
    subtitle="本地 Whisper"
    features={[
      "⏱️ 5-15 分钟",
      "📊 95%+ 准确率",
      "💰 完全免费",
      "🔒 数据不上传"
    ]}
    selected={method === 'whisper'}
    onClick={() => setMethod('whisper')}
  />

  {/* 方案 B: Deepgram */}
  <MethodCard
    title="⚡ 快速方案"
    subtitle="Deepgram API"
    features={[
      "🚀 30-60 秒",
      "🎯 98%+ 准确率",
      "💎 需要积分/付费",
      "⚡ 即时返回"
    ]}
    selected={method === 'deepgram'}
    onClick={() => setMethod('deepgram')}
  />
</div>

<Button
  onClick={handleSubmit}
  disabled={!isInputValid()}
  className="button-primary w-full mt-4"
>
  {method === 'whisper' ? '开始转录（免费）' : '快速转录（付费）'}
</Button>
```

### 3️⃣ 进度显示（ProgressDisplay）

```typescript
<div className="bg-[#2a2a2a] rounded-lg p-6 space-y-4">
  {/* 步骤进度 */}
  <div className="space-y-3">
    <ProgressStep
      label="下载音频"
      status={progress > 0 ? 'completed' : 'pending'}
    />
    <ProgressStep
      label="提取音频"
      status={progress > 10 ? 'completed' : progress > 5 ? 'processing' : 'pending'}
    />
    <ProgressStep
      label="运行转录"
      status={progress > 30 ? 'completed' : progress > 10 ? 'processing' : 'pending'}
    />
    <ProgressStep
      label="格式化"
      status={progress > 90 ? 'processing' : 'pending'}
    />
  </div>

  {/* 进度条 */}
  <div className="space-y-1">
    <div className="flex justify-between">
      <span className="text-sm">总进度</span>
      <span className="text-sm font-mono">{progress}%</span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#00FF41] transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>

  {/* 实时日志 */}
  <div className="bg-[#131313] rounded p-3 max-h-40 overflow-y-auto font-mono text-xs text-white/70 space-y-1">
    {logs.map((log, idx) => (
      <div key={idx}>
        <span className="text-white/50">{log.timestamp}</span>
        <span className="ml-2">{log.message}</span>
      </div>
    ))}
  </div>

  {/* 取消按钮（仅 Whisper） */}
  {method === 'whisper' && (
    <Button variant="ghost" onClick={handleCancel}>
      取消任务
    </Button>
  )}
</div>
```

### 4️⃣ 结果展示（ResultDisplay）

```typescript
<div className="space-y-4">
  {/* 格式选择 */}
  <div className="flex gap-2 overflow-x-auto">
    {(['srt', 'vtt', 'json', 'txt', 'markdown'] as const).map((fmt) => (
      <Button
        key={fmt}
        variant={selectedFormat === fmt ? 'accent' : 'ghost'}
        onClick={() => setSelectedFormat(fmt)}
      >
        {fmt.toUpperCase()}
      </Button>
    ))}
  </div>

  {/* 预览 */}
  <div className="bg-[#1f1f1f] rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm text-white/70">
    <pre>{formattedResult}</pre>
  </div>

  {/* 操作按钮 */}
  <div className="flex gap-2">
    <Button onClick={downloadSubtitle} className="flex-1">
      ⬇ 下载 {selectedFormat.toUpperCase()}
    </Button>
    <Button onClick={copyToClipboard} variant="secondary">
      📋 复制
    </Button>
  </div>

  {/* 元数据 */}
  <div className="bg-[#2a2a2a] rounded-lg p-3 text-xs text-white/60 space-y-1">
    <div>总时长: {metadata.duration}s</div>
    <div>字幕段数: {metadata.segmentCount}</div>
    <div>识别语言: {metadata.language}</div>
    <div>处理时间: {metadata.processingTime}s</div>
  </div>
</div>
```

---

## 后端实现

### 文件结构

```
/api/tools/subtitle/
├── route.ts              # POST /api/tools/subtitle/transcribe
├── progress.ts           # GET /api/tools/subtitle/progress
├── ws.ts                 # WebSocket /api/tools/subtitle/ws (可选)
└── lib/
    ├── whisper.ts        # Whisper 处理逻辑
    ├── deepgram.ts       # Deepgram API 集成
    ├── queue.ts          # 任务队列管理
    ├── audio.ts          # 音频下载/处理
    └── formatter.ts      # 结果格式化
```

### 1. Main API Handler

**`route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { processWithWhisper } from './lib/whisper';
import { processWithDeepgram } from './lib/deepgram';
import { TaskQueue } from './lib/queue';
import { downloadAudio } from './lib/audio';

const taskQueue = new TaskQueue();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, input, language, outputFormats } = body;

    // 1. 验证输入
    if (!input.url && !input.file) {
      return NextResponse.json(
        { error: 'URL 或文件必须提供其中之一' },
        { status: 400 }
      );
    }

    // 2. 下载音频
    let audioPath: string;
    if (input.type === 'url') {
      audioPath = await downloadAudio(input.url);
    } else {
      audioPath = await saveUploadedFile(input.file);
    }

    // 3. 路由处理
    if (method === 'deepgram') {
      // 快速处理：直接调用 API
      const result = await processWithDeepgram(audioPath, language);
      return NextResponse.json({
        success: true,
        method: 'deepgram',
        result,
        processingTime: result.processingTime
      });
    } else if (method === 'whisper') {
      // 慢速处理：加入队列
      const taskId = await taskQueue.enqueue({
        audioPath,
        language,
        outputFormats,
        createdAt: Date.now()
      });

      return NextResponse.json({
        success: true,
        method: 'whisper',
        taskId,
        status: 'queued',
        message: '任务已加入队列，预计需要 5-15 分钟'
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### 2. Whisper 处理

**`lib/whisper.ts`**

```typescript
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function processWithWhisper(
  audioPath: string,
  language: string,
  onProgress?: (progress: number, message: string) => void
) {
  try {
    onProgress?.(10, '提取音频...');

    // 运行 Whisper
    const { stdout } = await execFileAsync('whisper', [
      audioPath,
      '--language', language,
      '--output_format', 'json',
      '--output_dir', '/tmp/whisper-output',
      '--fp16', 'False'  // CPU 优化
    ]);

    onProgress?.(80, '格式化结果...');

    // 读取和解析结果
    const result = await parseWhisperOutput(audioPath);

    onProgress?.(100, '完成！');

    return result;
  } catch (error) {
    throw new Error(`Whisper 处理失败: ${error.message}`);
  }
}

// 解析 Whisper JSON 输出
async function parseWhisperOutput(audioPath: string) {
  const jsonPath = `/tmp/whisper-output/${basename(audioPath, path.extname(audioPath))}.json`;
  const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));

  return {
    text: data.text,
    segments: data.segments.map(seg => ({
      id: seg.id + 1,
      start: seg.start,
      duration: seg.end - seg.start,
      text: seg.text.trim()
    })),
    metadata: {
      language: 'zh',  // 从 Whisper 检测
      totalDuration: data.segments[data.segments.length - 1]?.end || 0,
      segmentCount: data.segments.length,
      confidence: 0.95
    }
  };
}
```

### 3. Deepgram 集成

**`lib/deepgram.ts`**

```typescript
import axios from 'axios';

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const DEEPGRAM_URL = 'https://api.deepgram.com/v1/listen';

export async function processWithDeepgram(
  audioPath: string,
  language: string
) {
  const startTime = Date.now();

  try {
    // 读取音频文件
    const audioBuffer = readFileSync(audioPath);

    // 调用 Deepgram API
    const response = await axios.post(
      DEEPGRAM_URL,
      audioBuffer,
      {
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'audio/wav'
        },
        params: {
          model: 'nova-3',
          language,
          smart_format: true,
          punctuate: true
        }
      }
    );

    const data = response.data;

    // 格式化结果
    return {
      text: data.results.channels[0].alternatives[0].transcript,
      segments: formatDeepgramSegments(data.results.channels[0].alternatives[0].words),
      metadata: {
        language,
        totalDuration: data.metadata.duration,
        segmentCount: data.results.channels[0].alternatives[0].words.length,
        confidence: data.results.channels[0].alternatives[0].confidence
      },
      processingTime: Date.now() - startTime
    };
  } catch (error) {
    throw new Error(`Deepgram 处理失败: ${error.message}`);
  }
}

function formatDeepgramSegments(words: any[]) {
  // 将单词合并成句子段
  const segments = [];
  let currentSegment = [];
  let startTime = words[0]?.start || 0;

  for (const word of words) {
    currentSegment.push(word.punctuated_word);

    // 按句子边界分割（。！？或时长超过 10s）
    if (
      word.punctuated_word.endsWith('。') ||
      word.punctuated_word.endsWith('！') ||
      word.punctuated_word.endsWith('？') ||
      (word.end - startTime > 10)
    ) {
      segments.push({
        id: segments.length + 1,
        start: startTime,
        duration: word.end - startTime,
        text: currentSegment.join('')
      });
      currentSegment = [];
      startTime = word.end;
    }
  }

  return segments;
}
```

### 4. 任务队列

**`lib/queue.ts`**

```typescript
export class TaskQueue {
  private queue: Task[] = [];
  private processing = false;
  private tasks = new Map<string, TaskState>();

  async enqueue(task: Task): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.tasks.set(taskId, {
      ...task,
      status: 'queued',
      progress: 0,
      logs: [],
      result: null
    });

    this.queue.push({ ...task, taskId });

    // 启动队列处理（不阻塞）
    if (!this.processing) {
      this.processQueue();
    }

    return taskId;
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      const taskState = this.tasks.get(task.taskId)!;

      try {
        taskState.status = 'processing';
        taskState.startTime = Date.now();

        const result = await processWithWhisper(
          task.audioPath,
          task.language,
          (progress, message) => {
            taskState.progress = progress;
            taskState.logs.push({
              timestamp: new Date().toISOString(),
              message
            });
          }
        );

        taskState.result = result;
        taskState.status = 'completed';
      } catch (error) {
        taskState.status = 'failed';
        taskState.error = error.message;
      }
    }

    this.processing = false;
  }

  getStatus(taskId: string): TaskState | null {
    return this.tasks.get(taskId) || null;
  }
}
```

### 5. 音频下载和处理

**`lib/audio.ts`**

```typescript
import ytdl from 'ytdl-core';
import { execFileAsync } from 'child_process';

export async function downloadAudio(url: string): Promise<string> {
  const outputPath = `/tmp/subtitle_${Date.now()}.m4a`;

  if (url.includes('bilibili') || url.includes('youtube')) {
    // 用 yt-dlp 下载
    await execFileAsync('yt-dlp', [
      '-f', 'bestaudio',
      '--audio-format', 'm4a',
      '--audio-quality', '192K',
      '-o', outputPath,
      '--no-warnings',
      url
    ]);
  } else {
    throw new Error('不支持的视频网站');
  }

  return outputPath;
}

export async function saveUploadedFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const outputPath = `/tmp/subtitle_${Date.now()}_${file.name}`;
  writeFileSync(outputPath, Buffer.from(buffer));
  return outputPath;
}
```

### 6. 结果格式化

**`lib/formatter.ts`**

```typescript
export function formatToSRT(segments: Segment[]): string {
  return segments
    .map(seg => `${seg.id}\n${formatTime(seg.start)} --> ${formatTime(seg.start + seg.duration)}\n${seg.text}`)
    .join('\n\n');
}

export function formatToVTT(segments: Segment[]): string {
  return (
    'WEBVTT\n\n' +
    segments
      .map(seg => `${formatTime(seg.start)} --> ${formatTime(seg.start + seg.duration)}\n${seg.text}`)
      .join('\n\n')
  );
}

export function formatToJSON(segments: Segment[]): string {
  return JSON.stringify({ segments }, null, 2);
}

export function formatToMarkdown(segments: Segment[]): string {
  return segments
    .map(seg => `**${formatTime(seg.start)}**: ${seg.text}`)
    .join('\n\n');
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}
```

---

## 数据流

### Deepgram 流程（快速）

```
用户提交
  ↓
✓ 输入验证
  ↓
⬇ 下载/上传音频
  ↓
📤 发送到 Deepgram API
  ↓
📊 接收转录结果
  ↓
🔄 格式化（SRT/JSON/VTT）
  ↓
✅ 返回结果给前端
  ↓
用户下载/复制
```

**时间**: 30-60 秒

---

### Whisper 流程（免费）

```
用户提交
  ↓
✓ 输入验证
  ↓
⬇ 下载/上传音频
  ↓
📋 加入任务队列（立即返回 taskId）
  ↓
用户看到进度页面
  ↓
[后台处理] → 运行 Whisper（5-15 min）
              ↓ 推送进度（WebSocket / Polling）
              ↓ 格式化结果
  ↓
✅ 完成时推送结果
  ↓
用户下载/复制
```

**时间**: 5-15 分钟

---

## 错误处理

### 前端错误处理

```typescript
try {
  const result = await submitTranscription(input);
  setResult(result);
} catch (error) {
  switch (error.code) {
    case 'INVALID_URL':
      showError('提供的 URL 无效，请检查链接');
      break;
    case 'FILE_TOO_LARGE':
      showError('文件过大，最大支持 500MB');
      break;
    case 'NETWORK_ERROR':
      showError('网络连接失败，请稍后重试');
      break;
    case 'QUOTA_EXCEEDED':
      showError('免费配额已用完，请升级账户');
      break;
    case 'UNSUPPORTED_FORMAT':
      showError('不支持的文件格式');
      break;
    default:
      showError('处理失败，请稍后重试');
  }
}
```

### 后端错误处理

| 错误 | HTTP Code | 原因 | 处理 |
|------|-----------|------|------|
| INVALID_URL | 400 | URL 无效 | 返回错误信息给用户 |
| FILE_TOO_LARGE | 413 | 文件 > 500MB | 前端限制 |
| DOWNLOAD_FAILED | 502 | 无法下载视频 | 重试或提示 |
| OUT_OF_MEMORY | 500 | CPU 内存不足 | 加入队列，稍后重试 |
| API_ERROR | 503 | Deepgram API 故障 | 提示稍后重试 |
| QUOTA_EXCEEDED | 429 | 超过 API 配额 | 提示升级或等待 |

---

## 性能优化

### 1. 缓存策略

```typescript
// 缓存转录结果（1 小时）
const cache = new Map<string, CacheEntry>();

function getCacheKey(url: string, language: string): string {
  return `${hash(url)}_${language}`;
}

if (cache.has(cacheKey)) {
  const cached = cache.get(cacheKey);
  if (Date.now() - cached.timestamp < 3600000) {
    return cached.result;  // 返回缓存
  }
}

// 处理后缓存
cache.set(cacheKey, { result, timestamp: Date.now() });
```

### 2. 并发限制

```typescript
// Whisper 队列限制（避免 CPU 过载）
class TaskQueue {
  private maxConcurrent = 1;  // 一次只处理一个
  private processing = 0;

  async processQueue() {
    while (this.processing < this.maxConcurrent && this.queue.length > 0) {
      this.processing++;
      const task = this.queue.shift();
      
      await this.process(task).finally(() => {
        this.processing--;
      });
    }
  }
}
```

### 3. 文件清理

```typescript
// 定期清理临时文件
setInterval(() => {
  const tmpDir = '/tmp';
  const files = fs.readdirSync(tmpDir);
  
  for (const file of files) {
    if (file.startsWith('subtitle_')) {
      const filePath = path.join(tmpDir, file);
      const stat = fs.statSync(filePath);
      
      // 删除超过 1 小时的临时文件
      if (Date.now() - stat.mtimeMs > 3600000) {
        fs.unlinkSync(filePath);
      }
    }
  }
}, 600000);  // 每 10 分钟清理一次
```

---

## 部署方案

### 环境变量

```bash
# .env.local
DEEPGRAM_API_KEY=dg_xxxxxxxxxxxx
WHISPER_ENABLED=true
MAX_FILE_SIZE=524288000  # 500MB
TASK_QUEUE_ENABLED=true
CACHE_ENABLED=true
```

### Vercel 部署

1. **秘密变量**：Vercel Dashboard 设置 `DEEPGRAM_API_KEY`
2. **区域**：选择离用户最近的区域
3. **超时**：设置 Function 超时为 300 秒（Whisper 处理）
4. **内存**：最大 3008 MB（Whisper 可能需要）

### Docker（可选，用于本地 Whisper）

```dockerfile
FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    nodejs npm

RUN pip install openai-whisper

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]
```

---

## 后期扩展

### Phase 2（未来）

- [ ] 用户账户系统 + 积分管理
- [ ] 订阅计划（免费/专业/企业）
- [ ] 多语言支持（日文、韩文、西班牙文等）
- [ ] 字幕编辑工具（修改、调整时间戳）
- [ ] 翻译功能（字幕翻译）
- [ ] 批量处理（一次提交多个视频）
- [ ] API 端点（为开发者提供 `/api/subtitle/transcribe`）

### Phase 3（更远期）

- [ ] 浏览器扩展（一键从网页提取字幕）
- [ ] 桌面应用（离线使用）
- [ ] 实时字幕生成（直播/会议）
- [ ] 高级编辑工具（字幕同步、对齐）

---

## 总结

| 方面 | 详情 |
|------|------|
| 技术栈 | Next.js + Node.js + Python（Whisper）+ Deepgram API |
| 开发时间 | Phase 2（Deepgram）: 3-4 天 |
| 维护成本 | 低（API 成本可控） |
| 用户体验 | 优秀（支持快速和免费两种选项） |
| 扩展性 | 高（易于添加新功能） |

---

**下一步**: 确认架构后开始 Phase 2 开发（Deepgram 集成）
