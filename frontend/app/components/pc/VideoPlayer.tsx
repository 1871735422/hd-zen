'use client';
import { trackVideoPlay } from '@/app/utils/clarityAnalytics';
import { useDeviceType } from '@/app/utils/deviceUtils';
import {
  pauseOtherMediaPlayers,
  registerMediaPlayer,
  unregisterMediaPlayer,
  type MediaPlayer,
} from '@/app/utils/mediaRegistry';
import { pxToVw } from '@/app/utils/mobileUtils';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import Artplayer from 'artplayer';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import PlayCircleIcon from '../icons/PlayCircleIcon';
import MediaDownloadButton from './MediaDownloadButton';
type Source = { src: string; type?: string; size?: number };

export interface VideoItem {
  url_downmp4?: string;
  id: string;
  title: string;
  poster?: string;
  sources: Source[];
}

export interface VideoPlayerRef {
  switchToVideo: (index: number) => void;
}

const VideoPlayer = forwardRef<
  VideoPlayerRef,
  {
    videoList: VideoItem[];
    currentIndex?: number;
    onVideoChange?: (index: number) => void;
    urlParamName?: string;
    onManualSwitch?: (index: number) => void;
    hasUserPlayedOnce?: boolean;
    onUserPlayed?: () => void;
  }
>(function VideoPlayer(
  {
    videoList,
    currentIndex = 0,
    onVideoChange,
    urlParamName = 'tab',
    onManualSwitch,
    hasUserPlayedOnce: externalHasUserPlayedOnce,
    onUserPlayed,
  },
  ref
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Artplayer | null>(null);
  const mediaPlayerRef = useRef<MediaPlayer | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(currentIndex);
  const [playerReady, setPlayerReady] = useState(false); // 播放器是否准备好
  const [played, setPlayed] = useState(false); // 是否已播放（控制封面显示）
  const currentIndexRef = useRef(currentVideoIndex);
  const hasUserPlayedOnceRef = useRef(false);
  const trackedVideoIdsRef = useRef<Set<string>>(new Set());
  const hasInitializedFromUrlRef = useRef(false);
  const allowAutoAdvanceRef = useRef(true);

  // 同步外部传入的用户播放状态
  if (externalHasUserPlayedOnce !== undefined) {
    hasUserPlayedOnceRef.current = externalHasUserPlayedOnce;
  }

  const videos: VideoItem[] = videoList;
  const currentVideo = videos[currentVideoIndex];
  const isMobile = useDeviceType() === 'mobile';
  const isShowTitle = currentVideo?.title && urlParamName === 'showTitle';

  // 同步当前索引到 ref
  useEffect(() => {
    currentIndexRef.current = currentVideoIndex;
  }, [currentVideoIndex]);

  // 从 URL 初始化视频索引
  useEffect(() => {
    if (hasInitializedFromUrlRef.current) return;
    if (videos.length <= 1) {
      hasInitializedFromUrlRef.current = true;
      return;
    }

    const urlParam = searchParams.get(urlParamName);
    if (urlParam && urlParam.startsWith('question')) {
      const tabNumber = parseInt(urlParam.replace('question', ''), 10);
      const indexFromUrl = tabNumber - 1;
      if (!isNaN(tabNumber) && tabNumber >= 1 && indexFromUrl < videos.length) {
        setCurrentVideoIndex(indexFromUrl);
      }
    }
    hasInitializedFromUrlRef.current = true;
  }, [searchParams, urlParamName, videos.length]);

  // 更新 URL 参数
  const updateUrlParam = (index: number) => {
    const url = new URL(window.location.href);
    if (videos.length <= 1) {
      if (url.searchParams.has(urlParamName)) {
        url.searchParams.delete(urlParamName);
        router.replace(`${url.pathname}${url.search}`, { scroll: false });
      }
      return;
    }
    const paramValue = `question${index + 1}`;
    if (url.searchParams.get(urlParamName) === paramValue) return;
    url.searchParams.set(urlParamName, paramValue);
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
  };

  // 切换到指定视频
  const switchToVideo = (index: number) => {
    allowAutoAdvanceRef.current = false;
    updateUrlParam(index);
    applySource(index, hasUserPlayedOnceRef.current);
    onManualSwitch?.(index);
  };

  // 应用视频源（直接操作 player，不触发状态更新避免重新渲染）
  const applySource = (
    index: number,
    autoplay = false,
    skipStateUpdate = false
  ) => {
    const player = playerRef.current;
    if (!player) return;

    const safeIndex = Math.max(0, Math.min(index, videos.length - 1));
    const nextVideo = videos[safeIndex];
    const nextSrc = nextVideo?.sources?.[0]?.src;

    if (!nextSrc) return;

    // 更新 ref（不触发渲染）
    currentIndexRef.current = safeIndex;

    // 只在非自动切换时更新状态和 URL（手动切换才需要）
    if (!skipStateUpdate) {
      setCurrentVideoIndex(safeIndex);
      updateUrlParam(safeIndex);
    }

    onVideoChange?.(safeIndex);

    // 切换视频源（ArtPlayer 的 switchUrl 在 iOS 全屏下支持良好）
    player.switchUrl(nextSrc);

    // 自动播放
    if (autoplay) {
      player.play().catch(() => {});
    }
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({ switchToVideo }), []);

  // 初始化 ArtPlayer
  useEffect(() => {
    if (!containerRef.current) return;

    // 获取初始视频
    const getVideoAtIndex = (index: number) => {
      const video = videos[index];
      const sources = video?.sources || [];
      return { video, sources };
    };

    const { video: initialVideo, sources: initialSources } = getVideoAtIndex(
      currentIndexRef.current
    );

    // 画质映射（数字 -> 汉字）
    const qualityMap: Record<number, string> = {
      360: '流畅',
      480: '标清',
      720: '高清',
      1080: '超清',
    };

    // 构建清晰度选项的函数
    const buildQualities = (sources: Source[]) =>
      sources
        .filter(s => s.size)
        .map(s => ({
          default: s.size === sources[0]?.size,
          html: qualityMap[s.size || 720] || `${s.size}P`,
          url: s.src,
        }));

    const initialQualities = buildQualities(initialSources);

    // 创建 ArtPlayer 实例
    const player = new Artplayer({
      container: containerRef.current,
      url: initialSources[0]?.src || '',
      poster: initialVideo?.poster || '',
      autoplay: false,
      autoSize: false,
      autoMini: false,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      setting: false,
      hotkey: true,
      pip: false,
      mutex: true,
      backdrop: true,
      fullscreen: true,
      fullscreenWeb: false, // 使用原生全屏（iOS 支持良好）
      subtitleOffset: false,
      miniProgressBar: true,
      playsInline: true,
      quality: initialQualities.length > 0 ? initialQualities : undefined,
      moreVideoAttr: {
        playsInline: true,
      },
      theme: '#00b2ff',
      lang: 'zh-cn',
    });

    playerRef.current = player;

    // 创建媒体播放器包装对象
    const mediaPlayer: MediaPlayer = {
      pause: () => player.pause(),
      get paused() {
        const artVideo = player?.video;
        return artVideo ? artVideo.paused : true;
      },
      type: 'video',
    };
    mediaPlayerRef.current = mediaPlayer;
    registerMediaPlayer(mediaPlayer);

    // 监听播放器准备就绪
    player.on('ready', () => {
      // player.cssVar('--art-background-color', 'white'); // 播放器背景色，如果需要可以打开
      setPlayerReady(true);
    });

    // 监听播放事件
    player.on('play', () => {
      setPlayed(true); // 隐藏封面

      if (!hasUserPlayedOnceRef.current) {
        hasUserPlayedOnceRef.current = true;
        onUserPlayed?.();
      }

      // 视频播放统计
      const currentVideo = videos[currentIndexRef.current];
      if (currentVideo && !trackedVideoIdsRef.current.has(currentVideo.id)) {
        trackVideoPlay(currentVideo.id, currentVideo.title);
        trackedVideoIdsRef.current.add(currentVideo.id);
      }

      pauseOtherMediaPlayers(mediaPlayer);
    });

    // 在 loadedmetadata 事件中自动播放
    player.on('video:loadedmetadata', () => {
      // 用户播放过则自动播放
      if (hasUserPlayedOnceRef.current) {
        player.play().catch(() => {});
      }
    });

    // 监听播放结束事件
    player.on('video:ended', async () => {
      if (player.currentTime < 1) return;

      // 检查是否有下一个视频
      if (currentIndexRef.current >= videos.length - 1) {
        return;
      }

      const nextIndex = currentIndexRef.current + 1;
      const nextVideo = videos[nextIndex];
      const nextSrc = nextVideo?.sources?.[0]?.src;

      if (!nextSrc) return;

      // 更新索引（只更新 ref，不更新 state）
      currentIndexRef.current = nextIndex;
      onVideoChange?.(nextIndex);

      // 使用 await 等待切换完成
      await player.switchUrl(nextSrc);

      // 延迟更新 URL
      setTimeout(() => {
        updateUrlParam(nextIndex);
      }, 100);
    });

    // 如果外部传入用户已播放，自动播放
    if (externalHasUserPlayedOnce || hasUserPlayedOnceRef.current) {
      player.play().catch(() => {});
    }

    return () => {
      if (mediaPlayerRef.current) {
        unregisterMediaPlayer(mediaPlayerRef.current);
        mediaPlayerRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 关键：只在初始化时执行一次，不依赖任何会变化的值

  // 监听外部传入的 currentIndex 变化（侧边栏切换）
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    // 如果外部索引和内部 ref 不一致，说明是外部控制的切换
    if (currentIndex !== currentIndexRef.current) {
      currentIndexRef.current = currentIndex;

      const video = videos[currentIndex];
      const src = video?.sources?.[0]?.src;

      if (src) {
        player.switchUrl(src);
        if (hasUserPlayedOnceRef.current) {
          player.play().catch(() => {});
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]); // 只依赖外部传入的 currentIndex

  return (
    <>
      <Stack
        minHeight={
          currentVideo?.url_downmp4 && !isMobile
            ? { lg: '45px', xlg: '55px', xl: '70px', xxl: '90px' }
            : 'auto'
        }
        width='100%'
        direction='row'
        justifyContent={isShowTitle ? 'space-between' : 'flex-end'}
        mt={isMobile ? 1 : videoList.length > 1 ? -3 : isShowTitle ? 4.5 : 5}
        alignItems='center'
        position='relative'
      >
        {isShowTitle && (
          <Typography
            sx={{
              fontWeight: 500,
              mb: isMobile
                ? pxToVw(6)
                : { lg: '20px', xlg: '22px', xl: '25px', xxl: '30px' },
              pl: isMobile ? pxToVw(4) : 0,
              fontSize: isMobile ? pxToVw(16) : { lg: 18, xl: 24, xxl: 28 },
              color: 'rgba(102, 102, 102, 1)',
            }}
          >
            {currentVideo?.title}
          </Typography>
        )}
        {currentVideo?.url_downmp4 && !isMobile && (
          <MediaDownloadButton
            mediaType='video'
            downloadUrls={[currentVideo?.url_downmp4]}
            sx={{
              position: 'absolute',
              top: '-80%',
              right: 0,
            }}
          />
        )}
      </Stack>
      <Box
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          mb: isMobile ? pxToVw(20) : 10,
          position: 'relative',
          // 隐藏 ArtPlayer 中间的大播放/暂停按钮
          '& .art-state': {
            display: 'none !important',
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
            backgroundImage: `url(${currentVideo?.poster}) , url(/images/book_cover5.webp)`,
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
              if (!hasUserPlayedOnceRef.current) {
                hasUserPlayedOnceRef.current = true;
                onUserPlayed?.();
              }
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
            {isMobile ? (
              <PlayCircleIcon />
            ) : (
              <PlayCircleOutlineIcon sx={{ fontSize: 80 }} />
            )}
          </IconButton>
        )}
        <div
          ref={containerRef}
          style={{
            aspectRatio: 16 / 9,
            visibility: played ? 'visible' : 'hidden', // 未播放时隐藏播放器
            opacity: playerReady ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      </Box>
    </>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
