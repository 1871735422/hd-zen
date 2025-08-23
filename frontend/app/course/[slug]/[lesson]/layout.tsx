import AppBreadcrumbs, {
  BreadcrumbProvider,
} from '@/app/components/pc/AppBreadcrumbs';
import { Box, Container } from '@mui/material';
import {
  getCategories,
  getCourseByDisplayOrder,
  getCourseTopicsByCourse,
} from '../../../api';

const LessonLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; lesson: string }>;
}) => {
  const resolvedParams = await params;
  const courseOrder = resolvedParams.slug;
  const lessonOrder = resolvedParams.lesson.replace('lesson', '');
  // console.log({courseOrder,lessonOrder});

  const course = await getCourseByDisplayOrder(courseOrder);
  const courseId = course?.id || '';
  const { items: courseTopics } = await getCourseTopicsByCourse(courseId);
  const lessonCrumbLabel =
    courseTopics.find(topic => topic.ordering + '' === lessonOrder)?.title ??
    '';
  const menuData = await getCategories('慧灯禅修课');
  const courseName =
    menuData[0].subMenu?.find(item => item.slug === courseOrder)?.name ?? '';

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '慧灯禅修课', href: '/course' },
    { label: courseName, href: `/course/${courseOrder}` },
    {
      label: lessonCrumbLabel,
      href: `/course/${courseOrder}/lesson${lessonOrder}`,
    },
  ];

  return (
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
  );
};

export default LessonLayout;
