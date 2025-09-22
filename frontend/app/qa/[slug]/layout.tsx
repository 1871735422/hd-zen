import CategorySelector from '@/app/components/pc/CategorySelector';
import TitleBanner from '@/app/components/shared/TitleBanner';
import { Container } from '@mui/material';
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
  const courseOrders = coursesResult.items.map(item => item.displayOrder + '');
  const selectedCategory = course.title;

  return (
    <Container
      maxWidth={false}
      sx={{
        m: 0,
        px: { lg: 25 },
        background: 'url(/images/course-bg-h.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '200px',
      }}
    >
      <TitleBanner title='禅修课问答' />
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        courseIds={courseOrders}
      />
      {children}
    </Container>
  );
}
