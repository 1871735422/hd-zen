import {
  getCourses,
  getCourseTopicsByDisplayOrder,
  getQuestionsByOrder,
} from '@/app/api';
import CourseCard from '@/app/components/pc/CourseCard';
import { Container, Grid } from '@mui/material';
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
    const courseTopics = (await getCourseTopicsByDisplayOrder(displayOrder))
      ?.items;
    const questions = (await getQuestionsByOrder(displayOrder, lessonOrder))
      ?.items;

    // console.log({ courseTopics });
    console.log(questions);
    // console.log(questions.items[0]);

    const sidebarData = courseTopics
      .sort((a, b) => a.ordering - b.ordering)
      .map(item => ({
        label: item.article_title,
        path: `/qa/${displayOrder}?tab=lesson${item.ordering}`,
      }));

    return (
      <Container
        maxWidth='lg'
        sx={{
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
            mb: 9,
            height: 'fit-content',
          }}
        >
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
              pt: 4,
              pb: 5,
              height: 'fit-content',
            }}
            size={9}
          >
            {questions.map((question, idx) => (
              <Grid key={question.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CourseCard
                  item={{
                    idx: Number(lessonOrder),
                    title: question.title || '',
                    description: question.description || '',
                  }}
                  courseOrder={Number(displayOrder)}
                  slug='qa'
                  questionOrder={idx + 1}
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
