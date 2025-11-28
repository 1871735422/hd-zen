import { MobileBaseLayout } from '@/app/components/mobile/MobileBaseLayout';
import BaseLayout from '@/app/components/pc/BaseLayout';
import { BreadcrumbProvider } from '@/app/components/shared/AppBreadcrumbs';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next/types';
import { getCategories, getCourseByDisplayOrder } from '../../api';

// 15分钟缓存
export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Get the current course and menu data
  const [course, menuData] = await Promise.all([
    getCourseByDisplayOrder(slug),
    getCategories('学修参考资料'),
  ]);

  if (!course) {
    return {
      title: '学修参考资料 | 慧灯禅修',
      description: `本栏目提供加行修法的必修资料：《大圆满前行引导文》
辅助参考资料：《前行备忘录》《菩提道次第广论》《稻杆经》《大圆满心性修息》`,
    };
  }

  const menus = menuData[0]?.subMenu;
  const selectedCategory = (menus && menus[Number(slug) - 1]?.name) || '';

  return {
    title: `${selectedCategory}-学修参考资料 | 慧灯禅修`,
    description: `慧灯之光禅修网站 — ${selectedCategory} 学修参考资料`,
  };
}

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
    <BreadcrumbProvider>
      {deviceType === 'mobile' ? (
        <MobileBaseLayout>{children}</MobileBaseLayout>
      ) : (
        <BaseLayout
          title='学修参考资料'
          categories={categories}
          selectedCategory={selectedCategory}
          description={`本栏目提供加行修法的必修资料：《大圆满前行引导文》
辅助参考资料：《前行备忘录》《菩提道次第广论》《稻杆经》《大圆满心性修息》`}
        >
          {children}
        </BaseLayout>
      )}
    </BreadcrumbProvider>
  );
}
