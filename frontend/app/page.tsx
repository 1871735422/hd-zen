import MobileHome from './components/mobile/Home';
import DesktopHome from './components/pc/Home';
import { getDeviceTypeFromHeaders } from './utils/serverDeviceUtils';

/**
 * 首页路由
 *
 * 服务端检测设备类型并渲染对应组件
 * - ✅ 保留完整的 SSR（只渲染需要的组件，不浪费资源）
 * - ✅ SEO 友好，首屏性能好
 * - ✅ 与 ResponsiveLayout 使用相同的检测逻辑，确保一致性
 *
 * 注意：
 * - 使用与服务端完全一致的检测逻辑（已在 serverDeviceUtils.ts 中确保）
 * - 如果客户端检测到不一致，DeviceProvider 会更新，但只影响 header，不影响页面内容（避免闪烁）
 */
export default async function HomePage() {
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
