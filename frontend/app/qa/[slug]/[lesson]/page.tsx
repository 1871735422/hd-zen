import { getTopicMediaByOrder } from '@/app/api';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import AudioPage from '../../../components/pc/AudioPage';
import LessonMeta from '../../../components/pc/LessonMeta';
import ReadingPage from '../../../components/pc/ReadingPage';

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
    if (selectedKey === 'reading')
      return <ReadingPage topicMedia={topicMedia} />;

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
