'use client';

import { Container } from '@mui/material';
import dynamic from 'next/dynamic';
import { usePageLoading } from '../hooks/usePageLoading';
import { useDevice, type DeviceType } from './DeviceProvider';
import PageSkeleton from './mobile/PageSkeleton';
import {
  SearchFocusProvider,
  useSearchFocus,
} from './mobile/SearchFocusContext';
import SeatchHistory from './mobile/SeatchHistory';
import DesktopFooter from './pc/Footer';

const MobileHeader = dynamic(() => import('./mobile/Header'), {
  ssr: false,
});

const DesktopHeader = dynamic(() => import('./pc/Header'), {
  ssr: false,
});

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
  initialDeviceType,
}: {
  children: React.ReactNode;
  initialDeviceType: DeviceType;
}) {
  const { deviceType, isHydrated } = useDevice();
  const effectiveDeviceType = isHydrated ? deviceType : initialDeviceType;
  const { isLoading, pageType } = usePageLoading({ minDisplayTime: 600 });

  const isMobile = effectiveDeviceType === 'mobile';

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
