'use client';
import { Box, Typography } from '@mui/material';
import { useRef, useState } from 'react';

export interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
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
        mb: 5,
      }}
    >
      {title && (
        <Typography variant='body1' fontWeight={500} my={2}>
          {title}
        </Typography>
      )}
      <audio controls style={{ width: '100%' }} preload='metadata'>
        <source src={src} type='audio/mpeg' />
        <Typography color='error'>您的浏览器不支持音频播放。</Typography>
      </audio>
    </Box>
  );
}
