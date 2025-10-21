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

  // Helper: build plyr-compatible source list
  const buildPlyrSources = (list: Source[]) =>
    list.map(s => ({
      src: s.src,
      type: s.type ?? 'video/mp4',
      size: s.size ?? 0,
    }));

  useEffect(() => {
    let mounted = true;
    (async () => {
      const PlyrModule = await import('plyr');
      const PlyrLib = PlyrModule.default ?? PlyrModule;
      if (!mounted || !videoRef.current) return;

      // Prepare quality options from sources (unique, sorted desc)
      const qualityOptions = Array.from(
        new Set(sources.map(s => s.size).filter(Boolean) as number[])
      )
        .sort((a, b) => a - b)
        .map(n => Number(n));

      playerRef.current = new PlyrLib(videoRef.current, {
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
        // settings must include 'quality' to show quality in settings menu
        settings: ['quality', 'loop'],
        quality: {
          default: qualityOptions[0] ?? sources[0]?.size ?? 720,
          options: qualityOptions.length ? qualityOptions : [720],
          forced: true, // ensure plyr will force quality changes by replacing src
        },
      });

      // set initial source in plyr format
      if (playerRef.current) {
        playerRef.current.source = {
          type: 'video',
          title: title ?? '',
          sources: buildPlyrSources(sources),
        };
      }
    })();

    return () => {
      mounted = false;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, []);

  // Update player source when sources prop changes
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    // rebuild quality options
    const qualityOptions = Array.from(
      new Set(sources.map(s => s.size).filter(Boolean) as number[])
    )
      .sort((a, b) => b - a)
      .map(n => Number(n));

    // Update quality config if changed
    try {
      // @ts-ignore - Plyr types may not expose runtime config update; update internal config
      if (qualityOptions.length) {
        // update config so settings menu reflects available qualities
        // NOTE: this updates the internal options used by settings menu
        // Some Plyr versions read config only on init; forced:true helps
        // But updating .options may help the UI
        // @ts-ignore
        player.options.quality = {
          default: qualityOptions[0],
          options: qualityOptions,
          forced: true,
        };
      }
    } catch (e) {
      // ignore
    }

    // Preserve playback state/time
    const v = videoRef.current;
    if (!v) return;
    const wasPlaying = !v.paused && !v.ended;
    const curTime = v.currentTime || 0;

    player.source = {
      type: 'video',
      title: title ?? '',
      sources: buildPlyrSources(sources),
    };

    // Try to restore time/play state after switching source
    v.currentTime = Math.min(curTime, Number.POSITIVE_INFINITY);
    if (wasPlaying) {
      v.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources, poster, title]);

  return (
    <Box sx={{ '& .plyr--full-ui': { borderRadius: '12px' } }}>
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
