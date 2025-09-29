import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { Box, Link, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { formatDate } from '../../utils/courseUtils';
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
  return (
    <Box>
      <Typography
        fontWeight={500}
        px={0}
        fontSize={{ lg: 28, xl: 36 }}
        align={isQuestion ? 'left' : 'center'}
        color={STANDARD_TEXT_COLOR}
        mb={{ lg: 4, xl: 8 }}
        mt={isQuestion ? 0 : { lg: 7, xl: 9 }}
      >
        {title}
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
            px: { lg: 3, xl: 4 },
            pt: { lg: 3, xl: 3.5 },
            pb: 3,
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
            position: 'relative',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            overflow: 'hidden',
            '& .MuiTypography-subtitle1': {
              mr: 0.7,
              color: 'rgba(102, 102, 102, 1)',
              fontWeight: 500,
              fontSize: { lg: 16, xl: 18 },
            },
          }}
        >
          {tags && (
            <Stack
              direction='row'
              spacing={1}
              mb={1}
              alignItems='center'
              flexWrap='wrap'
              sx={{
                '& .MuiTypography-root, .MuiChip-root': {
                  fontSize: { lg: 16, xl: 18 },
                  lineHeight: { lg: '24px', xl: '28px' },
                },
              }}
            >
              <Typography variant='subtitle1'>标签：</Typography>
              {tags.map((tag, idx) => (
                <Fragment key={idx}>
                  <CourseTag label={tag} />
                </Fragment>
              ))}
            </Stack>
          )}
          <Stack flexDirection={'row'} mt={2}>
            <Typography variant='subtitle1' sx={{ minWidth: 60 }}>
              问题：
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
        color='ml={1}rgba(153, 153, 153, 1)'
        fontSize={{ lg: 16, xl: 18 }}
      >
        <Typography variant='subtitle1' fontSize={'inherit'}>
          作者：{author?.replace('作者：', '')} &nbsp;&nbsp; {formatDate(date)}
        </Typography>
        {refCourse && (
          <Typography variant='subtitle1'>
            本问答属于：
            <Link
              href={refUrl}
              fontSize={'inherit'}
              color='rgba(86, 137, 204, 1) !important'
            >
              {refCourse}
            </Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
}
