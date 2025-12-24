import {
  getAnswerMediasByOrder,
  getContentWaitingForUpdateText,
  getCourses,
} from '@/app/api';
import CourseCard from '@/app/components/pc/CourseCard';
import DownloadQaResource from '@/app/components/shared/DownloadQaResource';
import { getDeviceTypeFromHeaders } from '@/app/utils/serverDeviceUtils';
import { Grid, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
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

  let hintText = '';
  try {
    hintText = await getContentWaitingForUpdateText();
    // console.log({ result });

    // 获取所有问答数据（未过滤 topic），已按 topicTitle 分组
    const questionsGrouped = await getAnswerMediasByOrder(displayOrder);

    // 构建侧边栏数据：应用与 categories 相同的数据处理逻辑，使用真实课名
    const sidebarData = questionsGrouped.map(group => ({
      label: group.topicTitle,
      path: `/qa/${displayOrder}?tab=lesson${group.questions[0].topicOrder}`,
      displayOrder: group.questions[0].topicOrder,
    }));

    // 根据当前选中的 lessonOrder 过滤问题
    const currentGroup = questionsGrouped.find(
      group => group.questions[0].topicOrder === Number(lessonOrder)
    );

    // 过滤问题：只显示 isActive: true 的问题
    const allQuestions = currentGroup?.questions || [];
    const activeQuestions = allQuestions.filter(q => q.isActive === true);
    const hasInactiveQuestions = allQuestions.some(q => q.isActive === false);

    // 如果有 isActive: true 的问题，正常显示；如果都是 false，显示"即将推出"
    const questions = activeQuestions;
    const showComingSoon = hasInactiveQuestions && activeQuestions.length === 0;

    const MobileQaPage = dynamic(
      () => import('../../components/mobile/MobileQaPage'),
      { ssr: true }
    );

    if (isMobile) {
      return (
        <MobileQaPage
          courseOrder={displayOrder}
          sidebarData={sidebarData}
          questions={questions}
          selectedLessonOrder={lessonOrder}
          showComingSoon={showComingSoon}
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
          {sidebarData.length > 0 ? (
            <Grid size={3}>
              <QaSidebar
                lesson={sidebarData}
                selectedIdx={sidebarData.findIndex(
                  item => item.displayOrder === Number(lessonOrder)
                )}
              />
            </Grid>
          ) : (
            <Typography variant='h5' sx={{ p: 5 }}>
              {hintText}
            </Typography>
          )}
          <Grid
            container
            spacing={3.5}
            sx={{
              px: 3,
              pt: 5,
              pb: 5,
              height: 'fit-content',
              display: questions.length > 0 ? 'flex' : 'none',
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
