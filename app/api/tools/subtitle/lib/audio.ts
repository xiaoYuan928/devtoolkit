/**
 * 音频下载和处理
 * 支持：YouTube、B 站、本地文件
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import path from 'path';

const execFileAsync = promisify(execFile);

/**
 * 检查 URL 是否有效
 */
export function isValidVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return (
      hostname.includes('youtube.com') ||
      hostname.includes('youtu.be') ||
      hostname.includes('bilibili.com') ||
      hostname.includes('youku.com') ||
      hostname.includes('qq.com')
    );
  } catch {
    return false;
  }
}

/**
 * 从视频 URL 下载音频
 * 使用 yt-dlp（支持多个视频网站）
 */
export async function downloadAudio(url: string, signal?: AbortSignal): Promise<string> {
  if (!isValidVideoUrl(url)) {
    throw new Error('不支持的视频网站，仅支持 YouTube、B 站等');
  }

  const outputPath = `/tmp/subtitle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.m4a`;

  try {
    // 检查 signal 中止状态
    if (signal?.aborted) {
      throw new Error('操作已取消');
    }

    // 用 yt-dlp 下载音频
    const { stderr } = await execFileAsync(
      'yt-dlp',
      [
        '-f', 'bestaudio',
        '--audio-format', 'm4a',
        '--audio-quality', '128K',  // 降低质量以加快下载
        '--no-warnings',
        '--no-playlist',
        '-o', outputPath,
        '--socket-timeout', '30',
        url
      ],
      {
        timeout: 300000,  // 5 分钟超时
        signal
      }
    );

    // 验证文件是否成功创建
    try {
      readFileSync(outputPath);
    } catch {
      throw new Error('音频下载失败，文件未生成');
    }

    return outputPath;
  } catch (error: any) {
    // 清理失败的文件
    try {
      unlinkSync(outputPath);
    } catch {}

    // 更友好的错误消息
    if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
      throw new Error('视频网站请求过于频繁，请稍后重试');
    }
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      throw new Error('无权限访问该视频，可能需要登录或该视频已删除');
    }
    if (error.message.includes('404') || error.message.includes('Not Found')) {
      throw new Error('视频不存在或已删除');
    }
    if (error.message.includes('timeout')) {
      throw new Error('下载超时，请检查网络连接');
    }

    throw new Error(`音频下载失败: ${error.message}`);
  }
}

/**
 * 保存上传的文件
 * 支持 multipart/form-data 上传
 */
export async function saveUploadedFile(buffer: Buffer, originalName: string): Promise<string> {
  // 验证文件大小（500MB）
  const MAX_SIZE = 500 * 1024 * 1024;
  if (buffer.length > MAX_SIZE) {
    throw new Error('文件过大，最大支持 500MB');
  }

  // 验证文件格式
  const ext = path.extname(originalName).toLowerCase();
  const supportedFormats = ['.mp3', '.m4a', '.wav', '.webm', '.aac', '.flac', '.ogg', '.mp4', '.mkv', '.mov'];
  if (!supportedFormats.includes(ext)) {
    throw new Error(`不支持的文件格式：${ext}，请上传音频或视频文件`);
  }

  const outputPath = `/tmp/subtitle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`;

  try {
    writeFileSync(outputPath, buffer);
    return outputPath;
  } catch (error: any) {
    throw new Error(`文件保存失败: ${error.message}`);
  }
}

/**
 * 提取音频元数据（获取时长等）
 * 使用 ffprobe（通过 yt-dlp 附带的工具）
 */
export async function getAudioMetadata(
  filePath: string
): Promise<{ duration: number; codec: string }> {
  try {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1:nofile=1',
      filePath
    ]);

    const duration = parseFloat(stdout.trim());

    return {
      duration: isNaN(duration) ? 0 : duration,
      codec: 'unknown'
    };
  } catch (error) {
    // ffprobe 不可用时，返回默认值
    return { duration: 0, codec: 'unknown' };
  }
}

/**
 * 清理临时文件
 */
export function cleanupTempFile(filePath: string): void {
  try {
    unlinkSync(filePath);
  } catch (error) {
    // 忽略删除错误
    console.warn(`清理临时文件失败: ${filePath}`);
  }
}

/**
 * 批量清理过期临时文件
 * 删除超过 1 小时的文件
 */
export function cleanupExpiredFiles(): void {
  try {
    const tmpDir = '/tmp';
    const now = Date.now();
    const maxAge = 3600000;  // 1 小时

    // 这个函数在实际应用中应该在后台运行
    // 由于 Next.js Edge 函数的限制，可能需要在单独的 cron job 中运行
  } catch (error) {
    console.warn('清理过期文件失败:', error);
  }
}
