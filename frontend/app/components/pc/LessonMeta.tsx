import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { Box, Link, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { clearCourseTitle, formatDate } from '../../utils/courseUtils';
import CourseTag from '../shared/CourseTag';

export interface LessonMetaProps {
  title: string;
  tags?: string[];
  description?: string;
  author: string;
  date: string;
  refCourse?: string;
  refUrl?: string;
}

export default function LessonMeta({
  title,
  tags,
  description,
  author,
  date,
  refCourse,
  refUrl,
}: LessonMetaProps) {
  const isQuestion = /^\d+\./.test(title);
  // console.log(isQuestion, title);

  return (
    <Stack
      display={'flex'}
      flexDirection={'column'}
      alignItems={isQuestion ? 'flex-start' : 'center'}
    >
      <Typography
        fontWeight={600}
        px={0}
        fontSize={{
          lg: 30,
          xl: isQuestion ? 32 : 36,
          xxl: isQuestion ? 36 : 40,
        }}
        color={STANDARD_TEXT_COLOR}
        mb={tags?.length || description ? { lg: 5.7, xl: 8, xxl: 10 } : 1}
        mt={isQuestion ? 0 : { lg: 6.4, xl: 9, xxl: 11 }}
      >
        {clearCourseTitle(title)}
      </Typography>
      {description && (
        <Box
          sx={{
            background: isQuestion
              ? 'rgba(240, 247, 255, 1)'
              : 'url(/images/course-desc-bg.webp) 0 35% / cover no-repeat',
            '&::before': isQuestion
              ? {}
              : {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'url(/images/course-desc-bg.webp) 0 0 / cover no-repeat',
                  transform: 'rotate(180deg)',
                  zIndex: -1,
                },
            borderRadius: '20px',
            px: { lg: 2.8, xl: 4, xxl: 5 },
            pt: { lg: 2.5, xl: 3.5, xxl: 4 },
            pb: 3,
            position: 'relative',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            overflow: 'hidden',
            '& .MuiTypography-subtitle1': {
              mr: 0.7,
              color: 'rgba(102, 102, 102, 1)',
              fontWeight: 500,
              fontSize: { lg: 16, xl: 18, xxl: 20 },
              minWidth: 'max-content',
            },
          }}
        >
          {tags && tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant='subtitle1'>标签：</Typography>
              <Stack
                direction='row'
                alignItems='center'
                flexWrap='wrap'
                gap={1}
                sx={{
                  '& .MuiTypography-root, .MuiChip-root': {
                    fontSize: { lg: 16, xl: 18 },
                    lineHeight: { lg: '24px', xl: '28px' },
                  },
                }}
              >
                {tags.map((tag, idx) => (
                  <Fragment key={idx}>
                    <CourseTag label={tag} />
                  </Fragment>
                ))}
              </Stack>
            </Box>
          )}
          <Stack flexDirection={'row'} mt={2}>
            <Typography variant='subtitle1'>
              {`${isQuestion ? '问题' : '概述'}`}：
            </Typography>
            <Typography
              variant='body1'
              color='rgba(102, 102, 102, 1)'
              sx={{
                lineHeight: 1.7,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: { lg: 16, xl: 18 },
              }}
            >
              {description}
            </Typography>
          </Stack>
        </Box>
      )}
      <Box
        mt={{ lg: 1, xl: 2 }}
        mb={2}
        ml={1}
        alignSelf={'start'}
        sx={{
          '& .MuiTypography-subtitle1': {
            ml: 1,
            fontSize: { lg: 16, xl: 18 },
            color: 'rgba(153, 153, 153, 1)',
          },
        }}
      >
        <Typography variant='subtitle1'>
          作者：{author?.replace('作者：', '')} &nbsp;&nbsp; {formatDate(date)}
        </Typography>
        {refCourse && (
          <Typography variant='subtitle1'>
            本问答属于：
            <Link href={refUrl} color='rgba(86, 137, 204, 1) !important'>
              {refCourse}
            </Link>
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
