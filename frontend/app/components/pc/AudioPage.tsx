'use client';
import { getContentWaitingForUpdateText } from '@/app/api';
import { useDevice } from '@/app/components/DeviceProvider';
import MediaDownloadButton from '@/app/components/pc/MediaDownloadButton';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { TopicMediaX } from '../../types/models';
import AudioDownIcon from '../icons/AudioDownIcon';
import { buttonStyles } from '../mobile/MobileEBookDownload';
import AudioPlayer from './AudioPlayer';

interface AudioPageProps {
  topicMedia: TopicMediaX[];
  showTitle?: boolean;
}

export default function AudioPage({
  topicMedia,
  showTitle = true,
}: AudioPageProps) {
  const { deviceType } = useDevice();
  const isMobile = deviceType === 'mobile';
  const [hintText, setHintText] = useState('');

  useEffect(() => {
    getContentWaitingForUpdateText()
      .then(text => {
        if (text) {
          setHintText(text);
        }
      })
      .catch(() => {});
  }, []);

  if (!topicMedia.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='text.secondary'>
          {hintText || '此课程暂无音频内容'}
        </Typography>
      </Paper>
    );
  }

  const firstMedia = topicMedia[0];
  const bookUrls =
    firstMedia?.url_downpdf || firstMedia?.url_downepub
      ? {
          pdf: firstMedia.url_downpdf ? [firstMedia.url_downpdf] : [],
          epub: firstMedia.url_downepub ? [firstMedia.url_downepub] : [],
        }
      : null;
  const audioBookUrl = [
    {
      title: topicMedia[0]?.title,
      url_mp3: topicMedia[0]?.ct_url_mp3,
      url_downmp3: topicMedia[0]?.url_downmp3,
    },
  ];

  const audioItems = showTitle
    ? topicMedia.map(item => ({
        title: item?.title,
        url_mp3: item?.url_mp3,
        url_downmp3: item?.url_downmp3,
        id: item?.id,
      }))
    : audioBookUrl.map(item => ({
        ...item,
        id: topicMedia[0]?.id,
      }));

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {audioItems.map((item, idx) => (
        <Fragment key={idx}>
          <Stack my={2} direction={'row'} justifyContent={'space-between'}>
            {item.title && showTitle && (
              <Typography
                fontWeight={500}
                color='#444'
                fontSize={isMobile ? pxToVw(16) : { lg: 18, xl: 24, xxl: 28 }}
              >
                {item.title}
              </Typography>
            )}
            {isMobile && showTitle && item.url_downmp3 && (
              <Button href={item.url_downmp3} sx={buttonStyles}>
                <AudioDownIcon />
                音频下载
              </Button>
            )}
          </Stack>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: isMobile ? pxToVw(25) : 3,
              gap: { lg: '8px', xlg: '8px', xl: '10px', xxl: '15px' },
            }}
          >
            {item?.url_mp3 ? (
              <AudioPlayer
                src={item?.url_mp3}
                audioId={item?.id}
                audioTitle={item?.title}
              />
            ) : (
              <Stack flexGrow={1} />
            )}
            {!isMobile && (
              <Box display={'flex'}>
                {bookUrls && (
                  <>
                    {bookUrls.pdf.length > 0 && (
                      <MediaDownloadButton
                        mediaType='pdf'
                        downloadUrls={bookUrls.pdf}
                      />
                    )}
                    {bookUrls.epub.length > 0 && (
                      <>
                        &nbsp;
                        <MediaDownloadButton
                          mediaType='epub'
                          downloadUrls={bookUrls.epub}
                        />
                      </>
                    )}
                  </>
                )}
                {item?.url_downmp3 && (
                  <>
                    {bookUrls &&
                      (bookUrls.pdf.length > 0 || bookUrls.epub.length > 0) && (
                        <>&nbsp;</>
                      )}
                    <MediaDownloadButton
                      mediaType='audio'
                      downloadUrls={[item.url_downmp3]}
                    />
                  </>
                )}
              </Box>
            )}
          </Box>
        </Fragment>
      ))}
    </Box>
  );
}
