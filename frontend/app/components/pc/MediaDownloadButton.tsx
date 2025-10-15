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

  const handleDownload = () => {
    downloadUrls.forEach(url => {
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      link.target = '_blank';
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
        width: { sm: 40, md: 50, lg: 60, xl: 76, xxl: 84 },
        height: { sm: 40, md: 50, lg: 60, xl: 76, xxl: 84 },
        fontSize: { sm: 8, md: 9, lg: 10, xl: 12, xxl: 14 },
        borderRadius: '50%',
        background: 'rgba(255, 168, 184, 1)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { sm: 0.2, md: 0.3, lg: 0.5, xl: 0.5, xxl: 0.6 },
        minWidth: 'unset',
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
      <IconComponent
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: { sm: 14, md: 16, lg: 20, xl: 22, xxl: 24 },
          zIndex: 1,
        }}
      />
      <Typography
        variant='caption'
        sx={{
          fontSize: { sm: 8, md: 9, lg: 10, xl: 12, xxl: 14 },
          fontWeight: 500,
          lineHeight: 1,
          textAlign: 'center',
          marginTop: '-2px',
        }}
      >
        {mediaInfo.label}下载
      </Typography>
    </Button>
  );
};

export default MediaDownloadButton;
