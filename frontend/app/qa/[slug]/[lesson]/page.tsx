import {
  getAnswerMediasByOrder,
  getCourseByDisplayOrder,
  getCourses,
  getCourseTopicsByCourse,
} from '@/app/api';
import LessonMeta from '@/app/components/pc/LessonMeta';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import QaSidebar from '@/app/components/pc/QaSidebar';
import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { CourseTopic } from '@/app/types/models';
import { formatDate } from '@/app/utils/courseUtils';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

interface LessonPageProps {
  params: Promise<{ slug: string; lesson: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LessonPage = async ({ params, searchParams }: LessonPageProps) => {
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

  if (!questions.length) {
    notFound();
  }
  const currentQuestion = questions[Number(questionOrder) - 1];

  return (
    <Container
      maxWidth='lg'
      sx={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        pb: 4,
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
          <QaSidebar
            lesson={questions.map(question => ({
              label: question.questionTitle || '',
              path: `/qa/${courseOrder}/lesson${lessonOrder}?tab=question${question.questionOrder}`,
            }))}
            selectedIdx={Number(questionOrder) - 1}
          />
        </Grid>
        <Grid container spacing={4} sx={{ px: 3, py: 4 }} size={9}>
          <Box
            sx={{
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              pb: 5,
              px: 3.5,
              borderRadius: 5,
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <LessonMeta
                title={currentQuestion?.questionTitle}
                author='作者：慈诚罗珠堪布'
                date={formatDate(currentQuestion?.questionCreated)}
                refCourse={`${courseName} > ${lessonName}`}
                refUrl={`/course/${courseOrder}/lesson${lessonOrder}`}
              />
            </Box>
            <>
              <MediaDownloadButton
                sx={{
                  alignSelf: 'flex-end',
                  my: -3,
                }}
                mediaType='video'
                downloadUrls={[currentQuestion.url_downmp4 || '']}
              />
              {currentQuestion.url_hd && (
                <>
                  {currentQuestion.url_hd ? (
                    <VideoPlayer
                      poster={
                        currentQuestion.url_image ||
                        currentQuestion.image1_url ||
                        ''
                      }
                      title={''}
                      sources={[
                        {
                          src: currentQuestion.url_hd,
                          quality: 'HD',
                          label: '高清',
                        },
                        {
                          src: currentQuestion.url_sd || currentQuestion.url_hd,
                          quality: 'SD',
                          label: '标清',
                        },
                      ]}
                    />
                  ) : (
                    <Typography>
                      视频资源不可用：{currentQuestion.title}{' '}
                    </Typography>
                  )}
                </>
              )}
              <Stack
                direction='row'
                justifyContent='space-between'
                sx={{
                  '& .MuiButton-root': {
                    backgroundColor: 'rgba(240, 247, 255, 1)',
                    py: 0.5,
                    px: 2,
                    borderRadius: '20px',
                  },
                  '& .MuiButton-root>a': {
                    color: 'rgba(127, 173, 235, 1)',
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: '0 !important',
                    fontWeight: 300,
                  },
                  '& .MuiButton-endIcon': {
                    marginLeft: '0 !important',
                  },
                }}
              >
                <Button
                  startIcon={<ArrowBackIosIcon />}
                  disabled={parseInt(questionOrder) <= 1}
                >
                  <Link
                    href={`/qa/${courseOrder}/lesson${lessonOrder}?tab=question${parseInt(questionOrder) - 1}`}
                  >
                    上一个
                  </Link>
                </Button>
                <Button
                  disabled={parseInt(questionOrder) >= questions.length}
                  endIcon={<ArrowForwardIosIcon />}
                >
                  <Link
                    href={`/qa/${courseOrder}/lesson${lessonOrder}?tab=question${parseInt(questionOrder) + 1}`}
                  >
                    下一个
                  </Link>
                </Button>
              </Stack>
            </>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LessonPage;
