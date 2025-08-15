import { getTopicMediaByTopic } from '@/app/api';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import LessonMeta from '../../../components/pc/LessonMeta';

interface LessonPageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

const LessonPage = async ({ params }: LessonPageProps) => {
  const resolvedParams = await params;
  const topicId = resolvedParams.lesson;

  // Fetch topic details and associated media
  const { items: topicMedia } = await getTopicMediaByTopic(topicId);

  console.log({ topicMedia });

  if (!topicMedia) {
    notFound();
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        ml: '5%',
        px: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
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
            topicMedia[0]?.media!.tags
              ? topicMedia[0].media.tags
                  .split(',')
                  .map((tag: string) => tag.trim())
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
        <MediaDownloadButton
          sx={{ alignSelf: 'flex-end' }}
          mediaType='video'
          downloadUrls={topicMedia.map(media => media.media?.url_downmp4 || '')}
        />
      </Box>
      {topicMedia.map(media => (
        <Fragment key={media.id}>
          <VideoPlayer
            poster={media.media?.url_image || media.media?.image1_url || ''}
            title={media.media?.title || ''}
            src={media.media?.url_hd || media.media?.high_quality_url || ''}
          />
        </Fragment>
      ))}
    </Box>
  );
};

export default LessonPage;
