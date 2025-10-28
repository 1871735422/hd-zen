'use client';

import { useEffect, useState } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * 检测设备类型
 */
export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setDeviceType('mobile');
      } else if (width < 960) {
        setDeviceType('tablet');
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
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

/**
 * 获取响应式断点值
 */
export const breakpoints = {
  mobile: 0,
  tablet: 600,
  desktop: 960,
} as const;
