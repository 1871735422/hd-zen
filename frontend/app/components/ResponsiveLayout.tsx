'use client';

import { Container } from '@mui/material';
import { usePageLoading } from '../hooks/usePageLoading';
import { useDevice } from './DeviceProvider';
import MobileHeader from './mobile/Header';
import PageSkeleton from './mobile/PageSkeleton';
import {
  SearchFocusProvider,
  useSearchFocus,
} from './mobile/SearchFocusContext';
import SeatchHistory from './mobile/SeatchHistory';
import DesktopFooter from './pc/Footer';
import DesktopHeader from './pc/Header';

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
  const { isLoading, pageType } = usePageLoading({ minDisplayTime: 600 });

  // 使用客户端的设备类型
  // DeviceProvider 会立即执行客户端检测，如果与服务端不一致会更新
  // 初始值来自服务端检测，确保 SSR 和客户端一致
  const isMobile = deviceType === 'mobile';

  function MainContainerContent() {
    // read focus state to decide what to show in main area on mobile
    const { isSearchFocused } = useSearchFocus();

    // 如果是移动端且正在加载，显示 skeleton
    if (isMobile && isLoading) {
      return <PageSkeleton type={pageType} />;
    }

    // 如果是移动端且搜索聚焦，显示搜索历史
    if (isMobile && isSearchFocused) {
      return <SeatchHistory />;
    }

    // 正常渲染内容
    return <>{children}</>;
  }

  return (
    <SearchFocusProvider>
      {/* 根据设备类型渲染不同的 Header */}
      {isMobile ? <MobileHeader /> : <DesktopHeader />}

      <Container
        maxWidth={isMobile ? false : 'xxl'}
        component='main'
        sx={{
          p: '0 !important',
          m: 0,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <MainContainerContent />
      </Container>

      {/* 根据设备类型渲染不同的 Footer */}
      {!isMobile && <DesktopFooter />}
    </SearchFocusProvider>
  );
}
