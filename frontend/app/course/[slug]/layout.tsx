import { MobileBaseLayout } from '@/app/components/mobile/MobileBaseLayout';
import BaseLayout from '@/app/components/pc/BaseLayout';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next/types';
import { getCourseByDisplayOrder, getCourses } from '../../api';

// 15分钟缓存
export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Get the current course
  const course = await getCourseByDisplayOrder(slug);

  if (!course) {
    return {
      title: '慧灯禅修课',
    };
  }

  return {
    title: `${course.title}-慧灯禅修课`,
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

  // Get the current course and all courses
  const [course, coursesResult] = await Promise.all([
    getCourseByDisplayOrder(slug),
    getCourses(),
  ]);

  if (!course) {
    notFound();
  }

  const categories = coursesResult.items.map(item => item.title);
  const selectedCategory = course.title;
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  if (isMobile) {
    return <MobileBaseLayout>{children}</MobileBaseLayout>;
  }

  return (
    <BaseLayout
      title='慧灯禅修课'
      categories={categories}
      selectedCategory={selectedCategory}
    >
      {children}
    </BaseLayout>
  );
}
