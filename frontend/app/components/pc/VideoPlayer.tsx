'use client';
import { useDeviceType } from '@/app/utils/deviceUtils';
import { pxToVw } from '@/app/utils/mobileUtils';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import 'plyr/dist/plyr.css';
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

// 按需加载 Plyr，并做模块级缓存，避免重复拉取包体
let plyrPromise: Promise<typeof import('plyr')> | null = null;
async function loadPlyr() {
  if (!plyrPromise) plyrPromise = import('plyr');
  const { default: PlyrLib } = await plyrPromise;
  return PlyrLib;
}

const VideoPlayer = forwardRef<
  VideoPlayerRef,
  {
    videoList: VideoItem[]; // 必填参数，统一使用 videoList
    currentIndex?: number;
    onVideoChange?: (index: number) => void;
    urlParamName?: string;
    onManualSwitch?: (index: number) => void;
  }
>(function VideoPlayer(
  {
    videoList,
    currentIndex = 0,
    onVideoChange,
    urlParamName = 'tab', // 默认使用 tab 参数
    onManualSwitch, // 手动切换回调
  },
  ref
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);
  const [played, setPlayed] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(currentIndex);
  const currentIndexRef = useRef(currentVideoIndex);
  const hasStartedCurrentRef = useRef(false);
  const playAttemptTokenRef = useRef(0);
  const lastAdvanceTimeRef = useRef(0);
  const videoStartTimeRef = useRef(0);
  const autoAdvanceTokenRef = useRef(0);
  const isAdvancingRef = useRef(false);
  const hasInitializedFromUrlRef = useRef(false); // 记录是否已经从 URL 初始化过
  const lastAutoAdvanceIndexRef = useRef(-1); // 记录最后一次自动切换的索引
  const allowAutoAdvanceRef = useRef(true); // 是否允许自动切换
  const isAutoAdvanceInProgressRef = useRef(false); // 标记是否正在进行自动切换
  const hasUserPlayedOnceRef = useRef(false); // 记录用户是否已经手动播放过

  // 暴露给外部的方法
  useImperativeHandle(
    ref,
    () => ({
      switchToVideo: (index: number) => {
        console.debug('[VideoPlayer] External manual switch request', {
          index,
        });
        switchToVideo(index);
      },
    }),
    []
  );

  // 统一使用 videoList，不再支持 sources fallback
  const videos: VideoItem[] = videoList;

  // 作用：把当前索引写入 ref，避免 Plyr 回调闭包中拿到旧值
  useEffect(() => {
    currentIndexRef.current = currentVideoIndex;
  }, [currentVideoIndex]);

  // 初始化时从 URL 参数读取视频索引（只执行一次）
  useEffect(() => {
    // 防止重复初始化
    if (hasInitializedFromUrlRef.current) return;

    // 仅在存在多个视频时，才根据 URL 初始化索引
    if (videos.length <= 1) {
      hasInitializedFromUrlRef.current = true;
      return;
    }

    const urlParam = searchParams.get(urlParamName);
    if (urlParam && urlParam.startsWith('question')) {
      const tabNumber = parseInt(urlParam.replace('question', ''), 10);
      const indexFromUrl = tabNumber - 1; // question1 -> videoList[0]
      if (!isNaN(tabNumber) && tabNumber >= 1 && indexFromUrl < videos.length) {
        console.debug('[VideoPlayer] Setting initial index from URL', {
          urlParam,
          tabNumber,
          indexFromUrl,
          currentIndex: currentVideoIndex,
        });
        setCurrentVideoIndex(indexFromUrl);
      }
    }

    hasInitializedFromUrlRef.current = true;
  }, [searchParams, urlParamName, videos.length]); // 移除 currentVideoIndex 依赖

  // Get current video
  const currentVideo = videos[currentVideoIndex];
  const currentSources = currentVideo?.sources || [];

  // Helper: build plyr-compatible source list
  const buildPlyrSources = (list: Source[]) =>
    list.map(s => ({
      src: s.src,
      type: s.type ?? 'video/mp4',
      size: s.size ?? 0,
    }));

  // 更新 URL 查询参数
  const updateUrlParam = (index: number) => {
    const url = new URL(window.location.href);

    // 只有当视频数 > 1 时才写入 question 参数；否则移除该参数
    if (videos.length <= 1) {
      if (url.searchParams.has(urlParamName)) {
        url.searchParams.delete(urlParamName);
        router.replace(`${url.pathname}${url.search}`, { scroll: false });
        console.debug('[VideoPlayer] URL param removed (single video)', {
          paramName: urlParamName,
          newUrl: `${url.pathname}${url.search}`,
        });
      }
      return;
    }

    const paramValue = `question${index + 1}`; // videoList[0] -> question1
    if (url.searchParams.get(urlParamName) === paramValue) {
      return;
    }
    url.searchParams.set(urlParamName, paramValue);
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
    console.debug('[VideoPlayer] URL updated', {
      index,
      paramName: urlParamName,
      paramValue,
      newUrl: `${url.pathname}${url.search}`,
    });
  };

  // 简化的自动播放逻辑
  const attemptAutoPlay = (videoElement: HTMLVideoElement) => {
    return videoElement
      .play()
      .then(() => {
        console.debug('[VideoPlayer] Video play successful');
        setPlayed(true);
      })
      .catch(err => {
        console.warn('[VideoPlayer] Video play failed:', err.message);
        setPlayed(false);
      });
  };

  // 检查视频是否应该自动切换到下一个
  const shouldAdvanceToNext = (): boolean => {
    console.debug('[VideoPlayer] Checking shouldAdvanceToNext', {
      hasStarted: hasStartedCurrentRef.current,
      isAdvancing: isAdvancingRef.current,
      currentIndex: currentIndexRef.current,
      totalVideos: videos.length,
      videoStartTime: videoStartTimeRef.current,
      lastAdvanceTime: lastAdvanceTimeRef.current,
      allowAutoAdvance: allowAutoAdvanceRef.current,
    });

    // 检查是否允许自动切换（防止手动切换后的误触发）
    if (!allowAutoAdvanceRef.current) {
      console.debug('[VideoPlayer] Auto advance disabled after manual switch');
      return false;
    }

    // 基本条件检查
    if (
      !hasStartedCurrentRef.current ||
      isAdvancingRef.current ||
      currentIndexRef.current >= videos.length - 1
    ) {
      console.debug('[VideoPlayer] Basic conditions not met');
      return false;
    }

    // 时间间隔检查 - 防止频繁切换
    const now = Date.now();
    const timeSinceLastAdvance = now - lastAdvanceTimeRef.current;
    const timeSinceVideoStart = now - videoStartTimeRef.current;

    // 对于手动切换后的第一个视频，需要更长的播放时间才能自动切换
    const minPlayTime = lastAdvanceTimeRef.current === 0 ? 2000 : 800; // 手动切换后需要至少2秒

    if (lastAdvanceTimeRef.current > 0 && timeSinceLastAdvance < 2000) {
      console.debug('[VideoPlayer] Too frequent advance');
      return false; // 至少2秒间隔
    }

    if (videoStartTimeRef.current > 0 && timeSinceVideoStart < minPlayTime) {
      console.debug('[VideoPlayer] Video played too short', {
        timeSinceVideoStart,
        minPlayTime,
        wasManualSwitch: lastAdvanceTimeRef.current === 0,
      });
      return false;
    }

    console.debug('[VideoPlayer] All checks passed, allowing advance');
    return true;
  };

  // 手动切换到指定视频
  const switchToVideo = (index: number) => {
    console.debug('[VideoPlayer] Manual switch to video', {
      index,
      currentIndex: currentIndexRef.current,
      allowAutoAdvance: allowAutoAdvanceRef.current,
    });

    // 禁用自动切换直到当前视频自然播放结束
    allowAutoAdvanceRef.current = false;
    isAdvancingRef.current = false;
    isAutoAdvanceInProgressRef.current = false;

    updateUrlParam(index); // ★ 一定保证这里同步更新地址栏
    applySource(index, true, undefined, true); // 最后为 true 标记手动切换
    onManualSwitch?.(index);
  };

  // 切换到下一个视频（自动切换）
  const advanceToNext = () => {
    isAdvancingRef.current = true;
    isAutoAdvanceInProgressRef.current = true; // 标记正在进行自动切换
    lastAdvanceTimeRef.current = Date.now();
    autoAdvanceTokenRef.current = Date.now();
    const nextIndex = currentIndexRef.current + 1;
    lastAutoAdvanceIndexRef.current = nextIndex; // 记录自动切换的索引

    console.debug('[VideoPlayer] Auto advancing to next video', { nextIndex });
    applySource(nextIndex, true, autoAdvanceTokenRef.current, false); // 明确标记为非手动切换
  };

  // 统一的切源方法：更新 Plyr 源并尝试自动播放
  const applySource = (
    index: number,
    autoplay = false,
    autoAdvanceToken?: number,
    isManualSwitch = false // 新增：是否为手动切换
  ) => {
    const player = playerRef.current;
    const v = videoRef.current;
    if (!player || !v) return;

    // 边界保护
    const safeIndex = Math.max(0, Math.min(index, videos.length - 1));

    console.debug('[VideoPlayer] Applying source', {
      index: safeIndex,
      autoplay,
      isAdvancing: isAdvancingRef.current,
      isManualSwitch,
    });

    // 切源前先暂停，避免状态混乱
    try {
      v.pause();
    } catch {}

    // 如果是手动切换，重置相关状态但保留后续自动切换的能力
    if (isManualSwitch) {
      isAdvancingRef.current = false;
      allowAutoAdvanceRef.current = false; // 禁用自动切换直到当前视频播放完成
      // 不重置 autoAdvanceTokenRef，保留后续自动切换的能力
      console.debug(
        '[VideoPlayer] Manual switch detected, temporarily disabling auto-advance'
      );
    }

    // 更新索引和同步状态
    currentIndexRef.current = safeIndex;
    setCurrentVideoIndex(safeIndex);
    onVideoChange?.(safeIndex);

    // 更新 URL 查询参数
    if (!isManualSwitch) {
      updateUrlParam(safeIndex);
    }

    // 延迟设置新源，确保前一个视频完全停止
    setTimeout(() => {
      if (currentIndexRef.current !== safeIndex) return; // 防止竞态条件

      console.debug('[VideoPlayer] Setting new source', { index: safeIndex });

      player.source = {
        type: 'video',
        title: videos[safeIndex]?.title ?? '',
        sources: buildPlyrSources(videos[safeIndex]?.sources || []),
      };

      // 在设置新源后重置播放状态
      hasStartedCurrentRef.current = false;

      try {
        if (playerRef.current) {
          playerRef.current.currentTime = 0;
        }
      } catch {}

      // 使用 Plyr 推荐的方式处理源切换后的自动播放
      if (autoplay && hasUserPlayedOnceRef.current) {
        const attemptToken = ++playAttemptTokenRef.current;

        console.debug('[VideoPlayer] Setting up autoplay after source change', {
          index: safeIndex,
          autoAdvanceToken,
          attemptToken,
        });

        // 监听 Plyr 的 loadeddata 事件（数据加载完成）
        const onLoadedData = () => {
          if (
            playAttemptTokenRef.current !== attemptToken ||
            currentIndexRef.current !== safeIndex
          ) {
            console.debug(
              '[VideoPlayer] Autoplay cancelled - token/index mismatch'
            );
            return;
          }

          console.debug('[VideoPlayer] Video data loaded, attempting autoplay');

          // 设置 playing 事件监听
          const markPlaying = () => {
            if (playAttemptTokenRef.current !== attemptToken) return;
            console.debug('[VideoPlayer] Video started playing successfully');
            hasStartedCurrentRef.current = true;
            setPlayed(true);
            isAdvancingRef.current = false;
            videoStartTimeRef.current = Date.now();
            allowAutoAdvanceRef.current = true; // ★ 新视频开始播放时允许后续自动切换
            v.removeEventListener('playing', markPlaying);
          };
          v.addEventListener('playing', markPlaying);

          // 使用 Plyr 的 play 方法
          try {
            const playPromise = player.play();
            if (playPromise && typeof playPromise.then === 'function') {
              playPromise
                .then(() => {
                  console.debug('[VideoPlayer] Plyr autoplay successful');
                })
                .catch((err: Error) => {
                  console.warn(
                    '[VideoPlayer] Plyr autoplay failed, trying fallback',
                    err.message
                  );
                });
            } else {
              console.debug(
                '[VideoPlayer] Plyr play() returned void, assuming success'
              );
            }
          } catch (err: unknown) {
            const errorMessage =
              err instanceof Error ? err.message : String(err);
            console.warn('[VideoPlayer] Plyr play() threw error', errorMessage);
          }
        };

        // 监听 loadeddata 事件
        player.once('loadeddata', onLoadedData);
      }
    }, 50);
  };

  // 作用：仅首屏创建 Plyr 实例，并注册 timeupdate（预加载和推进）
  useEffect(() => {
    let mounted = true;
    (async () => {
      const PlyrLib = await loadPlyr();
      if (!mounted || !videoRef.current) return;

      // 计算清晰度列表（去重、排序）
      const qualityOptions = Array.from(
        new Set(currentSources.map(s => s.size).filter(Boolean) as number[])
      )
        .sort((a, b) => a - b)
        .map(n => Number(n));
      playerRef.current = new PlyrLib(videoRef.current, {
        controls: [
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'settings',
          'fullscreen',
        ],
        // settings must include 'quality' to show quality in settings menu
        settings: ['quality'],
        autoplay: false, // 启用自动播放
        muted: false, // 不静音，但如果自动播放失败会尝试静音
        quality: {
          default: qualityOptions[0] ?? currentSources[0]?.size ?? 720,
          options: qualityOptions.length ? qualityOptions : [720],
          forced: true, // ensure plyr will force quality changes by replacing src
        },
      });

      // 注册事件：播放标记、进度记录、结束后推进
      try {
        playerRef.current.on('play', () => {
          hasStartedCurrentRef.current = true;
          videoStartTimeRef.current = Date.now();
          isAdvancingRef.current = false;
          console.debug('[VideoPlayer] Video started playing', {
            index: currentIndexRef.current,
          });
        });

        // 简化：只监听播放开始事件
        playerRef.current.on('timeupdate', () => {
          if (!hasStartedCurrentRef.current) {
            const player = playerRef.current;
            if (player && player.currentTime > 0.25) {
              hasStartedCurrentRef.current = true;
            }
          }
        });
        playerRef.current.on('ended', () => {
          const player = playerRef.current;
          if (!player) return;

          // 防抖，视频仅播放1秒内就触发ended（如切源骚乱），不做自动切换
          if (player.currentTime < 1 || !hasStartedCurrentRef.current) {
            console.debug('[VideoPlayer] ended触发太早，忽略自动切换', {
              currentTime: player.currentTime,
              hasStarted: hasStartedCurrentRef.current,
            });
            return;
          }

          console.debug('[VideoPlayer] Video ended', {
            index: currentIndexRef.current,
            duration: player.duration || 0,
            totalVideos: videos.length,
            allowAutoAdvance: allowAutoAdvanceRef.current,
          });

          // 视频真正播放完成后，重新启用自动切换
          if (!allowAutoAdvanceRef.current) {
            console.debug(
              '[VideoPlayer] Re-enabling auto advance after video completion'
            );
            allowAutoAdvanceRef.current = true;
          }

          // 判断是否应该切换
          if (shouldAdvanceToNext()) {
            advanceToNext();
          }
        });
      } catch {
        // 忽略事件注册异常（极少发生）
      }

      // 初始化：按当前索引切源，首次不自动播放
      applySource(currentVideoIndex, false);
    })();

    return () => {
      mounted = false;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 作用：切换索引时更新 Plyr 源，并尝试自动播放
  useEffect(() => {
    const player = playerRef.current;
    const v = videoRef.current;
    if (!player || !v) return;

    if (played) {
      player.autoplay = true;
    }
    // console.log({ player });

    // 检查是否为手动切换（非正在进行的自动切换）
    const isManualSwitch = !isAutoAdvanceInProgressRef.current;

    if (isManualSwitch) {
      console.debug('[VideoPlayer] Manual switch detected in useEffect', {
        currentVideoIndex,
        wasAutoAdvancing: isAutoAdvanceInProgressRef.current,
      });

      // 手动切换时，禁用自动切换直到当前视频真正播放完成
      isAdvancingRef.current = false;
      allowAutoAdvanceRef.current = false; // 禁用自动切换
      lastAutoAdvanceIndexRef.current = -1;

      console.debug('[VideoPlayer] Auto advance disabled due to manual switch');
    }

    // 重置自动切换进行状态
    isAutoAdvanceInProgressRef.current = false;

    // 更新清晰度配置
    const qualityOptions = Array.from(
      new Set(currentSources.map(s => s.size).filter(Boolean) as number[])
    )
      .sort((a, b) => b - a)
      .map(n => Number(n));

    try {
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

    // 设置新视频源
    hasStartedCurrentRef.current = false;

    player.source = {
      type: 'video',
      title: currentVideo?.title ?? '',
      sources: buildPlyrSources(currentSources),
    };

    try {
      if (playerRef.current) {
        playerRef.current.currentTime = 0;
      }
    } catch {}

    // 统一的播放尝试逻辑 - 只有用户播放过才自动播放
    if (hasUserPlayedOnceRef.current) {
      const attemptToken = ++playAttemptTokenRef.current;
      const markPlaying = () => {
        if (playAttemptTokenRef.current !== attemptToken) return;
        hasStartedCurrentRef.current = true;
        setPlayed(true);
        videoStartTimeRef.current = Date.now();
        v.removeEventListener('playing', markPlaying);
      };
      v.addEventListener('playing', markPlaying);

      if (v.readyState >= 3) {
        attemptAutoPlay(v);
      } else {
        const onCanPlayNew = () => {
          v.removeEventListener('canplay', onCanPlayNew);
          attemptAutoPlay(v);
        };
        v.addEventListener('canplay', onCanPlayNew, { once: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoIndex]);

  // 作用：父组件外部受控索引变动时，同步内部索引
  useEffect(() => {
    if (currentIndex !== currentVideoIndex) {
      setCurrentVideoIndex(currentIndex);
    }
  }, [currentIndex, currentVideoIndex]);

  const currentPoster = currentVideo?.poster;
  const currentTitle = currentVideo?.title;
  const isMobile = useDeviceType() === 'mobile';

  return (
    <>
      <Stack
        direction='row'
        justifyContent={currentTitle ? 'space-between' : 'flex-end'}
        mt={currentTitle ? 0 : -5}
        mb={currentTitle ? 0 : -2}
        alignItems='center'
      >
        {currentTitle && (
          <Typography
            sx={{
              fontWeight: 500,
              my: isMobile ? pxToVw(6) : 2,
              pl: isMobile ? pxToVw(4) : 0,
              fontSize: isMobile ? pxToVw(16) : { lg: 18, xl: 24, xxl: 28 },
              color: 'rgba(102, 102, 102, 1)',
            }}
          >
            {currentTitle}
          </Typography>
        )}
        {currentVideo?.url_downmp4 && !isMobile && (
          <MediaDownloadButton
            mediaType='video'
            downloadUrls={[currentVideo?.url_downmp4]}
          />
        )}
      </Stack>
      <Box
        sx={{
          mb: isMobile ? pxToVw(20) : 0,
          position: 'relative',
          '& .plyr--full-ui': {
            visibility: played ? 'visible' : 'hidden',
            borderRadius: '12px',
            minHeight: isMobile ? pxToVw(200) : { lg: 360, xl: 400, xxl: 400 },
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
            backgroundImage: `url(${currentPoster})`,
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
              hasStartedCurrentRef.current = true;
              videoStartTimeRef.current = Date.now();
              hasUserPlayedOnceRef.current = true; // 标记用户已手动播放
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
    </>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
