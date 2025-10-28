import { redirect } from 'next/navigation';
import { getDeviceTypeFromHeaders } from '../utils/serverDeviceUtils';
import { getCategories } from '../api';
import MobileReferencePage from '../components/mobile/MobileReferencePage';

export default async function ReferenceRedirect() {
  const deviceType = await getDeviceTypeFromHeaders();

  // 移动端直接显示参考资料页面
  if (deviceType === 'mobile') {
    const menuData = await getCategories('学修参考资料');
    const subMenu = menuData[0]?.subMenu || [];
    const categories = subMenu.map(item => ({
      id: parseInt(item.slug, 10),
      name: item.name,
      displayOrder: parseInt(item.slug, 10),
    }));
    return <MobileReferencePage categories={categories} />;
  }

  // PC端重定向到 /reference/1
  redirect('/reference/1');
}
