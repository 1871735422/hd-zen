'use client';
import React from 'react';
import { Button, Box, Typography, Theme, SxProps } from '@mui/material';
import { 
  Download, 
  Videocam, 
  PictureAsPdf, 
  MenuBook, 
  Headphones,   
  MusicNote 
} from '@mui/icons-material';

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
  sx
}) => {
  console.log(downloadUrls);
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 40,
          height: 40,
          fontSize: '0.5rem'
        };
      case 'large':
        return {
          width: 80,
          height: 80,
          fontSize: '0.75rem'
        };
      default:
        return {
          width: 64,
          height: 64,
          fontSize: '0.6rem'
        };
    }
  };

  const getMediaInfo = (type: MediaType) => {
    switch (type) {
      case 'pdf':
        return {
          icon: PictureAsPdf,
          label: 'PDF'
        };
      case 'epub':
        return {
          icon: MenuBook,
          label: 'EPUB'
        };
      case 'audiobook':
        return {
          icon: Headphones,
          label: '有声书'
        };
      case 'audio':
        return {
          icon: MusicNote,
          label: '音频'
        };
      case 'video':
        return {
          icon: Videocam,
          label: '视频'
        };
      default:
        return {
          icon: Download,
          label: '下载'
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
  }
  
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
        ...sx
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconComponent 
          sx={{ 
            fontSize: sizeStyles.width * 0.4,
            position: 'relative',
            zIndex: 1
          }} 
        />
        <Download 
          sx={{ 
            fontSize: sizeStyles.width * 0.15,
            position: 'absolute',
            top: '25%',
            left: '50%',
            zIndex: 2
          }} 
        />
      </Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: sizeStyles.fontSize,
          fontWeight: 500,
          lineHeight: 1,
          textAlign: 'center',
          marginTop: -0.7,
        }}
      >
        {mediaInfo.label}下载
      </Typography>
    </Button>
  );
};

export default MediaDownloadButton; 