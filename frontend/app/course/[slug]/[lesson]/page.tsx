import AudioPage from '@/app/components/pc/AudioPage';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import ReadingPage from '@/app/components/pc/ReadingPage';
import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { Box, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
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
      `Generated ${allParams.length} lesson params (limited to ${maxCourses} courses)`
    );
    return allParams;
  } catch (error) {
    console.error('Error generating static params for lessons:', error);
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
          pl: 14,
          pr: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 5,
          borderRadius: 5,
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
