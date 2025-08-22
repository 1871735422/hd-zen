import { Box, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { formatDate } from '../../utils/courseUtils';
import CourseTag from '../shared/CourseTag';

export interface LessonMetaProps {
  title: string;
  tags: string[];
  description: string;
  author: string;
  date: string;
}

export default function LessonMeta({
  title,
  tags,
  description,
  author,
  date,
}: LessonMetaProps) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant='h4'
        fontWeight={500}
        fontSize={24}
        align='center'
        color='#333'
        m={3}
      >
        {title}
      </Typography>
      <Box
        sx={{
          backgroundImage: 'url(/images/course-desc-bg.webp)',
          backgroundPositionY: '40%',
          borderRadius: 6,
          p: 3,
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
          position: 'relative',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          overflow: 'hidden',
          border: '1px solid #e3eaf2',
        }}
      >
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
          {tags[0].split('、').map((tag, idx) => (
            <Fragment key={idx}>
              <CourseTag label={tag} />
            </Fragment>
          ))}
        </Stack>
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
      <Box mt={1} mb={2}>
        <Typography
          variant='subtitle2'
          color='rgba(153, 153, 153, 1)'
          fontFamily={'"Microsoft Yahei", "Hiragino Sans GB"'}
          fontSize={14}
        >
          作者：{author?.replace('作者：', '')} &nbsp;&nbsp; {formatDate(date)}
        </Typography>
      </Box>
    </Box>
  );
}
