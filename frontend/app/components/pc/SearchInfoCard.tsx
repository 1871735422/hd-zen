// SearchInfoCard.tsx
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import BookExpandIcon from '../icons/BookExpandIcon';
import BookIcon from '../icons/BookIcon';

export type SearchInfoCardType = '文章' | '视频';

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

const escapeHtml = (str: string) =>
  str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

// 将 keywords 转为安全的 RegExp
const buildKeywordRegex = (keywords: string[]) => {
  const escaped = keywords
    .filter(Boolean)
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (escaped.length === 0) return null;
  return new RegExp(`(${escaped.join('|')})`, 'gi');
};

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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(true);
  let height = 120;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const check = () => {
      setIsOverflowing(el.scrollHeight > height + 4); // 余量
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [height, content, expanded]);

  return (
    <Box
      style={style}
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: 0,
        pt: 2,
      }}
    >
      <Stack direction='row' alignItems='center' spacing={1.25}>
        {typeof index === 'number' && (
          <Box
            sx={{
              minWidth: 22,
              height: 22,
              borderRadius: '50%',
              bgcolor: 'rgba(86, 137, 204, 1)',
              color: 'primary.contrastText',
              fontWeight: 500,
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto',
            }}
            aria-label={`index-${index}`}
          >
            {index}
          </Box>
        )}
        <Typography
          variant='h6'
          sx={{
            fontSize: { xs: 16, sm: 18 },
            fontWeight: 700,
            color: 'rgba(86, 137, 204, 1)',
            flex: 1,
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>

        <Button
          size='small'
          sx={{
            color: 'rgba(194, 194, 194, 1)',
          }}
          variant='text'
          startIcon={<BookIcon />}
        >
          {type}
        </Button>
      </Stack>

      <Box
        ref={contentRef}
        sx={{
          position: 'relative',
          mt: 1.25,
          color: 'text.secondary',
          fontSize: { xs: 14, sm: 15 },
          lineHeight: 1.8,
          overflow: 'hidden',
          maxHeight: expanded ? 'none' : `${height}px`,
          transition: 'max-height 220ms ease',
          pr: 0.5,
        }}
      >
        <Box
          component='div'
          sx={{ '& mark': { px: 0.25, borderRadius: 0.5 } }}
          dangerouslySetInnerHTML={{
            __html:
              keywords && keywords.length > 0
                ? // 简易 HTML 高亮（仅做字符串替换，不处理复杂 DOM）
                  escapeHtml(content).replace(
                    buildKeywordRegex(keywords) ?? /$^/,
                    m =>
                      `<mark style="color: rgba(255, 94, 124, 1);background: transparent">${m}</mark>`
                  )
                : content,
          }}
        />

        {!expanded && isOverflowing && (
          <Box
            sx={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              height: 48,
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0), var(--mui-palette-background-paper) 60%)',
            }}
          />
        )}
      </Box>

      <Stack
        direction='column'
        alignItems='center'
        justifyContent='space-between'
        sx={{ mt: 1 }}
        spacing={1}
      >
        {1 && (
          <Button
            size='small'
            onClick={() => setExpanded(v => !v)}
            aria-label={expanded ? 'collapse' : 'expand'}
            sx={{
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'rgba(84, 161, 209, 1)',
            }}
          >
            {expanded ? '折叠' : '展开'}
            <ExpandMoreIcon
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 200ms',
              }}
            />
          </Button>
        )}
        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {from && (
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              来源：{from}
            </Typography>
          )}
          {url && (
            <Tooltip title='查看原文' arrow>
              <MuiLink
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                underline='hover'
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'rgba(130, 178, 232, 1)',
                }}
              >
                <BookExpandIcon />
                <Typography
                  sx={{
                    ml: 0.5,
                    fontSize: 13,
                    color: 'rgba(130, 178, 232, 1)',
                  }}
                >
                  查看原文
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
