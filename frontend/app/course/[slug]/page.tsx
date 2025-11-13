import {
  getCourseByDisplayOrder,
  getCourseTopicsByCourse,
  getCourses,
} from '@/app/api';
import MobileCoursePage from '@/app/components/mobile/MobileCoursePage';
import MobileVolumeNavigation from '@/app/components/mobile/MobileVolumeNavigation';
import CourseCard from '@/app/components/pc/CourseCard';
import { pxToVw } from '@/app/utils/mobileUtils';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { Box, Container, Typography } from '@mui/material';
import { notFound } from 'next/navigation';

// 15分钟缓存
export const revalidate = 900;

// 生成静态参数 - 最佳解决方案
export async function generateStaticParams() {
  try {
    const { items: courses } = await getCourses();
    return courses.map(course => ({
      slug: course.displayOrder.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = await params;
  const displayOrder = resolvedParams.slug;
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  try {
    // Fetch course details and topics
    const course = await getCourseByDisplayOrder(displayOrder);
    const courseId = course?.id || '';
    const courseTopicsResult = await getCourseTopicsByCourse(courseId);
    // console.log({ courseTopicsResult });
    // If course is not found, show not found
    if (!course) {
      notFound();
    }

    const courseTopics = courseTopicsResult.items;

    // 移动端：使用移动端组件
    if (isMobile) {
      return (
        <>
          {/* 导航按钮 */}
          <MobileVolumeNavigation type='course' />
          <Box px={pxToVw(16)}>
            {/* 描述文字块 */}
            <Typography
              sx={{
                fontSize: pxToVw(16),
                color: 'rgba(67, 109, 186, 1)',
                lineHeight: 1.5,
                px: pxToVw(15),
                py: pxToVw(15),
                marginBottom: pxToVw(18),
                background:
                  'linear-gradient(175.97deg, rgba(232, 247, 255, 1) 0%, rgba(224, 226, 255, 1) 99.94%) ',
                borderRadius: pxToVw(12),
              }}
            >
              {course?.description}
            </Typography>
            <MobileCoursePage
              courseTopics={courseTopics}
              courseOrder={displayOrder}
              courseType={'course'}
            />
          </Box>
        </>
      );
    }

    // PC端：使用原有布局
    return (
      <Container
        maxWidth='xl'
        sx={{
          py: { lg: 3, xl: 5 },
          paddingX: '0px !important',
        }}
      >
        {/* Course Topics Flex Layout */}
        <Box>
          {(() => {
            const rows = [];
            for (let i = 0; i < courseTopics.length; i += 3) {
              const rowItems = courseTopics.slice(i, i + 3);
              rows.push(
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent:
                      rowItems.length === 3 ? 'space-between' : 'flex-start',
                    gap:
                      rowItems.length < 3
                        ? {
                            lg: `calc((100% - 330px * 3) / 2) `,
                            xl: `calc((100% - 437px * 3) / 2) `,
                          }
                        : 0,
                    mb: 5,
                  }}
                >
                  {rowItems.map(topic => (
                    <CourseCard
                      key={topic.id}
                      item={{
                        idx: topic.ordering,
                        title: topic.article_title || topic.title || '',
                        description:
                          topic.article_summary ||
                          topic.description ||
                          topic.article_introtext ||
                          '',
                      }}
                      courseOrder={course.displayOrder}
                      slug='course'
                    />
                  ))}
                </Box>
              );
            }
            return rows;
          })()}
        </Box>

        {/* Empty state */}
        {courseTopics.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant='h6' sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              此课程暂无内容
            </Typography>
          </Box>
        )}
      </Container>
    );
  } catch (error) {
    console.error('Error loading course:', error);
  }
}
