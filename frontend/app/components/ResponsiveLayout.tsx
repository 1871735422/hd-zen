'use client';

import { Container } from '@mui/material';
import { useDevice } from './DeviceProvider';
import DesktopFooter from './pc/Footer';
import DesktopHeader from './pc/Header';
import MobileHeader from './mobile/Header';
import TabNavigation from './mobile/TabNavigation';

/**
 * 响应式布局组件
 *
 * 功能：
 * - 基于客户端设备检测动态渲染 Header/Footer
 * - 解决热更新时服务端检测不准确的问题
 * - 支持窗口大小变化时的平滑切换
 *
 * 注意：
 * - 首次渲染使用服务端检测值（来自 DeviceProvider）
 * - 水合后使用客户端检测值
 * - 避免水合不匹配问题
 */
export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { deviceType, isHydrated } = useDevice();

  // 在水合完成前，不渲染任何内容，避免客户端和服务端不匹配导致的问题
  if (!isHydrated) {
    return null;
  }

  const isMobile = deviceType === 'mobile';

  return (
    <>
      {/* 根据设备类型渲染不同的 Header */}
      {isMobile ? (
        <>
          <MobileHeader />
          <TabNavigation />
        </>
      ) : (
        <DesktopHeader />
      )}

      <Container
        maxWidth={isMobile ? false : 'xxl'}
        component='main'
        sx={{
          p: isMobile ? 0 : { xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0 },
          m: isMobile ? 0 : { xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0 },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {children}
      </Container>

      {/* 根据设备类型渲染不同的 Footer */}
      {!isMobile && <DesktopFooter />}
    </>
  );
}
