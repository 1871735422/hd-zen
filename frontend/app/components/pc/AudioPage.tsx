'use client';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import { Box, Paper, Typography } from '@mui/material';
import { Fragment } from 'react';
import { TopicMediaX } from '../../types/models';
import AudioPlayer from './AudioPlayer';

interface AudioPageProps {
  topicMedia: TopicMediaX[];
  showTitle?: boolean;
}

export default function AudioPage({
  topicMedia,
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

  const bookUrls = showTitle
    ? null
    : {
        pdf: [topicMedia[0].url_downpdf],
        epub: [topicMedia[0].url_downepub],
      };
  const audioBookUrl = [
    { title: topicMedia[0]?.title, url_mp3: topicMedia[0]?.ct_url_mp3 },
  ];

  const mp3Urls = showTitle
    ? topicMedia.map(item => ({
        title: item?.title,
        url_mp3: item?.url_mp3,
      }))
    : audioBookUrl;
  // console.log('mp3Urls', mp3Urls);
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {mp3Urls.map(item => (
        <Fragment key={item.title}>
          {item.title && showTitle && (
            <Typography
              variant='body1'
              fontWeight={500}
              color='#444'
              my={2}
              fontSize={{ lg: 18, xl: 24, xxl: 28 }}
            >
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
            {item?.url_mp3 && <AudioPlayer src={item?.url_mp3} />}
            {bookUrls ? (
              <Box display={'flex'}>
                <MediaDownloadButton
                  mediaType='pdf'
                  downloadUrls={bookUrls['pdf']}
                />{' '}
                &nbsp;
                <MediaDownloadButton
                  mediaType='epub'
                  downloadUrls={bookUrls['epub']}
                />
              </Box>
            ) : (
              <MediaDownloadButton
                mediaType='audio'
                downloadUrls={topicMedia.map(item => item?.url_downmp3 || '')}
              />
            )}
          </Box>
        </Fragment>
      ))}
    </Box>
  );
}
