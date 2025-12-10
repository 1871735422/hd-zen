import MobileHome from './components/mobile/Home';
import DesktopHome from './components/pc/Home';
import { getDeviceTypeFromHeaders } from './utils/serverDeviceUtils';

/**
 * 首页路由
 *
 * 服务端检测设备类型并渲染对应组件
 * - ✅ 保留完整的 SSR
 * - ✅ SEO 友好，首屏性能好
 * - ✅ 简单直接
 *
 * 注意：
 * - 使用 Client Hints（标准）+ User-Agent（兼容）检测
 * - ResponsiveLayout 会在客户端进行二次校正（极少数情况）
 * - 如果服务端检测准确，与导航栏完全一致
 */
export default async function HomePage() {
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
