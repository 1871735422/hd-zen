'use client';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Box, IconButton, Typography } from '@mui/material';
import 'plyr/dist/plyr.css';
import { useEffect, useRef, useState } from 'react';

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
  const [played, setPlayed] = useState(false);

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
        // @ts-ignore
        player.options.quality = {
          default: qualityOptions[0],
          options: qualityOptions,
          forced: true,
        };
      }
    } catch (e) {
      console.error(e);
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
  }, [sources, title]);

  return (
    <Box
      sx={{
        position: 'relative',
        '& .plyr--full-ui': {
          visibility: played ? 'visible' : 'hidden',
          borderRadius: '12px',
          minHeight: { lg: 360, xl: 400, xxl: 400 },
        },
        '&.MuiBox-root:before': {
          position: 'absolute',
          display: played ? 'none' : 'block',
          inset: 0,
          content: '""',
          zIndex: 10,
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          backgroundImage: `url(${poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      }}
    >
      {!played && (
        <IconButton
          onClick={() => {
            playerRef.current?.play();
            setPlayed(true);
          }}
          sx={{
            position: 'absolute',
            bottom: '5%',
            left: '3%',
            color: 'white',
            fontSize: '2.5em',
            zIndex: 11,
          }}
        >
          <PlayCircleOutlineIcon sx={{ fontSize: 80 }} />
        </IconButton>
      )}
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
          objectFit: 'contain',
          backgroundColor: '#fff',
        }}
        preload='metadata'
      />
    </Box>
  );
}
