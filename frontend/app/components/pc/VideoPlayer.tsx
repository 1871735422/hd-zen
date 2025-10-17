'use client';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import VideoPlayIcon from '../icons/VideoPlayIcon';

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
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<'SD' | 'HD'>('SD');
  const [qualityMenuAnchor, setQualityMenuAnchor] =
    useState<null | HTMLElement>(null);
  const qualitySelectRef = useRef(null);

  // 初始化默认画质
  useEffect(() => {
    if (video && sources.length > 0) {
      const defaultSource =
        sources.find(source => source.quality === currentQuality) || sources[0];
      video.src = defaultSource.src;
      video.load();
    }
  }, [video, sources, currentQuality]);

  const handlePlay = () => {
    setPlayed(true);
    setPlaying(true);
    video?.play();
  };

  const handleQualityChange = (quality: 'SD' | 'HD') => {
    setCurrentQuality(quality);
    setQualityMenuAnchor(null);

    if (video) {
      const currentTime = video.currentTime;
      const isPaused = video.paused;
      const selectedSource = sources.find(source => source.quality === quality);

      if (selectedSource) {
        video.src = selectedSource.src;
        video.load();
        video.currentTime = currentTime;
        if (!isPaused) video.play();
      }
    }
  };

  return (
    <Box sx={{ overflow: 'hidden', mb: { lg: 5, xl: 10, xxl: 12 } }}>
      {title && (
        <Typography
          variant='h1'
          sx={{
            fontWeight: 500,
            my: 2,
            fontSize: { lg: 14, xl: 20, xxl: 24 },
            color: 'rgba(102, 102, 102, 1)',
          }}
        >
          {title}
        </Typography>
      )}
      <Box
        onMouseEnter={() => {
          const ref = qualitySelectRef?.current as HTMLElement | null;
          if (ref) {
            ref.style.display = '';
          }
        }}
        onMouseLeave={() => {
          const ref = qualitySelectRef?.current as HTMLElement | null;
          if (ref && playing) {
            ref.style.display = 'none';
          }
        }}
        sx={{ position: 'relative', width: '100%', pt: '56.25%' }}
      >
        {!played && (
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
              borderRadius: '25px',
              objectFit: 'cover',
            }}
          />
        )}

        <video
          ref={el => setVideo(el as HTMLVideoElement | null)}
          controls
          disablePictureInPicture
          style={{
            display: played ? 'block' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 10,
          }}
          poster={poster}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        >
          {sources.map((source, index) => (
            <source key={index} src={source.src} type='video/mp4' />
          ))}
        </video>

        {!played && (
          <IconButton
            onClick={handlePlay}
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              color: 'white',
            }}
          >
            <VideoPlayIcon />
          </IconButton>
        )}

        {played && sources.length > 1 && (
          <Box
            ref={qualitySelectRef}
            sx={{ position: 'absolute', bottom: 32, right: 150, zIndex: 10 }}
          >
            <Button
              onClick={e => {
                e.preventDefault();
                setQualityMenuAnchor(e.currentTarget);
              }}
              sx={{
                color: 'white',
                fontSize: '12px',
                minWidth: 'auto',
                padding: '4px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '4px',
              }}
            >
              {sources.find(s => s.quality === currentQuality)?.label || '标清'}
            </Button>
            <Menu
              anchorEl={qualityMenuAnchor}
              open={Boolean(qualityMenuAnchor)}
              onClose={() => setQualityMenuAnchor(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    minWidth: '50px',
                  },
                },
              }}
            >
              {sources.map(source => (
                <MenuItem
                  key={source.quality}
                  onClick={() => handleQualityChange(source.quality)}
                  sx={{ color: 'white', fontSize: '12px' }}
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
