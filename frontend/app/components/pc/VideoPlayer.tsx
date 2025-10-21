'use client';
import { Box, Typography } from '@mui/material';
import 'plyr/dist/plyr.css';
import { useEffect, useRef } from 'react';

type Source = { src: string; type?: string; size?: number };

export default function VideoPlayer({
  sources,
  title,
  poster,
}: {
  sources: Source[];
  title?: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);
  // console.log('sources', sources);
  useEffect(() => {
    let mounted = true;
    // 动态导入 plyr，仅在客户端运行
    (async () => {
      const PlyrModule = await import('plyr');
      const Plyr = PlyrModule.default ?? PlyrModule;
      if (!mounted || !videoRef.current) return;
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'settings',
          'fullscreen',
        ],
        settings: ['quality', 'loop'],
        quality: {
          default: sources[0]?.size ?? 720,
          options: [720, 1080],
        },
      });
    })();

    return () => {
      mounted = false;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, []);

  // 切源逻辑
  useEffect(() => {
    const player = playerRef.current;

    if (player) {
      player.source = {
        type: 'video',
        title: title || '',
        sources: sources,
      };
      // console.log('player.source', player.source);
    }
    const v = videoRef.current;
    if (!v) return;
    const wasPlaying = !v.paused && !v.ended;
    const curTime = v.currentTime || 0;
    v.pause();
    v.src = sources[0]?.src ?? '';
    if (poster) v.poster = poster;
    v.load();
    v.currentTime = Math.min(curTime, Number.POSITIVE_INFINITY);
    if (wasPlaying) {
      v.play().catch(() => {});
    }
  }, [sources, poster, playerRef?.current]);

  return (
    <Box sx={{ '& .plyr--full-ui': { borderRadius: '25px' } }}>
      {title && (
        <Typography
          sx={{
            fontWeight: 500,
            my: 2,
            fontSize: { lg: 18, xl: 24, xxl: 28 },
            color: 'rgba(102, 102, 102, 1)',
          }}
        >
          {title}
        </Typography>
      )}
      <video
        ref={videoRef}
        className='plyr-react plyr--full-ui'
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          objectFit: 'contain',
        }}
        poster={poster}
        preload='metadata'
      />
    </Box>
  );
}
