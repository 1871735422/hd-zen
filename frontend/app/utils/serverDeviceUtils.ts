/**
 * 服务器端设备检测工具
 * 用于在 Server Components 中检测设备类型
 */

/**
 * 判断是否为移动设备（服务器端）
 */
export function isMobileUserAgent(userAgent?: string): boolean {
  if (!userAgent) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

/**
 * 从 Headers 获取设备类型（用于 Next.js Server Components）
 */
export async function getDeviceTypeFromHeaders(): Promise<
  'mobile' | 'desktop'
> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    return isMobileUserAgent(userAgent) ? 'mobile' : 'desktop';
  } catch (error) {
    // 如果导入失败，默认返回桌面版
    console.error('Failed to get device type:', error);
    return 'desktop';
  }
}
