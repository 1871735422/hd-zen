'use client';

import { useEffect } from 'react';

/**
 * Clarity Analytics 客户端组件
 * 在客户端初始化 Microsoft Clarity 分析脚本
 *
 * 注意：必须在客户端组件中使用 useEffect 初始化，
 * 避免在服务端执行或引发水合警告
 */
export default function ClarityAnalytics({ projectId }: { projectId: string }) {
  useEffect(() => {
    // 仅在浏览器环境中初始化
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'development')
      return;

    // 动态导入 Clarity 以避免服务端执行
    import('@microsoft/clarity').then(Clarity => {
      try {
        Clarity.default.init(projectId);
        console.log('Clarity Analytics initialized');
      } catch (error) {
        console.error('Failed to initialize Clarity:', error);
      }
    });
  }, [projectId]);

  // 不渲染任何 UI
  return null;
}
