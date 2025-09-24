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
        backgroundImage: `
          linear-gradient(180deg, rgba(224, 241, 255, 0.7) 0%, rgba(255, 255, 255, 0) 20.05%, rgba(217, 234, 252, 0.7) 33.35%, rgba(241, 247, 254, 0.7) 63.87%, rgba(245, 247, 251, 0.7) 100%),
          url(/images/course-bg-h.png),
          url(/images/course-lesson-bg.jpg)
        `,
        backgroundSize: 'cover, cover, contain',
        backgroundPosition: 'center, center, 0% -14%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <TitleBanner title={'慧灯禅修课'} />
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        courseIds={courseOrders}
      />
      {children}
    </Container>
  );
}
