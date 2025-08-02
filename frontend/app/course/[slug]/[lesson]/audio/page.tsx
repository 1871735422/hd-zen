import { getTopicMediaByTopic } from '@/app/api';
import { Box, Typography, Paper } from '@mui/material';
import { notFound } from 'next/navigation';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import { Fragment } from 'react';

interface AudioPageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

export default async function AudioPage({ params }: AudioPageProps) {
  const resolvedParams = await params;
  const topicId = resolvedParams.lesson;

  const { items: topicMedia } = await getTopicMediaByTopic(topicId);

  if (!topicMedia) {
    notFound();
  }

  if (!topicMedia.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='text.secondary'>
          此课程暂无音频内容
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ py: 3, gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MediaDownloadButton
          mediaType="audio"
          downloadUrls={topicMedia.map(item => item.media?.url_downmp3 || '')}
        />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {topicMedia.map(item => (
          <Fragment key={item.id}>
            <Typography variant='body1' sx={{ mt: 4, fontWeight: 'bold' }}>
              {item.media?.title}
            </Typography>
            <audio
              controls
              style={{ width: '100%' }}
              preload="metadata"
            >
              <source src={item.media?.url_mp3 || ''} type="audio/mpeg" />
              <Typography color='error'>
                您的浏览器不支持音频播放。
              </Typography>
            </audio>
          </Fragment>
        ))}
      </Box>
    </Box >
  );
}
