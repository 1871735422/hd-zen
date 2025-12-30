'use client';

import { STANDARD_TEXT_COLOR } from '@/app/constants/colors';
import { useHighlightDescription } from '@/app/hooks/useHighlightDescription';
import { formatDate } from '@/app/utils/courseUtils';
import { Box, Link, Stack, Typography } from '@mui/material';
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

interface MobileLessonAuthorProps {
  author: string;
  date?: string;
  isQa?: string;
}

export const MobileLessonAuthor = ({
  author,
  date,
  isQa,
}: MobileLessonAuthorProps) => (
  <Typography
    sx={{
      display: author ? 'block' : 'none',
      pl: isQa ? 0 : pxToVw(30),
      pr: isQa ? 0 : pxToVw(90),
      pb: isQa ? 0 : pxToVw(6),
      fontSize: pxToVw(12),
      color: 'rgba(153, 153, 153, 1)',
      lineHeight: 2.3,
    }}
  >
    {author}
    {date ? ` / ${formatDate(date)}` : ''}
  </Typography>
);

interface MobileLessonDescriptionProps {
  description?: string;
  highlightedDescription?: string;
}

export const MobileLessonDescription = ({
  description,
  highlightedDescription,
}: MobileLessonDescriptionProps) => {
  if (!description) return null;

  return (
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
      <Typography sx={{ fontSize: pxToVw(16) }}>
        <strong>概述：</strong>
        <span
          dangerouslySetInnerHTML={{
            __html: highlightedDescription || description,
          }}
        />
      </Typography>
    </Box>
  );
};

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
  const isQa = refCourse;
  return (
    <>
      <Box>
        {/* 标题 */}
        <Typography
          sx={{
            pt: pxToVw(15),
            pb: pxToVw(25),
            pl: hasSiderbar ? pxToVw(isQa ? 25 : 50) : pxToVw(20),
            pr: pxToVw(isQa ? 0 : 50),
            fontSize: pxToVw(20),
            fontWeight: 500,
            textAlign: isQa ? 'left' : 'center',
            color: STANDARD_TEXT_COLOR,
            lineHeight: 1.4,
            mb: isQa ? 0 : pxToVw(12),
          }}
        >
          {title}
        </Typography>

        <MobileEBookDownload
          pdfUrl={pdfUrl}
          epubUrl={epubUrl}
          mp3Url={mp3Url}
        />
        <Stack ml={isQa ? pxToVw(15) : 0}>
          <MobileLessonAuthor author={author} date={date} isQa={isQa} />
          {isQa && (
            <Typography
              sx={{
                fontSize: pxToVw(12),
                color: 'rgba(153, 153, 153, 1)',
                lineHeight: 1.5,
              }}
            >
              本问答属于：
              <Link href={refUrl} color='rgba(86, 137, 204, 1) !important'>
                {isQa}
              </Link>
            </Typography>
          )}
        </Stack>
      </Box>

      <MobileLessonDescription
        description={description}
        highlightedDescription={highlightedDescription}
      />
    </>
  );
}

export type { MobileLessonMetaProps };
