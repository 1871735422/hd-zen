'use client';
// SearchInfoCard.tsx
import { highlightKeywords } from '@/app/utils/highlight';
import { mobileSizes, pxToVw } from '@/app/utils/mobileUtils';
import {
  Box,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useDevice } from '../DeviceProvider';
import BookExpandIcon from '../icons/BookExpandIcon';
import BookIcon from '../icons/BookIcon';
import FoldResultIcon from '../icons/FoldResultIcon';
import PlayMediaIcon from '../icons/PlayMediaIcon';
import VideoCamIcon from '../icons/VideoCamIcon';

export type SearchInfoCardType = '文章' | '音视频';

export interface SearchInfoCardProps {
  index?: number;
  title: string;
  content: string;
  from?: string; // 来源名称
  type?: SearchInfoCardType;
  url?: string; // 原文链接
  keywords?: string[]; // 需要高亮的词（可选）
  style?: React.CSSProperties;
}

export const SearchInfoCard: React.FC<SearchInfoCardProps> = ({
  index,
  title,
  content,
  from,
  type = '文章',
  url,
  keywords,
  style,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { deviceType } = useDevice();
  const isMobile = deviceType === 'mobile';

  return (
    <Box
      style={style}
      sx={{
        width: '100%',
        borderRadius: isMobile ? mobileSizes.borderRadius.md : 2,
        boxShadow: 0,
        pt: isMobile ? mobileSizes.spacing.md : 2,
      }}
    >
      <Stack
        direction='row'
        alignItems='center'
        sx={{
          mb: isMobile ? pxToVw(-16) : '-16px !important',
        }}
      >
        {typeof index === 'number' && (
          <Box
            sx={{
              minWidth: isMobile ? pxToVw(18) : { lg: 18, xl: 22, xxl: 26 },
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              bgcolor: 'rgba(86, 137, 204, 1)',
              color: '#fff',
              fontSize: isMobile ? pxToVw(12) : { lg: 12, xl: 16, xxl: 18 },
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={`index-${index}`}
          >
            {index}
          </Box>
        )}
        <Typography
          variant='h6'
          sx={{
            fontSize: isMobile
              ? mobileSizes.fontSize.lg
              : { lg: 13, xl: 18, xxl: 20 },
            fontWeight: 500,
            color: 'rgba(86, 137, 204, 1)',
            ml: isMobile ? mobileSizes.spacing.sm : '8px !important',
            flex: 1,
          }}
          dangerouslySetInnerHTML={{
            __html: highlightKeywords(title, keywords || [], expanded),
          }}
        />

        <Stack
          direction='row'
          alignItems='center'
          sx={{
            color: 'rgba(194, 194, 194, 1)',
            cursor: 'default',
            fontSize: isMobile
              ? mobileSizes.fontSize.sm
              : { lg: 13, xl: 16, xxl: 18 },
            lineHeight: isMobile ? 1.5 : '27px',
            gap: isMobile ? mobileSizes.spacing.xs : 0.5,
          }}
        >
          {type === '文章' ? <BookIcon /> : <VideoCamIcon />}
          {type}
        </Stack>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          mt: isMobile ? mobileSizes.spacing.md : 1.25,
          color: 'text.secondary',
          fontSize: isMobile
            ? mobileSizes.fontSize.base
            : { lg: 13, xlg: 14, xl: 16, xxl: 16 },
          lineHeight: 1.7,
          overflow: 'hidden',
          ...(expanded
            ? {
                maxHeight: 'none',
              }
            : {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 5, // 显示5行完整内容
              }),
          transition: 'max-height 220ms ease',
          pr: isMobile ? mobileSizes.spacing.xs : 0.5,
        }}
      >
        <Box
          onClick={() => setExpanded(v => !v)}
          component='div'
          sx={{ '& mark': { px: 0.25, borderRadius: 0.5 } }}
          dangerouslySetInnerHTML={{
            __html: highlightKeywords(content, keywords || [], expanded),
          }}
        />
      </Box>

      <Stack
        direction='column'
        alignItems='center'
        justifyContent='space-between'
      >
        <Stack
          direction='row'
          alignItems='center'
          onClick={() => setExpanded(v => !v)}
          aria-label={expanded ? 'collapse' : 'expand'}
          sx={{
            alignSelf: 'center',
            display: 'flex',
            flexDirection: 'column',
            color: 'rgba(84, 161, 209, 1)',
            fontSize: isMobile ? pxToVw(14) : 14,
            mt: isMobile ? pxToVw(14) : 0.5,
            mb:
              type === '文章'
                ? expanded
                  ? 0
                  : isMobile
                    ? pxToVw(-16)
                    : -2
                : isMobile
                  ? pxToVw(16)
                  : 1,
          }}
        >
          {type === '文章' && (
            <FoldResultIcon isMobile={isMobile} expanded={expanded} />
          )}
        </Stack>
        <Stack
          direction='row'
          alignItems='center'
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {from && (
            <Typography
              variant='body2'
              fontSize={
                isMobile ? mobileSizes.fontSize.xs : { lg: 10, xl: 14, xxl: 16 }
              }
              sx={{ color: 'rgba(194, 194, 194, 1)' }}
            >
              来源：{from}
            </Typography>
          )}
          {url && (
            <Tooltip title={type === '文章' ? '查看原文' : '查看音视频'} arrow>
              <MuiLink
                href={url}
                // target='_blank'
                rel='noopener noreferrer'
                underline='hover'
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'rgba(130, 178, 232, 1)',
                  '& svg': {
                    color: 'rgba(178, 207, 202, 1)',
                    fontSize: isMobile ? mobileSizes.fontSize.sm : 16,
                  },
                }}
              >
                {type === '文章' ? <BookExpandIcon /> : <PlayMediaIcon />}
                <Typography
                  sx={{
                    ml: isMobile ? mobileSizes.spacing.xs : 0.5,
                    fontSize: isMobile ? mobileSizes.fontSize.sm : 14,
                    color: 'rgba(130, 178, 232, 1)',
                  }}
                >
                  {type === '文章' ? '查看原文' : '查看音视频'}
                </Typography>
              </MuiLink>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SearchInfoCard;
