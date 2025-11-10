import AppBreadcrumbs, {
  BreadcrumbProvider,
} from '@/app/components/shared/AppBreadcrumbs';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Box, Container, Stack } from '@mui/material';
import {
  getCategories,
  getCourseByDisplayOrder,
  getCourseTopicsByCourse,
} from '../../../api';
import { getDeviceTypeFromHeaders } from '../../../utils/serverDeviceUtils';

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

  // 设备检测
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  const course = await getCourseByDisplayOrder(courseOrder);
  const courseId = course?.id || '';
  const { items: courseTopics } = (await getCourseTopicsByCourse(courseId)) || {
    items: [],
  };
  const lessonCrumbLabel =
    courseTopics.find(topic => topic.ordering + '' === lessonOrder)?.title ??
    '';
  const menuData = await getCategories('慧灯禅修课');
  const courseName =
    menuData[0]?.subMenu?.find(item => item.slug === courseOrder)?.name ?? '';

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
        <Stack
          sx={{
            pt: isMobile ? pxToVw(8) : 0,
            pl: isMobile ? pxToVw(18) : 0,
            backgroundColor: 'transparent',
          }}
        >
          <AppBreadcrumbs
            color={isMobile ? 'rgba(86, 137, 204, 1)' : undefined}
            items={breadcrumbItems}
            useContext={true}
          />
        </Stack>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: isMobile ? 'visible' : 'hidden',
            pb: isMobile ? 0 : 5,
            mb: isMobile ? 0 : 5,
            borderRadius: isMobile ? 0 : 5,
          }}
        >
          {children}
        </Box>
      </Container>
    </BreadcrumbProvider>
  );
};

export default LessonLayout;
