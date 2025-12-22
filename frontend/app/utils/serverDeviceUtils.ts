/**
 * 服务器端设备检测工具
 * 用于在 Server Components 中检测设备类型
 *
 * 优先使用 Client Hints (Sec-CH-UA-Mobile)，回退到 User-Agent
 */

import { MOBILE_UA_REGEX } from '../constants';

/**
 * 判断是否为移动设备（服务器端）
 *
 * 简单通用的检测规则：
 * - 只检测最常见的关键词：mobile、android、iphone、ipad
 * - 不检测具体品牌型号（不可靠且无法穷举）
 * - 客户端会用屏幕宽度和触摸能力进行最终校正
 */
export function isMobileUserAgent(userAgent?: string): boolean {
  if (!userAgent) return false;

  // 简单通用的移动设备检测
  // 涵盖 99% 的移动设备场景
  return MOBILE_UA_REGEX.test(userAgent);
}

/**
 * 从 Client Hints 判断是否为移动设备
 * Client Hints 提供比 User-Agent 更准确和隐私友好的设备信息
 */
export function isMobileFromClientHints(headers: Headers): boolean | null {
  // 检查 Sec-CH-UA-Mobile header
  const uaMobile = headers.get('sec-ch-ua-mobile');

  if (uaMobile === '?1') {
    return true; // 明确是移动设备
  } else if (uaMobile === '?0') {
    return false; // 明确不是移动设备
  }

  return null; // Client Hints 不可用
}

/**
 * 从 Headers 获取设备类型（用于 Next.js Server Components）
 *
 * 检测策略：
 * 1. 优先使用 Client Hints (Sec-CH-UA-Mobile) - 更准确、隐私友好
 * 2. 回退到 User-Agent 检测 - 兼容不支持 Client Hints 的浏览器
 * 3. 默认返回 desktop - 保守策略
 *
 * 注意：
 * - 在开发环境热更新时，headers 可能不可用
 * - 此时会返回默认值 'desktop'
 * - 客户端 DeviceProvider 会在水合后进行校正
 */

export async function getDeviceTypeFromHeaders(): Promise<
  'mobile' | 'desktop'
> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();

    // 1. 优先尝试 Client Hints
    const isMobileHint = isMobileFromClientHints(headersList);

    // 2. 同时拿到 User-Agent，避免部分浏览器（如部分国产浏览器）CH 误报
    const userAgent = headersList.get('user-agent') || '';
    const isMobileFromUA = userAgent ? isMobileUserAgent(userAgent) : null;

    // 3. 读取视口宽度和高度（Client Hints），计算有效宽度（与客户端逻辑一致）
    const viewportWidth = await getViewportWidth();
    const viewportHeight = await getViewportHeight();

    // 计算有效宽度：移动端横屏时使用较短边，否则使用宽度
    // 与客户端逻辑完全一致
    let effectiveWidth: number | null = null;
    if (
      typeof viewportWidth === 'number' &&
      typeof viewportHeight === 'number'
    ) {
      const isLandscape = viewportWidth > viewportHeight;
      effectiveWidth =
        isMobileFromUA === true && isLandscape
          ? Math.min(viewportWidth, viewportHeight)
          : viewportWidth;
    } else if (typeof viewportWidth === 'number') {
      // 如果无法获取高度，回退到只使用宽度
      effectiveWidth = viewportWidth;
    }

    // 断点：<= 1024px 视为移动端（包含 iPad Pro 1024px 等平板设备）
    const isNarrowViewport = effectiveWidth !== null && effectiveWidth <= 1024;

    // 核心判断逻辑：与客户端完全一致
    // 需要同时满足：移动 UA + 窄视口（有效宽度 <= 1024px）
    // 优先使用有效宽度判断，确保与服务端和客户端逻辑一致
    if (isMobileFromUA === true && isNarrowViewport) {
      return 'mobile';
    }

    // 如果 Client Hints 明确标记为移动端，且 UA 也是移动端，返回移动端
    // 但如果没有有效宽度信息，则依赖 Client Hints
    if (isMobileHint === true && isMobileFromUA === true) {
      return 'mobile';
    }

    // 如果 Client Hints 标记为桌面，但 UA 判断为移动端且有效宽度很窄，取移动端（更保守）
    if (isMobileHint === false && isMobileFromUA === true && isNarrowViewport) {
      return 'mobile';
    }

    // Client Hints 明确标记桌面且 UA 也非移动，则返回桌面
    if (isMobileHint === false) {
      return 'desktop';
    }

    // Client Hints 不可用时，回退到 UA 判断（不检查视口，因为可能无法获取）
    if (isMobileFromUA !== null) {
      return isMobileFromUA ? 'mobile' : 'desktop';
    }

    // 如果 headers 完全不可用（如热更新），返回默认值
    // 客户端 DeviceProvider 会在水合后校正
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[DeviceDetection] Headers not available (possibly HMR), using default "desktop". Client will correct after hydration.'
      );
    }
    return 'desktop';
  } catch (error) {
    // 如果导入失败，默认返回桌面版
    if (process.env.NODE_ENV === 'development') {
      console.error('[DeviceDetection] Failed to get device type:', error);
    }
    return 'desktop';
  }
}

/**
 * 获取视口宽度（从 Client Hints）
 * 用于更精确的响应式判断
 */
export async function getViewportWidth(): Promise<number | null> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const viewportWidth = headersList.get('sec-ch-viewport-width');

    if (viewportWidth) {
      const width = parseInt(viewportWidth, 10);
      return isNaN(width) ? null : width;
    }

    return null;
  } catch (error) {
    console.error('Failed to get viewport width:', error);
    return null;
  }
}

/**
 * 获取视口高度（从 Client Hints）
 * 用于判断横屏情况，计算有效宽度
 */
export async function getViewportHeight(): Promise<number | null> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const viewportHeight = headersList.get('sec-ch-viewport-height');

    if (viewportHeight) {
      const height = parseInt(viewportHeight, 10);
      return isNaN(height) ? null : height;
    }

    return null;
  } catch (error) {
    console.error('Failed to get viewport height:', error);
    return null;
  }
}
