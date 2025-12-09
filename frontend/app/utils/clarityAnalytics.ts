/**
 * Clarity Analytics 工具函数
 * 用于发送自定义事件统计
 */

/**
 * 检查 Clarity 是否已初始化
 */
function isClarityAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (window as any).clarity !== 'undefined';
}

/**
 * 发送 Clarity 自定义事件
 * @param eventName 事件名称
 * @param eventData 事件数据（可选）
 */
export function trackClarityEvent(
  eventName: string,
  eventData?: Record<string, string | number>
): void {
  if (!isClarityAvailable()) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clarity = (window as any).clarity;
    if (clarity && typeof clarity.event === 'function') {
      clarity.event(eventName, eventData);
    }
  } catch (error) {
    // 静默处理错误，避免影响用户体验
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to track Clarity event:', error);
    }
  }
}

/**
 * 文章阅读统计
 * @param articleId 文章ID
 * @param articleTitle 文章标题
 */
export function trackArticleRead(
  articleId: string,
  articleTitle?: string
): void {
  trackClarityEvent('article_read', {
    article_id: articleId,
    ...(articleTitle && { article_title: articleTitle }),
  });
}

/**
 * 视频播放统计
 * @param videoId 视频ID
 * @param videoTitle 视频标题
 */
export function trackVideoPlay(videoId: string, videoTitle?: string): void {
  trackClarityEvent('video_play', {
    video_id: videoId,
    ...(videoTitle && { video_title: videoTitle }),
  });
}

/**
 * 音频播放统计
 * @param audioId 音频ID
 * @param audioTitle 音频标题
 */
export function trackAudioPlay(audioId: string, audioTitle?: string): void {
  trackClarityEvent('audio_play', {
    audio_id: audioId,
    ...(audioTitle && { audio_title: audioTitle }),
  });
}

/**
 * 文件下载统计
 * @param fileType 文件类型 (pdf, epub, audio, video)
 * @param fileName 文件名
 * @param fileUrl 文件URL（可选）
 */
export function trackDownload(
  fileType: string,
  fileName?: string,
  fileUrl?: string
): void {
  trackClarityEvent('file_download', {
    file_type: fileType,
    ...(fileName && { file_name: fileName }),
    ...(fileUrl && { file_url: fileUrl }),
  });
}
