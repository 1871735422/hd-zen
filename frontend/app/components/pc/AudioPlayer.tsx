'use client';
import { useDevice } from '@/app/components/DeviceProvider';
import { trackAudioPlay } from '@/app/utils/clarityAnalytics';
import {
  pauseOtherMediaPlayers,
  registerMediaPlayer,
  unregisterMediaPlayer,
  type MediaPlayer,
} from '@/app/utils/mediaRegistry';
import { pxToVw } from '@/app/utils/mobileUtils';
import { Box, IconButton, Slider, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import AudioPlayIcon from '../icons/AudioPlayIcon';
import PauseIcon from '../icons/PauseIcon';
import SpeakerIcon from '../icons/SpeakerIcon';

export interface AudioPlayerProps {
  src: string;
  audioId?: string;
  audioTitle?: string;
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

const TimeLineLabel = ({ time }: { time: number }) => {
  return (
    <Typography
      variant='body2'
      fontSize='inherit'
      color='rgba(102, 102, 102, 1)'
      sx={{ minWidth: { lg: 36, xl: 50, xxl: 60 }, textAlign: 'center' }}
    >
      {formatTime(time)}
    </Typography>
  );
};

export default function AudioPlayer({
  src,
  audioId,
  audioTitle,
}: AudioPlayerProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100); // 0 - 100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const isDraggingRef = useRef(false);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const audioElement = new Audio(src);
    setAudio(audioElement);
    audioElement.preload = 'metadata';
    audioElement.volume = volume / 100;
    audioElement.muted = isMuted;

    // 创建 MediaPlayer 包装对象
    const mediaPlayer: MediaPlayer = {
      pause: () => audioElement.pause(),
      get paused() {
        return audioElement.paused;
      },
      type: 'audio',
    };

    // 注册到全局媒体列表
    registerMediaPlayer(mediaPlayer);

    audioElement.addEventListener('loadedmetadata', () => {
      setDuration(audioElement.duration || 0);
    });
    audioElement.addEventListener('timeupdate', () => {
      // 使用 ref 判断是否在拖动，避免因为 state 变化触发 useEffect 重新渲染
      if (!isDraggingRef.current) {
        setCurrentTime(audioElement.currentTime || 0);
      }
    });
    audioElement.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    // 监听播放事件，暂停其他媒体播放器
    audioElement.addEventListener('play', () => {
      pauseOtherMediaPlayers(mediaPlayer);
      setIsPlaying(true);

      // 音频播放统计
      if (audioId && !hasTrackedRef.current) {
        trackAudioPlay(audioId, audioTitle);
        hasTrackedRef.current = true;
      }
    });
    // 监听暂停事件，同步 UI 状态
    audioElement.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    return () => {
      // 从全局列表移除媒体播放器
      unregisterMediaPlayer(mediaPlayer);
      audioElement.pause();
      audioElement.src = '';
      setAudio(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      hasTrackedRef.current = false;
    };
  }, [src, audioId, audioTitle]);

  const progress = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleSliderChangeStart = () => {
    isDraggingRef.current = true;
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    if (!audio || !Number.isFinite(duration) || duration <= 0) return;
    const nextTime = (v / 100) * duration;
    setCurrentTime(nextTime);
  };

  const handleSliderCommit = (
    _: Event | React.SyntheticEvent,
    value: number | number[]
  ) => {
    const v = Array.isArray(value) ? value[0] : value;
    if (!audio || !Number.isFinite(duration) || duration <= 0) return;
    const nextTime = (v / 100) * duration;
    audio.currentTime = nextTime;
    isDraggingRef.current = false;
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    const clamped = Math.min(100, Math.max(0, v));
    setVolume(clamped);
    if (!audio) return;
    audio.volume = clamped / 100;

    if (clamped === 0) {
      audio.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    }
  };
  const { deviceType } = useDevice();
  const isMobile = deviceType === 'mobile';

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(242, 248, 255, 0.75)',
        borderRadius: 999,
        px: { lg: 2, xl: 3, xxl: 4 },
        py: { lg: 1, xl: 1.5, xxl: 2 },
        gap: 1.5,
        '& .MuiTypography-root': {
          color: 'rgba(102, 102, 102, 1)',
          fontSize: { lg: 13, xl: 16, xxl: 18 },
        },
      }}
    >
      <IconButton
        aria-label={isPlaying ? 'pause' : 'play'}
        onClick={togglePlay}
        size='small'
        sx={{
          minWidth: '30px',
        }}
      >
        {isPlaying ? <PauseIcon /> : <AudioPlayIcon />}
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          gap: isMobile ? 0 : 1,
          position: 'relative',
        }}
      >
        <Stack
          sx={
            isMobile
              ? {
                  position: 'absolute',
                  left: 0,
                  bottom: pxToVw(-3),
                  fontSize: pxToVw(12),
                }
              : {}
          }
        >
          <TimeLineLabel time={currentTime} />
        </Stack>
        <Slider
          value={progress}
          onChangeCommitted={handleSliderCommit}
          onChange={handleSliderChange}
          onMouseDown={handleSliderChangeStart}
          aria-label='progress'
          sx={{
            flex: 1,
            color: 'transparent',
            '& .MuiSlider-rail': {
              opacity: 1,
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
            '& .MuiSlider-track': {
              border: 'none',
              background:
                'linear-gradient(270deg, rgba(78, 144, 237, 1) 0%, rgba(176, 222, 255, 1) 100%)',
            },
            '& .MuiSlider-thumb': {
              width: { lg: 14, xl: 20, xxl: 24 },
              height: { lg: 14, xl: 20, xxl: 24 },
              backgroundColor: '#7DB1F8',
              boxShadow: '3px 0 0 0 rgba(245, 249, 252, 1)',
            },
          }}
        />
        <Stack
          sx={
            isMobile
              ? {
                  position: 'absolute',
                  right: 0,
                  bottom: pxToVw(-3),
                }
              : {}
          }
        >
          <TimeLineLabel time={duration} />
        </Stack>
      </Box>

      <Stack direction='row' alignItems='center'>
        <IconButton
          aria-label='volume'
          onClick={toggleVolumeSlider}
          size='small'
          sx={{
            '& svg': {
              fontSize: { lg: 20, xl: 28, xxl: 32 },
            },
            ...(isMuted
              ? {
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: { lg: 20, xl: 28, xxl: 32 },
                    height: 2,
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    background:
                      'linear-gradient(90deg, rgba(70, 134, 207, 1) 0%, rgba(170, 207, 250, 1) 100%)',
                    borderRadius: 2,
                    pointerEvents: 'none',
                  },
                }
              : {}),
          }}
        >
          <SpeakerIcon />
        </IconButton>
        <Box
          sx={{
            width: showVolumeSlider ? { lg: 60, xl: 80, xxl: 100 } : 0,
            opacity: showVolumeSlider ? 1 : 0,
            ml: showVolumeSlider ? 1 : 0,
            transform: showVolumeSlider ? 'translateX(0)' : 'translateX(8px)',
            transition: theme =>
              theme.transitions.create(
                ['width', 'opacity', 'margin-left', 'transform'],
                {
                  duration: showVolumeSlider ? 260 : 200,
                  easing: showVolumeSlider
                    ? theme.transitions.easing.easeOut
                    : theme.transitions.easing.easeInOut,
                }
              ),
          }}
        >
          <Slider
            value={volume}
            onChange={showVolumeSlider ? handleVolumeChange : undefined}
            aria-label='volume'
            sx={{
              width: '100%',
              color: 'transparent',
              '& .MuiSlider-rail': {
                opacity: 1,
                backgroundColor: 'rgba(0,0,0,0.1)',
              },
              '& .MuiSlider-track': {
                border: 'none',
                background:
                  'linear-gradient(270deg, rgba(78, 144, 237, 1) 0%, rgba(176, 222, 255, 1) 100%)',
              },
              '& .MuiSlider-thumb': {
                width: { lg: 12, xl: 16, xxl: 18 },
                height: { lg: 12, xl: 16, xxl: 18 },
                backgroundColor: '#7DB1F8',
                boxShadow: '3px 0 0 0 rgba(245, 249, 252, 1)',
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
