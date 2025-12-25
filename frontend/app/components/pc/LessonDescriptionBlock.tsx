'use client';

import { useHighlightDescription } from '@/app/hooks/useHighlightDescription';
import { Box, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import CourseTag from '../shared/CourseTag';

export interface LessonDescriptionBlockProps {
  isQuestion: boolean;
  description?: string;
  tags?: string[];
}

export default function LessonDescriptionBlock({
  isQuestion,
  description,
  tags,
}: LessonDescriptionBlockProps) {
  const highlightedDescription = useHighlightDescription(description);

  if (!description) {
    return null;
  }

  return (
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
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
            {tags.slice(0, 5).map((tag, idx) => (
              <Fragment key={idx}>
                <CourseTag label={tag} />
              </Fragment>
            ))}
          </Stack>
        </Box>
      )}
      <Stack flexDirection={'row'}>
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
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: { lg: 16, xl: 18 },
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: highlightedDescription }} />
        </Typography>
      </Stack>
    </Box>
  );
}
