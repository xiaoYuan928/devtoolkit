/**
 * OpenAI Whisper 集成
 * 本地免费转录（95%+ 准确率，5-15 分钟处理时间）
 */

import { execFile, execFileSync } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';
import { Segment, TranscriptionResult } from './formatter';

const execFileAsync = promisify(execFile);

/**
 * 获取 Whisper 可执行文件路径
 */
function getWhisperPath(): string {
  // 优先使用完整路径
  const paths = [
    '/Users/qiangxiaoyuan/.pyenv/versions/3.10.13/bin/whisper',
    '/opt/homebrew/bin/whisper',
    '/usr/local/bin/whisper',
    'whisper'  // 降级：使用 PATH 中的
  ];

  for (const whiskeyPath of paths) {
    if (whiskeyPath !== 'whisper' && existsSync(whiskeyPath)) {
      return whiskeyPath;
    }
  }

  return 'whisper';  // 最后降级
}

const WHISPER_PATH = getWhisperPath();

/**
 * 检查 Whisper 是否安装
 */
export async function isWhisperAvailable(): Promise<boolean> {
  // 优先检查文件是否存在
  if (WHISPER_PATH !== 'whisper' && existsSync(WHISPER_PATH)) {
    return true;
  }

  try {
    // 降级：尝试调用 whisper -h
    await execFileAsync(WHISPER_PATH, ['-h'], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * 使用 Whisper 进行转录
 */
export async function transcribeWithWhisper(
  filePath: string,
  language: string = 'auto'
): Promise<TranscriptionResult> {
  const tempDir = path.dirname(filePath);
  const filename = path.basename(filePath, path.extname(filePath));
  // Whisper 的输出文件名是 {filename}.{format}，所以 JSON 输出就是 {filename}.json
  const jsonPath = path.join(tempDir, `${filename}.json`);

  try {
    // 检查 Whisper 是否可用
    const available = await isWhisperAvailable();
    if (!available) {
      throw new Error('Whisper 未安装，请先运行：pip install openai-whisper');
    }

    const startTime = Date.now();

    // 构建 Whisper 命令参数
    const args: string[] = [
      '--model', 'base',  // 使用 base 模型平衡速度和准确率
      '--output_format', 'json',  // 输出 JSON 格式
      '--output_dir', tempDir,
      '--verbose', 'False'  // 不输出详细日志
    ];

    // Whisper 不支持 'auto'，如果不是自动检测就添加语言参数
    if (language !== 'auto') {
      args.push('--language', language);
    }

    args.push(filePath);

    // 调用 Whisper
    const { stderr } = await execFileAsync(WHISPER_PATH, args, {
      timeout: 3600000,  // 1 小时超时
      env: {
        ...process.env,
        PATH: process.env.PATH || '/usr/local/bin:/usr/bin'
      }
    });

    const processingTime = Date.now() - startTime;

    // 读取输出 JSON 文件
    const outputText = readFileSync(jsonPath, 'utf-8');
    const result = JSON.parse(outputText);

    // 清理临时 JSON 文件
    try {
      unlinkSync(jsonPath);
    } catch {}

    // 格式化字幕段
    const segments = formatWhisperSegments(result.segments || []);

    // 检测语言（从 result 中获取）
    const detectedLanguage = result.language || language;

    return {
      text: result.text || '',
      segments,
      metadata: {
        language: detectedLanguage,
        totalDuration: result.duration || 0,
        segmentCount: segments.length,
        confidence: 0.95  // Whisper 的平均准确率
      }
    };
  } catch (error: any) {
    // 清理失败的临时文件
    try {
      unlinkSync(jsonPath);
    } catch {}

    // 更友好的错误处理
    if (error.message.includes('not installed') || error.message.includes('No such file')) {
      throw new Error('Whisper 未安装。请运行：pip install openai-whisper');
    }
    if (error.message.includes('timeout')) {
      throw new Error('Whisper 处理超时（超过 1 小时），文件可能过长');
    }
    if (error.message.includes('CUDA')) {
      throw new Error('GPU 加速不可用，但会使用 CPU 处理（速度较慢）');
    }

    throw new Error(`Whisper 转录失败: ${error.message}`);
  }
}

/**
 * 将 Whisper 的段落格式化为字幕段
 */
function formatWhisperSegments(segments: any[]): Segment[] {
  if (!segments.length) return [];

  return segments.map((seg, idx) => ({
    id: idx + 1,
    start: seg.start || 0,
    duration: (seg.end || 0) - (seg.start || 0),
    text: (seg.text || '').trim()
  }));
}

/**
 * 获取 Whisper 支持的语言列表
 */
export const WHISPER_LANGUAGES = [
  { code: 'auto', label: '自动检测' },
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'ar', label: 'العربية' }
];
