import { getCourseByDisplayOrder, getCourseTopicsByCourse } from '@/app/api';
import CourseCard from '@/app/components/pc/CourseCard';
import { Box, Container, Grid, Typography } from '@mui/material';
import { notFound } from 'next/navigation';

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
        maxWidth='lg'
        sx={{
          py: 4,
        }}
      >
        {/* Course Topics Grid */}
        <Grid container spacing={4}>
          {courseTopics.map(topic => (
            <Grid key={topic.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CourseCard
                item={{
                  idx: topic.ordering,
                  title: topic.article_title || topic.title || '',
                  description:
                    topic.article_introtext || topic.description || '',
                }}
                courseOrder={course.displayOrder}
                slug='course'
              />
            </Grid>
          ))}
        </Grid>

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
