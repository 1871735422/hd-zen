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
  size = 'medium',
  sx,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 40,
          height: 40,
          fontSize: '0.5rem',
        };
      case 'large':
        return {
          width: 80,
          height: 80,
          fontSize: '0.75rem',
        };
      default:
        return {
          width: 60,
          height: 60,
          fontSize: '0.55rem',
          pt: 1,
        };
    }
  };

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

  const sizeStyles = getSizeStyles();
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
        width: sizeStyles.width,
        height: sizeStyles.height,
        borderRadius: '50%',
        background: 'rgba(255, 168, 184, 1)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
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
          fontSize: sizeStyles.width * 0.4,
          zIndex: 1,
        }}
      />
      <Typography
        variant='caption'
        sx={{
          fontSize: sizeStyles.fontSize,
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
