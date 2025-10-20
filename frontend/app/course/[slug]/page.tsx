import {
  getCourseByDisplayOrder,
  getCourseTopicsByCourse,
  getCourses,
} from '@/app/api';
import CourseCard from '@/app/components/pc/CourseCard';
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

  try {
    // Fetch course details and topics
    const course = await getCourseByDisplayOrder(displayOrder);
    const courseId = course?.id || '';
    const courseTopicsResult = await getCourseTopicsByCourse(courseId);

    // If course is not found, show not found
    if (!course) {
      notFound();
    }

    const courseTopics = courseTopicsResult.items;

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
                    gap: rowItems.length < 3 ? 5 : 0,
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
                          topic.article_introtext || topic.description || '',
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
