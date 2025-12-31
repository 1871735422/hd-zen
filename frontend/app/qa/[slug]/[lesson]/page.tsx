import {
  getAnswerMediasByOrder,
  getCourses,
  getCourseTopicsByCourse,
} from '@/app/api';
import NotFound from '@/app/not-found';
import { CourseTopic } from '@/app/types/models';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { Container } from '@mui/material';
import dynamic from 'next/dynamic';
import { Metadata } from 'next/types';
import QaClientWrapper from '../../../components/pc/QaClientWrapper';

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}): Promise<Metadata | undefined> {
  const resolvedParams = await params;
  const courseOrder = resolvedParams.slug;
  const lessonOrder = resolvedParams.lesson?.replace('lesson', '');

  try {
    // 获取课程和课题信息
    const { items: courses } = await getCourses();
    const course = courses.find(c => c.displayOrder.toString() === courseOrder);

    const { items: topics } = (await getCourseTopicsByCourse(
      course?.id ?? ''
    )) || { items: [] };
    const topic = topics.find(
      t => `lesson${t.ordering}` === resolvedParams.lesson
    );

    // 获取问答数据
    const questionsGrouped = await getAnswerMediasByOrder(
      courseOrder,
      lessonOrder,
      true
    );
    const questions = questionsGrouped.flatMap(group => group.questions);

    if (!course || !topic || !questions.length) return;

    const url = `/qa/${courseOrder}/lesson${lessonOrder}`;
    const title = `${topic.title} - 问答`;
    const description = `${course.title} - ${topic.title} 的问答内容`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'article',
      },
    };
  } catch (error) {
    console.error('Error generating metadata for QA page:', error);
    return;
  }
}

interface qaPageProps {
  params: Promise<{ slug: string; lesson: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const qaPage = async ({ params, searchParams }: qaPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const questionOrder = Number(
    typeof resolvedSearchParams.tab === 'string' && resolvedSearchParams.tab
      ? resolvedSearchParams.tab.replace('question', '')
      : '1'
  );
  const courseOrder = resolvedParams.slug;
  const lessonOrder = resolvedParams.lesson?.replace('lesson', '');

  // 服务端检测设备类型
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  // 获取问题和答案（已按 topicTitle 分组）
  const questionsGrouped = await getAnswerMediasByOrder(
    courseOrder,
    lessonOrder,
    true
  );
  // 展平分组数据以便查找和遍历
  const questions = questionsGrouped.flatMap(group => group.questions);
  const courseName = questions[0]?.courseTitle ?? '';
  const lessonName = questions[0]?.topicTitle ?? '';
  // console.log('questionsGrouped', questionsGrouped);

  if (!questions.length) {
    return <NotFound />;
  }

  // Narrow questions to the client wrapper's expected shape without using any
  type QLite = {
    questionOrder: number;
    questionTitle?: string;
    media_author?: string;
    media_date?: string;
    title?: string;
    url_sd?: string;
    url_hd?: string;
    url_image?: string;
    url_downmp4?: string;
  };

  const questionsData = questions as unknown as QLite[];
  // console.log('questionsData', questionsData);
  const initialIdx = questionOrder - 1;
  const MobileQaLessonPage = dynamic(
    () => import('@/app/components/mobile/MobileQaLessonPage'),
    { ssr: true }
  );
  // 移动端渲染
  if (isMobile) {
    return (
      <MobileQaLessonPage
        questions={questionsData}
        initialIndex={initialIdx}
        courseOrder={courseOrder}
        lessonOrder={lessonOrder}
        courseName={courseName}
        lessonName={lessonName}
      />
    );
  }

  // PC 端渲染
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
        questions={questionsData}
        initialIndex={initialIdx}
        courseOrder={courseOrder}
        lessonOrder={lessonOrder}
        courseName={courseName}
        lessonName={lessonName}
      />
    </Container>
  );
};

export default qaPage;
