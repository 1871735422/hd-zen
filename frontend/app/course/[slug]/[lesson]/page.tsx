import VideoPlayer from '@/app/components/pc/VideoPlayer';
import { getCourseTopicById, getTopicMediaByTopic } from '@/app/api';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import { Box } from '@mui/material';

interface LessonPageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

const LessonPage = async ({ params }: LessonPageProps) => {
  const resolvedParams = await params;
  const topicId = resolvedParams.lesson;

  // Fetch topic details and associated media
  const [topic, topicMediaResult] = await Promise.all([
    getCourseTopicById(topicId),
    getTopicMediaByTopic(topicId)
  ]);

  if (!topic) {
    notFound();
  }

  const topicMedia = topicMediaResult.items;

  return (
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <MediaDownloadButton
          mediaType="video"
          downloadUrls={topicMedia.map(media => media.media?.url_downmp4 || '')}
        />
      </Box>
      {topicMedia.map((media) => (
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

export default LessonPage;
