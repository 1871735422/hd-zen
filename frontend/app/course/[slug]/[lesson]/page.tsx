import AudioPage from '@/app/components/pc/AudioPage';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import ReadingPage from '@/app/components/pc/ReadingPage';
import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { Box, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { Metadata } from 'next/types';
import { Fragment } from 'react';
import {
  getCourses,
  getCourseTopicsByCourse,
  getTopicMediaByOrder,
} from '../../../api';
import LessonMeta from '../../../components/pc/LessonMeta';
import LessonSidebar from '../../../components/pc/LessonSidebar';
import { CourseTopic } from '../../../types/models';

// 15分钟缓存
export const revalidate = 900;

// 生成静态参数 - 嵌套动态路由必须预生成
export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [];

  try {
    const { items: courses } = await getCourses();
    const allParams: { slug: string; lesson: string }[] = [];

    for (const course of courses) {
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );
        const { items: topics } = (await Promise.race([
          getCourseTopicsByCourse(course.id),
          timeout,
        ])) as { items: CourseTopic[] };

        for (const topic of topics) {
          allParams.push({
            slug: course.displayOrder.toString(),
            lesson: `lesson${topic.ordering}`,
          });
        }
      } catch {
        allParams.push({
          slug: course.displayOrder.toString(),
          lesson: 'lesson1',
        });
      }
    }
    return allParams;
  } catch {
    return [];
  }
}
export async function generateMetadata({
  params,
}: {
  params: { slug: string; lesson: string };
}): Promise<Metadata | undefined> {
  const courseOrder = params.slug;
  const lessonOrder = params.lesson?.replace('lesson', '');

  // 获取课程和课题信息
  const { items: courses } = await getCourses();
  const course = courses.find(c => c.displayOrder.toString() === courseOrder);

  const { items: topics } = await getCourseTopicsByCourse(course?.id ?? '');
  const topic = topics.find(t => `lesson${t.ordering}` === params.lesson);

  const topicMedia = await getTopicMediaByOrder(courseOrder, lessonOrder);
  const media = topicMedia?.[0];

  if (!course || !topic || !media) return;

  const url = `https://www.example.com/course/${courseOrder}/lesson${lessonOrder}`;
  const title = `${media.title || topic.title || '课程'} | 慧灯禅修`;
  const description =
    media.article_summary ||
    media.article_introtext ||
    topic.title ||
    course.title;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: media.created,
      authors: ['作者：慈诚罗珠堪布'],
    },
  };
}
interface LessonPageProps {
  params: Promise<{ slug: string; lesson: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LessonPage = async ({ params, searchParams }: LessonPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { tab: selectedKey } = resolvedSearchParams;
  const courseOrder = resolvedParams.slug;
  const lessonOrder = resolvedParams.lesson?.replace('lesson', '');

  // 总是需要获取 topicMedia 数据
  const topicMedia = await getTopicMediaByOrder(courseOrder, lessonOrder);
  // console.log('topicMedia', topicMedia);

  if (!topicMedia) {
    notFound();
  }
  const media = topicMedia[0];
  const topicTags = media?.tags;
  const excludeLabels = [''];
  if (!media?.url_hd && !media.url_sd) {
    excludeLabels.push('视频');
  }
  if (!media?.url_mp3) {
    excludeLabels.push('音频');
  }
  if (!media?.article_introtext && media?.article_fulltext) {
    excludeLabels.push('文字');
  }

  const TabRender = () => {
    if (
      selectedKey === 'audio' ||
      (excludeLabels?.includes('视频') && media?.url_mp3)
    )
      return <AudioPage topicMedia={topicMedia} />;
    if (
      selectedKey === 'article' ||
      (excludeLabels?.includes('视频') && !media?.mp3_duration)
    ) {
      const isReadingMode = resolvedSearchParams.readingMode === 'true';
      return (
        <ReadingPage topicMediaX={topicMedia} isReadingMode={isReadingMode} />
      );
    }

    // 默认视频 tab 组件
    const downloadUrls = topicMedia
      .map(media => media?.url_downmp4)
      .filter(url => url !== undefined);

    return (
      <>
        <MediaDownloadButton
          sx={{
            alignSelf: 'flex-end',
            my: -4,
          }}
          mediaType='video'
          downloadUrls={downloadUrls}
        />
        {topicMedia.map(media => (
          <Fragment key={media.id}>
            {media?.url_hd ? (
              <VideoPlayer
                poster={media?.url_image || media?.image1_url || ''}
                title={media?.title || ''}
                sources={[
                  {
                    src: media?.url_hd,
                    quality: 'HD',
                    label: '高清',
                  },
                  {
                    src: media?.url_sd || media?.url_hd,
                    quality: 'SD',
                    label: '标清',
                  },
                ]}
              />
            ) : (
              <Typography>视频资源不可用：{media?.title} </Typography>
            )}
          </Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      <LessonSidebar
        excludeLabels={excludeLabels}
        selectedKey={selectedKey?.toString()}
        path={`/course/${courseOrder}/lesson${lessonOrder}`}
      />
      <Box
        sx={{
          backgroundColor: 'white',
          ml: '5%',
          pl: { lg: 14, xl: 21 },
          pr: { lg: 18, xl: 26 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 5,
          borderRadius: '25px',
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
            title={topicMedia[0]?.title}
            tags={
              topicTags?.length
                ? topicTags.map((tag: string) => tag.trim())
                : []
            }
            description={topicMedia[0]?.article_summary ?? ''}
            author='作者：慈诚罗珠堪布'
            date={topicMedia[0]?.created}
          />
        </Box>
        <TabRender />
      </Box>
    </>
  );
};

export default LessonPage;
