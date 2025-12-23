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
 * 检测策略（与客户端逻辑完全一致）：
 * 1. 优先使用视口宽度（Client Hints）- 最准确
 * 2. 回退到 User-Agent 检测 - 兼容不支持 Client Hints 的浏览器
 * 3. 最后回退到 Client Hints (Sec-CH-UA-Mobile)
 * 4. 默认返回 desktop - 保守策略
 *
 * 注意：
 * - 在开发环境热更新时，headers 可能不可用
 * - 此时会返回默认值 'desktop'
 * - 客户端 DeviceProvider 会在水合后进行校正
 */

export async function getDeviceTypeFromHeaders(): Promise<
  'mobile' | 'desktop'
> {
  // 在构建时（静态生成），headers() 不可用且会导致构建失败
  // 检查是否在构建时：Next.js 在构建时会设置特定的环境变量
  // 如果在构建时，直接返回默认值，不调用 headers()
  const isBuildTime =
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-export' ||
    // 如果没有请求上下文，可能是构建时
    (typeof process !== 'undefined' &&
      process.env.NODE_ENV === 'production' &&
      !process.env.VERCEL);

  if (isBuildTime) {
    // 构建时返回默认值 desktop，客户端会在水合后进行校正
    return 'desktop';
  }

  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();

    // 1. 获取 User-Agent（用于判断移动设备）
    const userAgent = headersList.get('user-agent') || '';
    const isMobileUA = userAgent ? isMobileUserAgent(userAgent) : false;

    // 2. 读取视口宽度和高度（Client Hints），计算有效宽度
    // 优先使用视口宽度，因为这是最准确的判断依据
    // 注意：使用已获取的 headersList，避免重复调用 headers()
    const viewportWidth = getViewportWidthFromHeaders(headersList);
    const viewportHeight = getViewportHeightFromHeaders(headersList);

    // 计算有效宽度：移动端横屏时，只有当横屏宽度 <= 960px 才使用较短边（处理手机横屏）
    // 如果横屏宽度 > 960px，说明设备足够大（如平板），应该直接使用宽度判断为 desktop
    // 与客户端逻辑完全一致
    let effectiveWidth: number | null = null;
    if (
      typeof viewportWidth === 'number' &&
      typeof viewportHeight === 'number'
    ) {
      const isLandscape = viewportWidth > viewportHeight;
      // 横屏时：如果宽度 <= 960px（手机横屏），使用较短边；如果宽度 > 960px（平板横屏），使用宽度
      effectiveWidth =
        isMobileUA && isLandscape && viewportWidth <= 960
          ? Math.min(viewportWidth, viewportHeight)
          : viewportWidth;
    } else if (typeof viewportWidth === 'number') {
      // 如果无法获取高度，回退到只使用宽度
      effectiveWidth = viewportWidth;
    }

    // 3. 核心判断逻辑：与客户端完全一致
    // 断点：960px，大于 960px 的平板（如 iPad Pro 1024px）视为 PC 端
    if (effectiveWidth !== null) {
      // 有效宽度 > 960px → desktop
      if (effectiveWidth > 960) {
        return 'desktop';
      }
      // 有效宽度 <= 960px 且移动 UA → mobile
      // 有效宽度 <= 960px 但非移动 UA → desktop
      return isMobileUA ? 'mobile' : 'desktop';
    }

    // 4. 如果视口宽度不可用，回退到 Client Hints + UA 判断
    const isMobileHint = isMobileFromClientHints(headersList);
    if (isMobileHint === true && isMobileUA) {
      return 'mobile';
    }
    if (isMobileHint === false && !isMobileUA) {
      return 'desktop';
    }

    // 5. Client Hints 不可用时，回退到 UA 判断
    if (isMobileUA) {
      return 'mobile';
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
    // 生产环境也记录错误，方便调试
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (process.env.NODE_ENV === 'development') {
      console.error('[DeviceDetection] Failed to get device type:', error);
    } else {
      // 生产环境使用 console.warn，避免过多错误日志
      console.warn(
        `[DeviceDetection] Failed to get device type: ${errorMessage}. Using default "desktop".`
      );
    }
    return 'desktop';
  }
}

/**
 * 从 Headers 获取视口宽度（从 Client Hints）
 * 用于更精确的响应式判断
 */
function getViewportWidthFromHeaders(headersList: Headers): number | null {
  const viewportWidth = headersList.get('sec-ch-viewport-width');
  if (viewportWidth) {
    const width = parseInt(viewportWidth, 10);
    return isNaN(width) ? null : width;
  }
  return null;
}

/**
 * 从 Headers 获取视口高度（从 Client Hints）
 * 用于判断横屏情况，计算有效宽度
 */
function getViewportHeightFromHeaders(headersList: Headers): number | null {
  const viewportHeight = headersList.get('sec-ch-viewport-height');
  if (viewportHeight) {
    const height = parseInt(viewportHeight, 10);
    return isNaN(height) ? null : height;
  }
  return null;
}

/**
 * 获取视口宽度（从 Client Hints）
 * 用于更精确的响应式判断
 * @deprecated 优先使用 getViewportWidthFromHeaders，避免重复调用 headers()
 */
export async function getViewportWidth(): Promise<number | null> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    return getViewportWidthFromHeaders(headersList);
  } catch (error) {
    console.error('Failed to get viewport width:', error);
    return null;
  }
}

/**
 * 获取视口高度（从 Client Hints）
 * 用于判断横屏情况，计算有效宽度
 * @deprecated 优先使用 getViewportHeightFromHeaders，避免重复调用 headers()
 */
export async function getViewportHeight(): Promise<number | null> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    return getViewportHeightFromHeaders(headersList);
  } catch (error) {
    console.error('Failed to get viewport height:', error);
    return null;
  }
}
