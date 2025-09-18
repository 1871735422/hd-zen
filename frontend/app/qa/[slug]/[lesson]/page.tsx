import {
  getTopicMediaByOrder,
  getCourses,
  getCourseTopicsByCourse,
} from '@/app/api';
import { CourseTopic } from '@/app/types/models';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import AudioPage from '../../../components/pc/AudioPage';
import LessonMeta from '../../../components/pc/LessonMeta';

// 15分钟缓存
export const revalidate = 900;

// 生成静态参数 - QA 嵌套动态路由必须预生成
export async function generateStaticParams() {
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
    // 返回一些默认参数，避免完全失败
    return [
      { slug: '1', lesson: 'lesson1' },
      { slug: '2', lesson: 'lesson1' },
      { slug: '3', lesson: 'lesson1' },
    ];
  }
}

interface LessonPageProps {
  params: Promise<{ slug: string; lesson: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LessonPage = async ({ params, searchParams }: LessonPageProps) => {
  const resolvedParams = await params;
  const { tab: selectedKey } = await searchParams;
  const courseOrder = resolvedParams.slug;
  const lessonOrder = resolvedParams.lesson?.replace('lesson', '');
  const res = await getTopicMediaByOrder(courseOrder, lessonOrder);
  const topicMedia = res?.items;

  if (!topicMedia) {
    notFound();
  }

  const topicTags = topicMedia[0]?.media?.tags;

  const TabRender = () => {
    if (selectedKey === 'audio') return <AudioPage topicMedia={topicMedia} />;

    return (
      <>
        <MediaDownloadButton
          sx={{
            alignSelf: 'flex-end',
            my: -3,
          }}
          mediaType='video'
          downloadUrls={topicMedia.map(media => media.media?.url_downmp4 || '')}
        />
        {topicMedia.map(media => (
          <Fragment key={media.id}>
            <VideoPlayer
              poster={media.media?.url_image || media.media?.image1_url || ''}
              title={media.media?.title || ''}
              src={media.media?.url_hd || media.media?.high_quality_url || ''}
            />
          </Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <LessonMeta
          title={topicMedia[0]?.media!.title}
          tags={
            topicTags?.length ? topicTags.map((tag: string) => tag.trim()) : []
          }
          description={topicMedia[0]?.media!.summary ?? ''}
          author='作者：慈诚罗珠堪布'
          date={
            topicMedia[0]?.media!.created
              ? new Date(topicMedia[0].media.created).toLocaleDateString(
                  'zh-CN'
                )
              : ''
          }
        />
        <TabRender />
      </Box>
    </>
  );
};

export default LessonPage;
