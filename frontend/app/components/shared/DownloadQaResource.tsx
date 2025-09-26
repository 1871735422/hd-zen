'use client';

import { getDownloadResources } from '@/app/api';
import { Button, Typography } from '@mui/material';
import VideoDownIcon from '../icons/VideoDownIcon';

export default function DownloadQaResource({
  volumeName,
}: {
  volumeName: string;
}) {
  const handleDownload = async () => {
    const downloadItems = await getDownloadResources(true);
    const url = downloadItems.find(item =>
      item.name.includes(volumeName)
    )?.url_downvideo;
    // console.log({ downloadItems, volumeName, url });

    if (!url) {
      return alert('下载资源不可用');
    }
    window.open(url);
  };
  return (
    <Button
      onClick={handleDownload}
      sx={{
        position: 'absolute',
        top: -3.5,
        right: 25,
        color: '#fff',
        backgroundColor: 'rgba(255, 168, 184, 1)',
        borderRadius: '25px 25px 0 0 ',
        px: 2,
        pt: 1,
        pb: 0.4,
      }}
    >
      <VideoDownIcon sx={{ width: 24, height: 24 }} />
      <Typography fontSize={11} pl={0.8} lineHeight={1.1}>
        本课问答
        <br />
        打包下载
      </Typography>
    </Button>
  );
}
