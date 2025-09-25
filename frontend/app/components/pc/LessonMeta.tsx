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
    <Box sx={{ mr: 5 }}>
      <Typography
        fontWeight={500}
        px={0}
        fontSize={28}
        align={isQuestion ? 'left' : 'center'}
        color={STANDARD_TEXT_COLOR}
        mb={4}
        mt={7}
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
            p: 3,
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
            position: 'relative',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            overflow: 'hidden',
          }}
        >
          {tags && (
            <Stack
              direction='row'
              spacing={1}
              mb={1}
              alignItems='center'
              flexWrap='wrap'
            >
              <Typography
                variant='subtitle1'
                color='rgba(102, 102, 102, 1)'
                fontWeight={500}
                sx={{ fontSize: 16 }}
              >
                标签：
              </Typography>
              {tags.map((tag, idx) => (
                <Fragment key={idx}>
                  <CourseTag label={tag} />
                </Fragment>
              ))}
            </Stack>
          )}
          <Box display='flex' alignItems='flex-start'>
            <Typography
              variant='subtitle1'
              color='rgba(102, 102, 102, 1)'
              fontWeight={500}
              sx={{ fontSize: 16, minWidth: 60 }}
            >
              问题：
            </Typography>
            <Typography
              variant='body1'
              color='rgba(102, 102, 102, 1)'
              sx={{
                fontSize: 16,
                lineHeight: 1.7,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      )}
      <Box mt={1} mb={2} color='rgba(153, 153, 153, 1)' fontSize={14}>
        <Typography
          variant='subtitle1'
          fontFamily={'"Microsoft Yahei", "Hiragino Sans GB"'}
        >
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
    </Box>
  );
}
