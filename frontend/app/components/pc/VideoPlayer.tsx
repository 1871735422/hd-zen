'use client';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export interface VideoSource {
  src: string;
  quality: 'SD' | 'HD';
  label: string;
}

export interface VideoPlayerProps {
  poster: string;
  sources: VideoSource[];
  title?: string;
}

export default function VideoPlayer({
  poster,
  sources,
  title,
}: VideoPlayerProps) {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<'SD' | 'HD'>('SD');
  const [qualityMenuAnchor, setQualityMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [showControls, setShowControls] = useState(true);

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初始化默认画质
  useEffect(() => {
    if (video && sources.length > 0) {
      const defaultSource =
        sources.find(source => source.quality === currentQuality) || sources[0];
      video.src = defaultSource.src;
      video.load();
    }
  }, [video, sources, currentQuality]);

  // 监听视频控制栏显示/隐藏状态
  useEffect(() => {
    if (!video) return;

    const handleMouseEnter = () => {
      setShowControls(true);
    };

    const handleMouseLeave = () => {
      setShowControls(false);
    };

    // 监听视频容器的鼠标事件
    video.addEventListener('mouseenter', handleMouseEnter);
    video.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      video.removeEventListener('mouseenter', handleMouseEnter);
      video.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [video]);

  // 服务端渲染时返回静态内容
  if (!isClient) {
    return (
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          mb: 5,
        }}
      >
        {title && (
          <Typography variant='body1' fontWeight={500} my={2}>
            {title}
          </Typography>
        )}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            pt: '56.25%',
          }}
        >
          <Image
            src={poster}
            alt={title || ''}
            width={1000}
            height={1000}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: 10,
              objectFit: 'cover',
            }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              bottom: '5%',
              left: '3%',
              color: 'white',
              fontSize: 80,
            }}
            disabled
          >
            <PlayCircleOutlineIcon sx={{ fontSize: 80 }} />
          </IconButton>
        </Box>
      </Box>
    );
  }

  const handlePlay = () => {
    setPlaying(true);
    video?.play();
  };

  const handleContainerClick = (event: React.MouseEvent<HTMLElement>) => {
    // 只有当点击的是容器本身（不是子元素）时才播放
    if (event.target === event.currentTarget) {
      handlePlay();
    }
  };

  const handleQualityChange = (quality: 'SD' | 'HD') => {
    setCurrentQuality(quality);
    setQualityMenuAnchor(null);

    if (video) {
      const currentTime = video.currentTime;
      const isPaused = video.paused;

      // 找到对应画质的视频源
      const selectedSource = sources.find(source => source.quality === quality);
      if (selectedSource) {
        video.src = selectedSource.src;
        video.load();

        // 恢复播放状态
        video.currentTime = currentTime;
        if (!isPaused) {
          video.play();
        }
      }
    }
  };

  const handleQualityMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setQualityMenuAnchor(event.currentTarget);
  };

  const handleQualityMenuClose = () => {
    setQualityMenuAnchor(null);
  };

  const currentQualityLabel =
    sources.find(source => source.quality === currentQuality)?.label || '标清';

  return (
    <Box
      sx={{
        overflow: 'hidden',
        mb: 5,
      }}
    >
      {title && (
        <Typography variant='body1' fontWeight={500} my={2}>
          {title}
        </Typography>
      )}
      <Box
        onClick={handleContainerClick}
        sx={{
          position: 'relative',
          width: '100%',
          pt: '56.25%',
        }}
      >
        {!playing && (
          <Image
            src={poster}
            alt={title || ''}
            width={1000}
            height={1000}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: 10,
              objectFit: 'cover',
            }}
          />
        )}
        <video
          ref={el => setVideo(el as HTMLVideoElement | null)}
          controls
          disablePictureInPicture
          controlsList='nodownload noremoteplayback noplaybackrate nocaptions'
          style={{
            display: playing ? 'block' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 10,
          }}
          poster={poster}
        >
          {sources.map((source, index) => (
            <source key={index} src={source.src} type='video/mp4' />
          ))}
          <track kind='captions' />
        </video>
        {!playing && (
          <IconButton
            onClick={handlePlay}
            sx={{
              position: 'absolute',
              bottom: '5%',
              left: '3%',
              color: 'white',
              fontSize: 80,
            }}
          >
            <PlayCircleOutlineIcon sx={{ fontSize: 80 }} />
          </IconButton>
        )}

        {playing && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 32,
              right: 150,
              zIndex: 10,
              opacity: showControls ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            <Button
              onClick={handleQualityMenuOpen}
              sx={{
                color: 'white',
                fontSize: '12px',
                minWidth: 'auto',
                padding: '4px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              {currentQualityLabel}
            </Button>
            <Menu
              anchorEl={qualityMenuAnchor}
              open={Boolean(qualityMenuAnchor)}
              onClose={handleQualityMenuClose}
              disableScrollLock={true}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    minWidth: '80px',
                    marginTop: '-8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    '& .MuiMenuItem-root': {
                      color: 'white !important',
                      padding: '6px 12px',
                      fontSize: '12px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2) !important',
                      },
                    },
                  },
                },
              }}
            >
              {sources.map(source => (
                <MenuItem
                  key={source.quality}
                  onClick={() => handleQualityChange(source.quality)}
                  sx={{
                    color: 'white',
                    fontSize: '12px',
                    backgroundColor:
                      source.quality === currentQuality
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  {source.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Box>
    </Box>
  );
}
