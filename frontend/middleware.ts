import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 * 用于设置响应头，支持 CDN 缓存和 Client Hints
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. 设置 Vary 头，确保 CDN 基于这些头进行缓存分发
  // 这样可以避免移动版缓存被错误地提供给桌面用户
  const varyHeaders = [
    'User-Agent',
    'Sec-CH-UA-Mobile',
    'Sec-CH-UA',
    'Sec-CH-Width',
    'Sec-CH-Viewport-Width',
  ];
  response.headers.set('Vary', varyHeaders.join(', '));

  // 2. 设置 Accept-CH 头，请求浏览器发送 Client Hints
  // 这些 hints 提供比 User-Agent 更准确的设备信息
  const clientHints = [
    'Sec-CH-UA-Mobile',
    'Sec-CH-UA',
    'Sec-CH-UA-Platform',
    'Sec-CH-Width',
    'Sec-CH-Viewport-Width',
    'Sec-CH-Prefers-Color-Scheme',
  ];
  response.headers.set('Accept-CH', clientHints.join(', '));

  // 3. 设置 Critical-CH 头，标记关键的 Client Hints
  // 浏览器会在这些 hints 缺失时自动重试请求
  const criticalHints = ['Sec-CH-UA-Mobile', 'Sec-CH-Viewport-Width'];
  response.headers.set('Critical-CH', criticalHints.join(', '));

  // 4. 设置 Permissions-Policy 允许 Client Hints
  response.headers.set(
    'Permissions-Policy',
    'ch-ua-mobile=*, ch-ua=*, ch-ua-platform=*, ch-width=*, ch-viewport-width=*'
  );

  return response;
}

// 配置 middleware 应用的路径
// 排除静态资源和 API 路由
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)',
  ],
};
