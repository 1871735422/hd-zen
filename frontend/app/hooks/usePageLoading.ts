'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface UsePageLoadingOptions {
  minDisplayTime?: number; // 最小显示时间（毫秒）
}

export function usePageLoading(options: UsePageLoadingOptions = {}) {
  const { minDisplayTime = 600 } = options;
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);

  // 根据路径检测页面类型
  const getPageType = ():
    | 'home'
    | 'course'
    | 'qa'
    | 'reference'
    | 'download'
    | 'ask'
    | 'default' => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/course')) return 'course';
    if (pathname.startsWith('/qa')) return 'qa';
    if (pathname.startsWith('/reference')) return 'reference';
    if (pathname.startsWith('/download')) return 'download';
    if (pathname.startsWith('/ask')) return 'ask';
    return 'default';
  };

  useEffect(() => {
    // 当路径发生变化时，显示 loading
    if (pathname !== previousPath) {
      setIsLoading(true);

      // 设置最小显示时间
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPreviousPath(pathname);
      }, minDisplayTime);

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath, minDisplayTime]);

  // 初始加载时也显示 skeleton
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  return { isLoading, pageType: getPageType() };
}
