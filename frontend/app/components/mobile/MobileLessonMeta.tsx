'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { Box, Typography } from '@mui/material';
import { clearCourseTitle, formatDate } from '../../utils/courseUtils';
import { pxToVw } from '../../utils/mobileUtils';

interface MobileLessonMetaProps {
  title: string;
  author: string;
  date: string;
  description?: string;
}

export function MobileLessonMeta({
  title,
  author,
  date,
  description,
}: MobileLessonMetaProps) {
  return (
    <>
      <Box sx={{}}>
        {/* 标题 */}
        <Typography
          sx={{
            pt: pxToVw(15),
            pb: pxToVw(25),
            fontSize: pxToVw(20),
            fontWeight: 500,
            textAlign: 'center',
            color: STANDARD_TEXT_COLOR,
            lineHeight: 1.4,
            mb: pxToVw(12),
          }}
        >
          {clearCourseTitle(title)}
        </Typography>

        {/* 作者和日期 */}
        <Typography
          sx={{
            pl: pxToVw(10),
            pb: pxToVw(6),
            fontSize: pxToVw(12),
            color: 'rgba(153, 153, 153, 1)',
            lineHeight: 2.3,
          }}
        >
          {author?.replace('作者：', '')} / {formatDate(date)}
        </Typography>
      </Box>

      {/* 概述框 */}
      {description && (
        <Box
          sx={{
            mb: pxToVw(20),
            px: pxToVw(20),
            py: pxToVw(10),
            borderRadius: pxToVw(12),
            backgroundColor: 'rgba(240, 247, 255, 1)',
            color: 'rgba(102, 102, 102, 1)',
            fontSize: pxToVw(14),
            lineHeight: 1.42,
            textAlign: 'justify',
          }}
        >
          <Typography sx={{}}>
            <strong>概述：</strong>
            {description}
          </Typography>
        </Box>
      )}
    </>
  );
}

export type { MobileLessonMetaProps };
