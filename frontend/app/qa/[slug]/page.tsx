import { getCourseByDisplayOrder, getCourseTopicsByCourse } from '@/app/api';
import CourseCard from '@/app/components/pc/CourseCard';
import { Container, Grid } from '@mui/material';
import { notFound } from 'next/navigation';
import QaSidebar from '../../components/pc/QaSidebar';

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function QaPage({ params }: CoursePageProps) {
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
    const sidebarData = courseTopics.map(item => ({
      label: item.title,
      path: '',
    }));

    return (
      <Container
        maxWidth='lg'
        sx={{
          backgroundImage: 'url(/images/course-lesson-bg.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          py: 4,
          px: '0 !important',
        }}
      >
        <Grid
          container
          sx={{
            backgroundColor: '#fff',
            borderRadius: 5,
            py: 0,
            mb: 5,
            height: 'fit-content',
          }}
        >
          <Grid size={3}>
            <QaSidebar lesson={sidebarData} selectedIdx={0} />
          </Grid>
          <Grid container spacing={4} sx={{ px: 3, py: 4 }} size={9}>
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
                  slug='qa'
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Container>
    );
  } catch (error) {
    console.error('Error loading course:', error);
  }
}
