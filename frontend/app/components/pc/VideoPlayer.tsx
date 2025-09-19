'use client';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Box, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export interface VideoPlayerProps {
  poster: string;
  src: string;
  title?: string;
}

export default function VideoPlayer({ poster, src, title }: VideoPlayerProps) {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        onClick={handlePlay}
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
          src={src}
          controls
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
          <track kind='captions' />
        </video>
        {!playing && (
          <IconButton
            onClick={handlePlay}
            sx={{
              position: 'absolute',
              bottom: '5%',
              left: '3%',
              // transform: 'translate(-50%, 50%)',
              color: 'white',
              fontSize: 80,
            }}
          >
            <PlayCircleOutlineIcon sx={{ fontSize: 80 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
