'use client';
import LessonMeta from '@/app/components/pc/LessonMeta';
import QaSidebar from '@/app/components/pc/QaSidebar';
import VideoPlayer, { VideoItem } from '@/app/components/pc/VideoPlayer';
import { formatDate } from '@/app/utils/courseUtils';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Grid, Stack } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface QuestionItem {
  questionOrder: number;
  questionTitle?: string;
  questionContent?: string;
  questionCreated?: string;
  title?: string;
  url_sd?: string;
  url_hd?: string;
  url_image?: string;
  url_downmp4?: string;
}

export default function QaClientWrapper({
  questions,
  initialIndex,
  courseOrder,
  lessonOrder,
  courseName,
  lessonName,
}: {
  questions: QuestionItem[];
  initialIndex: number;
  courseOrder: string;
  lessonOrder: string | undefined;
  courseName: string;
  lessonName: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentIndex, setCurrentIndex] = useState(() => {
    const tabParam = searchParams?.get('tab');
    const titleParam = searchParams?.get('title');

    console.log('Debug - URL params:', { tabParam, titleParam });

    if (tabParam) {
      // Extract question number from tab (e.g., "question1" -> 1)
      const match = tabParam.match(/question(\d+)/);
      if (match) {
        const index = Math.max(0, parseInt(match[1], 10) - 1);
        console.log('Debug - Using tab param, index:', index);
        return index;
      }
    } else if (titleParam) {
      // Find question matching the title
      const matchedIndex = questions.findIndex(
        q => q.questionTitle === titleParam
      );
      console.log(
        'Debug - Title param found, searching for:',
        titleParam,
        'matched index:',
        matchedIndex
      );
      if (matchedIndex !== -1) {
        return matchedIndex;
      }
    }

    console.log('Debug - Using initialIndex:', Math.max(0, initialIndex));
    return Math.max(0, initialIndex);
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('tab', `question${currentIndex + 1}`);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }, [currentIndex, pathname, router, searchParams]);

  const sidebarItems = useMemo(
    () =>
      questions.map((q, idx) => ({
        label: q.questionTitle || '',
        path: `/qa/${courseOrder}/lesson${lessonOrder}?tab=question${q.questionOrder}`,
        displayOrder: idx + 1,
      })),
    [questions, courseOrder, lessonOrder]
  );

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

  const hasVideo = currentQuestion?.url_hd || currentQuestion?.url_sd;
  console.log('currentQuestion', currentQuestion);
  return (
    <Grid
      container
      sx={{
        backgroundColor: '#fff',
        borderRadius: '25px',
        py: 0,
        mb: 5,
        height: 'fit-content',
      }}
    >
      <Grid size={3}>
        <QaSidebar
          lesson={sidebarItems}
          selectedIdx={currentIndex}
          onSelect={setCurrentIndex}
        />
      </Grid>
      <Grid container spacing={4} sx={{ px: 9, py: 4 }} size={9}>
        <Box
          sx={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            pb: 5,
            borderRadius: 5,
            width: '100%',
          }}
        >
          {currentQuestion?.questionTitle && (
            <LessonMeta
              title={`${currentIndex + 1}. ${currentQuestion?.questionTitle}`}
              author='作者：慈诚罗珠堪布'
              date={formatDate(currentQuestion?.questionCreated || '')}
              refCourse={`${courseName} > ${lessonName}`}
              refUrl={`/course/${courseOrder}/lesson${lessonOrder}`}
            />
          )}
          {currentQuestion?.questionContent && (
            <Box
              sx={{ p: 2, '& p': { fontSize: '1.2em', lineHeight: 2 } }}
              dangerouslySetInnerHTML={{
                __html: currentQuestion?.questionContent,
              }}
            />
          )}
          {hasVideo && (
            <>
              <VideoPlayer
                videoList={videoList}
                currentIndex={currentIndex}
                onVideoChange={setCurrentIndex}
              />

              <Stack
                direction='row'
                justifyContent='space-between'
                sx={{
                  '& .MuiButton-root>a': {
                    fontSize: 18,
                    pr: '2px',
                  },
                  '& .MuiButton-root': {
                    backgroundColor: 'rgba(240, 247, 255, 1)',
                    py: '2px',
                    px: '14px',
                    borderRadius: '20px',
                    fontWeight: 400,
                    color: 'rgba(127, 173, 235, 1)',
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: '0 !important',
                  },
                  '& .MuiButton-endIcon': {
                    marginLeft: '0 !important',
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
            </>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
