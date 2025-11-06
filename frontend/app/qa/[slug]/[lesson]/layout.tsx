import CategorySelector from '@/app/components/pc/CategorySelector';
import AppBreadcrumbs, {
  BreadcrumbProvider,
} from '@/app/components/shared/AppBreadcrumbs';
import { buildLessonsTitle } from '@/app/utils/courseUtils';
import { pxToVw } from '@/app/utils/mobileUtils';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { Box, Container, Stack } from '@mui/material';
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

  // 检测设备类型
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  const course = await getCourseByDisplayOrder(courseOrder);
  const courseId = course?.id || '';
  const { items: courseTopics } = await getCourseTopicsByCourse(courseId);
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

  return (
    <BreadcrumbProvider>
      {/* PC 端显示 CategorySelector */}
      {!isMobile && (
        <Box mb={3}>
          <CategorySelector
            categories={buildLessonsTitle(courseTopics.length)}
            selectedCategory={
              buildLessonsTitle(courseTopics.length)[Number(lessonOrder) - 1]
            }
          />
        </Box>
      )}

      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 !important',
          ml: 0,
        }}
      >
        {/* 面包屑导航 - 移动端和PC端都显示，但样式不同 */}
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
            px: isMobile ? pxToVw(15) : 0,
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
