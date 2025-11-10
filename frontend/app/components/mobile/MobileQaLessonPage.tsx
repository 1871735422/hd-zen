'use client';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Stack, Typography } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { pxToVw } from '../../utils/mobileUtils';
import ArrowTop from '../icons/ArrowTop';
import VideoPlayer, { VideoItem } from '../pc/VideoPlayer';
import { MobileLessonMeta } from './MobileLessonMeta';
import MobileQaSidebar from './MobileQaSidebar';

interface QuestionItem {
  questionOrder: number;
  questionTitle?: string;
  questionCreated?: string;
  title?: string;
  url_sd?: string;
  url_hd?: string;
  url_image?: string;
  url_downmp4?: string;
}

interface MobileQaLessonPageProps {
  questions: QuestionItem[];
  initialIndex: number;
  courseOrder: string;
  lessonOrder: string;
  courseName: string;
  lessonName: string;
}

export default function MobileQaLessonPage({
  questions,
  initialIndex,
  courseOrder,
  lessonOrder,
  courseName,
  lessonName,
}: MobileQaLessonPageProps) {
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, initialIndex));
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 更新 URL 参数
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('tab', `question${currentIndex + 1}`);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [currentIndex, pathname, router, searchParams]);

  // 侧边栏数据
  const sidebarItems = useMemo(
    () =>
      questions.map(q => ({
        label: q.questionTitle || '',
        displayOrder: Number(q.questionOrder),
      })),
    [questions]
  );

  // 视频列表
  const videoList: VideoItem[] = useMemo(
    () =>
      questions.map(q => ({
        id: `q-${q.questionOrder}`,
        title: q.title || '',
        poster: q.url_image || '',
        url_downmp4: q.url_downmp4,
        sources: [
          q.url_sd
            ? { src: q.url_sd, size: 720, type: 'video/mp4' }
            : undefined,
          q.url_hd
            ? { src: q.url_hd, size: 1080, type: 'video/mp4' }
            : undefined,
        ].filter(Boolean) as { src: string; size?: number; type?: string }[],
      })),
    [questions]
  );

  const currentQuestion = questions[currentIndex];

  const handlePrev = useCallback(() => {
    setCurrentIndex(i => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(i => Math.min(questions.length - 1, i + 1));
  }, [questions.length]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (isSidebarExpanded) {
      setShowExpandButton(false);
    } else {
      timer = setTimeout(() => {
        setShowExpandButton(true);
      }, 300);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isSidebarExpanded]);
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        pb: pxToVw(20),
      }}
    >
      {/* 折叠/展开按钮 */}
      {!isSidebarExpanded && showExpandButton && (
        <Button
          onClick={() => setIsSidebarExpanded(prev => !prev)}
          sx={{
            position: 'absolute',
            top: pxToVw(0),
            left: pxToVw(0),
            minHeight: pxToVw(100),
            minWidth: pxToVw(40),
            px: pxToVw(4),
            py: pxToVw(3),
            borderRadius: `0 ${pxToVw(15)} ${pxToVw(15)} 0`,
            color: '#fff',
            background:
              'linear-gradient(175.97deg, rgba(165, 209, 240, 1) 0%, rgba(173, 178, 247, 1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: pxToVw(2),
            cursor: 'pointer',
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: pxToVw(13),
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
            }}
          >
            本课其他问题
          </Typography>
          <Stack sx={{ transform: 'rotate(90deg)', fontSize: pxToVw(11) }}>
            <ArrowTop />
          </Stack>
        </Button>
      )}

      {/* 左侧：侧边栏容器 */}

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 100,
          mt: pxToVw(8),
        }}
      >
        <MobileQaSidebar
          items={sidebarItems}
          selectedIdx={currentIndex}
          onSelect={setCurrentIndex}
          expanded={isSidebarExpanded}
          onClose={() => setIsSidebarExpanded(false)}
        />
      </Box>

      {/* 右侧：视频和详情 */}
      <Stack sx={{ flex: 1, mt: pxToVw(-20) }}>
        {/* 视频播放器区域 */}
        {currentQuestion?.questionTitle && (
          <Box sx={{ p: pxToVw(16) }}>
            <MobileLessonMeta
              title={`${currentIndex + 1}. ${currentQuestion.questionTitle}`}
              author='作者：慈诚罗珠堪布'
              date={currentQuestion.questionCreated}
              refCourse={`${courseName} > ${lessonName}`}
              refUrl={`/course/${courseOrder}/lesson${lessonOrder}`}
            />
          </Box>
        )}

        {currentQuestion?.url_hd || currentQuestion?.url_sd ? (
          <VideoPlayer
            videoList={videoList}
            currentIndex={currentIndex}
            onVideoChange={setCurrentIndex}
          />
        ) : (
          <Typography sx={{ p: pxToVw(16), fontSize: pxToVw(14) }}>
            视频资源不可用：{currentQuestion?.questionTitle || ''}
          </Typography>
        )}

        {/* 导航按钮 */}
        <Stack
          direction='row'
          justifyContent='space-between'
          sx={{
            mt: pxToVw(-5),
            '& .MuiButton-root': {
              bgcolor: 'rgba(240, 247, 255, 1)',
              py: pxToVw(5),
              px: pxToVw(10),
              borderRadius: pxToVw(20),
              fontWeight: 400,
              fontSize: pxToVw(12),
              color: 'rgba(127, 173, 235, 1)',
              '&.Mui-disabled': {
                bgcolor: 'rgba(240, 247, 255, 0.5)',
                color: 'rgba(127, 173, 235, 0.5)',
              },
              '& .MuiButton-startIcon': {
                mr: 0,
              },
              '& .MuiButton-endIcon': {
                ml: 0,
              },
              '& svg': {
                fontSize: `${pxToVw(12)} !important`,
              },
            },
          }}
        >
          <Button
            startIcon={<ArrowBackIosIcon />}
            disabled={currentIndex <= 0}
            onClick={handlePrev}
          >
            上一个
          </Button>
          <Button
            disabled={currentIndex >= questions.length - 1}
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleNext}
          >
            下一个
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
