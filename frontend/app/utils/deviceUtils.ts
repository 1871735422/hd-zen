'use client';

import { useEffect, useState } from 'react';
import { MOBILE_UA_REGEX } from '../constants';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * 检测设备类型
 *
 * @deprecated 推荐使用 useDevice() from '@/app/components/DeviceProvider'
 * 新的 Hook 提供了更好的 SSR 支持和性能优化
 *
 * 迁移示例：
 * ```typescript
 * // 旧方式
 * import { useDeviceType } from '@/app/utils/deviceUtils';
 * const deviceType = useDeviceType();
 *
 * // 新方式（推荐）
 * import { useDevice } from '@/app/components/DeviceProvider';
 * const { deviceType, isHydrated } = useDevice();
 * ```
 */
export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      const isMobileUA = isMobileUserAgent(navigator.userAgent);

      // 移动端横屏时，用较短边作为有效宽度；否则使用正常宽度
      const effectiveWidth =
        isMobileUA && isLandscape ? Math.min(width, height) : width;

      if (effectiveWidth < 960 && isMobileUA) {
        setDeviceType('mobile');
      } else {
        setDeviceType('desktop');
      }
    };

    // Initial check
    checkDevice();

    // Listen for resize events
    const handleResize = () => checkDevice();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

/**
 * 判断是否为移动设备（服务器端）
 */
export function isMobileUserAgent(userAgent?: string): boolean {
  if (!userAgent) return false;
  return MOBILE_UA_REGEX.test(userAgent);
}
