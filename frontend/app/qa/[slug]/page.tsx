import {
  getAnswerMediasByOrder,
  getCourses,
  getCourseTopicsByDisplayOrder,
} from '@/app/api';
import MobileQaPage from '@/app/components/mobile/MobileQaPage';
import CourseCard from '@/app/components/pc/CourseCard';
import DownloadQaResource from '@/app/components/shared/DownloadQaResource';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { Grid, Typography } from '@mui/material';
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

  // 服务端检测设备类型
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';

  try {
    // 获取所有问答数据（未过滤 topic），已按 topicTitle 分组
    const questionsGrouped = await getAnswerMediasByOrder(displayOrder);

    // 获取课程主题信息，用于匹配 lessonOrder 和 topicTitle
    const courseTopics =
      (await getCourseTopicsByDisplayOrder(displayOrder))?.items || [];

    // 构建侧边栏数据：所有有问题数据的 topic 都显示
    const sidebarData = courseTopics
      .filter(topic => {
        const group = questionsGrouped.find(
          g => g.topicTitle === topic.article_title
        );
        return group && group.questions.length > 0;
      })
      .map(topic => ({
        label: topic.article_title,
        path: `/qa/${displayOrder}?tab=lesson${topic.ordering}`,
        displayOrder: topic.ordering,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);

    // 根据当前选中的 lessonOrder 过滤问题
    const currentTopic = courseTopics.find(
      topic => topic.ordering.toString() === lessonOrder
    );
    const currentGroup = questionsGrouped.find(
      group => group.topicTitle === currentTopic?.article_title
    );

    // 过滤问题：只显示 isActive: true 的问题
    const allQuestions = currentGroup?.questions || [];
    const activeQuestions = allQuestions.filter(q => q.isActive === true);
    const hasInactiveQuestions = allQuestions.some(q => q.isActive === false);

    // 如果有 isActive: true 的问题，正常显示；如果都是 false，显示"即将推出"
    const questions = activeQuestions;
    const showComingSoon = hasInactiveQuestions && activeQuestions.length === 0;
    if (isMobile) {
      return (
        <MobileQaPage
          courseOrder={displayOrder}
          courseTopics={courseTopics}
          questions={questions}
          selectedLessonOrder={lessonOrder}
        />
      );
    }

    return (
      <>
        <Grid
          container
          sx={{
            backgroundColor: '#fff',
            borderRadius: '25px',
            py: 0,
            mt: 7,
            mb: 9,
            height: 'fit-content',
            position: 'relative',
          }}
        >
          {sidebarData.length > 0 && (
            <DownloadQaResource
              courseOrder={displayOrder}
              lessonOrder={lessonOrder}
            />
          )}
          <Grid size={3}>
            {sidebarData.length > 0 ? (
              <QaSidebar
                lesson={sidebarData}
                selectedIdx={Number(lessonOrder) - 1}
              />
            ) : (
              <Typography variant='h5' sx={{ textAlign: 'center', py: 5 }}>
                本册暂无问答
              </Typography>
            )}
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
            {questions.map((question, idx) => (
              <Grid key={idx} size={4}>
                <CourseCard
                  item={{
                    idx: Number(lessonOrder),
                    title: question.questionTitle || '',
                    description: question.description || '',
                  }}
                  courseOrder={Number(displayOrder)}
                  slug='qa'
                  questionOrder={idx + 1}
                />
              </Grid>
            ))}
            {showComingSoon && (
              <Grid size={{ sm: 6, md: 4 }}>
                <Typography variant='h5'>即将推出</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </>
    );
  } catch (error) {
    console.error('Error loading course:', error);
  }
}
