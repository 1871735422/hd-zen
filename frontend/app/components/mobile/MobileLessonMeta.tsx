'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { Box, Link, Typography } from '@mui/material';
import { clearCourseTitle } from '../../utils/courseUtils';
import { pxToVw } from '../../utils/mobileUtils';
import MobileEBookDownload from './MobileEBookDownload';

interface MobileLessonMetaProps {
  title: string;
  author: string;
  date?: string;
  description?: string;
  pdfUrl?: string;
  epubUrl?: string;
  refCourse?: string;
  refUrl?: string;
}

export function MobileLessonMeta({
  title,
  author,
  date,
  description,
  pdfUrl,
  epubUrl,
  refCourse,
  refUrl,
}: MobileLessonMetaProps) {
  return (
    <>
      <Box>
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
            mb: refCourse ? 0 : pxToVw(12),
          }}
        >
          {clearCourseTitle(title)}
        </Typography>

        <MobileEBookDownload pdfUrl={pdfUrl} epubUrl={epubUrl} />
        {/* 作者和日期 */}
        <Typography
          sx={{
            pl: refCourse ? 0 : pxToVw(10),
            pb: refCourse ? 0 : pxToVw(6),
            fontSize: pxToVw(12),
            color: 'rgba(153, 153, 153, 1)',
            lineHeight: 2.3,
          }}
        >
          {author} {date ? ` / ${date}` : ''}
        </Typography>
        {refCourse && (
          <Typography
            sx={{
              fontSize: pxToVw(12),
              color: 'rgba(153, 153, 153, 1)',
              lineHeight: 1.5,
            }}
          >
            本问答属于：
            <Link href={refUrl} color='rgba(86, 137, 204, 1) !important'>
              {refCourse}
            </Link>
          </Typography>
        )}
      </Box>

      {/* 概述框 */}
      {description && (
        <Box
          sx={{
            mb: pxToVw(20),
            px: pxToVw(20),
            py: pxToVw(10),
            borderRadius: pxToVw(20),
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
