'use client';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Box, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import { useRef, useState } from 'react';

export interface VideoPlayerProps {
  poster: string;
  src: string;
  title?: string;
}

export default function VideoPlayer({ poster, src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
        mb: 3,
      }}
    >
      {title && (
        <Typography variant='h6' fontWeight={500}>
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
            objectFit='cover'
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: 10,
            }}
          />
        )}
        <video
          ref={videoRef}
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
