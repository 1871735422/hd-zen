import { getCourseById, getCourseTopicsByCourse } from '@/app/api';
import CourseCard from '@/app/components/pc/CourseCard';
import { Box, Container, Grid, Typography } from '@mui/material';
import { notFound } from 'next/navigation';

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = await params;
  const courseId = resolvedParams.slug;

  try {
    // Fetch course details and topics
    const [course, courseTopicsResult] = await Promise.all([
      getCourseById(courseId),
      getCourseTopicsByCourse(courseId)
    ]);

    console.log('Course found:', course?.title || 'null');
    console.log('Course topics count:', courseTopicsResult.items.length);

    // If course is not found, show not found
    if (!course) {
      console.log('Course not found, calling notFound()');
      notFound();
    }

    const courseTopics = courseTopicsResult.items;
    console.log('Rendering course page for:', course.title);

    return (
      <Container
        maxWidth='lg'
        sx={{
          backgroundImage: 'url(/images/sun-bg@2x.webp)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          py: 4,
        }}
      >

        {/* Course Topics Grid */}
        <Grid container spacing={4}>
          {courseTopics.map((topic, index) => (
            <Grid key={topic.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CourseCard
                item={{
                  id: index + 1, // For display purposes
                  title: topic.article_title || topic.title,
                  description: topic.article_introtext || topic.description ||
                    `${topic.article_title} - 了解更多关于这个话题的详细内容。`,
                }}
                topicId={topic.id}
                courseId={courseId}
              />
            </Grid>
          ))}
        </Grid>

        {/* Empty state */}
        {courseTopics.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant='h6' sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              此课程暂无可用的主题内容
            </Typography>
          </Box>
        )}
      </Container>
    );
  } catch (error) {
    console.error('Error loading course:', error);
    // Instead of calling notFound(), let's render an error state
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h4' component='h1' sx={{ mb: 2 }}>
            加载课程时出错
          </Typography>
          <Typography variant='body1' sx={{ mb: 2 }}>
            课程ID: {courseId}
          </Typography>
          <Typography variant='body2' sx={{ color: 'error.main' }}>
            错误信息: {error instanceof Error ? error.message : '未知错误'}
          </Typography>
        </Box>
      </Container>
    );
  }
}
