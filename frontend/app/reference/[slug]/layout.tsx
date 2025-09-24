import CategorySelector from '@/app/components/pc/CategorySelector';
import TitleBanner from '@/app/components/shared/TitleBanner';
import { Container, Typography } from '@mui/material';
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
    <Container
      maxWidth={false}
      sx={{
        m: 0,
        px: { lg: 25 },
        background: 'url(/images/course-bg-h.png)',
      }}
    >
      <TitleBanner title='学修参考资料' />
      <Typography
        sx={{
          color: 'rgba(127, 173, 235, 1)',
          mt: -6,
          mb: 6,
          px: 2,
        }}
      >
        本栏目提供加行修法的必修资料：《大圆满前行引导文》
        <br />
        辅助参考资料：《前行备忘录》《菩提道次第广论》《稻杆经》《大圆满心性修息》
      </Typography>
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
      />
      {children}
    </Container>
  );
}
