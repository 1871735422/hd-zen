import AppBreadcrumbs, {
  BreadcrumbProvider,
} from '@/app/components/pc/AppBreadcrumbs';
import CategorySelector from '@/app/components/pc/CategorySelector';
import { Container, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { getCourseById, getCourses } from '../../api';

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
    getCourseById(slug),
    getCourses()
  ]);
  
  if (!course) {
    notFound();
  }

  const categories = coursesResult.items.map(item => item.title);
  const courseIds = coursesResult.items.map(item => item.id);
  const selectedCategory = course.title;

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '慧灯禅修课', href: '/course' },
    { label: course.title, href: `/course/${slug}` },
  ];

  return (
    <BreadcrumbProvider>
      <Container
        maxWidth='lg'
        sx={{
          backgroundImage: 'url(/images/sun-bg@2x.webp)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant='h1' fontWeight={600} fontSize={24} pt={5}>
          慧灯禅修课
        </Typography>
        <Typography variant='body1' color='rgba(127, 173, 235, 1)' p={2}>
          这里随便写一点，慧灯禅修课的简介，写的什么呢，就是。这里随便写一点，学修参考资料的简介
        </Typography>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          courseIds={courseIds}
        />
        <AppBreadcrumbs items={breadcrumbItems} useContext={true} />
        {children}
      </Container>
    </BreadcrumbProvider>
  );
}
