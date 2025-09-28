import BaseLayout from '@/app/components/pc/BaseLayout';
import { notFound } from 'next/navigation';
import { getCourseByDisplayOrder, getCourses } from '../../api';

// 15分钟缓存
export const revalidate = 900;

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
