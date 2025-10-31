'use client';

import { getDownloadResources } from '@/app/api';
import { Button, Typography } from '@mui/material';
import VideoDownIcon from '../icons/VideoDownIcon';

export default function DownloadQaResource({
  courseOrder,
  lessonOrder,
}: {
  courseOrder: string;
  lessonOrder: string;
}) {
  const handleDownload = async () => {
    const downloadItems = await getDownloadResources(
      true,
      courseOrder,
      lessonOrder
    );
    const url = downloadItems?.[0]?.url_downvideo;
    // console.log({ downloadItems, courseOrder, lessonOrder, url });

    if (!url) {
      return alert('本课下载资源不存在');
    }
    window.open(url);
  };
  return (
    <Button
      onClick={handleDownload}
      sx={{
        position: 'absolute',
        width: 120,
        height: 40,
        top: -40,
        right: 30,
        color: '#fff',
        backgroundColor: 'rgba(255, 168, 184, 1)',
        borderRadius: {
          lg: '25px 25px 0 0 ',
          xl: '30px 30px 0px 0px',
          xxl: '35px 35px 0px 0px',
        },
        px: 2,
        pt: 1,
        pb: 0.4,
        '& svg': {
          fontSize: { lg: 24, xl: 28, xxl: 32 },
        },
      }}
    >
      <VideoDownIcon />
      <Typography fontSize={12} pl={0.8} lineHeight={'13px'} fontWeight={500}>
        本课问答
        <br />
        打包下载
      </Typography>
    </Button>
  );
}
