'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { MOBILE_UA_REGEX } from '../constants';

/**
 * 设备类型
 * 统一使用此类型定义，避免类型不一致
 */
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
 *
 * 返回：
 * - deviceType: 'mobile' | 'desktop' - 当前设备类型
 * - isHydrated: boolean - 是否已完成客户端水合（用于避免 SSR 不匹配）
 *
 * 使用示例：
 * ```typescript
 * const { deviceType, isHydrated } = useDevice();
 * const isMobile = deviceType === 'mobile';
 * ```
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
    const checkDevice = (isInitialCheck = false) => {
      const ua = navigator.userAgent || '';
      const isMobileUA = MOBILE_UA_REGEX.test(ua);
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isLandscape = viewportWidth > viewportHeight;

      // 移动端横屏时，用较短边作为有效宽度；否则使用正常宽度
      // 断点：960px，大于 960px 的平板（如 iPad Pro 1024px）视为 PC 端
      const effectiveWidth =
        isMobileUA && isLandscape
          ? Math.min(viewportWidth, viewportHeight)
          : viewportWidth;

      // 核心判断逻辑：与服务端完全一致
      // 1. 有效宽度 > 960px → desktop
      // 2. 有效宽度 <= 960px 且移动 UA → mobile
      // 3. 有效宽度 <= 960px 但非移动 UA → desktop
      let isMobile = false;
      if (effectiveWidth > 960) {
        isMobile = false; // 大屏设备视为桌面端
      } else if (effectiveWidth <= 960) {
        // 窄屏设备：需要同时满足移动 UA + 窄视口
        isMobile = isMobileUA;
      }

      const newDeviceType = isMobile ? 'mobile' : 'desktop';

      // 首次检测时：如果客户端检测结果与服务端不一致，才更新
      // 这样可以纠正生产环境中服务端检测错误的情况
      if (isInitialCheck) {
        if (newDeviceType !== serverDeviceType) {
          setDeviceType(newDeviceType);
        }
      } else {
        // 窗口大小变化时，直接更新
        setDeviceType(newDeviceType);
      }
    };

    // 标记为已水合（使用服务端的初始值，避免闪烁）
    setIsHydrated(true);

    // 首次客户端检测：立即执行一次，然后使用 requestAnimationFrame 再检测一次
    // 立即执行确保能尽快纠正服务端检测错误的情况，避免 header 和内容不一致
    checkDevice(true);

    // 使用 requestAnimationFrame 延迟再检测一次，确保在 DOM 完全准备好后再确认
    const rafId = requestAnimationFrame(() => {
      checkDevice(true);
    });

    // 添加窗口大小变化监听器
    window.addEventListener('resize', () => checkDevice(false));

    // 清理函数
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', () => checkDevice(false));
    };
  }, [serverDeviceType]); // 添加 serverDeviceType 作为依赖

  return (
    <DeviceContext.Provider value={{ deviceType, isHydrated }}>
      {children}
    </DeviceContext.Provider>
  );
}
