import DesktopHome from './components/pc/Home';
import MobileHome from './components/mobile/Home';
import { getDeviceTypeFromHeaders } from './utils/serverDeviceUtils';

export default async function HomePage() {
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  // 根据设备类型渲染不同的首页组件
  return isMobile ? <MobileHome /> : <DesktopHome />;
}
