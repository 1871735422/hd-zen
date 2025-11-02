'use client';
import LessonMeta from '@/app/components/pc/LessonMeta';
import QaSidebar from '@/app/components/pc/QaSidebar';
import VideoPlayer, { VideoItem } from '@/app/components/pc/VideoPlayer';
import { formatDate } from '@/app/utils/courseUtils';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

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
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, initialIndex));

  const sidebarItems = useMemo(
    () =>
      questions.map(q => ({
        label: q.questionTitle || '',
        path: `/qa/${courseOrder}/lesson${lessonOrder}?tab=question${q.questionOrder}`,
        displayOrder: Number(q.questionOrder),
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
            gap: 4,
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
          <>
            <>
              {currentQuestion?.url_hd || currentQuestion?.url_sd ? (
                <VideoPlayer
                  videoList={videoList}
                  currentIndex={currentIndex}
                  onVideoChange={setCurrentIndex}
                />
              ) : (
                <Typography>
                  视频资源不可用：{currentQuestion?.questionTitle || ''}
                </Typography>
              )}
            </>
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
        </Box>
      </Grid>
    </Grid>
  );
}
