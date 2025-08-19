import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import { Box, Paper, Typography } from '@mui/material';
import { Fragment } from 'react';
import { TopicMedia } from '../../types/models';
import AudioPlayer from './AudioPlayer';

interface AudioPageProps {
  topicMedia: TopicMedia[];
}

export default function AudioPage({ topicMedia }: AudioPageProps) {
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
          mediaType='audio'
          downloadUrls={topicMedia.map(item => item.media?.url_downmp3 || '')}
        />
      </Box>
      <Box
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {topicMedia.map(item => (
          <Fragment key={item.id}>
            <AudioPlayer
              title={item.media?.title}
              src={item.media?.url_mp3 ?? ''}
            />
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}
