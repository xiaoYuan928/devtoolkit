/**
 * Deepgram API 集成
 * 快速字幕生成（30-60 秒）
 */

import axios from 'axios';
import { readFileSync } from 'fs';
import { Segment, TranscriptionResult } from './formatter';

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const DEEPGRAM_URL = 'https://api.deepgram.com/v1/listen';

interface DeepgramResponse {
  metadata: {
    transaction_key: string;
    request_id: string;
    sha256: string;
    created: string;
    duration: number;
    channels: number;
    models: string[];
    model_info: Record<string, any>;
  };
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
        confidence: number;
        words: Array<{
          word: string;
          start: number;
          end: number;
          confidence: number;
          punctuated_word?: string;
        }>;
      }>;
    }>;
  };
}

/**
 * 检查 API Key 是否配置
 */
export function isDeepgramConfigured(): boolean {
  return !!DEEPGRAM_API_KEY;
}

/**
 * 使用 Deepgram 进行转录
 */
export async function transcribeWithDeepgram(
  filePath: string,
  language: string = 'zh'
): Promise<TranscriptionResult> {
  if (!DEEPGRAM_API_KEY) {
    throw new Error('Deepgram API Key 未配置');
  }

  const startTime = Date.now();

  try {
    // 读取音频文件
    const audioBuffer = readFileSync(filePath);

    // 调用 Deepgram API
    const response = await axios.post<DeepgramResponse>(
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
          punctuate: true,
          utterances: true  // 按句子分段
        },
        timeout: 120000  // 2 分钟超时
      }
    );

    const data = response.data;

    // 验证响应
    if (!data.results?.channels?.[0]?.alternatives?.[0]) {
      throw new Error('Deepgram 返回数据格式错误');
    }

    const alternative = data.results.channels[0].alternatives[0];

    // 格式化字幕段
    const segments = formatDeepgramSegments(alternative.words || []);

    return {
      text: alternative.transcript,
      segments,
      metadata: {
        language,
        totalDuration: data.metadata.duration,
        segmentCount: segments.length,
        confidence: alternative.confidence
      }
    };
  } catch (error: any) {
    // 更友好的错误处理
    if (error.response?.status === 401) {
      throw new Error('Deepgram API Key 无效');
    }
    if (error.response?.status === 429) {
      throw new Error('Deepgram 请求过于频繁，请稍后重试');
    }
    if (error.response?.status === 400) {
      throw new Error('音频格式不支持或参数错误');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Deepgram 请求超时');
    }

    throw new Error(`Deepgram 转录失败: ${error.message}`);
  }
}

/**
 * 将 Deepgram 的单词列表格式化为字幕段
 * 按句子或时长分割
 */
function formatDeepgramSegments(words: any[]): Segment[] {
  if (!words.length) return [];

  const segments: Segment[] = [];
  let currentSegment = [];
  let startTime = words[0]?.start || 0;
  let currentId = 1;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = words[i + 1];

    // 收集词
    currentSegment.push(word.punctuated_word || word.word);

    // 判断是否需要分割段落
    const isEndOfSentence =
      (word.punctuated_word || word.word).endsWith('。') ||
      (word.punctuated_word || word.word).endsWith('！') ||
      (word.punctuated_word || word.word).endsWith('？');

    const isTimeBreak = word.end - startTime > 10;  // 超过 10 秒分割
    const isLastWord = i === words.length - 1;

    if (isEndOfSentence || isTimeBreak || isLastWord) {
      const endTime = word.end;
      const text = currentSegment.join('').trim();

      if (text) {
        segments.push({
          id: currentId++,
          start: startTime,
          duration: endTime - startTime,
          text
        });
      }

      currentSegment = [];
      startTime = nextWord?.start || endTime;
    }
  }

  return segments;
}

/**
 * 获取 Deepgram 支持的语言列表
 */
export const DEEPGRAM_LANGUAGES = [
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
