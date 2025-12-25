'use client';

import { trackDownload } from '@/app/utils/clarityAnalytics';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Button, Stack } from '@mui/material';
import AudioDownIcon from '../icons/AudioDownIcon';
import EpubDownIcon from '../icons/EpubDownIcon';
import PdfDownIcon from '../icons/PdfDownIcon';

interface MobileEBookDownloadProps {
  epubUrl?: string;
  pdfUrl?: string;
  mp3Url?: string;
}

export const buttonStyles = {
  width: pxToVw(90),
  height: pxToVw(32),
  borderTopLeftRadius: pxToVw(30),
  borderBottomLeftRadius: pxToVw(30),
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  color: '#fff',
  background:
    'linear-gradient(90deg, rgba(196, 198, 255, 1) 0%, rgba(250, 167, 222, 1) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: pxToVw(2),
  fontSize: pxToVw(12),
  fontWeight: 700,
  textTransform: 'none' as const,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
  '& svg': {
    fontSize: pxToVw(20),
  },
};

const MobileEBookDownload = ({
  epubUrl,
  pdfUrl,
  mp3Url,
}: MobileEBookDownloadProps) => {
  // 如果3个都没有，不渲染组件
  if (!epubUrl && !pdfUrl && !mp3Url) {
    return null;
  }

  const handleDownload = (url: string, type: 'epub' | 'pdf' | 'mp3') => {
    // 下载统计
    const fileType = type === 'mp3' ? 'audio' : type;
    trackDownload(fileType, undefined, url);

    // 创建一个隐藏的 a 标签进行下载
    const link = document.createElement('a');
    link.href = url;
    link.download = `book.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Stack
      spacing={pxToVw(8)}
      sx={{
        mt: pxToVw(-30),
        mb: pxToVw(-20),
        alignItems: 'flex-end',
      }}
    >
      {mp3Url && (
        <Button onClick={() => handleDownload(mp3Url, 'mp3')} sx={buttonStyles}>
          <AudioDownIcon />
          音频下载
        </Button>
      )}
      {pdfUrl && (
        <Button onClick={() => handleDownload(pdfUrl, 'pdf')} sx={buttonStyles}>
          <PdfDownIcon />
          PDF下载
        </Button>
      )}

      {epubUrl && (
        <Button
          onClick={() => handleDownload(epubUrl, 'epub')}
          sx={buttonStyles}
        >
          <EpubDownIcon />
          EPUB下载
        </Button>
      )}
    </Stack>
  );
};

export default MobileEBookDownload;
