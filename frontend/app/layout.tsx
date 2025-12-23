import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Analytics } from '@vercel/analytics/react';
import { Suspense } from 'react';
import ClarityAnalytics from './components/ClarityAnalytics';
import DeviceProvider from './components/DeviceProvider';
import ResponsiveLayout from './components/ResponsiveLayout';
// @ts-ignore
import './globals.css';
import MuiThemeProvider from './theme-provider';
import { getDeviceTypeFromHeaders } from './utils/serverDeviceUtils';

export const metadata = {
  title: '慧灯禅修', // 可选：在这里定义默认 metadata，页面会覆盖 head
  description: '慧灯之光禅修网站 — 专为现代人定制的佛法学修网站',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projectId = 'tncl8cmm4o';

  // 服务端检测设备类型（首屏渲染）
  const serverDeviceType = await getDeviceTypeFromHeaders();
  const isMobile = serverDeviceType === 'mobile';

  return (
    <html lang='zh-Hans' suppressHydrationWarning>
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          ...(isMobile ? {} : { minWidth: '1280px' }),
        }}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: false }}>
          <MuiThemeProvider>
            {/* 客户端设备检测 Provider - 支持窗口大小变化时的二次校正 */}
            <DeviceProvider serverDeviceType={serverDeviceType}>
              {/* 响应式布局 - 基于客户端检测动态渲染，解决热更新问题 */}
              {/* Suspense 边界：MobileHeader 使用了 useSearchParams()，需要 Suspense 包裹 */}
              <Suspense fallback={null}>
                <ResponsiveLayout>{children}</ResponsiveLayout>
              </Suspense>
            </DeviceProvider>

            {/* Clarity Analytics - 在客户端初始化 */}
            <ClarityAnalytics projectId={projectId} />
            {/* Vercel Analytics - 性能监控和错误追踪 */}
            <Analytics />
          </MuiThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
