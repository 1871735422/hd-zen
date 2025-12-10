'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { MOBILE_UA_REGEX } from '../constants';

export type DeviceType = 'mobile' | 'desktop';

interface DeviceContextType {
  deviceType: DeviceType;
  isHydrated: boolean;
}

const DeviceContext = createContext<DeviceContextType>({
  deviceType: 'desktop',
  isHydrated: false,
});

/**
 * 客户端设备检测 Hook
 * 使用 matchMedia API 进行精确的响应式检测
 */
export function useDevice() {
  return useContext(DeviceContext);
}

/**
 * 设备类型 Provider
 *
 * 功能：
 * 1. 接收服务端检测的初始设备类型（SSR）
 * 2. 在客户端使用 matchMedia 进行二次校正
 * 3. 监听窗口大小变化，动态更新设备类型
 *
 * 优势：
 * - 首屏使用 SSR 值，避免闪烁
 * - 客户端校正处理"桌面浏览器缩小窗口"等边界情况
 * - 响应式断点与服务端阈值保持一致
 */
export default function DeviceProvider({
  children,
  serverDeviceType,
}: {
  children: React.ReactNode;
  serverDeviceType: DeviceType;
}) {
  const [deviceType, setDeviceType] = useState<DeviceType>(serverDeviceType);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent || '';
      const isMobileUA = MOBILE_UA_REGEX.test(ua);
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isLandscape = viewportWidth > viewportHeight;

      // 移动端横屏时，用较短边作为有效宽度；否则使用正常宽度
      const effectiveWidth =
        isMobileUA && isLandscape
          ? Math.min(viewportWidth, viewportHeight)
          : viewportWidth;

      const isNarrowViewport = effectiveWidth < 960;
      const isMobile = isMobileUA && isNarrowViewport;
      setDeviceType(isMobile ? 'mobile' : 'desktop');
    };

    // 首次客户端加载时，立即检查一次
    checkDevice();
    // 然后标记为已水合
    setIsHydrated(true);

    // 添加监听器
    window.addEventListener('resize', checkDevice);

    // 清理函数
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []); // 依赖项为空，确保只在客户端挂载时运行一次

  return (
    <DeviceContext.Provider value={{ deviceType, isHydrated }}>
      {children}
    </DeviceContext.Provider>
  );
}
