'use client';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import PauseIcon from '../icons/PauseIcon';
import PlayIcon from '../icons/PlayIcon';
import SpeakerIcon from '../icons/SpeakerIcon';

export interface AudioPlayerProps {
  src: string;
}

function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const mm = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Recreate audio when src changes
  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.preload = 'metadata';
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration || 0);
    });
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime || 0);
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };
  }, [src]);

  const progress = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration) || duration <= 0) return;
    const nextTime = (v / 100) * duration;
    setCurrentTime(nextTime);
  };

  const handleSliderCommit = (
    _: Event | React.SyntheticEvent,
    value: number | number[]
  ) => {
    const v = Array.isArray(value) ? value[0] : value;
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration) || duration <= 0) return;
    const nextTime = (v / 100) * duration;
    audio.currentTime = nextTime;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'rgba(242, 248, 255, 0.75)',
        borderRadius: 999,
        px: 2,
        py: 1,
        gap: 1.5,
      }}
    >
      <IconButton
        aria-label={isPlaying ? 'pause' : 'play'}
        onClick={togglePlay}
        size='small'
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>

      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ minWidth: 40, textAlign: 'right' }}
      >
        {formatTime(currentTime)}
      </Typography>

      <Slider
        value={progress}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderCommit}
        aria-label='progress'
        sx={{
          flex: 1,
          height: 8,
          color: 'transparent',
          '& .MuiSlider-rail': {
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          '& .MuiSlider-track': {
            border: 'none',
            background:
              'linear-gradient(90deg, rgba(78, 144, 237, 1) 0%, rgba(176, 222, 255, 1) 100%)',
          },
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16,
            backgroundColor: '#7DB1F8',
            boxShadow: '0 0 0 3px rgba(125,177,248,0.25)',
          },
        }}
      />

      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ minWidth: 52, textAlign: 'left' }}
      >
        {formatTime(duration)}
      </Typography>

      <IconButton
        aria-label='mute'
        onClick={toggleMute}
        size='small'
        sx={
          isMuted
            ? {
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 22,
                  height: 2,
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  background:
                    'linear-gradient(90deg, rgba(70, 134, 207, 1) 0%, rgba(170, 207, 250, 1) 100%)',
                  borderRadius: 2,
                  pointerEvents: 'none',
                },
              }
            : undefined
        }
      >
        <SpeakerIcon />
      </IconButton>
    </Box>
  );
}
