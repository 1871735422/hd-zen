'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { useHighlightDescription } from '@/app/hooks/useHighlightDescription';
import { formatDate } from '@/app/utils/courseUtils';
import { Box, Link, Stack, Typography } from '@mui/material';
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
  mp3Url?: string;
  refCourse?: string;
  refUrl?: string;
  hasSiderbar?: boolean;
}

export function MobileLessonMeta({
  title,
  author,
  date,
  description,
  pdfUrl,
  epubUrl,
  mp3Url,
  refCourse,
  refUrl,
  hasSiderbar,
}: MobileLessonMetaProps) {
  const highlightedDescription = useHighlightDescription(description);

  return (
    <>
      <Box>
        {/* 标题 */}
        <Typography
          sx={{
            pt: pxToVw(15),
            pb: pxToVw(25),
            pl: hasSiderbar ? pxToVw(refCourse ? 25 : 62) : pxToVw(20),
            pr: refCourse ? 0 : pxToVw(20),
            fontSize: pxToVw(20),
            fontWeight: 500,
            textAlign: refCourse ? 'left' : 'center',
            color: STANDARD_TEXT_COLOR,
            lineHeight: 1.4,
            mb: refCourse ? 0 : pxToVw(12),
          }}
        >
          {clearCourseTitle(title)}
        </Typography>

        <MobileEBookDownload
          pdfUrl={pdfUrl}
          epubUrl={epubUrl}
          mp3Url={mp3Url}
        />
        <Stack ml={refCourse ? pxToVw(15) : 0}>
          {/* 作者和日期 */}
          <Typography
            sx={{
              pl: refCourse ? 0 : pxToVw(22),
              pb: refCourse ? 0 : pxToVw(6),
              fontSize: pxToVw(12),
              color: 'rgba(153, 153, 153, 1)',
              lineHeight: 2.3,
            }}
          >
            {author && `作者：${author} `}{' '}
            {date ? ` / ${formatDate(date)}` : ''}
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
        </Stack>
      </Box>

      {/* 概述框 */}
      {description && (
        <Box
          sx={{
            mx: pxToVw(16),
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
          <Typography>
            <strong>概述：</strong>
            <span
              dangerouslySetInnerHTML={{ __html: highlightedDescription }}
            />
          </Typography>
        </Box>
      )}
    </>
  );
}

export type { MobileLessonMetaProps };
