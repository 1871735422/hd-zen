import BaseLayout from '@/app/components/pc/BaseLayout';
import { notFound } from 'next/navigation';
import { getCategories, getCourseByDisplayOrder } from '../../api';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';

// 15分钟缓存
export const revalidate = 900;

export const metadata = {
  title: '学修参考资料 | 慧灯禅修',
  description: `本栏目提供加行修法的必修资料：《大圆满前行引导文》
辅助参考资料：《前行备忘录》《菩提道次第广论》《稻杆经》《大圆满心性修息》`,
};

export default async function CourseLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;

  // 检测设备类型
  const deviceType = await getDeviceTypeFromHeaders();

  // 移动端直接返回 children，不使用 BaseLayout
  if (deviceType === 'mobile') {
    return <>{children}</>;
  }

  // PC端使用原有布局
  // Get the current course and all courses
  const [course, menuData] = await Promise.all([
    getCourseByDisplayOrder(slug),
    getCategories('学修参考资料'),
  ]);

  if (!course) {
    notFound();
  }

  // console.log({ course, coursesResult, menuData });
  const menus = menuData[0]?.subMenu;
  const categories = menus?.map(item => item.name) || [];
  const selectedCategory = (menus && menus[Number(slug) - 1]?.name) || '';

  return (
    <BaseLayout
      title='学修参考资料'
      categories={categories}
      selectedCategory={selectedCategory}
      description={metadata.description}
    >
      {children}
    </BaseLayout>
  );
}
