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

      // 移动端横屏时，只有当横屏宽度 <= 960px 才使用较短边（处理手机横屏）
      // 如果横屏宽度 > 960px，说明设备足够大（如平板），应该直接使用宽度判断为 desktop
      // 断点：960px，大于 960px 的平板（如 iPad Pro 1024px）视为 PC 端
      const effectiveWidth =
        isMobileUA && isLandscape && viewportWidth <= 960
          ? Math.min(viewportWidth, viewportHeight)
          : viewportWidth;

      // 核心判断逻辑：与服务端完全一致
      // 1. 有效宽度 > 960px → desktop
      // 2. 有效宽度 <= 960px 且移动 UA → mobile
      // 3. 有效宽度 <= 960px 但非移动 UA → desktop
      // 注意：客户端 window.innerWidth 总是存在，所以 effectiveWidth 不会是 null
      let newDeviceType: 'mobile' | 'desktop';
      if (effectiveWidth > 960) {
        newDeviceType = 'desktop';
      } else {
        // 有效宽度 <= 960px 时，根据移动 UA 判断
        newDeviceType = isMobileUA ? 'mobile' : 'desktop';
      }

      // 首次检测时：如果客户端检测结果与服务端不一致，才更新
      // 这样可以纠正生产环境中服务端检测错误的情况
      // 注意：即使更新了，也只影响 header（ResponsiveLayout），页面内容已在服务端渲染完成，不会重新渲染，避免闪烁
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

    // 首次客户端检测：立即同步执行，确保尽快纠正服务端检测错误
    // 同步执行确保在首次渲染时就能得到正确的设备类型
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
