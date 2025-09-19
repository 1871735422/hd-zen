import {
  getAnswerMediaByOrder,
  getCourseByDisplayOrder,
  getCourses,
  getCourseTopicsByCourse,
  getQuestionsByOrder,
} from '@/app/api';
import LessonMeta from '@/app/components/pc/LessonMeta';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import QaSidebar from '@/app/components/pc/QaSidebar';
import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { CourseTopic } from '@/app/types/models';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

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
  const questionsRes = await getQuestionsByOrder(courseOrder, lessonOrder);
  const answerMediaRes = await getAnswerMediaByOrder(
    courseOrder,
    lessonOrder,
    questionOrder
  );

  const questions = questionsRes?.items || [];
  // console.log(questions);
  console.log('answerMediaRes', answerMediaRes);

  if (!questions.length) {
    notFound();
  }

  return (
    <Container
      maxWidth='lg'
      sx={{
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
          <QaSidebar
            lesson={questions.map((question, idx) => ({
              label: question.title || '',
              path: `/qa/${courseOrder}/lesson${lessonOrder}?tab=question${idx + 1}`,
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
                title={
                  answerMediaRes?.media?.title
                    ? `${questionOrder}. ${answerMediaRes?.media?.title}`
                    : ''
                }
                tags={['智悲力', '禅修课', '中观', '大圆满']}
                description={
                  // answerMediaRes?.media?.summary ??
                  '想要度化众生，必须提升自己的智、悲、力，其中最重要的是智，即证悟心性的智慧。本课介绍了显宗中观、密宗气脉明点和大圆满三种证悟的方法，然后引用《大宝积经》中的偈颂，进一步阐明所要证悟的心的本性究竟为何。'
                }
                author='作者：慈诚罗珠堪布'
                date={
                  answerMediaRes?.created
                    ? new Date(answerMediaRes.created).toLocaleDateString(
                        'zh-CN'
                      )
                    : ''
                }
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
                downloadUrls={[answerMediaRes?.media?.url_downmp4 || '']}
              />
              {answerMediaRes?.media?.url_hd && (
                <Fragment key={answerMediaRes?.media?.id}>
                  {answerMediaRes?.media?.url_hd ? (
                    <VideoPlayer
                      poster={
                        answerMediaRes?.media?.url_image ||
                        answerMediaRes?.media?.image1_url ||
                        ''
                      }
                      title={''}
                      src={answerMediaRes?.media?.url_hd}
                    />
                  ) : (
                    <Typography>
                      视频资源不可用：{answerMediaRes?.media?.title}{' '}
                    </Typography>
                  )}
                </Fragment>
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
