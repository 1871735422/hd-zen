'use client';
// SearchInfoCard.tsx
import {
  Box,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
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

// 将 keywords 转为安全的 RegExp
const buildKeywordRegex = (keywords: string[]) => {
  const escaped = keywords
    .filter(Boolean)
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (escaped.length === 0) return null;
  return new RegExp(`(${escaped.join('|')})`, 'gi');
};

// 处理内容显示逻辑
const processContent = (
  content: string,
  keywords: string[],
  expanded: boolean
) => {
  if (!keywords || keywords.length === 0) {
    return content;
  }

  // 按HTML标签分割内容（p标签或h标签），保留完整标签
  const paragraphRegex = /<(p|h[1-6])(?:\s[^>]*)?>(.*?)<\/\1>/gi;
  const paragraphs: string[] = [];
  let match;

  while ((match = paragraphRegex.exec(content)) !== null) {
    const fullTag = match[0]; // 完整的标签包括开始和结束标签
    const tagContent = match[2].trim();
    if (tagContent) {
      paragraphs.push(fullTag);
    }
  }

  // 如果没有找到HTML标签，尝试按空行分割
  if (paragraphs.length === 0) {
    const fallbackParagraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    if (fallbackParagraphs.length > 0) {
      paragraphs.push(...fallbackParagraphs);
    }
  }

  if (paragraphs.length === 0) {
    return content;
  }

  // 找到包含关键词的段落
  const keywordRegex = buildKeywordRegex(keywords);
  const keywordParagraphIndices: number[] = [];

  paragraphs.forEach((paragraph, index) => {
    if (keywordRegex && keywordRegex.test(paragraph)) {
      keywordParagraphIndices.push(index);
    }
  });

  if (keywordParagraphIndices.length === 0) {
    // 如果没有找到包含关键词的段落，返回原内容
    return content;
  }

  if (expanded) {
    // 展开状态：显示包含关键词的段落 + 下一段 + 后面3段
    const startIndex = Math.min(...keywordParagraphIndices);
    const endIndex = Math.min(startIndex + 5, paragraphs.length); // 关键词段落 + 下一段 + 后面3段
    return paragraphs.slice(startIndex, endIndex).join('');
  } else {
    // 折叠状态：只显示包含关键词的段落和下一段
    const startIndex = Math.min(...keywordParagraphIndices);
    const endIndex = Math.min(startIndex + 2, paragraphs.length); // 关键词段落 + 下一段
    return paragraphs.slice(startIndex, endIndex).join('');
  }
};

const highlightKeywords = (
  content: string,
  keywords: string[],
  expanded: boolean
) => {
  const processedContent = processContent(content, keywords || [], expanded);
  if (keywords && keywords.length > 0) {
    return processedContent.replace(
      buildKeywordRegex(keywords) ?? /$^/,
      m =>
        `<mark style="color: rgba(255, 94, 124, 1);background: transparent">${m}</mark>`
    );
  }
  return processedContent;
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
      <Stack
        direction='row'
        alignItems='center'
        sx={{
          mb: '-16px !important',
        }}
      >
        {typeof index === 'number' && (
          <Box
            sx={{
              minWidth: { sm: 19, md: 19, lg: 16, xl: 22, xxl: 26 },
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              bgcolor: 'rgba(86, 137, 204, 1)',
              color: '#fff',
              fontSize: { lg: 13, xl: 16, xxl: 18 },
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
            fontSize: { lg: 13, xl: 18, xxl: 20 },
            fontWeight: 500,
            color: 'rgba(86, 137, 204, 1)',
            ml: '8px !important',
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
            fontSize: { lg: 13, xl: 16, xxl: 18 },
            lineHeight: '27px',
            gap: 0.5,
          }}
        >
          {type === '文章' ? <BookIcon /> : <VideoCamIcon />}
          {type}
        </Stack>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          mt: 1.25,
          color: 'text.secondary',
          fontSize: { lg: 13, xlg: 14, xl: 16, xxl: 16 },
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
          pr: 0.5,
        }}
      >
        <Box
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
            mt: 0.5,
            mb: type === '文章' ? (expanded ? 0 : -3) : 1,
          }}
        >
          {type === '文章' && <FoldResultIcon expanded={expanded} />}
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
              fontSize={{ lg: 10, xl: 14, xxl: 16 }}
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
                    fontSize: 16,
                  },
                }}
              >
                {type === '文章' ? <BookExpandIcon /> : <PlayMediaIcon />}
                <Typography
                  sx={{
                    ml: 0.5,
                    fontSize: 14,
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
