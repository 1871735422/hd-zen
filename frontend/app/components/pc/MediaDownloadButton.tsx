'use client';
import { Button, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import AudioDownIcon from '../icons/AudioDownIcon';
import EpubDownIcon from '../icons/EpubDownIcon';
import PdfDownIcon from '../icons/PdfDownIcon';
import VideoDownIcon from '../icons/VideoDownIcon';

export type MediaType = 'pdf' | 'epub' | 'audiobook' | 'audio' | 'video';

interface MediaDownloadButtonProps {
  mediaType: MediaType;
  downloadUrls: string[];
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme>;
}

const MediaDownloadButton: React.FC<MediaDownloadButtonProps> = ({
  mediaType,
  downloadUrls,
  disabled = false,
  sx,
}) => {
  const getMediaInfo = (type: MediaType) => {
    switch (type) {
      case 'pdf':
        return {
          icon: PdfDownIcon,
          label: 'PDF',
        };
      case 'epub':
        return {
          icon: EpubDownIcon,
          label: 'EPUB',
        };
      case 'audio':
        return {
          icon: AudioDownIcon,
          label: '音频',
        };
      case 'video':
        return {
          icon: VideoDownIcon,
          label: '视频',
        };
      default:
        return {
          icon: VideoDownIcon,
          label: '下载',
        };
    }
  };
  const mediaInfo = getMediaInfo(mediaType);
  const IconComponent = mediaInfo.icon;
  // console.log({ mediaInfo, downloadUrls });
  const handleDownload = () => {
    downloadUrls.forEach(url => {
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <Button
      disabled={disabled}
      onClick={handleDownload}
      sx={{
        width: { lg: 50, xlg: 61, xl: 76, xxl: 101.33 },
        height: { lg: 50, xlg: 61, xl: 76, xxl: 101.33 },
        pt: 0.3,
        borderRadius: '50%',
        background: 'rgba(255, 168, 184, 1)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 'unset',
        '& .MuiSvgIcon-root': {
          fontSize: { lg: 14, xlg: 18, xl: 22.5, xxl: 30 },
        },
        '& .MuiTypography-root': {
          fontSize: { lg: 8, xlg: 9.6, xl: 12, xxl: 16 },
          fontWeight: 500,
        },
        '&:hover': {
          background: 'rgba(255, 168, 184, 0.8)',
        },
        '&:disabled': {
          background: 'rgba(255, 168, 184, 0.5)',
          color: 'rgba(255, 255, 255, 0.5)',
        },
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
    >
      <IconComponent />
      <Typography>{mediaInfo.label}下载</Typography>
    </Button>
  );
};

export default MediaDownloadButton;
