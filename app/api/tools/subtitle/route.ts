/**
 * POST /api/tools/subtitle/transcribe
 * 字幕提取 API 端点
 *
 * 支持两种方法：
 * 1. Deepgram（快速，需 API Key）
 * 2. Whisper（免费，但慢）
 */

import { NextRequest, NextResponse } from 'next/server';
import { transcribeWithDeepgram, isDeepgramConfigured } from './lib/deepgram';
import { downloadAudio, saveUploadedFile, cleanupTempFile } from './lib/audio';
import {
  formatToSRT,
  formatToVTT,
  formatToJSON,
  formatToTXT,
  formatToMarkdown,
  type TranscriptionResult
} from './lib/formatter';

/**
 * 请求体类型
 */
interface TranscriptionRequest {
  method: 'deepgram' | 'whisper';
  input: {
    type: 'url' | 'file';
    url?: string;
    file?: string;  // base64 或 multipart
  };
  language?: string;
  outputFormats?: Array<'srt' | 'vtt' | 'json' | 'txt' | 'markdown'>;
}

/**
 * POST 处理器
 */
export async function POST(request: NextRequest) {
  let audioPath: string | null = null;
  let tempFiles: string[] = [];

  try {
    // 1. 解析请求
    let body: TranscriptionRequest;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else {
      return NextResponse.json(
        { error: 'Content-Type 必须是 application/json' },
        { status: 400 }
      );
    }

    // 2. 验证输入
    const { method, input, language = 'auto', outputFormats = ['srt'] } = body;

    if (!method || !['deepgram', 'whisper'].includes(method)) {
      return NextResponse.json(
        { error: '无效的处理方法，支持：deepgram, whisper' },
        { status: 400 }
      );
    }

    if (!input || !input.type) {
      return NextResponse.json(
        { error: 'input.type 必须是 url 或 file' },
        { status: 400 }
      );
    }

    // 3. 获取音频文件
    if (input.type === 'url') {
      if (!input.url) {
        return NextResponse.json(
          { error: 'URL 输入必须提供 url 字段' },
          { status: 400 }
        );
      }

      try {
        audioPath = await downloadAudio(input.url, request.signal);
        tempFiles.push(audioPath);
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || '音频下载失败' },
          { status: 400 }
        );
      }
    } else if (input.type === 'file') {
      if (!input.file) {
        return NextResponse.json(
          { error: '文件输入必须提供 file 字段（base64 编码）' },
          { status: 400 }
        );
      }

      try {
        // 解码 base64
        let buffer: Buffer;
        if (typeof input.file === 'string') {
          buffer = Buffer.from(input.file, 'base64');
        } else {
          return NextResponse.json(
            { error: 'file 必须是 base64 字符串' },
            { status: 400 }
          );
        }

        audioPath = await saveUploadedFile(buffer, 'audio.wav');
        tempFiles.push(audioPath);
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || '文件处理失败' },
          { status: 400 }
        );
      }
    }

    if (!audioPath) {
      return NextResponse.json(
        { error: '无法获取音频文件' },
        { status: 500 }
      );
    }

    // 4. 选择处理方法
    let result: TranscriptionResult;

    if (method === 'deepgram') {
      // 快速方法：直接调用 API
      if (!isDeepgramConfigured()) {
        return NextResponse.json(
          { error: 'Deepgram 未配置，请稍后重试或选择免费方案' },
          { status: 503 }
        );
      }

      try {
        result = await transcribeWithDeepgram(audioPath, language);
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || 'Deepgram 转录失败' },
          { status: 500 }
        );
      }
    } else if (method === 'whisper') {
      // 免费方法：任务队列（暂未实现，返回错误）
      return NextResponse.json(
        { error: 'Whisper 免费方案正在开发中，请先使用 Deepgram 快速方案' },
        { status: 503 }
      );
    } else {
      return NextResponse.json(
        { error: '未知的处理方法' },
        { status: 400 }
      );
    }

    // 5. 格式化输出
    const formattedSubtitles: Record<string, string> = {};

    for (const format of outputFormats) {
      try {
        switch (format) {
          case 'srt':
            formattedSubtitles.srt = formatToSRT(result);
            break;
          case 'vtt':
            formattedSubtitles.vtt = formatToVTT(result);
            break;
          case 'json':
            formattedSubtitles.json = formatToJSON(result);
            break;
          case 'txt':
            formattedSubtitles.txt = formatToTXT(result);
            break;
          case 'markdown':
            formattedSubtitles.markdown = formatToMarkdown(result);
            break;
        }
      } catch (error: any) {
        console.warn(`格式化 ${format} 失败:`, error);
      }
    }

    // 6. 返回成功响应
    return NextResponse.json(
      {
        success: true,
        method,
        result: {
          ...result,
          subtitles: formattedSubtitles
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('字幕提取错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || '发生未知错误'
      },
      { status: 500 }
    );
  } finally {
    // 清理临时文件
    for (const filePath of tempFiles) {
      try {
        cleanupTempFile(filePath);
      } catch (error) {
        console.warn(`清理临时文件失败: ${filePath}`);
      }
    }
  }
}

/**
 * OPTIONS 处理（CORS）
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
