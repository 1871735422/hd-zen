import AppBreadcrumbs, {
  BreadcrumbProvider,
} from '@/app/components/pc/AppBreadcrumbs';
import CategorySelector from '@/app/components/pc/CategorySelector';
import { buildLessonsTitle } from '@/app/utils/courseUtils';
import { Box, Container } from '@mui/material';
import { getCourseByDisplayOrder, getCourseTopicsByCourse } from '../../../api';

const LessonLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; lesson: string }>;
}) => {
  const { slug: courseOrder, lesson } = await params;
  const lessonOrder = lesson.replace('lesson', '');
  const course = await getCourseByDisplayOrder(courseOrder);
  // console.log('course', course);
  const courseId = course?.id || '';
  const { items: courseTopics } = await getCourseTopicsByCourse(courseId);
  // console.log('courseTopics', courseTopics);
  const courseName = course?.title ?? '';
  const lessonName =
    courseTopics.find(topic => topic.ordering + '' === lessonOrder)?.title ??
    '';
  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '禅修课问答', href: '/qa' },
    { label: courseName, href: `/qa/${courseOrder}` },
    {
      label: lessonName,
      href: `/qa/${courseOrder}/lesson${lessonOrder}`,
    },
  ];

  const categories = buildLessonsTitle(courseTopics.length);
  const selectedCategory = categories[Number(lessonOrder) - 1];

  return (
    <>
      <Box mb={3}>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
        />
      </Box>
      <BreadcrumbProvider>
        <Container
          maxWidth={false}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 !important',
            ml: 0,
          }}
        >
          <AppBreadcrumbs items={breadcrumbItems} useContext={true} />
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              pb: 5,
              mb: 5,
              borderRadius: 5,
            }}
          >
            {children}
          </Box>
        </Container>
      </BreadcrumbProvider>
    </>
  );
};

export default LessonLayout;
