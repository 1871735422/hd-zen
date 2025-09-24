'use client';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import { Box, Paper, Typography } from '@mui/material';
import { Fragment } from 'react';
import { CourseTopic, TopicMedia } from '../../types/models';
import AudioPlayer from './AudioPlayer';

interface AudioPageProps {
  topicMedia: TopicMedia[];
  courseTopic?: CourseTopic;
  showTitle?: boolean;
}

export default function AudioPage({
  topicMedia,
  courseTopic,
  showTitle = true,
}: AudioPageProps) {
  if (!topicMedia.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='text.secondary'>
          此课程暂无音频内容
        </Typography>
      </Paper>
    );
  }

  const bookUrls = courseTopic
    ? [courseTopic?.url_downpdf].filter(item => item != undefined)
    : null;
  const audioBookUrl = [
    { title: courseTopic?.title, url_mp3: courseTopic?.url_mp3 },
  ];

  const mp3Urls = courseTopic
    ? audioBookUrl
    : topicMedia.map(item => ({
        title: item.media?.title,
        url_mp3: item.media?.url_mp3,
      }));

  return (
    <Box sx={{ py: 0, gap: 2, mr: 5 }}>
      <Box
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {mp3Urls.map(item => (
          <Fragment key={item.title}>
            {item.title && showTitle && (
              <Typography variant='body1' fontWeight={500} my={2}>
                {item.title}
              </Typography>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
                gap: 1,
              }}
            >
              <AudioPlayer src={item?.url_mp3 ?? ''} />
              {bookUrls && bookUrls.length > 0 ? (
                <Box display={'flex'}>
                  <MediaDownloadButton
                    mediaType='pdf'
                    downloadUrls={bookUrls}
                  />{' '}
                  &nbsp;
                  <MediaDownloadButton
                    mediaType='epub'
                    downloadUrls={bookUrls}
                  />
                </Box>
              ) : (
                <MediaDownloadButton
                  mediaType='audio'
                  downloadUrls={topicMedia.map(
                    item => item.media?.url_downmp3 || ''
                  )}
                />
              )}
            </Box>
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}
