import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import VideoPlayer from '@/app/components/pc/VideoPlayer';
import NotFound from '@/app/not-found';
import { Box, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { getCourseTopicByOrder, getTopicMediaByOrder } from '../../../api';
import AudioPage from '../../../components/pc/AudioPage';
import LessonMeta from '../../../components/pc/LessonMeta';
import LessonSidebar from '../../../components/pc/LessonSidebar';
import ReadingPage from '../../../components/pc/ReadingPage';

// 15分钟缓存
export const revalidate = 900;

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
  const topicMediaRes = await getTopicMediaByOrder(courseOrder, lessonOrder);
  const topicMedia = topicMediaRes?.items;

  // 仅在 reading tab 时获取 topic 数据
  const topic =
    selectedKey === 'reading'
      ? await getCourseTopicByOrder(courseOrder, lessonOrder)
      : null;

  if (!topicMedia) {
    notFound();
  }

  const topicTags = topicMedia[0]?.media?.tags;

  const TabRender = () => {
    if (selectedKey === 'audio') return <AudioPage topicMedia={topicMedia} />;
    if (selectedKey === 'reading') {
      if (!topic) {
        return <NotFound />;
      }

      const isReadingMode = resolvedSearchParams.readingMode === 'true';
      return (
        <ReadingPage
          topic={topic}
          topicMedia={topicMedia}
          isReadingMode={isReadingMode}
        />
      );
    }

    const downloadUrls = topicMedia
      .map(media => media.media?.url_downmp4)
      .filter(url => url !== undefined);

    return (
      <>
        <MediaDownloadButton
          sx={{
            alignSelf: 'flex-end',
            my: -3,
          }}
          mediaType='video'
          downloadUrls={downloadUrls}
        />
        {topicMedia.map(media => (
          <Fragment key={media.id}>
            {media.media?.url_hd ? (
              <VideoPlayer
                poster={media.media?.url_image || media.media?.image1_url || ''}
                title={media.media?.title || ''}
                src={media.media?.url_hd}
              />
            ) : (
              <Typography>视频资源不可用：{media.media?.title} </Typography>
            )}
          </Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      <LessonSidebar
        selectedKey={selectedKey?.toString() ?? ''}
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
            title={topicMedia[0]?.media!.title}
            tags={
              topicTags?.length
                ? topicTags.map((tag: string) => tag.trim())
                : []
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
        </Box>
        <TabRender />
      </Box>
    </>
  );
};

export default LessonPage;
