import {
  getAnswerMediasByOrder,
  getCourses,
  getCourseTopicsByDisplayOrder,
} from '@/app/api';
import CourseCard from '@/app/components/pc/CourseCard';
import DownloadQaResource from '@/app/components/shared/DownloadQaResource';
import { Container, Grid, Typography } from '@mui/material';
import QaSidebar from '../../components/pc/QaSidebar';

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

interface QaPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function QaPage({ params, searchParams }: QaPageProps) {
  const resolvedParams = await params;
  const displayOrder = resolvedParams.slug;
  const resolvedSearchParams = await searchParams;
  const lessonOrder =
    typeof resolvedSearchParams.tab === 'string' && resolvedSearchParams.tab
      ? resolvedSearchParams.tab.replace('lesson', '')
      : '1';

  try {
    // Fetch course details and topics
    const courseTopics =
      (await getCourseTopicsByDisplayOrder(displayOrder))?.items || [];
    const questions = await getAnswerMediasByOrder(displayOrder, lessonOrder);
    // console.log({ courseTopics, questions });
    const sidebarData = courseTopics.map(item => ({
      label: item.article_title,
      path: `/qa/${displayOrder}?tab=lesson${item.ordering}`,
    }));
    return (
      <Container
        maxWidth='xl'
        sx={{
          py: 5,
          px: '0 !important',
        }}
      >
        <Grid
          container
          sx={{
            backgroundColor: '#fff',
            borderRadius: '25px',
            py: 0,
            mb: 9,
            height: 'fit-content',
            position: 'relative',
          }}
        >
          <DownloadQaResource volumeName={questions[0]?.courseTitle} />
          <Grid size={3}>
            <QaSidebar
              lesson={sidebarData}
              selectedIdx={Number(lessonOrder) - 1}
            />
          </Grid>
          <Grid
            container
            spacing={3.5}
            sx={{
              px: 3,
              pt: 5,
              pb: 5,
              height: 'fit-content',
            }}
            size={9}
          >
            {questions.map(question => (
              <Grid key={question.questionOrder} size={{ sm: 6, md: 4 }}>
                <CourseCard
                  item={{
                    idx: Number(lessonOrder),
                    title: question.questionTitle || '',
                    description: question.description || '',
                  }}
                  courseOrder={Number(displayOrder)}
                  slug='qa'
                  questionOrder={question.questionOrder}
                />
              </Grid>
            ))}
            {questions.length === 0 && (
              <Grid size={{ sm: 6, md: 4 }}>
                <Typography variant='h5'>即将推出</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    );
  } catch (error) {
    console.error('Error loading course:', error);
  }
}
