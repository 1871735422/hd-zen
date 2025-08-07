import CategorySelector from '@/app/components/pc/CategorySelector';
import { Box, Container } from '@mui/material';
import { notFound } from 'next/navigation';
import { getCourseByDisplayOrder, getCourses } from '../../api';
import CourseIcon from '../../components/icons/Course';

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
      }}
    >
      <Box sx={{ pt: 5, pb: 8 }}>
        <CourseIcon />
      </Box>
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        courseIds={courseOrders}
      />
      {children}
    </Container>
  );
}
