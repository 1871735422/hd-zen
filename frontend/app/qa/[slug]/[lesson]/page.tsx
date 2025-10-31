import {
  getAnswerMediasByOrder,
  getCourseByDisplayOrder,
  getCourses,
  getCourseTopicsByCourse,
} from '@/app/api';
import QaClientWrapper from './QaClientWrapper';
import { CourseTopic } from '@/app/types/models';
import { Container, Typography } from '@mui/material';

// 15分钟缓存
export const revalidate = 900;

// 生成静态参数 - QA 嵌套动态路由必须预生成
export async function generateStaticParams() {
  // 开发环境跳过预获取，避免开发时慢
  if (process.env.NODE_ENV === 'development') {
    return [];
  }

  try {
    const { items: courses } = await getCourses();
    const allParams = [];

    // 处理所有课程，确保完整的 SSG 构建
    const maxCourses = courses.length;

    for (let i = 0; i < maxCourses; i++) {
      const course = courses[i];
      try {
        // 添加超时控制
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );

        const topicsPromise = getCourseTopicsByCourse(course.id);
        const { items: topics } = (await Promise.race([
          topicsPromise,
          timeoutPromise,
        ])) as { items: CourseTopic[] };

        // 处理所有课时，确保完整的 SSG 构建
        const maxTopics = topics.length;

        // 为每个课时生成参数
        for (let j = 0; j < maxTopics; j++) {
          const topic = topics[j];
          allParams.push({
            slug: course.displayOrder.toString(),
            lesson: `lesson${topic.ordering}`,
          });
        }
      } catch (error) {
        console.error(`Error fetching topics for course ${course.id}:`, error);
        // 如果获取课时失败，至少生成课程参数
        allParams.push({
          slug: course.displayOrder.toString(),
          lesson: 'lesson1', // 默认第一个课时
        });
      }
    }

    console.log(
      `Generated ${allParams.length} QA lesson params (limited to ${maxCourses} courses)`
    );
    return allParams;
  } catch (error) {
    console.error('Error generating static params for QA lessons:', error);
    return [];
  }
}

interface qaPageProps {
  params: Promise<{ slug: string; lesson: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const qaPage = async ({ params, searchParams }: qaPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const questionOrder =
    typeof resolvedSearchParams.tab === 'string' && resolvedSearchParams.tab
      ? resolvedSearchParams.tab.replace('question', '')
      : '1';
  const courseOrder = resolvedParams.slug;
  const lessonOrder = resolvedParams.lesson?.replace('lesson', '');

  // 获取课程和课时信息
  const course = await getCourseByDisplayOrder(courseOrder);
  const courseId = course?.id || '';
  const { items: courseTopics } = await getCourseTopicsByCourse(courseId);
  const courseName = course?.title ?? '';
  const lessonName =
    courseTopics.find(topic => topic.ordering + '' === lessonOrder)?.title ??
    '';

  // 获取问题和答案
  const questions = await getAnswerMediasByOrder(
    courseOrder,
    lessonOrder,
    undefined,
    true
  );
  // console.log('questions', questions);

  if (!questions.length) {
    return (
      <Typography variant='h5' textAlign='center'>
        即将推出
      </Typography>
    );
  }
  const currentIndex = questions.findIndex(
    question => question.questionOrder + '' === questionOrder
  );

  // Narrow questions to the client wrapper's expected shape without using any
  type QLite = {
    questionOrder: number;
    questionTitle?: string;
    questionCreated?: string;
    title?: string;
    url_sd?: string;
    url_hd?: string;
    url_image?: string;
    url_downmp4?: string;
  };

  return (
    <Container
      maxWidth='xl'
      sx={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        pb: 4,
        px: '0 !important',
      }}
    >
      <QaClientWrapper
        questions={questions as unknown as QLite[]}
        initialIndex={currentIndex < 0 ? 0 : currentIndex}
        courseOrder={courseOrder}
        lessonOrder={lessonOrder}
        courseName={courseName}
        lessonName={lessonName}
      />
    </Container>
  );
};

export default qaPage;
